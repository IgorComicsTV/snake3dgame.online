import * as THREE from 'three';
import { Sound } from './audio';
import { Input } from './input';
import { type GameMode, type LevelDefinition } from './levels';
import { advanceSnake, createState, isReverse, type Direction, type GridPoint, type SnakeState } from './simulation';

interface Particle {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  life: number;
}

export class Game {
  state: SnakeState = createState();
  onUpdate?: (state: SnakeState) => void;
  onEnd?: (won: boolean, state: SnakeState) => void;
  onEvent?: (text: string) => void;

  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(45, 1, 0.1, 110);
  private readonly renderer: THREE.WebGLRenderer;
  private readonly input = new Input();
  private readonly sound = new Sound();
  private readonly clock = new THREE.Clock();
  private readonly boardGroup = new THREE.Group();
  private readonly snakeGroup = new THREE.Group();
  private readonly food = new THREE.Group();
  private readonly segmentMeshes: THREE.Group[] = [];
  private readonly portalMeshes: THREE.Group[] = [];
  private readonly particles: Particle[] = [];
  private readonly turnBuffer: Direction[] = [];
  private readonly cameraBase = new THREE.Vector3();
  private accumulator = 0;
  private sceneTime = 0;
  private cameraPunch = 0;
  private quality: 'low' | 'medium' | 'high' = 'high';

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.buildLights();
    this.buildFood();
    this.scene.add(this.boardGroup, this.snakeGroup, this.food);
    this.rebuildMap(this.state.map);
    this.syncSnake(true);
    this.syncFood();
    this.resize();
    addEventListener('resize', () => this.resize());
    this.renderer.domElement.addEventListener('webglcontextlost', (event) => event.preventDefault());
    requestAnimationFrame(() => this.loop());
  }

  private buildLights(): void {
    this.scene.add(new THREE.HemisphereLight(0xe9f4cf, 0x151510, 2));
    const sun = new THREE.DirectionalLight(0xffefc4, 3.3);
    sun.position.set(-10, 22, 11);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = sun.shadow.camera.bottom = -16;
    sun.shadow.camera.right = sun.shadow.camera.top = 16;
    this.scene.add(sun);
  }

  private rebuildMap(map: LevelDefinition): void {
    this.disposeGroup(this.boardGroup);
    this.portalMeshes.length = 0;
    this.scene.background = new THREE.Color(map.theme.background);
    this.scene.fog = new THREE.Fog(map.theme.background, 28, 62);
    const size = map.boardHalf * 2 + 1.4;
    const edge = map.boardHalf + 0.62;

    const board = new THREE.Mesh(
      new THREE.BoxGeometry(size, 0.7, size),
      new THREE.MeshStandardMaterial({ color: map.theme.board, roughness: 0.9, metalness: 0.04 }),
    );
    board.position.y = -0.48;
    board.receiveShadow = true;
    this.boardGroup.add(board);

    const grid = new THREE.GridHelper(map.boardHalf * 2 + 1, map.boardHalf * 2 + 1, map.theme.grid, map.theme.grid);
    grid.position.y = -0.115;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.55;
    this.boardGroup.add(grid);

    const railMaterial = new THREE.MeshStandardMaterial({ color: map.theme.rail, roughness: 0.58 });
    const horizontal = new THREE.BoxGeometry(size + 0.6, 0.42, 0.26);
    const vertical = new THREE.BoxGeometry(0.26, 0.42, size + 0.6);
    for (const z of [-edge, edge]) {
      const rail = new THREE.Mesh(horizontal, railMaterial); rail.position.set(0, 0.1, z); rail.castShadow = true; this.boardGroup.add(rail);
    }
    for (const x of [-edge, edge]) {
      const rail = new THREE.Mesh(vertical, railMaterial); rail.position.set(x, 0.1, 0); rail.castShadow = true; this.boardGroup.add(rail);
    }

    const obstacleMaterial = new THREE.MeshStandardMaterial({ color: map.theme.obstacle, roughness: 0.72, metalness: 0.12 });
    map.obstacles.forEach((point, index) => {
      const obstacle = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.72, 0.86), obstacleMaterial);
      obstacle.position.set(point.x, 0.25, point.z);
      obstacle.rotation.y = index % 2 ? 0.08 : -0.08;
      obstacle.castShadow = true;
      this.boardGroup.add(obstacle);
    });
    map.portals.forEach((portal) => this.buildPortal(portal.axis, portal.lane, portal.color, edge));
    this.updateSnakeMaterials(map);
    this.resize();
  }

  private buildPortal(axis: 'horizontal' | 'vertical', lane: number, color: number, edge: number): void {
    for (const side of [-1, 1]) {
      const group = new THREE.Group();
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.55, 0.11, 10, 28),
        new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 2.2, roughness: 0.25 }),
      );
      ring.scale.y = 1.35;
      group.add(ring);
      if (axis === 'horizontal') {
        group.position.set(side * edge, 0.76, lane);
        group.rotation.y = Math.PI / 2;
      } else {
        group.position.set(lane, 0.76, side * edge);
      }
      group.userData.phase = this.portalMeshes.length * 0.9;
      this.portalMeshes.push(group);
      this.boardGroup.add(group);
    }
  }

  private buildFood(): void {
    const apple = new THREE.Mesh(
      new THREE.SphereGeometry(0.42, 16, 12),
      new THREE.MeshStandardMaterial({ color: 0xe35445, emissive: 0x520b07, emissiveIntensity: 0.8, roughness: 0.45 }),
    );
    apple.scale.y = 0.92;
    apple.castShadow = true;
    const leaf = new THREE.Mesh(
      new THREE.ConeGeometry(0.13, 0.42, 5),
      new THREE.MeshStandardMaterial({ color: 0x86a94b, roughness: 0.7 }),
    );
    leaf.position.set(0.12, 0.42, 0);
    leaf.rotation.z = -0.55;
    this.food.add(apple, leaf);
  }

  private makeSegment(index: number): THREE.Group {
    const group = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.82, index === 0 ? 0.72 : 0.62, 0.82),
      new THREE.MeshStandardMaterial({ roughness: 0.55, metalness: 0.05 }),
    );
    body.geometry.translate(0, index === 0 ? 0.36 : 0.31, 0);
    body.castShadow = true;
    group.add(body);
    if (index === 0) {
      const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x10140d });
      for (const x of [-0.22, 0.22]) {
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 6), eyeMaterial);
        eye.position.set(x, 0.54, -0.405);
        group.add(eye);
      }
    }
    group.scale.setScalar(index >= this.state.snake.length - 1 ? 0.15 : 1);
    this.snakeGroup.add(group);
    return group;
  }

  private updateSnakeMaterials(map: LevelDefinition): void {
    this.segmentMeshes.forEach((segment, index) => {
      const body = segment.children[0] as THREE.Mesh;
      (body.material as THREE.MeshStandardMaterial).color.setHex(index === 0 ? map.theme.head : map.theme.snake);
    });
  }

  start(mode: GameMode = 'endless', levelIndex = 0): void {
    this.sound.unlock();
    this.state = createState(mode, levelIndex, this.loadBest(mode));
    this.state.phase = 'playing';
    this.accumulator = 0;
    this.turnBuffer.length = 0;
    this.input.clear();
    this.clearSnake();
    this.rebuildMap(this.state.map);
    this.syncSnake(true);
    this.syncFood();
    this.clock.getDelta();
    this.onUpdate?.(this.state);
  }

  pause(paused: boolean): void {
    if (paused && this.state.phase === 'playing') this.state.phase = 'paused';
    else if (!paused && this.state.phase === 'paused') { this.state.phase = 'playing'; this.clock.getDelta(); }
    this.onUpdate?.(this.state);
  }

  setSound(enabled: boolean): void { this.sound.setEnabled(enabled); }

  setQuality(quality: 'low' | 'medium' | 'high'): void {
    this.quality = quality;
    this.renderer.shadowMap.enabled = quality !== 'low';
    this.renderer.toneMappingExposure = quality === 'low' ? 1 : 1.15;
    this.resize();
  }

  private loop(): void {
    requestAnimationFrame(() => this.loop());
    const dt = Math.min(this.clock.getDelta(), 0.05);
    if (this.state.phase === 'playing') this.update(dt);
    this.animateScene(dt);
    this.renderer.render(this.scene, this.camera);
  }

  private update(dt: number): void {
    this.state.elapsed += dt;
    let acceptedTurn = false;
    for (const requested of this.input.drain()) {
      const base = this.turnBuffer.at(-1) ?? this.state.direction;
      if (isReverse(requested, base) || (requested.x === base.x && requested.z === base.z)) continue;
      if (this.turnBuffer.length < 2) {
        this.turnBuffer.push(requested);
        acceptedTurn = true;
      }
    }
    // Uma curva válida nunca espera mais de ~30ms para entrar no próximo passo.
    if (acceptedTurn) this.accumulator = Math.max(this.accumulator, this.state.stepTime - 0.03);
    this.accumulator += dt;
    if (this.accumulator < this.state.stepTime) return;
    this.accumulator %= this.state.stepTime;
    this.state.queuedDirection = this.turnBuffer.shift() ?? this.state.direction;
    const result = advanceSnake(this.state);

    if (result.ate) {
      this.sound.eat();
      this.spawnBurst(this.state.snake[0], 0xffd65a, 12);
      this.cameraPunch = 0.25;
      this.syncFood();
      this.saveBest();
      this.onEvent?.(`+${100 * this.state.multiplier}  ×${this.state.multiplier}`);
    }
    if (result.teleported) {
      this.sound.portal();
      this.spawnBurst(result.previousHead, 0xe96dff, 10);
      this.spawnBurst(this.state.snake[0], 0x52e7ff, 10);
      this.onEvent?.('PORTAL!');
    }
    this.syncSnake(false, result.teleported);
    this.onUpdate?.(this.state);
    if (result.crashed) {
      this.sound.crash();
      this.cameraPunch = 0.7;
      this.spawnBurst(result.previousHead, 0xff594d, 18);
      setTimeout(() => this.onEnd?.(false, this.state), 380);
    } else if (this.state.phase === 'won') {
      this.sound.level();
      setTimeout(() => this.onEnd?.(true, this.state), 420);
    }
  }

  private syncSnake(immediate: boolean, teleported = false): void {
    while (this.segmentMeshes.length < this.state.snake.length) this.segmentMeshes.push(this.makeSegment(this.segmentMeshes.length));
    this.updateSnakeMaterials(this.state.map);
    this.state.snake.forEach((part, index) => {
      const mesh = this.segmentMeshes[index];
      mesh.userData.target = new THREE.Vector3(part.x, 0, part.z);
      if (immediate || (teleported && index === 0)) mesh.position.copy(mesh.userData.target as THREE.Vector3);
    });
    const head = this.segmentMeshes[0];
    if (head) head.userData.rotationTarget = Math.atan2(-this.state.direction.x, -this.state.direction.z);
  }

  private syncFood(): void {
    this.food.position.set(this.state.food.x, 0.5, this.state.food.z);
    this.food.scale.setScalar(0.08);
  }

  private animateScene(dt: number): void {
    this.sceneTime += dt;
    const follow = 1 - Math.exp(-dt * 42);
    this.segmentMeshes.forEach((mesh, index) => {
      const target = mesh.userData.target as THREE.Vector3 | undefined;
      if (target) {
        mesh.position.x = THREE.MathUtils.lerp(mesh.position.x, target.x, follow);
        mesh.position.z = THREE.MathUtils.lerp(mesh.position.z, target.z, follow);
      }
      mesh.position.y = Math.sin(this.sceneTime * 8 - index * 0.55) * 0.045;
      mesh.scale.lerp(new THREE.Vector3(1, 1, 1), 1 - Math.exp(-dt * 12));
      if (index === 0 && typeof mesh.userData.rotationTarget === 'number') {
        mesh.rotation.y = this.lerpAngle(mesh.rotation.y, mesh.userData.rotationTarget as number, 1 - Math.exp(-dt * 28));
      }
    });
    this.food.rotation.y += dt * 2.2;
    this.food.position.y = 0.48 + Math.sin(this.sceneTime * 4) * 0.1;
    const pulse = 1 + Math.sin(this.sceneTime * 5) * 0.04;
    this.food.scale.lerp(new THREE.Vector3(pulse, pulse, pulse), 1 - Math.exp(-dt * 10));
    this.portalMeshes.forEach((portal) => {
      const pulseAmount = 1 + Math.sin(this.sceneTime * 4 + Number(portal.userData.phase)) * 0.08;
      portal.scale.setScalar(pulseAmount);
      portal.rotation.z = Math.sin(this.sceneTime * 2 + Number(portal.userData.phase)) * 0.08;
    });
    this.updateParticles(dt);
    this.camera.position.lerp(this.cameraBase, 1 - Math.exp(-dt * 18));
    if (this.cameraPunch > 0) {
      this.cameraPunch = Math.max(0, this.cameraPunch - dt * 2.5);
      this.camera.position.x += (Math.random() - 0.5) * this.cameraPunch;
      this.camera.position.y += (Math.random() - 0.5) * this.cameraPunch;
    }
  }

  private spawnBurst(point: GridPoint, color: number, amount: number): void {
    for (let index = 0; index < amount; index += 1) {
      const mesh = new THREE.Mesh(
        new THREE.TetrahedronGeometry(0.07 + Math.random() * 0.07),
        new THREE.MeshBasicMaterial({ color }),
      );
      mesh.position.set(point.x, 0.55, point.z);
      const velocity = new THREE.Vector3(Math.random() - 0.5, 0.3 + Math.random(), Math.random() - 0.5).normalize().multiplyScalar(2.5 + Math.random() * 3);
      this.scene.add(mesh);
      this.particles.push({ mesh, velocity, life: 0.45 + Math.random() * 0.35 });
    }
  }

  private updateParticles(dt: number): void {
    for (let index = this.particles.length - 1; index >= 0; index -= 1) {
      const particle = this.particles[index];
      particle.life -= dt;
      particle.velocity.y -= dt * 3.5;
      particle.mesh.position.addScaledVector(particle.velocity, dt);
      particle.mesh.rotation.x += dt * 9;
      particle.mesh.scale.setScalar(Math.max(0, particle.life * 1.6));
      if (particle.life <= 0) {
        this.scene.remove(particle.mesh);
        particle.mesh.geometry.dispose();
        (particle.mesh.material as THREE.Material).dispose();
        this.particles.splice(index, 1);
      }
    }
  }

  private clearSnake(): void {
    this.segmentMeshes.length = 0;
    this.disposeGroup(this.snakeGroup);
  }

  private disposeGroup(group: THREE.Group): void {
    group.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.geometry.dispose();
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach((material) => material.dispose());
    });
    group.clear();
  }

  private loadBest(mode: GameMode): number {
    try { return Number(localStorage.getItem(`snake-3d-best-${mode}`) ?? 0); } catch { return 0; }
  }

  private saveBest(): void {
    try { localStorage.setItem(`snake-3d-best-${this.state.mode}`, String(this.state.best)); } catch { /* indisponível */ }
  }

  private lerpAngle(from: number, to: number, amount: number): number {
    return from + Math.atan2(Math.sin(to - from), Math.cos(to - from)) * amount;
  }

  private resize(): void {
    const width = innerWidth;
    const height = innerHeight;
    const portrait = height > width;
    const half = this.state.map.boardHalf;
    const maxPixelRatio = this.quality === 'low' ? 1 : this.quality === 'medium' ? 1.5 : 2;
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, maxPixelRatio));
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.fov = portrait ? 70 : 45;
    this.cameraBase.set(0, portrait ? half * 3.35 : half * 2.45, portrait ? half * 2.15 : half * 2.1);
    this.camera.position.copy(this.cameraBase);
    this.camera.lookAt(0, 0, 0);
    this.camera.updateProjectionMatrix();
  }
}

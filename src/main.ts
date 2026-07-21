import './styles.css';
import { inject } from '@vercel/analytics';
import { LEVELS, type GameMode } from './game/levels';
import type { SnakeState } from './game/simulation';
import { getTranslation, localeLabels, mobileTranslations, type Locale } from './i18n';

inject();
const { Game } = await import('./game/Game');

type Quality = 'low' | 'medium' | 'high';
type ControlsSize = 'medium' | 'large' | 'xlarge';
interface Preferences { locale: Locale; quality: Quality; sound: boolean; controlsSize: ControlsSize; }

const get = <T extends HTMLElement>(id: string): T => document.getElementById(id) as T;
const game = new Game(get<HTMLCanvasElement>('game-canvas'));
const hud = get('hud');
const startScreen = get('start-screen');
const pauseScreen = get('pause-screen');
const endScreen = get('end-screen');
const reviveScreen = get('revive-screen');
const settingsScreen = get('settings-screen');
const modeButtons = get('mode-buttons');
const levelPanel = get('level-panel');
const mobileControls = get('mobile-controls');
const eventMessage = get('event-message');
const readyMessage = get('ready-message');
const gameAds = get('game-ads');
const shareButton = get<HTMLButtonElement>('share-button');
const languageSelect = get<HTMLSelectElement>('language-select');
const qualitySelect = get<HTMLSelectElement>('quality-select');
const soundSelect = get<HTMLSelectElement>('sound-select');
const controlsSizeSelect = get<HTMLSelectElement>('controls-size-select');
const devParams = new URLSearchParams(location.search);
const forceTouchPreview = import.meta.env.DEV && devParams.has('touch');
const isTouch = forceTouchPreview || matchMedia('(pointer: coarse)').matches;
const socialBarSelector = "iframe[id^='container-a764163f73af04eaedaa7cb2049c28ee'], iframe[class^='container-a764163f73af04eaedaa7cb2049c28ee']";
document.documentElement.classList.toggle('force-touch-preview', forceTouchPreview);
let selectedMode: GameMode = 'endless';
let selectedLevel = 0;
let eventTimer = 0;
let lastEnd: { won: boolean; state: SnakeState } | null = null;
let settingsReturn: 'menu' | 'pause' = 'menu';
let preferences = loadPreferences();

function setSocialBarVisible(visible: boolean): void {
  document.querySelectorAll<HTMLElement>(socialBarSelector).forEach((element) => {
    if (visible) element.style.removeProperty('display');
    else element.style.setProperty('display', 'none', 'important');
  });
}

new MutationObserver(() => {
  if (document.body.classList.contains('game-active')) setSocialBarVisible(false);
}).observe(document.body, { childList: true, subtree: true });

function loadPreferences(): Preferences {
  try {
    const saved = JSON.parse(localStorage.getItem('snake-3d-preferences') ?? '{}') as Partial<Preferences>;
    return {
      locale: 'en',
      quality: ['low', 'medium', 'high'].includes(saved.quality ?? '') ? saved.quality as Quality : 'high',
      sound: saved.sound ?? true,
      controlsSize: ['medium', 'large', 'xlarge'].includes(saved.controlsSize ?? '') ? saved.controlsSize as ControlsSize : 'large',
    };
  } catch { return { locale: 'en', quality: 'high', sound: true, controlsSize: 'large' }; }
}

function savePreferences(): void {
  try { localStorage.setItem('snake-3d-preferences', JSON.stringify(preferences)); } catch { /* armazenamento indisponível */ }
}

function start(mode = selectedMode, level = selectedLevel): void {
  document.body.classList.add('game-active');
  setSocialBarVisible(false);
  selectedMode = mode;
  selectedLevel = level;
  lastEnd = null;
  startScreen.classList.add('hidden');
  pauseScreen.classList.add('hidden');
  endScreen.classList.add('hidden');
  reviveScreen.classList.add('hidden');
  settingsScreen.classList.add('hidden');
  readyMessage.classList.add('hidden');
  hud.classList.remove('hidden');
  gameAds.classList.remove('hidden');
  mobileControls.classList.toggle('hidden', !isTouch);
  game.start(mode, level);
}

function showMenu(): void {
  document.body.classList.remove('game-active');
  setSocialBarVisible(true);
  hud.classList.add('hidden');
  pauseScreen.classList.add('hidden');
  endScreen.classList.add('hidden');
  reviveScreen.classList.add('hidden');
  settingsScreen.classList.add('hidden');
  gameAds.classList.add('hidden');
  mobileControls.classList.add('hidden');
  readyMessage.classList.add('hidden');
  levelPanel.classList.add('hidden');
  modeButtons.classList.remove('hidden');
  startScreen.classList.remove('hidden');
  game.pause(true);
}

function setPaused(paused: boolean): void {
  game.pause(paused);
  pauseScreen.classList.toggle('hidden', !paused);
  mobileControls.classList.toggle('hidden', paused || !isTouch);
}

function showSettings(origin: 'menu' | 'pause'): void {
  settingsReturn = origin;
  if (origin === 'pause' && game.state.phase === 'playing') setPaused(true);
  settingsScreen.classList.remove('hidden');
}

function closeSettings(): void {
  settingsScreen.classList.add('hidden');
  if (settingsReturn === 'menu') startScreen.classList.remove('hidden');
}

function flash(text: string): void {
  clearTimeout(eventTimer);
  eventMessage.textContent = text;
  eventMessage.classList.remove('hidden', 'pop');
  requestAnimationFrame(() => eventMessage.classList.add('pop'));
  eventTimer = window.setTimeout(() => eventMessage.classList.add('hidden'), 620);
}

function renderLevelGrid(): void {
  const t = getTranslation(preferences.locale);
  const grid = get('level-grid');
  grid.replaceChildren(...LEVELS.map((_, index) => {
    const button = document.createElement('button');
    button.dataset.level = String(index);
    button.innerHTML = `<b>${index + 1}</b>${t.levelNames[index]}`;
    button.addEventListener('click', () => start('levels', index));
    return button;
  }));
}

function applyTranslations(): void {
  const t = getTranslation(preferences.locale);
  const mobile = mobileTranslations[preferences.locale];
  document.documentElement.lang = preferences.locale;
  get('tagline').textContent = t.tagline;
  get('endless-button').textContent = t.endless;
  get('levels-button').textContent = t.levels;
  get('choose-map').textContent = t.chooseMap;
  get('back-button').textContent = t.back;
  get('controls').textContent = isTouch ? mobile.controlsHint : t.controls;
  get('paused-title').textContent = t.paused;
  get('resume-button').textContent = t.continue;
  get('restart-pause-button').textContent = t.restart;
  get('menu-pause-button').textContent = t.mainMenu;
  get('menu-button').textContent = t.mainMenu;
  get('settings-pause-button').textContent = t.settings;
  get('settings-title').textContent = t.settings;
  get('language-label').textContent = t.language;
  get('quality-label').textContent = t.quality;
  get('sound-label').textContent = t.sound;
  get('settings-close-button').textContent = t.close;
  get('revive-title').textContent = t.secondLife;
  get('revive-copy').textContent = t.returningIn;
  readyMessage.textContent = t.chooseDirection;
  get('label-points').textContent = t.points;
  get('label-best').textContent = t.best;
  get('label-combo').textContent = t.combo;
  shareButton.textContent = `𝕏  ${t.shareX}`;
  get('language-button').textContent = `🌐 ${preferences.locale.split('-')[0].toUpperCase()}`;
  get('settings-button').setAttribute('aria-label', t.settings);
  document.querySelectorAll('.ad-slot span').forEach((span) => { span.textContent = t.ad; });
  qualitySelect.options[0].text = t.low;
  qualitySelect.options[1].text = t.medium;
  qualitySelect.options[2].text = t.high;
  soundSelect.options[0].text = t.enabled;
  soundSelect.options[1].text = t.disabled;
  get('controls-size-label').textContent = mobile.controlsSize;
  controlsSizeSelect.options[0].text = mobile.medium;
  controlsSizeSelect.options[1].text = mobile.large;
  controlsSizeSelect.options[2].text = mobile.xlarge;
  get('swipe-hint').textContent = mobile.swipeHint;
  renderLevelGrid();
  updateHud(game.state);
  if (lastEnd) renderEnd(lastEnd.won, lastEnd.state);
}

function updateHud(state: SnakeState): void {
  const t = getTranslation(preferences.locale);
  get('score').textContent = state.score.toLocaleString(preferences.locale);
  get('best').textContent = state.best.toLocaleString(preferences.locale);
  get('combo').textContent = `×${state.multiplier}`;
  const speedLevel = Math.min(10, Math.floor((state.map.startSpeed - state.stepTime) / 0.01) + 1);
  get('speed').textContent = `${t.speed.toUpperCase()} ${speedLevel}`;
  get('stage-label').textContent = state.mode === 'endless' ? t.endless : `${t.stage.toUpperCase()} ${state.levelIndex + 1} · ${t.levelNames[state.levelIndex]}`;
  const goal = get('goal');
  goal.classList.toggle('hidden', state.map.goal === null);
  if (state.map.goal !== null) goal.textContent = `${state.eaten} / ${state.map.goal} ${t.fruits.toUpperCase()}`;
  readyMessage.classList.toggle('hidden', state.phase !== 'ready');
}

function renderEnd(won: boolean, state: SnakeState): void {
  const t = getTranslation(preferences.locale);
  const hasNext = won && state.mode === 'levels' && state.levelIndex < LEVELS.length - 1;
  get('end-title').textContent = won ? (hasNext ? t.stageComplete : t.allComplete) : t.gameOver;
  get('end-stats').textContent = `${state.score.toLocaleString(preferences.locale)} ${t.points.toLowerCase()} · ${state.eaten} ${t.fruits.toLowerCase()} · ${t.combo.toLowerCase()} ×${state.multiplier}`;
  get('next-button').textContent = hasNext ? t.nextStage : t.playAgain;
  shareButton.classList.toggle('hidden', state.mode !== 'endless' || state.secondLifeUsed);
  get<HTMLButtonElement>('next-button').onclick = () => start(state.mode, hasNext ? state.levelIndex + 1 : state.levelIndex);
}

game.onUpdate = updateHud;
game.onEvent = flash;
game.onEnd = (won, state) => {
  lastEnd = { won, state };
  hud.classList.add('hidden');
  gameAds.classList.add('hidden');
  mobileControls.classList.add('hidden');
  readyMessage.classList.add('hidden');
  endScreen.classList.remove('hidden');
  renderEnd(won, state);
};

Object.entries(localeLabels).forEach(([value, label]) => languageSelect.add(new Option(label, value)));
languageSelect.value = preferences.locale;
qualitySelect.value = preferences.quality;
soundSelect.value = preferences.sound ? 'on' : 'off';
controlsSizeSelect.value = preferences.controlsSize;
mobileControls.dataset.size = preferences.controlsSize;
game.setQuality(preferences.quality);
game.setSound(preferences.sound);
applyTranslations();

languageSelect.addEventListener('change', () => {
  preferences.locale = languageSelect.value as Locale;
  savePreferences();
  applyTranslations();
});
qualitySelect.addEventListener('change', () => {
  preferences.quality = qualitySelect.value as Quality;
  game.setQuality(preferences.quality);
  savePreferences();
});
soundSelect.addEventListener('change', () => {
  preferences.sound = soundSelect.value === 'on';
  game.setSound(preferences.sound);
  savePreferences();
});
controlsSizeSelect.addEventListener('change', () => {
  preferences.controlsSize = controlsSizeSelect.value as ControlsSize;
  mobileControls.dataset.size = preferences.controlsSize;
  savePreferences();
});

get('endless-button').addEventListener('click', () => start('endless', 0));
get('levels-button').addEventListener('click', () => { modeButtons.classList.add('hidden'); levelPanel.classList.remove('hidden'); });
get('back-button').addEventListener('click', () => { levelPanel.classList.add('hidden'); modeButtons.classList.remove('hidden'); });
get('restart-pause-button').addEventListener('click', () => start());
get('pause-button').addEventListener('click', () => setPaused(true));
get('resume-button').addEventListener('click', () => setPaused(false));
get('menu-button').addEventListener('click', showMenu);
get('menu-pause-button').addEventListener('click', showMenu);
get('language-button').addEventListener('click', () => showSettings('menu'));
get('settings-button').addEventListener('click', () => showSettings('menu'));
get('settings-pause-button').addEventListener('click', () => showSettings('pause'));
get('settings-close-button').addEventListener('click', closeSettings);
shareButton.addEventListener('click', () => {
  if (!lastEnd || lastEnd.state.mode !== 'endless' || lastEnd.state.secondLifeUsed) return;
  const text = getTranslation(preferences.locale).shareText.replace('{score}', lastEnd.state.score.toLocaleString(preferences.locale));
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${text} #Snake3D`)}`, '_blank', 'noopener,noreferrer,width=720,height=520');
  beginSecondLifeCountdown();
});

function beginSecondLifeCountdown(): void {
  endScreen.classList.add('hidden');
  reviveScreen.classList.remove('hidden');
  const countdown = get('revive-countdown');
  const endsAt = Date.now() + 5_000;
  countdown.textContent = '5';
  const timer = window.setInterval(() => {
    const seconds = Math.max(0, Math.ceil((endsAt - Date.now()) / 1_000));
    countdown.textContent = String(seconds);
    if (seconds > 0) return;
    clearInterval(timer);
    reviveScreen.classList.add('hidden');
    if (!game.revive()) { endScreen.classList.remove('hidden'); return; }
    hud.classList.remove('hidden');
    gameAds.classList.remove('hidden');
    mobileControls.classList.toggle('hidden', !isTouch);
  }, 100);
}

addEventListener('keydown', (event) => {
  if (event.code !== 'Escape' && event.code !== 'KeyP') return;
  if (!settingsScreen.classList.contains('hidden')) { closeSettings(); return; }
  if (game.state.phase === 'playing') setPaused(true);
  else if (game.state.phase === 'paused' && startScreen.classList.contains('hidden')) setPaused(false);
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden && game.state.phase === 'playing') setPaused(true);
});

if (import.meta.env.DEV) {
  const params = devParams;
  const preview = params.get('play');
  if (preview) setTimeout(() => preview === 'endless' ? start('endless', 0) : start('levels', Math.max(0, Number(preview) - 1)), 120);
  if (params.has('settings')) setTimeout(() => showSettings('menu'), 120);
  if (params.has('levels')) setTimeout(() => { modeButtons.classList.add('hidden'); levelPanel.classList.remove('hidden'); }, 120);
  if (params.has('preview-revive')) setTimeout(() => {
    start('endless', 0);
    game.state.score = 2_400;
    game.state.eaten = 18;
    game.state.phase = 'lost';
    lastEnd = { won: false, state: game.state };
    beginSecondLifeCountdown();
  }, 120);
  if (params.has('preview-ready')) setTimeout(() => {
    start('endless', 0);
    game.state.phase = 'lost';
    if (game.revive()) {
      hud.classList.remove('hidden');
      gameAds.classList.remove('hidden');
    }
  }, 120);
  if (params.has('preview-score')) setTimeout(() => {
    start('endless', 0);
    game.state.score = 2_400;
    game.state.best = 8_400;
    game.state.eaten = 18;
    game.state.multiplier = 5;
    updateHud(game.state);
  }, 120);
}

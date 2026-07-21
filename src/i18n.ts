export type Locale = 'pt-BR' | 'en' | 'es' | 'fr' | 'de' | 'it' | 'ja' | 'ko' | 'zh-CN' | 'ru';

export interface Translation {
  tagline: string; endless: string; levels: string; chooseMap: string; back: string; controls: string;
  paused: string; continue: string; restart: string; mainMenu: string; gameOver: string;
  stageComplete: string; allComplete: string; playAgain: string; nextStage: string;
  points: string; best: string; combo: string; speed: string; stage: string; fruits: string;
  shareX: string; settings: string; language: string; quality: string; sound: string;
  low: string; medium: string; high: string; enabled: string; disabled: string; close: string;
  shareText: string; secondLife: string; returningIn: string; chooseDirection: string; ad: string; levelNames: string[];
}

export const localeLabels: Record<Locale, string> = {
  'pt-BR': 'Português', en: 'English', es: 'Español', fr: 'Français', de: 'Deutsch',
  it: 'Italiano', ja: '日本語', ko: '한국어', 'zh-CN': '中文', ru: 'Русский',
};

export const translations: Record<Locale, Translation> = {
  'pt-BR': {
    tagline: 'Coma, cresça e use os portais. Escolha uma corrida infinita ou avance por mapas com novos desafios.',
    endless: 'ENDLESS', levels: 'FASES', chooseMap: 'ESCOLHA O MAPA', back: 'Voltar', controls: 'WASD ou SETAS · ESC pausa',
    paused: 'PAUSADO', continue: 'CONTINUAR', restart: 'REINICIAR', mainMenu: 'Menu principal', gameOver: 'FIM DE JOGO',
    stageComplete: 'FASE CONCLUÍDA', allComplete: 'TODAS AS FASES CONCLUÍDAS', playAgain: 'JOGAR NOVAMENTE', nextStage: 'PRÓXIMA FASE',
    points: 'PONTOS', best: 'RECORDE', combo: 'COMBO', speed: 'VELOCIDADE', stage: 'FASE', fruits: 'FRUTAS',
    shareX: 'COMPARTILHE NO X E GANHE UMA NOVA TENTATIVA', settings: 'CONFIGURAÇÕES', language: 'Idioma', quality: 'Qualidade gráfica', sound: 'Sons',
    low: 'Baixa', medium: 'Média', high: 'Alta', enabled: 'Ligados', disabled: 'Desligados', close: 'SALVAR E FECHAR',
    shareText: 'Fiz {score} pontos no Snake 3D e desbloqueei uma segunda vida! Você consegue superar?', secondLife: 'SEGUNDA VIDA', returningIn: 'Voltando em', chooseDirection: 'ESCOLHA UMA DIREÇÃO', ad: 'ANÚNCIO',
    levelNames: ['Jardim', 'Cânion', 'Nexo', 'Gelo', 'Ruínas', 'Vulcão', 'Quântico', 'Labirinto', 'Vazio', 'Coroa'],
  },
  en: {
    tagline: 'Play Snake 3D free online. Eat fruit, grow, use portals, and beat endless runs or 10 challenging levels.',
    endless: 'ENDLESS', levels: 'LEVELS', chooseMap: 'CHOOSE A MAP', back: 'Back', controls: 'WASD or ARROWS · ESC pauses',
    paused: 'PAUSED', continue: 'CONTINUE', restart: 'RESTART', mainMenu: 'Main menu', gameOver: 'GAME OVER',
    stageComplete: 'LEVEL COMPLETE', allComplete: 'ALL LEVELS COMPLETE', playAgain: 'PLAY AGAIN', nextStage: 'NEXT LEVEL',
    points: 'SCORE', best: 'BEST', combo: 'COMBO', speed: 'SPEED', stage: 'LEVEL', fruits: 'FRUIT',
    shareX: 'SHARE ON X FOR A SECOND LIFE', settings: 'SETTINGS', language: 'Language', quality: 'Graphics quality', sound: 'Sound',
    low: 'Low', medium: 'Medium', high: 'High', enabled: 'On', disabled: 'Off', close: 'SAVE AND CLOSE',
    shareText: 'I scored {score} points in Snake 3D and unlocked a second life! Can you beat me?', secondLife: 'SECOND LIFE', returningIn: 'Returning in', chooseDirection: 'CHOOSE A DIRECTION', ad: 'ADVERTISEMENT',
    levelNames: ['Garden', 'Canyon', 'Nexus', 'Ice', 'Ruins', 'Volcano', 'Quantum', 'Maze', 'Void', 'Crown'],
  },
  es: {
    tagline: 'Come, crece y usa portales. Elige una partida infinita o avanza por mapas con nuevos desafíos.',
    endless: 'INFINITO', levels: 'NIVELES', chooseMap: 'ELIGE EL MAPA', back: 'Volver', controls: 'WASD o FLECHAS · ESC pausa',
    paused: 'PAUSA', continue: 'CONTINUAR', restart: 'REINICIAR', mainMenu: 'Menú principal', gameOver: 'FIN DEL JUEGO',
    stageComplete: 'NIVEL COMPLETADO', allComplete: 'TODOS LOS NIVELES COMPLETADOS', playAgain: 'JUGAR DE NUEVO', nextStage: 'SIGUIENTE NIVEL',
    points: 'PUNTOS', best: 'RÉCORD', combo: 'COMBO', speed: 'VELOCIDAD', stage: 'NIVEL', fruits: 'FRUTAS',
    shareX: 'COMPARTE EN X Y GANA OTRA VIDA', settings: 'AJUSTES', language: 'Idioma', quality: 'Calidad gráfica', sound: 'Sonido',
    low: 'Baja', medium: 'Media', high: 'Alta', enabled: 'Activado', disabled: 'Desactivado', close: 'GUARDAR Y CERRAR',
    shareText: '¡Hice {score} puntos en Snake 3D y desbloqueé una segunda vida! ¿Puedes superarme?', secondLife: 'SEGUNDA VIDA', returningIn: 'Regresas en', chooseDirection: 'ELIGE UNA DIRECCIÓN', ad: 'ANUNCIO',
    levelNames: ['Jardín', 'Cañón', 'Nexo', 'Hielo', 'Ruinas', 'Volcán', 'Cuántico', 'Laberinto', 'Vacío', 'Corona'],
  },
  fr: {
    tagline: 'Mangez, grandissez et utilisez les portails. Jouez sans fin ou progressez sur de nouvelles cartes.',
    endless: 'SANS FIN', levels: 'NIVEAUX', chooseMap: 'CHOISISSEZ LA CARTE', back: 'Retour', controls: 'WASD ou FLÈCHES · ESC pause',
    paused: 'PAUSE', continue: 'CONTINUER', restart: 'RECOMMENCER', mainMenu: 'Menu principal', gameOver: 'PARTIE TERMINÉE',
    stageComplete: 'NIVEAU TERMINÉ', allComplete: 'TOUS LES NIVEAUX TERMINÉS', playAgain: 'REJOUER', nextStage: 'NIVEAU SUIVANT',
    points: 'SCORE', best: 'RECORD', combo: 'COMBO', speed: 'VITESSE', stage: 'NIVEAU', fruits: 'FRUITS',
    shareX: 'PARTAGER SUR X POUR UNE SECONDE VIE', settings: 'PARAMÈTRES', language: 'Langue', quality: 'Qualité graphique', sound: 'Son',
    low: 'Basse', medium: 'Moyenne', high: 'Haute', enabled: 'Activé', disabled: 'Désactivé', close: 'ENREGISTRER ET FERMER',
    shareText: "J'ai marqué {score} points à Snake 3D et débloqué une seconde vie ! Pouvez-vous me battre ?", secondLife: 'SECONDE VIE', returningIn: 'Retour dans', chooseDirection: 'CHOISISSEZ UNE DIRECTION', ad: 'PUBLICITÉ',
    levelNames: ['Jardin', 'Canyon', 'Nexus', 'Glace', 'Ruines', 'Volcan', 'Quantique', 'Labyrinthe', 'Vide', 'Couronne'],
  },
  de: {
    tagline: 'Friss, wachse und nutze Portale. Spiele endlos oder meistere Karten mit neuen Herausforderungen.',
    endless: 'ENDLOS', levels: 'LEVEL', chooseMap: 'KARTE WÄHLEN', back: 'Zurück', controls: 'WASD oder PFEILE · ESC Pause',
    paused: 'PAUSE', continue: 'WEITER', restart: 'NEUSTART', mainMenu: 'Hauptmenü', gameOver: 'SPIEL VORBEI',
    stageComplete: 'LEVEL GESCHAFFT', allComplete: 'ALLE LEVEL GESCHAFFT', playAgain: 'NOCH EINMAL', nextStage: 'NÄCHSTES LEVEL',
    points: 'PUNKTE', best: 'REKORD', combo: 'KOMBO', speed: 'TEMPO', stage: 'LEVEL', fruits: 'FRÜCHTE',
    shareX: 'AUF X TEILEN FÜR EIN ZWEITES LEBEN', settings: 'EINSTELLUNGEN', language: 'Sprache', quality: 'Grafikqualität', sound: 'Ton',
    low: 'Niedrig', medium: 'Mittel', high: 'Hoch', enabled: 'An', disabled: 'Aus', close: 'SPEICHERN UND SCHLIESSEN',
    shareText: 'Ich habe {score} Punkte in Snake 3D und ein zweites Leben freigeschaltet! Schaffst du mehr?', secondLife: 'ZWEITES LEBEN', returningIn: 'Zurück in', chooseDirection: 'RICHTUNG WÄHLEN', ad: 'WERBUNG',
    levelNames: ['Garten', 'Canyon', 'Nexus', 'Eis', 'Ruinen', 'Vulkan', 'Quantenwelt', 'Labyrinth', 'Leere', 'Krone'],
  },
  it: {
    tagline: 'Mangia, cresci e usa i portali. Scegli una corsa infinita o supera mappe con nuove sfide.',
    endless: 'INFINITO', levels: 'LIVELLI', chooseMap: 'SCEGLI LA MAPPA', back: 'Indietro', controls: 'WASD o FRECCE · ESC pausa',
    paused: 'PAUSA', continue: 'CONTINUA', restart: 'RICOMINCIA', mainMenu: 'Menu principale', gameOver: 'FINE PARTITA',
    stageComplete: 'LIVELLO COMPLETATO', allComplete: 'TUTTI I LIVELLI COMPLETATI', playAgain: 'GIOCA ANCORA', nextStage: 'LIVELLO SUCCESSIVO',
    points: 'PUNTI', best: 'RECORD', combo: 'COMBO', speed: 'VELOCITÀ', stage: 'LIVELLO', fruits: 'FRUTTI',
    shareX: 'CONDIVIDI SU X PER UNA SECONDA VITA', settings: 'IMPOSTAZIONI', language: 'Lingua', quality: 'Qualità grafica', sound: 'Suono',
    low: 'Bassa', medium: 'Media', high: 'Alta', enabled: 'Attivo', disabled: 'Disattivo', close: 'SALVA E CHIUDI',
    shareText: 'Ho fatto {score} punti a Snake 3D e sbloccato una seconda vita! Riesci a battermi?', secondLife: 'SECONDA VITA', returningIn: 'Ritorno tra', chooseDirection: 'SCEGLI UNA DIREZIONE', ad: 'PUBBLICITÀ',
    levelNames: ['Giardino', 'Canyon', 'Nesso', 'Ghiaccio', 'Rovine', 'Vulcano', 'Quantico', 'Labirinto', 'Vuoto', 'Corona'],
  },
  ja: {
    tagline: '食べて成長し、ポータルを使おう。エンドレスか、難しくなるマップに挑戦。',
    endless: 'エンドレス', levels: 'ステージ', chooseMap: 'マップを選択', back: '戻る', controls: 'WASD / 矢印キー · ESC 一時停止',
    paused: '一時停止', continue: '続ける', restart: 'やり直す', mainMenu: 'メインメニュー', gameOver: 'ゲームオーバー',
    stageComplete: 'ステージクリア', allComplete: '全ステージクリア', playAgain: 'もう一度', nextStage: '次のステージ',
    points: 'スコア', best: 'ベスト', combo: 'コンボ', speed: 'スピード', stage: 'ステージ', fruits: 'フルーツ',
    shareX: 'Xで共有してセカンドライフを獲得', settings: '設定', language: '言語', quality: '画質', sound: 'サウンド',
    low: '低', medium: '中', high: '高', enabled: 'オン', disabled: 'オフ', close: '保存して閉じる',
    shareText: 'Snake 3Dで{score}点を獲得し、セカンドライフを解放！超えられる？', secondLife: 'セカンドライフ', returningIn: '復帰まで', chooseDirection: '方向を選択', ad: '広告',
    levelNames: ['ガーデン', 'キャニオン', 'ネクサス', 'アイス', '遺跡', '火山', '量子', '迷路', '虚空', 'クラウン'],
  },
  ko: {
    tagline: '먹고 성장하며 포털을 이용하세요. 무한 모드 또는 점점 어려워지는 맵에 도전하세요.',
    endless: '무한 모드', levels: '스테이지', chooseMap: '맵 선택', back: '뒤로', controls: 'WASD / 방향키 · ESC 일시정지',
    paused: '일시정지', continue: '계속', restart: '다시 시작', mainMenu: '메인 메뉴', gameOver: '게임 오버',
    stageComplete: '스테이지 완료', allComplete: '모든 스테이지 완료', playAgain: '다시 플레이', nextStage: '다음 스테이지',
    points: '점수', best: '최고', combo: '콤보', speed: '속도', stage: '스테이지', fruits: '과일',
    shareX: 'X에 공유하고 두 번째 기회 받기', settings: '설정', language: '언어', quality: '그래픽 품질', sound: '사운드',
    low: '낮음', medium: '중간', high: '높음', enabled: '켜짐', disabled: '꺼짐', close: '저장하고 닫기',
    shareText: 'Snake 3D에서 {score}점을 얻고 두 번째 기회를 잠금 해제했습니다! 기록을 깰 수 있나요?', secondLife: '두 번째 기회', returningIn: '복귀까지', chooseDirection: '방향을 선택하세요', ad: '광고',
    levelNames: ['정원', '협곡', '넥서스', '얼음', '유적', '화산', '퀀텀', '미로', '공허', '왕관'],
  },
  'zh-CN': {
    tagline: '吃掉水果、不断成长并使用传送门。选择无尽模式或挑战越来越难的地图。',
    endless: '无尽模式', levels: '关卡', chooseMap: '选择地图', back: '返回', controls: 'WASD / 方向键 · ESC 暂停',
    paused: '已暂停', continue: '继续', restart: '重新开始', mainMenu: '主菜单', gameOver: '游戏结束',
    stageComplete: '关卡完成', allComplete: '全部关卡完成', playAgain: '再玩一次', nextStage: '下一关',
    points: '分数', best: '纪录', combo: '连击', speed: '速度', stage: '关卡', fruits: '水果',
    shareX: '分享到 X，获得第二次机会', settings: '设置', language: '语言', quality: '画面质量', sound: '声音',
    low: '低', medium: '中', high: '高', enabled: '开启', disabled: '关闭', close: '保存并关闭',
    shareText: '我在 Snake 3D 中获得了 {score} 分并解锁了第二次机会！你能超过吗？', secondLife: '第二次机会', returningIn: '返回倒计时', chooseDirection: '选择方向', ad: '广告',
    levelNames: ['花园', '峡谷', '核心', '冰原', '遗迹', '火山', '量子', '迷宫', '虚空', '王冠'],
  },
  ru: {
    tagline: 'Ешьте, растите и используйте порталы. Играйте бесконечно или проходите всё более сложные карты.',
    endless: 'БЕСКОНЕЧНО', levels: 'УРОВНИ', chooseMap: 'ВЫБЕРИТЕ КАРТУ', back: 'Назад', controls: 'WASD или СТРЕЛКИ · ESC пауза',
    paused: 'ПАУЗА', continue: 'ПРОДОЛЖИТЬ', restart: 'ЗАНОВО', mainMenu: 'Главное меню', gameOver: 'ИГРА ОКОНЧЕНА',
    stageComplete: 'УРОВЕНЬ ПРОЙДЕН', allComplete: 'ВСЕ УРОВНИ ПРОЙДЕНЫ', playAgain: 'ИГРАТЬ СНОВА', nextStage: 'СЛЕДУЮЩИЙ УРОВЕНЬ',
    points: 'ОЧКИ', best: 'РЕКОРД', combo: 'КОМБО', speed: 'СКОРОСТЬ', stage: 'УРОВЕНЬ', fruits: 'ФРУКТЫ',
    shareX: 'ПОДЕЛИТЬСЯ В X И ПОЛУЧИТЬ ВТОРУЮ ЖИЗНЬ', settings: 'НАСТРОЙКИ', language: 'Язык', quality: 'Качество графики', sound: 'Звук',
    low: 'Низкое', medium: 'Среднее', high: 'Высокое', enabled: 'Вкл.', disabled: 'Выкл.', close: 'СОХРАНИТЬ И ЗАКРЫТЬ',
    shareText: 'Я набрал {score} очков в Snake 3D и открыл вторую жизнь! Сможешь больше?', secondLife: 'ВТОРАЯ ЖИЗНЬ', returningIn: 'Возвращение через', chooseDirection: 'ВЫБЕРИТЕ НАПРАВЛЕНИЕ', ad: 'РЕКЛАМА',
    levelNames: ['Сад', 'Каньон', 'Нексус', 'Лёд', 'Руины', 'Вулкан', 'Квант', 'Лабиринт', 'Пустота', 'Корона'],
  },
};

export const getTranslation = (locale: Locale): Translation => translations[locale] ?? translations.en;

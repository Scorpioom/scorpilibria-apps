/*
 * ScorpiLibria для телевизоров Samsung (модуль TizenBrew).
 * TizenBrew открывает сайт поверх своего интерфейса в том же окне и подключает
 * этот скрипт:
 * - включает режим ТВ сайта (крупный фокус, навигация пультом);
 * - помечает, что сайт открыт из TizenBrew: кнопка «Выход» в шапке и «Назад» на
 *   главной возвращают в TizenBrew (в начало истории), а не закрывают его целиком.
 * Медиакнопки пульта (Play/Pause, перемотка, след./пред. серия) регистрируются
 * через поле "keys" в package.json и обрабатываются плеером сайта.
 */
(function () {
  try {
    sessionStorage.setItem('scorpilibria:shell', 'tizenbrew');
  } catch (e) {
    /* без sessionStorage «Выход» просто закроет TizenBrew */
  }

  var TV_KEY = 'scorpilibria:tv';
  try {
    if (localStorage.getItem(TV_KEY) !== '1') {
      localStorage.setItem(TV_KEY, '1');
      location.reload();
      return;
    }
  } catch (e) {
    /* без localStorage сайт включит режим ТВ сам — по User-Agent Tizen */
  }

  function backToTizenBrew() {
    if (history.length > 1) {
      history.go(-(history.length - 1));
      return;
    }
    try {
      tizen.application.getCurrentApplication().exit();
    } catch (err) {
      /* не в Tizen — ничего не делаем */
    }
  }

  var BACK = 10009;
  document.addEventListener(
    'keydown',
    function (e) {
      if (e.keyCode !== BACK) return;
      var onHome = location.pathname === '/' || location.pathname === '';
      var busy = document.fullscreenElement || document.querySelector('[role="dialog"]');
      if (!onHome || busy) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      backToTizenBrew();
    },
    true,
  );
})();

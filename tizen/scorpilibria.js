/*
 * ScorpiLibria для телевизоров Samsung (модуль TizenBrew).
 * TizenBrew открывает сайт и подключает этот скрипт:
 * - включает режим ТВ сайта (крупный фокус, навигация пультом);
 * - кнопка «Назад» на главной странице закрывает приложение (иначе из него не выйти).
 * Медиакнопки пульта (Play/Pause, перемотка, след./пред. серия) регистрируются
 * через поле "keys" в package.json и обрабатываются плеером сайта.
 */
(function () {
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

  var BACK = 10009;
  document.addEventListener(
    'keydown',
    function (e) {
      if (e.keyCode !== BACK) return;
      var onHome = location.pathname === '/' || location.pathname === '';
      var busy = document.fullscreenElement || document.querySelector('[role="dialog"]');
      if (!onHome || busy || typeof tizen === 'undefined') return;
      e.preventDefault();
      e.stopImmediatePropagation();
      try {
        tizen.application.getCurrentApplication().exit();
      } catch (err) {
        /* не в Tizen — ничего не делаем */
      }
    },
    true,
  );
})();

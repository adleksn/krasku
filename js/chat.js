/* ============================================================
   KRASKU.RU — chat.js
   Чат с менеджером: mock-сообщения, отправка, статус печати.
   ============================================================ */

'use strict';

window.KRASKU = window.KRASKU || {};

(function (ns) {

  var REPLY_POOL = [
    'Спасибо за сообщение! Уточню у технолога и вернусь с ответом в течение 15 минут.',
    'Принято. Могу дополнительно подготовить расчёт по фасовкам и предварительное КП.',
    'Отличный вопрос. Подскажите, пожалуйста, условия эксплуатации — наружные или внутренние работы?',
    'Зафиксировал. Направлю коммерческое предложение на указанную почту до конца рабочего дня.'
  ];

  function now() {
    return new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  }

  function msgHtml(m) {
    return '<div class="chat-msg chat-msg--' + m.from + '">' + ns.esc(m.text) + '<time>' + m.time + '</time></div>';
  }

  ns.initChat = function () {
    var box = document.getElementById('chatBox');
    var list = document.getElementById('chatMessages');
    var input = document.getElementById('chatInput');
    var sendBtn = document.getElementById('chatSend');
    var typing = null;

    var typingHtml = '<div class="chat-typing" aria-label="Менеджер печатает"><i></i><i></i><i></i></div>';

    function append(m) {
      list.insertAdjacentHTML('beforeend', msgHtml(m));
      list.scrollTop = list.scrollHeight;
    }

    var history = ns.store.getChat();
    (history.length ? history : ns.api.getChatSeed()).forEach(append);

    function send() {
      var text = input.value.trim();
      if (!text) return;
      ns.store.appendChat({ from: 'client', text: text, time: now() });
      append({ from: 'client', text: text, time: now() });
      input.value = '';
      typing = document.createElement('div');
      typing.innerHTML = typingHtml;
      list.appendChild(typing);
      list.scrollTop = list.scrollHeight;

      setTimeout(function () {
        if (typing) typing.remove();
        var reply = REPLY_POOL[Math.floor(Math.random() * REPLY_POOL.length)];
        ns.store.appendChat({ from: 'manager', text: reply, time: now() });
        append({ from: 'manager', text: reply, time: now() });
      }, 1400 + Math.random() * 900);
    }

    sendBtn.addEventListener('click', send);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); send(); } });

    document.querySelectorAll('[data-quick-question]').forEach(function (b) {
      b.addEventListener('click', function () {
        input.value = b.getAttribute('data-quick-question');
        input.focus();
      });
    });
  };

})(window.KRASKU);

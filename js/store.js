/* ============================================================
   KRASKU.RU — store.js
   Избранное и сравнение через localStorage + события.
   ============================================================ */

'use strict';

window.KRASKU = window.KRASKU || {};

(function (ns) {

  var KEYS = {
    favs: 'krasku_favs',
    compare: 'krasku_compare',
    requests: 'krasku_requests',
    messages: 'krasku_messages',
    chat: 'krasku_chat'
  };
  var MAX_COMPARE = 4;

  /* Сидирование хранилища из mock-данных (только при первом запуске) */
  function seed(key, data) {
    try {
      if (localStorage.getItem(key) === null) localStorage.setItem(key, JSON.stringify(data || []));
    } catch (e) { /* ignore */ }
  }
  seed(KEYS.requests, ns.api.getRequestsSeed());
  seed(KEYS.messages, ns.api.getMessagesSeed());
  seed(KEYS.chat, ns.api.getChatSeed());

  function read(key) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function write(key, arr) {
    localStorage.setItem(key, JSON.stringify(arr));
    document.dispatchEvent(new CustomEvent('krasku:storechange', { detail: { key: key } }));
  }

  function emit(key, payload) {
    document.dispatchEvent(new CustomEvent('krasku:' + key, { detail: payload }));
  }

  ns.store = {
    /* ---------- Избранное ---------- */
    getFavorites: function () { return read(KEYS.favs); },
    isFavorite: function (id) { return read(KEYS.favs).indexOf(String(id)) !== -1; },
    toggleFavorite: function (id) {
      var arr = read(KEYS.favs);
      id = String(id);
      var i = arr.indexOf(id);
      var added = false;
      if (i === -1) { arr.push(id); added = true; } else { arr.splice(i, 1); }
      write(KEYS.favs, arr);
      emit('favoriteschange', { id: id, added: added, count: arr.length });
      return added;
    },
    removeFavorite: function (id) {
      var arr = read(KEYS.favs).filter(function (x) { return x !== String(id); });
      write(KEYS.favs, arr);
      emit('favoriteschange', { id: id, added: false, count: arr.length });
      return arr;
    },

    /* ---------- Сравнение (макс 4) ---------- */
    getCompare: function () { return read(KEYS.compare); },
    isCompare: function (id) { return read(KEYS.compare).indexOf(String(id)) !== -1; },
    compareFull: function () { return read(KEYS.compare).length >= MAX_COMPARE; },
    toggleCompare: function (id) {
      var arr = read(KEYS.compare);
      id = String(id);
      var i = arr.indexOf(id);
      var added = false;
      var full = false;
      if (i === -1) {
        if (arr.length >= MAX_COMPARE) {
          emit('comparefull', { limit: MAX_COMPARE });
          return { added: false, full: true };
        }
        arr.push(id); added = true;
      } else {
        arr.splice(i, 1);
      }
      write(KEYS.compare, arr);
      emit('comparechange', { id: id, added: added, count: arr.length });
      return { added: added, full: full };
    },
    removeCompare: function (id) {
      var arr = read(KEYS.compare).filter(function (x) { return x !== String(id); });
      write(KEYS.compare, arr);
      emit('comparechange', { id: id, added: false, count: arr.length });
    },
    clearCompare: function () {
      write(KEYS.compare, []);
      emit('comparechange', { added: false, count: 0 });
    },
    maxCompare: MAX_COMPARE,

    /* ---------- Заявки ---------- */
    getRequests: function () { return read(KEYS.requests); },
    addRequest: function (r) {
      var arr = read(KEYS.requests);
      arr.unshift(r);
      write(KEYS.requests, arr.slice(0, 60));
      emit('requestschange', { count: arr.length });
      return r;
    },
    newRequestId: function () {
      return 'ЗК-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    },

    /* ---------- Входящие сообщения ---------- */
    getMessages: function () { return read(KEYS.messages); },
    addMessage: function (m) {
      var arr = read(KEYS.messages);
      m.id = m.id || 'M' + Date.now();
      m.read = !!m.read;
      arr.unshift(m);
      write(KEYS.messages, arr.slice(0, 80));
      emit('messageschange', { count: arr.length });
      return m;
    },
    markMessageRead: function (id) {
      var arr = read(KEYS.messages);
      var changed = false;
      arr.forEach(function (m) {
        if (String(m.id) === String(id) && !m.read) { m.read = true; changed = true; }
      });
      if (changed) write(KEYS.messages, arr);
      return changed;
    },
    unreadMessages: function () {
      return read(KEYS.messages).filter(function (m) { return !m.read; }).length;
    },

    /* ---------- Чат с менеджером ---------- */
    getChat: function () { return read(KEYS.chat); },
    appendChat: function (m) {
      var arr = read(KEYS.chat);
      arr.push(m);
      write(KEYS.chat, arr.slice(-200));
      emit('chatchange', { count: arr.length });
      return m;
    },
    clearChat: function () {
      write(KEYS.chat, []);
      emit('chatchange', { count: 0 });
    }
  };

})(window.KRASKU);

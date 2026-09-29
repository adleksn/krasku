/* ============================================================
   KRASKU.RU — url.js
   Единый построитель ссылок. Все href в JS должны идти через
   ns.url(route, arg). При натяжке на WordPress карта ROUTES
   меняется на пермалинки (get_permalink и т.д.) — достаточно
   править только этот файл и не трогать остальной код.
   ============================================================ */

'use strict';

window.KRASKU = window.KRASKU || {};

(function (ns) {

  var ROUTES = {
    home: 'index.html',
    catalog: 'catalog.html',
    category: function (slug) { return 'category.html?cat=' + encodeURIComponent(slug); },
    product: function (id) { return 'product.html?id=' + encodeURIComponent(id); },
    article: function (id) { return 'article.html?id=' + encodeURIComponent(id); },
    search: function (q) { return 'search.html' + (q ? '?q=' + encodeURIComponent(q) : ''); },
    favorites: 'favorites.html',
    compare: 'compare.html',
    account: 'account.html',
    requests: 'requests.html',
    chat: 'chat.html',
    docs: function (cat) { return cat ? 'docs.html?cat=' + encodeURIComponent(cat) : 'docs.html'; },
    tinting: 'tinting.html',
    about: 'about.html',
    articles: 'articles.html',
    faq: 'faq.html',
    contacts: 'contacts.html'
  };

  ns.url = function (route, arg) {
    var r = ROUTES[route];
    if (r == null) return '#';
    return typeof r === 'function' ? r(arg) : r;
  };

  /* Таблица маршрутов (полезно для отладки и для WP-адаптера). */
  ns.routeOf = function () { return ROUTES; };

})(window.KRASKU);

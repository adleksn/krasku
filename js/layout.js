/* ============================================================
   KRASKU.RU — layout.js
   Шапка, подвал, мобильное меню, поиск, floating-кнопка заявки.
   Единый компонент — инжектится на все страницы.
   ============================================================ */

'use strict';

window.KRASKU = window.KRASKU || {};

(function (ns) {

  var NAV = [
    { id: 'home', route: 'home', label: 'Главная' },
    { id: 'catalog', route: 'catalog', label: 'Каталог' },
    { id: 'tinting', route: 'tinting', label: 'Колеровка' },
    { id: 'about', route: 'about', label: 'О нас' },
    { id: 'articles', route: 'articles', label: 'Статьи' },
    { id: 'docs', route: 'docs', label: 'Документация' },
    { id: 'contacts', route: 'contacts', label: 'Контакты' }
  ];

  function currentPage() {
    return document.body.getAttribute('data-page') || '';
  }

  function navHtml() {
    return '<ul>' + NAV.map(function (n) {
      return '<li><a href="' + ns.url(n.route) + '" data-nav="' + n.id + '"' + (currentPage() === n.id ? ' class="is-active" aria-current="page"' : '') + '>' + n.label + '</a></li>';
    }).join('') + '</ul>';
  }

  function logoHtml(inverse) {
    return '<span class="logo-art"><img src="assets/brand/' + (inverse ? 'logo-dark.svg' : 'logo-dark.svg') + '" alt="KRASKU.RU"></span>';
  }

  function badgeHtml(count) {
    return count > 0 ? '<span class="icon-badge">' + (count > 9 ? '9+' : count) + '</span>' : '<span class="icon-badge icon-badge--off"></span>';
  }

  function headerHtml() {
    var favCount = ns.store.getFavorites().length;
    var cmpCount = ns.store.getCompare().length;
    return '<header class="site-header" id="siteHeader">'
      + '<div class="container header-inner">'
      + '<a class="logo" href="' + ns.url('home') + '" aria-label="KRASKU.RU — на главную">'
      + logoHtml(false)
      + '</a>'
      + '<nav class="main-nav" aria-label="Основная навигация">' + navHtml() + '</nav>'
      + '<div class="header-actions">'
      + '<a class="header-phone" href="tel:88001001199"><b>8 800 100 1199</b><span>Пн–Пт 9:00–17:00</span></a>'
      + '<button type="button" class="btn-icon" data-search-open aria-label="Поиск по каталогу" aria-expanded="false" aria-controls="searchBar">' + ns.ICONS.search + '</button>'
      + '<a class="btn-icon" href="' + ns.url('favorites') + '" aria-label="Избранное">' + ns.ICONS.heart + badgeHtml(favCount) + '</a>'
      + '<a class="btn-icon btn-compare" href="' + ns.url('compare') + '" aria-label="Сравнение">' + ns.ICONS.compare + badgeHtml(cmpCount) + '</a>'
      + '<a class="btn-icon" href="' + ns.url('account') + '" aria-label="Личный кабинет">' + ns.ICONS.user + '</a>'
      + '<button type="button" class="btn btn-primary btn-kp" data-cta="kp">Запросить счёт с НДС</button>'
      + '<button type="button" class="btn-icon burger" data-menu-open aria-label="Открыть меню" aria-expanded="false" aria-controls="mobileNav">' + ns.ICONS.menu + '</button>'
      + '</div>'
      + '</div>'
      + '</header>';
  }

  function mobileNavHtml() {
    return '<aside class="mobile-nav" id="mobileNav" aria-label="Мобильное меню">'
      + '<div class="mobile-nav-head">'
      + '<span class="logo">' + logoHtml(false) + '</span>'
      + '<button type="button" class="btn-icon" data-menu-close aria-label="Закрыть меню">' + ns.ICONS.close + '</button>'
      + '</div>'
      + '<nav class="mobile-nav-body">' + NAV.map(function (n) {
        return '<a href="' + ns.url(n.route) + '"' + (currentPage() === n.id ? ' class="is-active"' : '') + '>' + n.label + '</a>';
      }).join('')
      + '<div class="mobile-nav-divider"></div>'
      + '<a href="' + ns.url('favorites') + '">Избранное</a>'
      + '<a href="' + ns.url('compare') + '">Сравнение</a>'
      + '<a href="' + ns.url('account') + '">Личный кабинет</a>'
      + '</nav>'
      + '<div class="mobile-nav-foot">'
      + '<a class="btn btn-outline" href="tel:88001001199">8 800 100 1199</a>'
      + '<button type="button" class="btn btn-primary" data-cta="kp">Запросить счёт с НДС</button>'
      + '</div>'
      + '</aside>';
  }

  function overlayHtml() {
    return '<div class="overlay" data-overlay></div>';
  }

  function searchBarHtml() {
    return '<div class="search-bar" id="searchBar" role="search">'
      + '<div class="container search-inner">'
      + '<div class="search-row">'
      + '<div class="search-input-wrap">'
      + ns.ICONS.search
      + '<input class="search-input" type="search" name="q" data-search-input placeholder="Марка, тип продукта, подложка, назначение…" aria-label="Поиск по каталогу" autocomplete="off">'
      + '</div>'
      + '<button type="button" class="btn btn-outline" data-search-close>Закрыть</button>'
      + '</div>'
      + '<div class="search-results" data-search-results></div>'
      + '</div>'
      + '</div>';
  }

  function footerHtml() {
    var cats = ns.api.getCategories();
    var dcs = ns.api.getDocCats();
    return '<footer class="site-footer">'
      + '<div class="container footer-main">'
      + '<div class="footer-grid">'
      + '<div class="footer-col footer-logo">'
      + '<a class="logo" href="' + ns.url('home') + '" aria-label="KRASKU.RU — на главную">'
      + logoHtml(true)
      + '</a>'
      + '<p class="footer-desc">Производство, колеровка и поставка лакокрасочных материалов для промышленности и строительства.</p>'
      + '</div>'
      + '<div class="footer-col">'
      + '<h4>Навигация</h4><ul>'
      + NAV.map(function (n) { return '<li><a href="' + ns.url(n.route) + '">' + n.label + '</a></li>'; }).join('')
      + '<li><a href="' + ns.url('faq') + '">FAQ</a></li>'
      + '<li><a href="' + ns.url('account') + '">Личный кабинет</a></li>'
      + '</ul>'
      + '</div>'
      + '<div class="footer-col">'
      + '<h4>Каталог</h4><ul>'
      + cats.map(function (c) {
        return '<li><a href="' + ns.url('category', c.slug) + '">' + c.name + '</a></li>';
      }).join('')
      + '</ul>'
      + '</div>'
      + '<div class="footer-col">'
      + '<h4>Документация</h4><ul>'
      + dcs.map(function (dc) {
        return '<li><a href="' + ns.url('docs', dc) + '">' + dc + '</a></li>';
      }).join('')
      + '</ul>'
      + '</div>'
      + '<div class="footer-col">'
      + '<h4>Контакты</h4>'
      + '<ul class="footer-contact">'
      + '<li>' + ns.ICONS.phone + '<span><b>8 800 100 11 99<br>8 920 127 71 77</b>Пн–Пт 9:00–17:00 МСК</span></li>'
      + '<li>' + ns.ICONS.mail + '<span><b>ros-akva@yandex.ru</b>Заявки и коммерческие предложения</span></li>'
      + '<li>' + ns.ICONS.pin + '<span><b>Адрес производства</b>г. Ярославль, Октября проспект 78, строение 5, офис 11</span></li>'
      + '</ul>'
      + '</div>'
      + '</div>'
      + '</div>'
      + '<div class="footer-bottom container">'
      + '<span>© ' + new Date().getFullYear() + ' KRASKU.RU — производство лакокрасочных материалов</span>'
      + '<nav aria-label="Правовая информация">'
      + '<a href="' + ns.url('docs') + '">Документация</a>'
      + '<a href="' + ns.url('contacts') + '">Реквизиты</a>'
      + '<a href="' + ns.url('contacts') + '">Политика конфиденциальности</a>'
      + '</nav>'
      + '</div>'
      + '</footer>';
  }

  function floatingBtnHtml() {
    return '<button type="button" class="floating-request" data-cta="request">' + ns.ICONS.mail + '<span>Заявка</span></button>';
  }

  /* ---------- Рендер результатов поиска ---------- */
  function renderSearchResults(query) {
    var wrap = document.querySelector('[data-search-results]');
    if (!wrap) return;
    var list = ns.api.search(query);
    if (!query) { wrap.innerHTML = ''; return; }
    if (!list.length) {
      wrap.innerHTML = '<p class="search-empty">Ничего не найдено. <a href="' + ns.url('search', query) + '">Открыть страницу поиска</a> или заказать по ТЗ.</p>';
      return;
    }
    wrap.innerHTML = list.slice(0, 6).map(function (p) {
      return '<a class="search-result" href="' + ns.url('product', p.id) + '">'
        + '<img src="' + ns.svgToDataUri(ns.productSvg(p, p.name)) + '" alt="">'
        + '<span><span class="search-result-name">' + ns.esc(p.name) + '</span><br><span class="search-result-sku">' + ns.esc(p.sku) + ' · ' + ns.esc(p.category) + '</span></span>'
        + '<span class="search-result-price">' + ns.formatPrice(p.pricePerKg) + ' /кг</span>'
        + '</a>';
    }).join('')
      + '<p class="search-empty"><a href="' + ns.url('search', query) + '">Показать все результаты (' + list.length + ')</a></p>';
  }

  /* ---------- Сборка layout ---------- */
  ns.buildLayout = function () {
    if (!document.querySelector('link[data-krasku-favicon]')) {
      var icon = document.createElement('link');
      icon.rel = 'icon'; icon.href = 'assets/brand/favicon.svg'; icon.type = 'image/svg+xml'; icon.setAttribute('data-krasku-favicon', '');
      document.head.appendChild(icon);
    }
    document.querySelectorAll('[data-slot="header"]').forEach(function (slot) { slot.outerHTML = headerHtml(); });
    document.querySelectorAll('[data-slot="footer"]').forEach(function (slot) { slot.outerHTML = footerHtml(); });

    var body = document.body;
    body.insertAdjacentHTML('beforeend', overlayHtml());
    body.insertAdjacentHTML('beforeend', mobileNavHtml());
    body.insertAdjacentHTML('beforeend', searchBarHtml());
    body.insertAdjacentHTML('beforeend', floatingBtnHtml());

    var header = document.getElementById('siteHeader');
    var overlay = document.querySelector('[data-overlay]');
    var mobileNav = document.getElementById('mobileNav');
    var searchBar = document.getElementById('searchBar');
    var searchInput = document.querySelector('[data-search-input]');
    var searchResults = document.querySelector('[data-search-results]');
    var scrolled = false;

    /* sticky-состояние */
    function onScroll() {
      var now = window.scrollY > 10;
      if (now !== scrolled) { scrolled = now; header.classList.toggle('is-scrolled', now); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    function openMenu() {
      mobileNav.classList.add('is-open');
      overlay.classList.add('is-open');
      document.body.classList.add('no-scroll');
      document.querySelector('[data-menu-open]').setAttribute('aria-expanded', 'true');
    }
    function closeMenu() {
      mobileNav.classList.remove('is-open');
      overlay.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
      document.querySelector('[data-menu-open]').setAttribute('aria-expanded', 'false');
    }
    function openSearch() {
      searchBar.classList.add('is-open');
      overlay.classList.add('is-open');
      document.body.classList.add('no-scroll');
      document.querySelector('[data-search-open]').setAttribute('aria-expanded', 'true');
      setTimeout(function () { searchInput.focus(); }, 80);
    }
    function closeSearch() {
      searchBar.classList.remove('is-open');
      overlay.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
      document.querySelector('[data-search-open]').setAttribute('aria-expanded', 'false');
    }

    document.querySelectorAll('[data-menu-open]').forEach(function (b) { b.addEventListener('click', openMenu); });
    document.querySelectorAll('[data-menu-close]').forEach(function (b) { b.addEventListener('click', closeMenu); });
    document.querySelector('[data-search-open]').addEventListener('click', openSearch);
    document.querySelectorAll('[data-search-close]').forEach(function (b) { b.addEventListener('click', closeSearch); });

    overlay.addEventListener('click', function () { closeMenu(); closeSearch(); });

    mobileNav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });

    /* live-поиск */
    searchInput.addEventListener('input', function () { renderSearchResults(searchInput.value); });
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var q = searchInput.value.trim();
        if (q) { window.location.href = ns.url('search', q); }
      }
      if (e.key === 'Escape') closeSearch();
    });

    /* Escape закрывает всё */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeMenu(); closeSearch(); }
    });

    /* Счётчики избранного/сравнения */
    function syncBadges() {
      var favs = document.querySelector('a[aria-label="Избранное"] .icon-badge');
      var cmps = document.querySelector('a[aria-label="Сравнение"] .icon-badge');
      var f = ns.store.getFavorites().length;
      var c = ns.store.getCompare().length;
      if (favs) { favs.textContent = f > 0 ? (f > 9 ? '9+' : f) : ''; favs.classList.toggle('icon-badge--off', f === 0); }
      if (cmps) { cmps.textContent = c > 0 ? (c > 9 ? '9+' : c) : ''; cmps.classList.toggle('icon-badge--off', c === 0); }
    }
    document.addEventListener('krasku:storechange', syncBadges);

    /* CTA-кнопки открывают модалку */
    document.querySelectorAll('[data-cta="kp"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        ns.invoiceModal();
      });
    });
    document.querySelectorAll('[data-cta="request"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        ns.technologistModal();
      });
    });
    document.querySelectorAll('[data-cta="consult"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        ns.technologistModal();
      });
    });
    document.querySelectorAll('[data-cta="tz"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        ns.technologistModal();
      });
    });
    document.querySelectorAll('[data-cta="tinting"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        ns.requestModal({
          title: 'Запросить подбор цвета',
          desc: 'Укажите систему цвета и оттенок — технолог согласует выкрас.',
          body: '<form data-request-form novalidate><div class="form-grid">'
            + ns.field('ФИО', 'name', 'text', true)
            + ns.field('Телефон', 'phone', 'tel', true)
            + ns.field('Email', 'email', 'email', true)
            + '<div class="field"><label class="field-label" for="f-cs">Система цвета</label><select id="f-cs" name="colorSystem"><option>RAL</option><option>ГОСТ</option><option>NCS</option></select></div>'
            + '<div class="field"><label class="field-label" for="f-cnum">Номер / описание цвета</label><input id="f-cnum" name="color" type="text"></div>'
            + '<div class="span-2">' + ns.field('Комментарий', 'comment', 'textarea') + '</div>'
            + '</div></form>',
          foot: '<button type="submit" class="btn btn-primary btn-lg btn-block" data-request-submit>Запросить подбор цвета</button>'
        });
      });
    });
  };

  /* ---------- SVG -> data URI ---------- */
  ns.svgToDataUri = function (svgString) {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
  };

})(window.KRASKU);

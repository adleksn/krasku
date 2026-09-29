/* ============================================================
   KRASKU.RU — main.js
   Инициализация страниц и общие рендеры контента.
   ============================================================ */

'use strict';

window.KRASKU = window.KRASKU || {};

(function (ns) {

  /* ---------- Категории: сетка ---------- */
  function plural(n, one, few, many) {
    var m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
  }

  function categoryCard(c, href, variant) {
    var surfaceArt = ns.surfaceCategoryArt && ns.surfaceCategoryArt[c.name];
    var media = variant === 'surface'
      ? surfaceArt
        ? '<div class="category-media category-media--surface" aria-hidden="true"><img src="' + surfaceArt + '" alt="" loading="lazy"></div>'
        : '<div class="category-media category-media--surface" aria-hidden="true"><span class="surface-mark surface-mark--' + ns.esc(c.slug) + '"></span></div>'
      : '<div class="category-media"><img src="' + (ns.categoryArt[c.name] || c.image || ns.svgToDataUri(ns.categorySvg(c.name))) + '" alt="' + ns.esc(c.name) + '" loading="lazy"></div>';
    var children = c.children && c.children.length ? '<ul class="category-children">' + c.children.map(function (child) { return '<li>' + ns.esc(child) + '</li>'; }).join('') + '</ul>' : '';
    return '<a class="category-card' + (variant === 'surface' ? ' category-card--surface' : '') + '" href="' + href + '">'
      + media
      + '<div class="category-body">'
      + '<h3>' + ns.esc(c.name) + '</h3>'
      + (c.desc ? '<p>' + ns.esc(c.desc) + '</p>' : '') + children
      + '<span class="category-link">Выбрать' + ns.ICONS.arrowRight + '</span>'
      + '</div></a>';
  }

  ns.renderCategories = function (container, list, options) {
    options = options || {};
    container.innerHTML = list.map(function (c) {
      return categoryCard(c, options.href ? options.href(c) : ns.url('category', c.slug), options.variant);
    }).join('');
  };

  function typeCards(surfaceSlug, origin) {
    surfaceSlug = typeof surfaceSlug === 'object' && surfaceSlug ? surfaceSlug.slug : surfaceSlug;
    var matches = surfaceSlug ? ns.api.getAvailableCategoriesForSurface(surfaceSlug) : null;
    var counts = {};
    (matches || []).forEach(function (item) { counts[item.name] = item.count; });
    return ns.api.getCategories().filter(function (category) {
      return surfaceSlug ? Boolean(counts[category.name]) : category.count > 0;
    }).map(function (category) {
      return Object.assign({}, category, { count: surfaceSlug ? counts[category.name] : category.count });
    }).map(function (category) {
      return { card: category, href: surfaceSlug
        ? ns.catalogNavigation.resultUrl(category.slug, surfaceSlug, origin)
        : ns.api.surfaceCatalogueEnabled()
          ? ns.catalogNavigation.browseUrl('surface', { type: category.slug })
          : ns.url('category', category.slug) };
    });
  }

  function surfaceCards(category, origin) {
    return ns.api.getAvailableSurfaces(category && category.name).map(function (surface) {
      return { card: { slug: surface.slug, name: surface.name, desc: surface.count + ' ' + plural(surface.count, 'товар', 'товара', 'товаров') }, href: category
        ? ns.catalogNavigation.resultUrl(category.slug, surface.slug, origin)
        : ns.catalogNavigation.browseUrl('type', { surface: surface.slug }) };
    });
  }

  function renderChooser(container, mode, selectedType, selectedSurface, origin) {
    var entries = mode === 'surface' ? surfaceCards(selectedType, origin) : typeCards(selectedSurface, origin);
    ns.renderCategories(container, entries.map(function (entry) { return entry.card; }), {
      variant: mode === 'surface' ? 'surface' : '',
      href: function (card) { return entries.find(function (entry) { return entry.card === card; }).href; }
    });
  }

  function initChooserToggle(root, onChange, activeMode) {
    var toggle = root.querySelector('[data-catalog-toggle]');
    if (!toggle || !ns.api.surfaceCatalogueEnabled()) return;
    toggle.hidden = false;
    toggle.querySelectorAll('[data-catalog-mode]').forEach(function (item) { item.setAttribute('aria-pressed', String(item.getAttribute('data-catalog-mode') === activeMode)); });
    toggle.addEventListener('click', function (event) {
      var button = event.target.closest('[data-catalog-mode]');
      if (!button) return;
      var mode = button.getAttribute('data-catalog-mode');
      toggle.querySelectorAll('[data-catalog-mode]').forEach(function (item) { item.setAttribute('aria-pressed', String(item === button)); });
      onChange(mode);
    });
  }

  /* ---------- Статьи: сетка ---------- */
  ns.renderArticles = function (container, items) {
    container.innerHTML = items.map(function (a) {
      return '<article class="article-card">'
        + '<a class="article-media" href="' + ns.url('article', a.id) + '" aria-label="' + ns.esc(a.title) + '"><img src="' + ns.articleImage(a) + '" alt="' + ns.esc(a.title) + '" loading="lazy"></a>'
        + '<div class="article-body">'
        + '<div class="article-meta">'
        + '<span class="article-cat">' + ns.esc(a.category) + '</span>'
        + '<span>' + ns.formatDate(a.date) + '</span>'
        + '</div>'
        + '<h3><a href="' + ns.url('article', a.id) + '">' + ns.esc(a.title) + '</a></h3>'
        + '<p>' + ns.esc(a.excerpt) + '</p>'
        + '<a class="article-link" href="' + ns.url('article', a.id) + '">Подробнее' + ns.ICONS.arrowRight + '</a>'
        + '</div></article>';
    }).join('');
  };

  /* ---------- SVG для статьи ---------- */
  ns.articleSvg = function (title) {
    var tones = ['#dfe2e5', '#e6e8ea', '#d8dbdf', '#eceef0'];
    var bg = tones[(title.length || 0) % tones.length];
    return '<svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + ns.esc(title) + '">'
      + '<rect width="640" height="360" fill="' + bg + '"/>'
      + '<rect x="24" y="24" width="592" height="312" fill="none" stroke="#2a2d31" stroke-opacity="0.14" stroke-width="2"/>'
      + '<rect x="60" y="120" width="150" height="110" rx="10" fill="#2a2d31"/>'
      + '<rect x="60" y="120" width="150" height="30" rx="10" fill="#3a3e44"/>'
      + '<rect x="232" y="120" width="90" height="14" fill="#43474d"/>'
      + '<rect x="232" y="146" width="90" height="14" fill="#43474d"/>'
      + '<rect x="232" y="172" width="90" height="14" fill="#43474d"/>'
      + '<rect x="110" y="252" width="360" height="12" fill="#3a3e44"/>'
      + '<rect x="110" y="276" width="300" height="12" fill="#43474d"/>'
      + '<rect x="110" y="300" width="330" height="12" fill="#43474d"/>'
      + '</svg>';
  };

  ns.articleImage = function (article) {
    return (article && article.image) || ns.articleArt[(article || {}).id] || 'assets/editorial/laboratory.png';
  };

  /* ---------- FAQ рендер ---------- */
  ns.renderFaq = function (container, items) {
    container.innerHTML = items.map(function (f) {
      return '<div class="faq-item">'
        + '<button type="button" class="faq-q">' + ns.esc(f.q) + '<span class="faq-icon">' + ns.ICONS.plus + '</span></button>'
        + '<div class="faq-a"><div><p>' + ns.esc(f.a) + '</p></div></div>'
        + '</div>';
    }).join('');
    ns.initFaq(container);
  };

  /* ---------- Страница: Главная ---------- */
  function initHome() {
    var catEl = document.getElementById('homeCats');
    if (catEl) {
      function renderHome(mode) {
        var head = document.getElementById('homeCatalogTitle');
        var desc = document.getElementById('homeCatalogDesc');
        if (head) head.textContent = mode === 'surface' ? 'Материалы по типу поверхности' : 'Материалы по типам продукции';
        if (desc) desc.textContent = mode === 'surface' ? 'Выберите поверхность — покажем подходящие виды материалов.' : 'Выберите тип материала, затем поверхность для точного подбора.';
        renderChooser(catEl, mode, null, null, mode);
      }
      renderHome('type');
      initChooserToggle(document.getElementById('homeCatalog') || document, renderHome, 'type');
    }

    var artEl = document.getElementById('homeArticles');
    if (artEl) ns.renderArticles(artEl, ns.api.getArticles().slice(0, 3));

    var partEl = document.getElementById('homePartners');
    if (partEl) partEl.innerHTML = ns.api.getPartners().map(function (p) {
      return '<div class="partner"><img src="' + ns.esc(p.logo) + '" alt="' + ns.esc(p.name) + '" loading="lazy"></div>';
    }).join('');

    initRequestBlock();
  }

  /* ---------- Форма заявки на главной ---------- */
  function initRequestBlock() {
    var block = document.getElementById('requestBlock');
    if (!block) return;

    /* Переключатель: Физическое / Юридическое лицо */
    block.querySelectorAll('[data-role-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var role = btn.getAttribute('data-role-toggle');
        block.querySelectorAll('[data-role-toggle]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
        block.querySelectorAll('[data-role-field]').forEach(function (f) { f.hidden = role !== 'legal'; });
      });
    });

    /* Переключатель: Краткая / Подробная заявка */
    block.querySelectorAll('[data-form-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var mode = btn.getAttribute('data-form-toggle');
        block.querySelectorAll('[data-form-toggle]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
        var short = document.getElementById('requestShort');
        var full = document.getElementById('requestFull');
        if (short) short.hidden = mode !== 'short';
        if (full) full.hidden = mode !== 'full';
      });
    });

    function onSend(btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var form = btn.closest('form');
        if (!ns.validateForm(form)) return;
        var data = ns.collectForm(form);
        ns.submitRequest(Object.assign({}, data, {
          product: data.comment || data.productType || 'Заявка с сайта',
          sku: data.brand || '',
          source: 'home'
        }), { toast: 'Заявка отправлена. Менеджер свяжется с вами.' });
        form.reset();
      });
    }

    block.querySelectorAll('[data-request-submit]').forEach(onSend);
  }

  /* ---------- Страница: Каталог ---------- */
  function initCatalog() {
    if (ns.initCategoryPage && !ns.catalogNavigation.isChooserUrl(window.location.search)) {
      ns.initCategoryPage();
      return;
    }
    var el = document.getElementById('catalogGrid');
    if (!el) return;
    document.getElementById('catalogChooser').hidden = false;
    document.getElementById('catalogProducts').hidden = true;
    document.getElementById('catCount').hidden = true;
    var params = new URLSearchParams(window.location.search);
    var mode = params.get('by') === 'surface' ? 'surface' : 'type';
    var selectedType = ns.api.getCategoryBySlug(params.get('type') || '');
    var selectedSurface = ns.catalogNavigation.surfaceBySlug(params.get('surface') || '');
    if ((params.get('type') && !selectedType) || (params.get('surface') && !selectedSurface)) { window.location.href = ns.url('catalog'); return; }
    if ((mode === 'surface' || selectedSurface) && !ns.api.surfaceCatalogueEnabled()) { window.location.href = ns.url('catalog'); return; }
    var title = document.getElementById('catTitle');
    var desc = document.getElementById('catDesc');
    if (selectedType && mode === 'surface') {
      title.textContent = selectedType.name + ': выберите поверхность';
      desc.textContent = 'Покажем только поверхности, для которых есть материалы этого типа.';
    } else if (selectedSurface && mode === 'type') {
      title.textContent = selectedSurface.name + ': выберите тип продукции';
      desc.textContent = 'Покажем только типы материалов, подходящие для выбранной поверхности.';
    } else {
      title.textContent = mode === 'surface' ? 'Каталог по типу поверхности' : 'Каталог продукции';
      desc.textContent = mode === 'surface' ? 'Выберите поверхность, затем тип материала.' : 'Выберите тип материала, затем поверхность для точного подбора.';
    }
    renderChooser(el, mode, selectedType, selectedSurface, mode);
    initChooserToggle(document, function (nextMode) {
      window.location.href = ns.catalogNavigation.browseUrl(nextMode);
    }, mode);
  }

  /* ---------- Страница: Избранное ---------- */
  function favoritesEmpty() {
    return '<div class="empty-state">' + ns.ICONS.heart
      + '<h3>В избранном пока пусто</h3><p>Нажимайте на значок ♡ в каталоге, чтобы сохранять понравившиеся материалы. Список хранится в вашем браузере.</p>'
      + '<a class="btn btn-primary" href="' + ns.url('catalog') + '">Перейти в каталог</a></div>';
  }

  function initFavorites() {
    var wrap = document.getElementById('favoritesRoot');
    var products = ns.store.getFavorites().map(ns.api.getProduct).filter(Boolean);
    if (!products.length) {
      wrap.innerHTML = favoritesEmpty();
      return;
    }
    wrap.innerHTML = '<div class="product-grid">' + products.map(ns.productCard).join('') + '</div>';
    ns.bindCardActions(wrap);

    document.addEventListener('krasku:favoriteschange', function (e) {
      if (e.detail.added) return;
      var card = wrap.querySelector('[data-fav="' + e.detail.id + '"]');
      if (card) card.closest('.product-card').remove();
      if (!wrap.querySelector('.product-card')) wrap.innerHTML = favoritesEmpty();
    });
  }

  /* ---------- Страница: Сравнение (обёртка) ---------- */
  function initCompare() { ns.initComparePage(); }

  /* ---------- Страница: Статьи ---------- */
  function initArticles() {
    var gridEl = document.getElementById('articlesGrid');
    var tabsEl = document.getElementById('articleTabs');
    if (!gridEl) return;

    var all = ns.api.getArticles();
    var cats = ['Все'].concat(ns.api.getArticleCats());
    var paramCat = new URLSearchParams(window.location.search).get('cat') || '';
    var current = cats.indexOf(paramCat) !== -1 ? paramCat : 'Все';

    tabsEl.innerHTML = cats.map(function (c) {
      return '<button type="button" class="tab-btn" data-article-cat="' + ns.esc(c) + '" aria-selected="' + (c === current) + '">' + ns.esc(c) + '</button>';
    }).join('');

    function list() {
      return current === 'Все' ? all : all.filter(function (a) { return a.category === current; });
    }

    function render() {
      var items = list().slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
      var featured = items[0];
      var rest = items.slice(1);

      gridEl.innerHTML = '';
      if (featured) {
        var fav = featured;
        gridEl.insertAdjacentHTML('beforeend',
          '<article class="article-card article-card--featured">'
          + '<a class="article-media" href="' + ns.url('article', fav.id) + '" aria-label="' + ns.esc(fav.title) + '"><img src="' + ns.articleImage(fav) + '" alt="' + ns.esc(fav.title) + '"></a>'
          + '<div class="article-body">'
          + '<div class="article-meta"><span class="article-cat">' + ns.esc(fav.category) + '</span><span>' + ns.formatDate(fav.date) + '</span></div>'
          + '<h3><a href="' + ns.url('article', fav.id) + '">' + ns.esc(fav.title) + '</a></h3>'
          + '<p>' + ns.esc(fav.excerpt) + '</p>'
          + '<a class="article-link" href="' + ns.url('article', fav.id) + '">Читать статью' + ns.ICONS.arrowRight + '</a>'
          + '</div></article>');
      }
      if (rest.length) {
        var wrap = ns.el('<div class="articles-grid"></div>');
        ns.renderArticles(wrap, rest);
        gridEl.appendChild(wrap);
      }
    }

    function select(btn) {
      current = btn.getAttribute('data-article-cat');
      tabsEl.querySelectorAll('[data-article-cat]').forEach(function (x) {
        x.setAttribute('aria-selected', String(x === btn));
      });
      render();
    }

    tabsEl.addEventListener('click', function (e) {
      var b = e.target.closest('[data-article-cat]');
      if (b) select(b);
    });
    ns.initRoving(tabsEl, Array.prototype.slice.call(tabsEl.querySelectorAll('[data-article-cat]')), select);

    render();
  }

  /* ---------- Страница: Статья ---------- */
  function initArticle() {
    var id = new URLSearchParams(window.location.search).get('id');
    var a = ns.api.getArticle(id);
    if (!a) { window.location.href = ns.url('articles'); return; }

    document.title = a.title + ' — KRASKU.RU';
    document.getElementById('aTitle').textContent = a.title;
    document.getElementById('aDate').textContent = ns.formatDate(a.date);
    document.getElementById('aCat').innerHTML = '<span class="article-cat">' + ns.esc(a.category) + '</span>';
    var bcCat = document.getElementById('aCatBc');
    if (bcCat) bcCat.innerHTML = '<a href="' + ns.url('articles') + '?cat=' + encodeURIComponent(a.category) + '">' + ns.esc(a.category) + '</a>';
    document.getElementById('bcArticle').textContent = a.title;
    document.getElementById('aCover').innerHTML = '<img src="' + ns.articleImage(a) + '" alt="' + ns.esc(a.title) + '">';

    document.getElementById('aToc').innerHTML = a.content.length > 1
      ? '<h3>Содержание</h3><ol>' + a.content.map(function (s, i) {
        return '<li><a href="#section-' + (i + 1) + '">' + ns.esc(s.title) + '</a></li>';
      }).join('') + '</ol>'
      : '';

    document.getElementById('aContent').innerHTML = a.content.map(function (s, i) {
      return '<h2 id="section-' + (i + 1) + '">' + ns.esc(s.title) + '</h2>'
        + s.paragraphs.map(function (p) { return '<p>' + ns.esc(p) + '</p>'; }).join('');
    }).join('');

    var related = ns.api.getArticles()
      .filter(function (x) { return x.id !== a.id; })
      .sort(function (x, y) {
        var sx = x.category === a.category ? 0 : 1;
        var sy = y.category === a.category ? 0 : 1;
        return sx - sy || (x.date < y.date ? 1 : -1);
      })
      .slice(0, 3);
    var relEl = document.getElementById('relatedArticles');
    if (relEl) {
      relEl.innerHTML = '<div class="section-head"><span class="eyebrow">Читайте также</span><h2>Похожие статьи</h2></div><div class="articles-grid"></div>';
      ns.renderArticles(relEl.querySelector('.articles-grid'), related);
    }
  }

  /* ---------- Страница: Документация ---------- */
  function initDocs() {
    var cats = ['Все'].concat(ns.api.getDocCats());
    var tabsEl = document.getElementById('docTabs');
    var gridEl = document.getElementById('docsGrid');
    var paramCat = new URLSearchParams(window.location.search).get('cat') || '';
    var current = cats.indexOf(paramCat) !== -1 ? paramCat : 'Все';

    tabsEl.innerHTML = cats.map(function (c) {
      return '<button type="button" class="tab-btn" data-doc-cat="' + ns.esc(c) + '" aria-selected="' + (c === current) + '">' + ns.esc(c) + '</button>';
    }).join('');

    function render() {
      var items = current === 'Все' ? ns.api.getDocs() : ns.api.getDocs().filter(function (d) { return d.cat === current; });
      gridEl.innerHTML = items.map(function (d) {
        return '<div class="doc-card">'
          + '<span class="doc-icon">' + ns.ICONS.doc + '</span>'
          + '<h3>' + ns.esc(d.name) + '</h3>'
          + '<div class="doc-meta">'
          + '<span class="chip">' + ns.esc(d.cat) + '</span>'
          + '<span class="chip">' + ns.esc(d.format) + ' · ' + ns.esc(d.size) + '</span>'
          + '<span class="chip">' + ns.formatDate(d.date) + '</span>'
          + '</div>'
          + '<div class="doc-actions">'
          + '<button type="button" class="btn btn-sm btn-outline" data-doc-open="' + ns.esc(d.name) + '">' + ns.ICONS.doc + ' Открыть</button>'
          + '<button type="button" class="btn btn-sm btn-ghost" data-doc-download="' + ns.esc(d.name) + '">' + ns.ICONS.download + ' Скачать</button>'
          + '</div></div>';
      }).join('');
    }

    function select(btn) {
      current = btn.getAttribute('data-doc-cat');
      tabsEl.querySelectorAll('[data-doc-cat]').forEach(function (x) { x.setAttribute('aria-selected', String(x === btn)); });
      render();
    }

    tabsEl.addEventListener('click', function (e) {
      var b = e.target.closest('[data-doc-cat]');
      if (b) select(b);
    });
    ns.initRoving(tabsEl, Array.prototype.slice.call(tabsEl.querySelectorAll('[data-doc-cat]')), select);

    gridEl.addEventListener('click', function (e) {
      var open = e.target.closest('[data-doc-open]');
      var dl = e.target.closest('[data-doc-download]');
      if (open) ns.toast('Документ «' + open.getAttribute('data-doc-open') + '» — mock PDF');
      if (dl) ns.toast('Скачивание «' + dl.getAttribute('data-doc-download') + '»…');
    });

    render();
  }

  /* ---------- Страница: FAQ ---------- */
  function initFaqPage() {
    var el = document.getElementById('faqList');
    if (el) ns.renderFaq(el, ns.api.getFaq());
  }

  /* ---------- Страница: Поиск ---------- */
  function initSearch() {
    var q = new URLSearchParams(window.location.search).get('q') || '';
    var input = document.getElementById('searchQuery');
    var grid = document.getElementById('searchResults');
    var hint = document.getElementById('searchHint');
    var notFound = document.getElementById('searchNotFound');

    function render(query) {
      var list = ns.api.search(query);
      if (hint) hint.innerHTML = query ? 'По запросу <b>' + ns.esc(query) + '</b> найдено: ' + list.length : 'Введите запрос — ищем по марке, типу продукта, подложке, назначению и растворимости.';
      if (grid) {
        grid.innerHTML = list.length
          ? '<div class="product-grid">' + list.map(ns.productCard).join('') + '</div>'
          : '';
        ns.bindCardActions(grid);
      }
      if (notFound) notFound.hidden = query && list.length > 0 ? true : !query;
      if (notFound && !query) notFound.hidden = true;
    }

    input.value = q;
    render(q);
    input.addEventListener('input', function () { render(input.value); });
  }

  /* ---------- Страница: Личный кабинет ---------- */
  function initAccount() {
    var tabs = document.getElementById('accountTabs');
    var panels = document.getElementById('accountPanels');
    if (!tabs) return;

    var sections = [
      { id: 'profile', label: 'Профиль', icon: ns.ICONS.user },
      { id: 'favorites', label: 'Избранное', icon: ns.ICONS.heart },
      { id: 'compare', label: 'Сравнение', icon: ns.ICONS.compare },
      { id: 'requests', label: 'Мои заявки', icon: ns.ICONS.doc },
      { id: 'messages', label: 'Сообщения', icon: ns.ICONS.mail },
      { id: 'manager', label: 'Менеджер', icon: ns.ICONS.message }
    ];

    tabs.innerHTML = sections.map(function (s, i) {
      return '<button type="button" class="account-tab" data-panel="' + s.id + '" aria-selected="' + (i === 0) + '">' + s.icon + '<span>' + s.label + '</span></button>';
    }).join('');

    panels.innerHTML = sections.map(function (s) {
      return '<section class="account-panel" data-panel-body="' + s.id + '"></section>';
    }).join('');

    /* Профиль */
    panels.querySelector('[data-panel-body="profile"]').innerHTML =
      '<h2 style="font-size:20px;margin-bottom:20px">Профиль</h2>'
      + '<form data-account-form novalidate><div class="form-grid">'
      + ns.field('ФИО', 'name', 'text', true)
      + ns.field('Телефон', 'phone', 'tel', true)
      + ns.field('Email', 'email', 'email', true)
      + ns.field('Организация', 'org')
      + ns.field('ИНН', 'inn')
      + ns.field('Город', 'city')
      + '</div><button type="submit" class="btn btn-primary" style="margin-top:20px" data-account-save>Сохранить</button></form>';

    /* Избранное */
    function renderFavs(panel) {
      var list = ns.store.getFavorites().map(ns.api.getProduct).filter(Boolean);
      panel.innerHTML = '<h2 style="font-size:20px;margin-bottom:20px">Избранные товары</h2>';
      if (!list.length) {
        panel.insertAdjacentHTML('beforeend', '<p class="text-muted">Список пуст. Добавляйте товары в избранное из каталога.</p>');
        return;
      }
      var grid = ns.el('<div class="product-grid"></div>');
      grid.innerHTML = list.map(function (p) { return ns.productCard(p, 'fav'); }).join('');
      panel.appendChild(grid);
      ns.bindCardActions(grid);
    }

    /* Сравнение */
    function renderCmp(panel) {
      var list = ns.store.getCompare().map(ns.api.getProduct).filter(Boolean);
      panel.innerHTML = '<h2 style="font-size:20px;margin-bottom:20px">Сравнение</h2>';
      if (!list.length) {
        panel.insertAdjacentHTML('beforeend', '<p class="text-muted">Сравнение пусто. Добавляйте товары кнопкой «Сравнить» в каталоге.</p>');
        return;
      }
      var grid = ns.el('<div class="product-grid"></div>');
      grid.innerHTML = list.map(function (p) { return ns.productCard(p, 'compare'); }).join('');
      panel.appendChild(grid);
      ns.bindCardActions(grid);
      panel.insertAdjacentHTML('beforeend', '<a class="btn btn-primary" style="margin-top:20px" href="' + ns.url('compare') + '">Открыть таблицу сравнения</a>');
    }

    renderFavs(panels.querySelector('[data-panel-body="favorites"]'));
    renderCmp(panels.querySelector('[data-panel-body="compare"]'));

    document.addEventListener('krasku:favoriteschange', function () {
      renderFavs(panels.querySelector('[data-panel-body="favorites"]'));
    });
    document.addEventListener('krasku:comparechange', function () {
      renderCmp(panels.querySelector('[data-panel-body="compare"]'));
    });

    /* Заявки */
    var requestList = ns.store.getRequests();
    panels.querySelector('[data-panel-body="requests"]').innerHTML =
      '<h2 style="font-size:20px;margin-bottom:20px">Мои заявки</h2>'
      + (requestList.length
        ? requestList.map(function (r) { return ns.requestCard(r, false); }).join('')
        : '<p class="text-muted">Заявок пока нет. Оформите заявку в каталоге — она появится здесь.</p>');

    /* Сообщения */
    function msgCard(m) {
      return '<button type="button" class="message-item' + (m.read ? '' : ' is-unread') + '" data-message="' + m.id + '">'
        + '<span class="message-dot"></span>'
        + '<span class="message-main"><b>' + ns.esc(m.subject) + '</b>'
        + '<span>' + ns.esc(m.author) + '</span>'
        + '<p>' + ns.esc(m.text) + '</p></span>'
        + '<time>' + ns.formatDate(m.date) + '</time>'
        + '</button>';
    }
    var msgPanel = panels.querySelector('[data-panel-body="messages"]');
    var msgList = ns.store.getMessages();
    msgPanel.innerHTML =
      '<h2 style="font-size:20px;margin-bottom:20px">Сообщения</h2>'
      + (msgList.length
        ? '<div class="message-list">' + msgList.map(msgCard).join('') + '</div>'
        : '<p class="text-muted">Сообщений пока нет.</p>')
      + '<div style="margin-top:22px"><a class="btn btn-outline" href="' + ns.url('chat') + '">Открыть чат с менеджером</a></div>';
    msgPanel.addEventListener('click', function (e) {
      var item = e.target.closest('[data-message]');
      if (!item) return;
      ns.store.markMessageRead(item.getAttribute('data-message'));
      item.classList.remove('is-unread');
    });

    /* Менеджер */
    panels.querySelector('[data-panel-body="manager"]').innerHTML =
      '<h2 style="font-size:20px;margin-bottom:12px">Менеджер</h2>'
      + '<p class="text-muted" style="margin-bottom:20px">Задайте вопрос или продолжите обсуждение заявки в чате. Менеджер на связи в рабочее время.</p>'
      + '<a class="btn btn-primary" href="' + ns.url('chat') + '">Открыть чат с менеджером</a>'
      + '<div class="buy-section"><div class="buy-section-title">Быстрые вопросы</div><div style="display:grid;gap:8px">'
      + ['Какой состав подойдёт для улицы?', 'Есть ли скидка на объём от 100 кг?', 'Можно ли доставку в мой город?']
        .map(function (q) { return '<button type="button" class="btn btn-outline" style="justify-content:flex-start" data-quick-question="' + ns.esc(q) + '">' + ns.esc(q) + '</button>'; }).join('')
      + '</div></div>';

    /* Переключение разделов */
    function switchPanel(id) {
      tabs.querySelectorAll('[data-panel]').forEach(function (b) { b.setAttribute('aria-selected', String(b.getAttribute('data-panel') === id)); });
      panels.querySelectorAll('[data-panel-body]').forEach(function (p) { p.hidden = p.getAttribute('data-panel-body') !== id; });
    }
    tabs.addEventListener('click', function (e) {
      var b = e.target.closest('[data-panel]');
      if (b) switchPanel(b.getAttribute('data-panel'));
    });
    ns.initRoving(tabs, Array.prototype.slice.call(tabs.querySelectorAll('[data-panel]')), function (b) {
      switchPanel(b.getAttribute('data-panel'));
    });
    switchPanel('profile');

    /* Сайдбар: якорные ссылки разделов */
    document.querySelectorAll('.account-nav a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var id = a.getAttribute('href').slice(1);
        var btn = tabs.querySelector('[data-panel="' + id + '"]');
        if (btn) {
          switchPanel(id);
          document.querySelector('.account-nav a.is-active') && document.querySelector('.account-nav a.is-active').classList.remove('is-active');
          a.classList.add('is-active');
        }
      });
    });

    /* Сохранение профиля */
    panels.querySelector('[data-account-form]').addEventListener('submit', function (e) {
      e.preventDefault();
      var form = e.target;
      if (!ns.validateForm(form)) return;
      ns.toast('Профиль сохранён');
      form.querySelectorAll('[name]').forEach(function (f) { f.style.borderColor = ''; });
    });

    /* Быстрые вопросы в панели менеджера */
    panels.querySelector('[data-panel-body="manager"]').addEventListener('click', function (e) {
      var b = e.target.closest('[data-quick-question]');
      if (b) { ns.toast('Вопрос передан менеджеру'); }
    });
  }

  /* ---------- Карточка заявки (общая для ЛК и страницы «Мои заявки») ---------- */
  ns.requestCard = function (r, showDiscuss) {
    return '<div class="request-item"><div style="flex:1;min-width:220px">'
      + '<b style="color:var(--ink);font-size:15px">' + ns.esc(r.product) + '</b>'
      + '<div class="text-muted text-small">№ ' + ns.esc(r.id) + ' · ' + ns.formatDate(r.date) + '</div>'
      + (r.sku ? '<div class="text-muted text-small">' + ns.esc(r.sku) + '</div>' : '')
      + '</div>'
      + (r.total ? '<div class="text-small"><div class="text-muted">Объём</div><b>' + ns.esc(r.total) + '</b></div>' : '')
      + (r.price ? '<div class="text-small"><div class="text-muted">Стоимость</div><b>' + ns.esc(r.price) + '</b></div>' : '')
      + '<span class="request-status request-status--' + (r.status || 'new') + '">' + ns.esc(r.statusText || 'Новая заявка') + '</span>'
      + (showDiscuss ? '<a class="btn btn-sm btn-outline" href="' + ns.url('chat') + '">Обсудить</a>' : '')
      + '</div>';
  };

  /* ---------- Страница: Мои заявки ---------- */
  function initRequests() {
    var el = document.getElementById('requestsList');
    if (!el) return;
    var list = ns.store.getRequests();
    if (!list.length) {
      el.innerHTML = '<div class="empty-state">' + ns.ICONS.doc
        + '<h3>Заявок пока нет</h3><p>Заявки, отправленные с сайта, появятся здесь. Оформите первую заявку в каталоге.</p>'
        + '<a class="btn btn-primary" href="' + ns.url('catalog') + '">Перейти в каталог</a></div>';
      return;
    }
    el.innerHTML = list.map(function (r) { return ns.requestCard(r, true); }).join('');
  }

  /* ---------- Страница: Колеровка ---------- */
  function initTinting() {
    var form = document.querySelector('[data-tinting-form]');
    if (!form) return;
    form.querySelector('[data-tinting-submit]').addEventListener('click', function (e) {
      e.preventDefault();
      if (!ns.validateForm(form)) return;
      var data = ns.collectForm(form);
      ns.submitRequest(Object.assign({}, data, {
        product: 'Колеровка: ' + (data.colorSystem || 'цвет') + (data.product ? ' · ' + data.product : ''),
        source: 'tinting'
      }), { toast: 'Запрос на подбор цвета отправлен' });
      form.reset();
    });
  }

  /* ---------- Страница: Контакты ---------- */
  function initContacts() {
    var form = document.querySelector('[data-contacts-form]');
    if (!form) return;
    form.querySelector('[data-contacts-submit]').addEventListener('click', function (e) {
      e.preventDefault();
      if (!ns.validateForm(form)) return;
      var data = ns.collectForm(form);
      ns.submitRequest(Object.assign({}, data, {
        product: data.topic || 'Сообщение с контактов',
        source: 'contacts'
      }), { toast: 'Сообщение отправлено' });
      form.reset();
    });
  }

  /* ---------- Диспетчер ---------- */
  function boot() {
    ns.buildLayout();
    var page = document.body.getAttribute('data-page');

    switch (page) {
      case 'home': initHome(); break;
      case 'catalog': initCatalog(); break;
      case 'tinting': initTinting(); break;
      case 'category': ns.initCategoryPage(); break;
      case 'product': ns.initProductPage(); break;
      case 'articles': initArticles(); break;
      case 'article': initArticle(); break;
      case 'docs': initDocs(); break;
      case 'faq': initFaqPage(); break;
      case 'search': initSearch(); break;
      case 'favorites': initFavorites(); break;
      case 'compare': initCompare(); break;
      case 'account': initAccount(); break;
      case 'requests': initRequests(); break;
      case 'contacts': initContacts(); break;
      case 'chat': ns.initChat(); break;
    }

    /* Общая инициализация интерактивов */
    document.querySelectorAll('[data-segmented]').forEach(ns.initSegmented);
    ns.initTabs(document);
    ns.initFaq(document);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})(window.KRASKU);

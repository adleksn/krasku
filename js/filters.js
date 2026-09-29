/* ============================================================
   KRASKU.RU — filters.js
   Страница категории: сетка товаров, фильтры, сортировка.
   Также карточка товара (переиспользуемый компонент).
   ============================================================ */

'use strict';

window.KRASKU = window.KRASKU || {};

(function (ns) {

  /* ---------- Переиспользуемая карточка товара ---------- */
  ns.productCard = function (p, removeType) {
    var image = p.image || ns.svgToDataUri(ns.productSvg(p, p.name));
    var fav = ns.store.isFavorite(p.id);
    var cmp = ns.store.isCompare(p.id);
    var chips = [p.type, p.coating, p.substrate].filter(Boolean).slice(0, 3);
    return '<article class="product-card">'
      + '<div class="product-media">'
      + '<a class="product-media-link" data-preview-product="' + ns.esc(p.id) + '" href="' + ns.url('product', p.id) + '" aria-label="Открыть товар: ' + ns.esc(p.name) + '"><img src="' + image + '" alt="' + ns.esc(p.name) + '" loading="lazy"></a>'
      + '<button type="button" class="btn-icon btn-icon--compare' + (cmp ? ' is-active' : '') + '" data-compare="' + p.id + '" aria-pressed="' + cmp + '" aria-label="Сравнить">' + ns.ICONS.compare + '</button>'
      + '<button type="button" class="btn-icon' + (fav ? ' is-active' : '') + '" data-fav="' + p.id + '" aria-pressed="' + fav + '" aria-label="В избранное">' + ns.ICONS.heart + '</button>'
      + '</div>'
      + '<div class="product-body">'
      + '<span class="product-sku">' + ns.esc(p.sku) + '</span>'
      + '<h3 class="product-name"><a href="' + ns.url('product', p.id) + '">' + ns.esc(p.name) + '</a></h3>'
      + '<div class="product-chips">' + chips.map(function (c) { return '<span class="chip">' + ns.esc(c) + '</span>'; }).join('') + '</div>'
      + '<span class="stock stock--' + (p.stock ? 'in' : 'out') + '">' + (p.stock ? 'В наличии' : 'Отсутствует') + '</span>'
      + '<div class="product-foot">'
      + '<span class="product-price">' + ns.formatPrice(p.pricePerKg) + '<small>за 1 кг</small></span>'
      + '</div>'
      + '</div>'
      + '</article>';
  };

  /* ---------- Делегирование кликов по карточкам ---------- */
  ns.bindCardActions = function (container) {
    var previewTimer = null;
    var activePreviewLink = null;
    var preview = null;

    function clearPreviewTimer() {
      if (previewTimer) {
        window.clearTimeout(previewTimer);
        previewTimer = null;
      }
    }

    function hidePreview() {
      clearPreviewTimer();
      activePreviewLink = null;
      if (!preview) return;
      preview.classList.remove('is-visible');
      window.setTimeout(function () {
        if (preview && !preview.classList.contains('is-visible')) {
          preview.remove();
          preview = null;
        }
      }, 180);
    }

    function previewDescription(product) {
      var description = ns.api.getProductDescription(product);
      var text = description && description.text ? description.text : (product.description || '');
      var sentences = String(text).match(/[^.!?]+[.!?]+/g) || [String(text)];
      text = sentences.slice(0, 2).join(' ').trim();
      return text.length > 210 ? text.slice(0, 207).trim() + '…' : text;
    }

    function placePreview(link) {
      var rect = link.getBoundingClientRect();
      var margin = 16;
      var width = Math.min(Math.max(Math.round(rect.width * 1.5), 360), window.innerWidth - margin * 2);
      var left = rect.right + 14;
      if (left + width > window.innerWidth - margin) left = rect.left - width - 14;
      left = Math.max(margin, Math.min(left, window.innerWidth - width - margin));
      preview.style.width = width + 'px';
      preview.style.left = left + 'px';
      preview.style.top = Math.max(margin, Math.min(rect.top, window.innerHeight - preview.offsetHeight - margin)) + 'px';
    }

    function showPreview(link) {
      var product = ns.api.getProduct(link.getAttribute('data-preview-product'));
      if (!product || activePreviewLink !== link) return;
      if (preview) preview.remove();

      var images = (Array.isArray(product.images) && product.images.length ? product.images : [product.image || ns.svgToDataUri(ns.productSvg(product, product.name))]).slice(0, 3);
      var stock = product.stock ? 'В наличии' : 'Под заказ';
      preview = document.createElement('aside');
      preview.className = 'product-hover-preview';
      preview.setAttribute('aria-hidden', 'true');
      preview.innerHTML = '<div class="product-hover-preview__media">'
        + '<img src="' + ns.esc(images[0]) + '" alt="" loading="eager">'
        + '<div class="product-hover-preview__thumbs">' + images.map(function (src) {
          return '<img src="' + ns.esc(src) + '" alt="">';
        }).join('') + '</div></div>'
        + '<div class="product-hover-preview__body">'
        + '<span class="product-sku">' + ns.esc(product.sku) + '</span>'
        + '<h3>' + ns.esc(product.name) + '</h3>'
        + '<p>' + ns.esc(previewDescription(product)) + '</p>'
        + '<div class="product-hover-preview__meta"><span class="stock stock--' + (product.stock ? 'in' : 'out') + '">' + stock + '</span>'
        + '<strong>' + ns.formatPrice(product.pricePerKg) + '<small>за 1 кг</small></strong></div>'
        + '</div>';
      document.body.appendChild(preview);
      placePreview(link);
      window.requestAnimationFrame(function () {
        if (preview && activePreviewLink === link) preview.classList.add('is-visible');
      });
    }

    container.addEventListener('pointerover', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      var link = e.target.closest('.product-media-link[data-preview-product]');
      if (!link || !container.contains(link) || link.contains(e.relatedTarget)) return;
      hidePreview();
      activePreviewLink = link;
      previewTimer = window.setTimeout(function () {
        previewTimer = null;
        showPreview(link);
      }, 1000);
    });

    container.addEventListener('pointerout', function (e) {
      var link = e.target.closest('.product-media-link[data-preview-product]');
      if (!link || !container.contains(link) || link.contains(e.relatedTarget)) return;
      if (activePreviewLink === link) hidePreview();
    });

    container.addEventListener('pointerdown', hidePreview);
    window.addEventListener('scroll', hidePreview, { passive: true });
    window.addEventListener('resize', hidePreview, { passive: true });

    container.addEventListener('click', function (e) {
      var rmFav = e.target.closest('[data-remove-fav]');
      if (rmFav) {
        e.preventDefault();
        ns.store.removeFavorite(rmFav.getAttribute('data-remove-fav'));
        var card = rmFav.closest('.product-card');
        if (card) card.remove();
        ns.toast('Товар убран из избранного');
        return;
      }
      var rmCmp = e.target.closest('[data-remove-compare]');
      if (rmCmp) {
        e.preventDefault();
        ns.store.removeCompare(rmCmp.getAttribute('data-remove-compare'));
        var card2 = rmCmp.closest('.product-card');
        if (card2) card2.remove();
        ns.toast('Товар убран из сравнения');
        return;
      }
      var favBtn = e.target.closest('[data-fav]');
      if (favBtn) {
        e.preventDefault();
        var id = favBtn.getAttribute('data-fav');
        var added = ns.store.toggleFavorite(id);
        favBtn.classList.toggle('is-active', added);
        favBtn.setAttribute('aria-pressed', String(added));
        ns.toast(added ? 'Добавлено в избранное' : 'Удалено из избранного');
        if (!added) {
          var favRoot = document.getElementById('favoritesRoot');
          if (favRoot && favRoot.contains(favBtn)) {
            var favCard = favBtn.closest('.product-card');
            if (favCard) favCard.remove();
            if (!favRoot.querySelector('.product-card')) {
              favRoot.innerHTML = '<div class="empty-state">' + ns.ICONS.heart
                + '<h3>В избранном пока пусто</h3><p>Нажимайте на значок ♡ в каталоге, чтобы сохранять понравившиеся материалы. Список хранится в вашем браузере.</p>'
                + '<a class="btn btn-primary" href="catalog.html">Перейти в каталог</a></div>';
            }
          }
        }
        return;
      }
      var cmpBtn = e.target.closest('[data-compare]');
      if (cmpBtn) {
        e.preventDefault();
        var cid = cmpBtn.getAttribute('data-compare');
        var res = ns.store.toggleCompare(cid);
        if (res.full) {
          ns.toast('Можно сравнить не более ' + ns.store.maxCompare + ' товаров');
          return;
        }
        cmpBtn.classList.toggle('is-active', res.added);
        cmpBtn.setAttribute('aria-pressed', String(res.added));
        ns.toast(res.added ? 'Добавлено в сравнение' : 'Удалено из сравнения');
      }
    });
  };

  /* ---------- Рендер сетки ---------- */
  ns.renderProductGrid = function (container, products) {
    container.innerHTML = products.length
      ? products.map(ns.productCard).join('')
      : '<div class="empty-state" style="grid-column:1/-1"><h3>Ничего не найдено</h3><p>Попробуйте изменить условия фильтра или закажите материал по техническому заданию.</p><button class="btn btn-primary" data-cta="tz">Заказать по ТЗ</button></div>';
  };

  ns.catalogFilterUtils = {
    productFacetValues: function (product, key) {
      var text = [product.name, product.brand, product.substrate, product.purpose, product.paintFor, product.description].join(' ').toLowerCase();
      if (key === 'type') {
        if (product.type === 'Лак') return ['Лаки и пропитки'];
        if (product.type === 'Разбавитель') return ['Растворитель'];
        return product.type ? [product.type] : [];
      }
      if (key === 'binder') {
        var binders = ['ВД-АК', 'ПФ', 'ГФ', 'АК', 'АУ', 'МЛ', 'УР', 'ХВ', 'ХС', 'ЭП', 'ЭФ', 'МС', 'ВЛ', 'ФА'];
        var source = [product.brand, product.name].join(' ').toUpperCase();
        var matched = binders.find(function (binder) { return source.indexOf(binder) !== -1; });
        return matched ? [matched] : [];
      }
      if (key === 'purpose') {
        if (text.indexOf('внутрен') !== -1) return ['Внутренняя'];
        if (text.indexOf('наружн') !== -1 || text.indexOf('фасад') !== -1) return ['Наружная'];
        return ['Универсальная'];
      }
      if (key === 'application') {
        var applications = [];
        if (text.indexOf('металл') !== -1) applications.push('Металл');
        if (text.indexOf('бетон') !== -1 || text.indexOf('цемент') !== -1) applications.push('Бетон');
        if (text.indexOf('дерев') !== -1) applications.push('Дерево');
        return applications.length ? applications : ['Специальные'];
      }
      if (key === 'solubility') {
        return /вод|вд-ак|акрил/.test(text) ? ['На водной основе'] : ['Органорастворимая'];
      }
      var value = product[key];
      return Array.isArray(value) ? value : value === undefined || value === null ? [] : [value];
    },
    isFilterFacetValue: function (value) {
      // The source catalogue may contain placeholders such as ":" or whitespace.
      // They are not meaningful filter choices.
      return typeof value === 'string' && /[\p{L}\p{N}]/u.test(value);
    },
    filterFacetValues: function (products, key) {
      var values = [];
      products.forEach(function (product) {
        ns.catalogFilterUtils.productFacetValues(product, key).forEach(function (value) {
          if (ns.catalogFilterUtils.isFilterFacetValue(value) && values.indexOf(value) === -1) values.push(value);
        });
      });
      return values;
    },
    cloneFilters: function (filters) {
      var next = {};
      Object.keys(filters || {}).forEach(function (key) {
        if (Array.isArray(filters[key]) && filters[key].length) next[key] = filters[key].slice();
      });
      return next;
    },
    filterProducts: function (products, filters) {
      return products.filter(function (product) {
        return Object.keys(filters || {}).every(function (key) {
          var values = filters[key];
          var productValues = ns.catalogFilterUtils.productFacetValues(product, key);
          return !values || !values.length || values.some(function (value) { return productValues.indexOf(value) !== -1; });
        });
      });
    },
    sanitizeFilters: function (products, filters) {
      var sanitized = {};
      Object.keys(filters || {}).forEach(function (key) {
        var available = ns.catalogFilterUtils.filterFacetValues(products, key);
        var values = (filters[key] || []).filter(function (value) {
          return ns.catalogFilterUtils.isFilterFacetValue(value) && available.indexOf(value) !== -1;
        });
        if (values.length) sanitized[key] = values;
      });
      return sanitized;
    }
  };

  /* ---------- Страница категории ---------- */
  ns.initCategoryPage = function () {
    var params = new URLSearchParams(window.location.search);
    var isAllCatalogue = document.body.getAttribute('data-page') === 'catalog';
    var slug = params.get('cat') || '';
    var cat = ns.api.getCategoryBySlug(slug);
    if (!isAllCatalogue && !cat) { window.location.href = ns.url('catalog'); return; }

    var surfaceSlug = params.get('surface') || '';
    var surface = surfaceSlug && ns.catalogNavigation ? ns.catalogNavigation.surfaceBySlug(surfaceSlug) : null;
    if (!isAllCatalogue && surfaceSlug && !surface) { window.location.href = ns.url('catalog'); return; }
    if (!isAllCatalogue && surfaceSlug && !ns.api.surfaceCatalogueEnabled()) { window.location.href = ns.url('catalog'); return; }
    // A category landing page remains a focused product list. Its final
    // "category + surface" result gets the same filter component as the full catalogue.
    var surfaceFilterElements = document.querySelectorAll('[data-surface-filter]');
    if (!isAllCatalogue && !surface) {
      surfaceFilterElements.forEach(function (element) { element.remove(); });
    } else {
      surfaceFilterElements.forEach(function (element) { element.hidden = false; });
      var categoryLayout = document.getElementById('catalogLayout');
      if (categoryLayout) categoryLayout.classList.remove('catalog-layout--without-filter');
    }
    var all = isAllCatalogue ? ns.api.getProducts() : surfaceSlug ? ns.api.getProductsByCategoryAndSurface(cat.name, surfaceSlug) : ns.api.getProductsByCategory(cat.name);
    var FILTER_STORAGE_KEY = 'krasku.catalog.filters';
    var COLLAPSE_STORAGE_KEY = 'krasku.catalog.filter-collapsed';
    var state = { sort: 'popular', filters: {}, pendingFilters: {} };

    var grid = document.getElementById('productGrid');
    var filterBtn = document.getElementById('filterBtn');
    var filterCount = document.getElementById('filterCount');
    var resultCount = document.getElementById('resultCount');

    /* Заголовок */
    document.getElementById('catTitle').textContent = isAllCatalogue ? 'Вся продукция' : surface ? cat.name + ' по ' + surface.prepositional : cat.name;
    document.getElementById('catDesc').textContent = isAllCatalogue ? 'Все материалы каталога. Используйте фильтры, чтобы сузить выбор.' : surface ? 'Материалы категории «' + cat.name + '», подходящие для поверхности: ' + surface.name.toLowerCase() + '.' : cat.desc;
    document.getElementById('catCount').textContent = (isAllCatalogue ? 'Всего товаров: ' : 'Товаров в категории: ') + all.length;
    document.getElementById('bcCat').textContent = isAllCatalogue ? 'Каталог' : surface ? cat.name + ' по ' + surface.prepositional : cat.name;
    if (surface) {
      var path = document.getElementById('bcPath');
      var from = params.get('from') === 'surface' ? 'surface' : 'type';
      path.hidden = false;
      path.innerHTML = from === 'surface'
        ? '<a href="' + ns.esc(ns.catalogNavigation.browseUrl('type', { surface: surfaceSlug })) + '">' + ns.esc(surface.name) + '</a>'
        : '<a href="' + ns.esc(ns.catalogNavigation.browseUrl('surface', { type: cat.slug })) + '">' + ns.esc(cat.name) + '</a>';
    }

    /* ---------- Фильтры ---------- */
    var FILTER_GROUPS = [
      { key: 'solubility', label: '' },
      { key: 'type', label: 'Тип продукта' },
      { key: 'binder', label: 'Тип связующего' },
      { key: 'purpose', label: 'Назначение' },
      { key: 'application', label: 'Применение' }
    ];

    function readSession(key, fallback) {
      try {
        var saved = window.sessionStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallback;
      } catch (error) { return fallback; }
    }

    function writeSession(key, value) {
      try { window.sessionStorage.setItem(key, JSON.stringify(value)); } catch (error) { /* Session storage can be unavailable. */ }
    }

    function isMobile() { return window.innerWidth < 768; }
    function isDesktop() { return window.innerWidth > 1024; }
    function activeFilters() { return isMobile() && drawer.classList.contains('is-open') ? state.pendingFilters : state.filters; }

    state.filters = ns.catalogFilterUtils.sanitizeFilters(all, readSession(FILTER_STORAGE_KEY, {}));
    delete state.filters.substrate;
    state.pendingFilters = ns.catalogFilterUtils.cloneFilters(state.filters);

    function filtered() { return ns.catalogFilterUtils.filterProducts(all, state.filters); }

    function sorted(list) {
      var arr = list.slice();
      switch (state.sort) {
        case 'price-asc': arr.sort(function (a, b) { return a.pricePerKg - b.pricePerKg; }); break;
        case 'price-desc': arr.sort(function (a, b) { return b.pricePerKg - a.pricePerKg; }); break;
        case 'name': arr.sort(function (a, b) { return a.name.localeCompare(b.name, 'ru'); }); break;
      }
      return arr;
    }

    var PAGE_SIZE = 50;
    var pagination = document.getElementById('catalogPagination');
    var sortSelect = document.getElementById('sortSelect');
    var sortLabel = document.getElementById('sortLabel');
    function renderPage(list) {
      var totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
      state.page = Math.min(Math.max(state.page || 1, 1), totalPages);
      ns.renderProductGrid(grid, list.slice((state.page - 1) * PAGE_SIZE, state.page * PAGE_SIZE));
      if (!pagination) return;
      var firstVisiblePage = Math.min(state.page, Math.max(1, totalPages - 4));
      var visiblePageCount = Math.min(5, totalPages);
      pagination.innerHTML = totalPages > 1
        ? '<button type="button" class="pagination-page pagination-page--arrow" data-catalog-page="' + (state.page - 1) + '" aria-label="Предыдущая страница"' + (state.page === 1 ? ' disabled' : '') + '>&larr;</button>'
          + Array.from({ length: visiblePageCount }, function (_, index) {
          var page = firstVisiblePage + index;
          return '<button type="button" class="pagination-page' + (page === state.page ? ' is-active' : '') + '" data-catalog-page="' + page + '"' + (page === state.page ? ' aria-current="page"' : '') + '>' + page + '</button>';
          }).join('')
          + '<button type="button" class="pagination-page pagination-page--arrow" data-catalog-page="' + (state.page + 1) + '" aria-label="Следующая страница"' + (state.page === totalPages ? ' disabled' : '') + '>&rarr;</button>'
        : '';
    }

    // Product cards on different pages can have different heights. Keep the
    // pagination in the same place in the viewport after the grid is redrawn,
    // so a pointer over an arrow does not have to chase the moving control.
    function changePageKeepingPagination(page, render) {
      var paginationTop = pagination ? pagination.getBoundingClientRect().top : null;
      state.page = page;
      render();
      if (paginationTop === null) return;
      window.requestAnimationFrame(function () {
        var shift = pagination.getBoundingClientRect().top - paginationTop;
        if (shift) window.scrollBy(0, shift);
      });
    }

    function renderPlainCategory() {
      var list = sorted(all);
      renderPage(list);
      resultCount.innerHTML = '<b>' + list.length + '</b> из ' + all.length;
      refreshSortLabel();
    }

    var hasFilters = Boolean(document.getElementById('filterDrawer'));
    if (!hasFilters) {
      var plainSort = document.getElementById('sortSelect');
      var plainPagination = document.getElementById('catalogPagination');
      plainSort.addEventListener('change', function (e) { state.sort = e.target.value; state.page = 1; renderPlainCategory(); });
      plainPagination.addEventListener('click', function (e) {
        var pageButton = e.target.closest('[data-catalog-page]');
        if (!pageButton) return;
        changePageKeepingPagination(Number(pageButton.getAttribute('data-catalog-page')) || 1, renderPlainCategory);
      });
      ns.bindCardActions(grid);
      renderPlainCategory();
      return;
    }

    function activeFilterCount() {
      return Object.values(state.filters).reduce(function (n, arr) { return n + (arr ? arr.length : 0); }, 0);
    }

    /* ---------- Построение дерева фильтра ---------- */
    function renderFilterGroups(filters) {
      var el = document.getElementById('filterBody');
      el.innerHTML = FILTER_GROUPS.map(function (g) {
        var withoutGroup = ns.catalogFilterUtils.cloneFilters(filters);
        delete withoutGroup[g.key];
        var facetProducts = ns.catalogFilterUtils.filterProducts(all, withoutGroup);
        var counts = {};
        facetProducts.forEach(function (product) {
          ns.catalogFilterUtils.productFacetValues(product, g.key).forEach(function (value) {
            counts[value] = (counts[value] || 0) + 1;
          });
        });
        var opts = ns.catalogFilterUtils.filterFacetValues(all, g.key).sort(function (a, b) {
          return a === 'Универсальная' ? 1 : b === 'Универсальная' ? -1 : a.localeCompare(b, 'ru');
        });
        if (!opts.length) return '';
        var selected = filters[g.key] || [];
        return '<div class="filter-group' + (g.key === 'solubility' ? ' filter-group--base' : '') + '">'
          + (g.label ? '<button type="button" class="filter-group-title" data-filter-group-toggle aria-expanded="true">' + ns.esc(g.label) + ns.ICONS.chevronDown + '</button>' : '')
          + '<div class="filter-options">'
          + opts.map(function (v) {
            var count = counts[v] || 0;
            var isSelected = selected.indexOf(v) !== -1;
            return '<label class="checkbox' + (!count && !isSelected ? ' is-disabled' : '') + '"><input type="checkbox" name="' + g.key + '" value="' + ns.esc(v) + '" data-group="' + g.key + '"' + (isSelected ? ' checked' : '') + (!count && !isSelected ? ' disabled' : '') + '><span class="box">' + ns.ICONS.check + '</span><span>' + ns.esc(v) + '</span><span class="count">' + count + '</span></label>';
          }).join('')
          + '</div></div>';
      }).join('');
    }

    /* ---------- Применение фильтра (AJAX-like, без перезагрузки) ---------- */
    function syncFilterCount() {
      filterCount.textContent = activeFilterCount();
      filterCount.hidden = activeFilterCount() === 0;
    }

    // On desktop/tablet the panel must retain its DOM and scroll/open-group state.
    // Only the products and result counter change after a checkbox click.
    function apply(renderFilters) {
      state.filters = ns.catalogFilterUtils.sanitizeFilters(all, state.filters);
      state.pendingFilters = ns.catalogFilterUtils.cloneFilters(state.filters);
      writeSession(FILTER_STORAGE_KEY, state.filters);
      var list = sorted(filtered());
      renderPage(list);
      resultCount.innerHTML = '<b>' + list.length + '</b> из ' + all.length;
      syncFilterCount();
      if (renderFilters !== false) renderFilterGroups(activeFilters());
      refreshSortLabel();
    }

    /* ---------- Сортировка ---------- */
    function refreshSortLabel() {
      var map = { 'popular': 'По популярности', 'price-asc': 'Сначала дешевле', 'price-desc': 'Сначала дороже', 'name': 'По алфавиту' };
      sortLabel.textContent = map[state.sort] || 'По популярности';
    }
    sortSelect.addEventListener('change', function (e) {
      state.sort = e.target.value;
      state.page = 1;
      apply(false);
    });

    /* ---------- Drawer ---------- */
    var drawer = document.getElementById('filterDrawer');
    var drawerOverlay = document.getElementById('filterOverlay');

    var collapseBtn = document.getElementById('filterCollapse');
    var catalogLayout = document.getElementById('catalogLayout');

    function setCollapsed(collapsed) {
      catalogLayout.classList.toggle('is-filter-collapsed', Boolean(collapsed) && isDesktop());
      collapseBtn.setAttribute('aria-expanded', String(!catalogLayout.classList.contains('is-filter-collapsed')));
      collapseBtn.setAttribute('aria-label', catalogLayout.classList.contains('is-filter-collapsed') ? 'Развернуть фильтр' : 'Свернуть фильтр');
      writeSession(COLLAPSE_STORAGE_KEY, Boolean(collapsed));
    }

    function openDrawer() {
      drawer.classList.add('is-open');
      drawer.classList.toggle('filter-drawer--bottom-sheet', isMobile());
      state.pendingFilters = ns.catalogFilterUtils.cloneFilters(state.filters);
      drawerOverlay.classList.add('is-open');
      document.body.classList.add('no-scroll');
      renderFilterGroups(activeFilters());
    }
    function closeDrawer() {
      drawer.classList.remove('is-open');
      drawerOverlay.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
      state.pendingFilters = ns.catalogFilterUtils.cloneFilters(state.filters);
      renderFilterGroups(state.filters);
    }

    filterBtn.addEventListener('click', openDrawer);
    drawerOverlay.addEventListener('click', closeDrawer);
    document.querySelectorAll('[data-filter-close]').forEach(function (b) { b.addEventListener('click', closeDrawer); });

    collapseBtn.addEventListener('click', function () {
      setCollapsed(!catalogLayout.classList.contains('is-filter-collapsed'));
    });
    document.querySelectorAll('[data-filter-reset]').forEach(function (reset) { reset.addEventListener('click', function () {
      state.filters = {};
      state.pendingFilters = {};
      state.page = 1;
      apply();
      try { window.sessionStorage.removeItem(FILTER_STORAGE_KEY); } catch (error) { /* Session storage can be unavailable. */ }
    }); });
    document.getElementById('filterApply').addEventListener('click', function () {
      state.filters = ns.catalogFilterUtils.cloneFilters(state.pendingFilters);
      apply();
      closeDrawer();
    });

    /* Изменение чекбоксов → обновление фильтра в реальном времени */
    document.getElementById('filterBody').addEventListener('change', function (e) {
      var cb = e.target;
      if (!cb.matches('input[type="checkbox"][data-group]')) return;
      var filters = isMobile() ? state.pendingFilters : state.filters;
      var group = cb.getAttribute('data-group');
      var val = cb.value;
      filters[group] = filters[group] || [];
      var i = filters[group].indexOf(val);
      if (cb.checked && i === -1) filters[group].push(val);
      if (!cb.checked && i !== -1) filters[group].splice(i, 1);
      if (!filters[group].length) delete filters[group];
      state.page = 1;
      if (isMobile()) renderFilterGroups(state.pendingFilters);
      else apply(false);
    });

    /* Сворачивание групп */
    document.getElementById('filterBody').addEventListener('click', function (e) {
      var groupTitle = e.target.closest('[data-filter-group-toggle]');
      if (!groupTitle) return;
      e.preventDefault();
      e.stopPropagation();
      var groupElement = groupTitle.closest('.filter-group');
      if (!groupElement) return;
      groupElement.classList.toggle('is-closed');
      groupTitle.setAttribute('aria-expanded', String(!groupElement.classList.contains('is-closed')));
    });

    pagination.addEventListener('click', function (e) {
      var pageButton = e.target.closest('[data-catalog-page]');
      if (!pageButton) return;
      changePageKeepingPagination(Number(pageButton.getAttribute('data-catalog-page')) || 1, function () { apply(false); });
    });

    /* ---------- Заявка по ТЗ ---------- */
    grid.addEventListener('click', function (e) {
      var tz = e.target.closest('[data-cta="tz"]');
      if (tz) {
        ns.requestModal({
          title: 'Заказать по ТЗ',
          desc: 'Опишите требования — технолог подберёт материал и подготовит предложение.'
        });
      }
    });

    ns.bindCardActions(grid);
    setCollapsed(readSession(COLLAPSE_STORAGE_KEY, false));
    window.addEventListener('resize', function () {
      setCollapsed(readSession(COLLAPSE_STORAGE_KEY, false));
      if (!isDesktop()) catalogLayout.classList.remove('is-filter-collapsed');
      if (!isMobile() && drawer.classList.contains('is-open')) closeDrawer();
    });
    apply();
  };

})(window.KRASKU);

/* ============================================================
   KRASKU.RU — api.js
   Слой доступа к данным. Единственная точка, через которую UI
   «берёт» контент. Сейчас работает поверх mock-массивов из data.js
   (адаптер 'mock'). При натяжке на WordPress меняется только этот
   файл: внутренние методы начинают ходить в wp-json (fetch), а
   контракт методов для UI остаётся прежним.
   ============================================================ */

'use strict';

window.KRASKU = window.KRASKU || {};

(function (ns) {

  var adapter = 'mock'; // 'mock' | 'rest'
  var snapshot = ns.catalogSnapshot || null;

  var surfaceTypeBrands = ['по дереву', 'для потолка', 'Пропитка бетона'];

  function normalizeSurfaceType(product) {
    if (surfaceTypeBrands.indexOf(product.brand) === -1) return product;
    var normalized = Object.assign({}, product);
    normalized.substrate = product.brand;
    normalized.brand = '';
    return normalized;
  }

  function products() {
    var source = snapshot && Array.isArray(snapshot.products) ? snapshot.products : ns.products;
    var normalized = source.map(normalizeSurfaceType);
    return catalogConfig().seedSurfacesFromText && ns.catalogSurfaceSeed ? ns.catalogSurfaceSeed(normalized) : normalized;
  }
  function categories() {
    if (snapshot && Array.isArray(snapshot.categories)) return snapshot.categories;
    return ns.categories;
  }
  function catalogConfig() {
    return Object.assign({}, ns.catalogConfig || {}, (snapshot && snapshot.catalogConfig) || {});
  }
  function useUnannotatedSurfaceFallback(surfaceSlug) {
    return Boolean(
      surfaceSlug
      && catalogConfig().seedSurfacesFromText
      && ns.catalogNavigation
      && !ns.catalogNavigation.availableCategories(products(), surfaceSlug).length
    );
  }
  function categoryDescription(name) {
    var descriptions = {
      'Грунтовки': 'Составы для подготовки поверхности и повышения адгезии покрытия.',
      'Эмали': 'Защитно-декоративные покрытия для промышленности и строительства.',
      'Грунт-эмали': 'Антикоррозионные покрытия, совмещающие свойства грунта и эмали.',
      'Краски': 'Краски для строительных, фасадных и специальных работ.',
      'Лаки': 'Защитные и декоративные покрытия для различных поверхностей.',
      'Растворители': 'Растворители для доведения ЛКМ до рабочей вязкости.',
      'Разбавители': 'Разбавители для совместимых лакокрасочных материалов.',
      'Отвердители': 'Компоненты для эпоксидных и полиуретановых систем.'
    };
    return descriptions[name] || 'Лакокрасочные материалы для промышленности и строительства.';
  }

  /* ---------- Внутренняя реализация: mock (data.js) ---------- */
  var mock = {

    getCategories: function () {
      var counts = {};
      products().forEach(function (p) { counts[p.category] = (counts[p.category] || 0) + 1; });
      return categories().map(function (c) {
        return { slug: c.slug, name: c.name, desc: c.desc || categoryDescription(c.name), count: counts[c.name] || 0, image: c.image, children: c.children };
      });
    },

    getApplications: function () {
      if (snapshot) {
        var homeNames = ['Грунтовки', 'Эмали', 'Отвердители', 'Растворители'];
        return mock.getCategories().filter(function (category) { return homeNames.indexOf(category.name) !== -1; });
      }
      var counts = {};
      products().forEach(function (p) { counts[p.category] = (counts[p.category] || 0) + 1; });
      return ns.applications.map(function (a) {
        var cat = ns.categoryBySlug(a.slug);
        return { slug: a.slug, name: a.name, desc: a.desc, count: cat ? counts[cat.name] || 0 : 0 };
      });
    },

    getProducts: function () { return products().slice(); },
    getProduct: function (id) { return products().find(function (p) { return String(p.id) === String(id) || p.slug === String(id); }); },
    getProductBySku: function (sku) { return products().find(function (p) { return p.sku === sku; }); },
    getProductsByCategory: function (name) { return products().filter(function (p) { return p.category === name; }); },
    getCategoryBySlug: function (slug) { return categories().find(function (c) { return c.slug === slug; }); },
    getCatalogConfig: function () { return catalogConfig(); },

    getArticles: function () { return ns.articles.slice(); },
    getArticle: function (id) { return ns.articleById(id); },
    getArticleCats: function () { return ns.articleCats.slice(); },
    getFaq: function () { return ns.faq.slice(); },
    getDocs: function () { return ns.docs.slice(); },
    getDocCats: function () { return ns.docCats.slice(); },
    getPartners: function () { return ns.partners.slice(); },

    getRequestsSeed: function () { return ns.requests.slice(); },
    getMessagesSeed: function () { return ns.seedMessages.slice(); },
    getChatSeed: function () { return ns.chatMessages.slice(); },

    getSpecs: function (p) { return ns.specs(p); },
    getProductDescription: function (p) { return ns.productDescription(p); },
    getDeliveryInfo: function () { return ns.deliveryInfo; },
    getPackages: function () { return ns.packages.slice(); },
    getPackageSets: function () { return ns.packageSets.slice(); },

    search: function (q) {
      q = String(q || '').toLowerCase().trim();
      if (!q) return [];
      var fields = ['name', 'sku', 'category', 'brand', 'type', 'coating', 'substrate', 'purpose', 'solubility'];
      return products().filter(function (p) {
        return fields.some(function (f) { return String(p[f] || '').toLowerCase().indexOf(q) !== -1; });
      });
    }
  };

  /* ---------- Публичный API ----------
     Контракт (важно сохранить при переходе на 'rest'):
     все методы возвращают те же структуры данных, что и mock.
     Для REST-версии: реализуйте методы ниже через fetch к wp-json
     и переключите адаптер: ns.api.setAdapter('rest'). */

  ns.api = {
    adapter: function () { return adapter; },
    setAdapter: function (a) { adapter = a; },

    getCategories: function () { return mock.getCategories(); },
    getApplications: function () { return mock.getApplications(); },
    getProducts: function () { return mock.getProducts(); },
    getProduct: function (id) { return mock.getProduct(id); },
    getProductBySku: function (sku) { return mock.getProductBySku(sku); },
    getProductsByCategory: function (name) { return mock.getProductsByCategory(name); },
    getCategoryBySlug: function (slug) { return mock.getCategoryBySlug(slug); },
    getCatalogConfig: function () { return mock.getCatalogConfig(); },
    surfaceCatalogueEnabled: function () {
      return Boolean(mock.getCatalogConfig().surfaceCatalogueEnabled && ns.catalogNavigation);
    },
    getAvailableSurfaces: function (categoryName) {
      return ns.catalogNavigation ? ns.catalogNavigation.availableSurfaces(products(), categoryName) : [];
    },
    getAvailableCategoriesForSurface: function (surfaceSlug) {
      if (!ns.catalogNavigation) return [];
      var available = ns.catalogNavigation.availableCategories(products(), surfaceSlug);
      if (available.length || !useUnannotatedSurfaceFallback(surfaceSlug)) return available;
      return mock.getCategories().filter(function (category) { return category.count > 0; }).map(function (category) {
        return { name: category.name, count: category.count };
      });
    },
    getProductsByCategoryAndSurface: function (name, surfaceSlug) {
      if (!ns.catalogNavigation) return mock.getProductsByCategory(name);
      var matched = ns.catalogNavigation.filterProducts(products(), name, surfaceSlug);
      return matched.length || !useUnannotatedSurfaceFallback(surfaceSlug) ? matched : mock.getProductsByCategory(name);
    },
    getArticles: function () { return mock.getArticles(); },
    getArticle: function (id) { return mock.getArticle(id); },
    getArticleCats: function () { return mock.getArticleCats(); },
    getFaq: function () { return mock.getFaq(); },
    getDocs: function () { return mock.getDocs(); },
    getDocCats: function () { return mock.getDocCats(); },
    getPartners: function () { return mock.getPartners(); },
    getRequestsSeed: function () { return mock.getRequestsSeed(); },
    getMessagesSeed: function () { return mock.getMessagesSeed(); },
    getChatSeed: function () { return mock.getChatSeed(); },
    getSpecs: function (p) { return mock.getSpecs(p); },
    getProductDescription: function (p) { return mock.getProductDescription(p); },
    getDeliveryInfo: function () { return mock.getDeliveryInfo(); },
    getPackages: function () { return mock.getPackages(); },
    getPackageSets: function () { return mock.getPackageSets(); },
    search: function (q) { return mock.search(q); }
  };

})(window.KRASKU);

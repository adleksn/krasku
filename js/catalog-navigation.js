/* ============================================================
   KRASKU.RU — catalog-navigation.js
   Двухэтапная навигация каталога: тип продукции ↔ поверхность.
   ============================================================ */

'use strict';

window.KRASKU = window.KRASKU || {};

(function (ns) {
  var SURFACES = [
    { slug: 'metal', name: 'Металл', prepositional: 'металлу' },
    { slug: 'wood', name: 'Дерево', prepositional: 'дереву' },
    { slug: 'concrete', name: 'Бетон', prepositional: 'бетону' },
    { slug: 'road', name: 'Дорожная', prepositional: 'дорожным покрытиям' },
    { slug: 'interior', name: 'Интерьерная', prepositional: 'интерьерным поверхностям' },
    { slug: 'facade', name: 'Фасадная', prepositional: 'фасадным поверхностям' }
  ];

  function surfaceBySlug(slug) {
    return SURFACES.find(function (surface) { return surface.slug === slug; });
  }

  function productSurfaces(product) {
    return Array.isArray(product && product.surfaces) ? product.surfaces : [];
  }

  function hasSurface(product, slug) {
    var surface = surfaceBySlug(slug);
    return Boolean(surface) && productSurfaces(product).indexOf(surface.name) !== -1;
  }

  function countBy(items, predicate) {
    return items.filter(predicate).length;
  }

  function addParams(url, params) {
    var query = Object.keys(params || {}).filter(function (key) { return params[key]; }).map(function (key) {
      return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
    });
    return query.length ? url + '?' + query.join('&') : url;
  }

  function isChooserUrl(search) {
    return /(?:^|[?&])(by|type|surface)=/.test(search || '');
  }

  ns.catalogNavigation = {
    surfaces: function () { return SURFACES.slice(); },
    surfaceBySlug: surfaceBySlug,
    productSurfaces: productSurfaces,
    hasSurface: hasSurface,

    availableSurfaces: function (items, categoryName) {
      return SURFACES.map(function (surface) {
        var count = countBy(items, function (product) {
          return (!categoryName || product.category === categoryName) && productSurfaces(product).indexOf(surface.name) !== -1;
        });
        return { slug: surface.slug, name: surface.name, count: count };
      }).filter(function (surface) { return surface.count > 0; });
    },

    availableCategories: function (items, surfaceSlug) {
      var counts = {};
      items.forEach(function (product) {
        if (hasSurface(product, surfaceSlug)) counts[product.category] = (counts[product.category] || 0) + 1;
      });
      return Object.keys(counts).sort(function (a, b) { return a.localeCompare(b, 'ru'); }).map(function (name) {
        return { name: name, count: counts[name] };
      });
    },

    filterProducts: function (items, categoryName, surfaceSlug) {
      return items.filter(function (product) {
        return (!categoryName || product.category === categoryName) && (!surfaceSlug || hasSurface(product, surfaceSlug));
      });
    },

    isChooserUrl: isChooserUrl,

    browseUrl: function (by, selection) {
      return addParams('catalog.html', Object.assign({ by: by }, selection || {}));
    },

    resultUrl: function (categorySlug, surfaceSlug, from) {
      var slug = typeof surfaceSlug === 'object' && surfaceSlug ? surfaceSlug.slug : surfaceSlug;
      return addParams('category.html', { cat: categorySlug, surface: slug, from: from });
    }
  };
})(window.KRASKU);

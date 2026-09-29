/* Стартовая разметка для статического каталога.
   WordPress передаёт заполненное администратором поле surfaces и имеет
   приоритет над этим безопасным правилом по явным упоминаниям. */
'use strict';

window.KRASKU = window.KRASKU || {};

(function (ns) {
  var rules = [
    { name: 'Металл', expression: /металл\w*|сталь\w*|желез\w*|алюмин\w*|оцинк\w*|чугун\w*|мед\w*|бронз\w*/i },
    { name: 'Дерево', expression: /дерев\w*|древес\w*|паркет\w*|фанер\w*|мебел\w*|\bдсп\b|\bдвп\b|\bosb\b/i },
    { name: 'Бетон', expression: /бетон\w*|цемент\w*|кирпич\w*|минеральн\w*|штукатур\w*|гипс\w*/i },
    { name: 'Дорожная', expression: /дорожн\w*|разметк\w*|асфальт\w*/i },
    { name: 'Интерьерная', expression: /интерьер\w*|внутренн\w*|внутри\s+помещен\w*|помещени\w*/i },
    { name: 'Фасадная', expression: /фасад/i, source: 'name' }
  ];

  ns.catalogSurfaceSeed = function (products) {
    return (products || []).map(function (product) {
      if (Array.isArray(product.surfaces) && product.surfaces.length) return product;
      var text = [product.name, product.paintFor, product.purpose].filter(Boolean).join(' ');
      var surfaces = rules.filter(function (rule) {
        return rule.expression.test(rule.source === 'name' ? product.name || '' : text);
      }).map(function (rule) { return rule.name; });
      return Object.assign({}, product, { surfaces: surfaces });
    });
  };
})(window.KRASKU);

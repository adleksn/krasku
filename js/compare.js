/* ============================================================
   KRASKU.RU — compare.js
   Страница сравнения: таблица, удаление, обсуждение с менеджером.
   ============================================================ */

'use strict';

window.KRASKU = window.KRASKU || {};

(function (ns) {

  var COMPARE_KEYS = [
    ['category', 'Категория'],
    ['type', 'Тип продукта'],
    ['coating', 'Тип покрытия'],
    ['substrate', 'Основание'],
    ['purpose', 'Назначение'],
    ['solubility', 'Растворимость'],
    ['sku', 'Артикул']
  ];

  ns.initComparePage = function () {
    var ids = ns.store.getCompare();
    var wrap = document.getElementById('compareRoot');
    var products = ids.map(ns.api.getProduct).filter(Boolean);

    if (!products.length) {
      wrap.innerHTML = '<div class="empty-state">' + ns.ICONS.compare
        + '<h3>Список сравнения пуст</h3><p>Добавьте товары кнопкой «Сравнить» в каталоге — мы покажем их характеристики в таблице.</p>'
        + '<a class="btn btn-primary" href="' + ns.url('catalog') + '">Перейти в каталог</a></div>';
      return;
    }

    var specs = products.map(function (p) { return ns.api.getSpecs(p); });

    var head = '<thead><tr><th>Характеристика</th>'
      + products.map(function (p) {
        return '<th><div class="product-media" style="aspect-ratio:1/1;max-width:120px;margin:0 auto 10px;border-radius:var(--radius)">'
          + '<img src="' + ns.svgToDataUri(ns.productSvg(p, p.name)) + '" alt=""></div>'
          + '<a href="' + ns.url('product', p.id) + '" style="font-size:14px">' + ns.esc(p.name) + '</a>'
          + '<div style="margin-top:8px"><span class="chip">' + ns.formatPrice(p.pricePerKg) + '/кг</span></div>'
          + '<div style="margin-top:10px"><button type="button" class="btn btn-sm btn-outline compare-remove" data-remove="' + p.id + '">' + ns.ICONS.trash + ' Убрать</button></div>'
          + '</th>';
      }).join('') + '</tr></thead>';

    var body = '<tbody>'
      + COMPARE_KEYS.map(function (pair) {
        return '<tr><td>' + pair[1] + '</td>'
          + products.map(function (p) { return '<td>' + ns.esc(p[pair[0]] || '—') + '</td>'; }).join('')
          + '</tr>';
      }).join('')
      + '<tr><td>Расход, г/м²</td>'
      + specs.map(function (s) { return '<td>' + ns.esc(s['Расход (1 слой, г/м²)']) + '</td>'; }).join('')
      + '</tr>'
      + '<tr><td>Температура эксплуатации, °C</td>'
      + specs.map(function (s) { return '<td>' + ns.esc(s['Температура эксплуатации, °C']) + '</td>'; }).join('')
      + '</tr>'
      + '<tr><td>Цена за 1 кг</td>'
      + products.map(function (p) { return '<td><b>' + ns.formatPrice(p.pricePerKg) + '</b></td>'; }).join('')
      + '</tr>'
      + '</tbody>';

    wrap.innerHTML = '<div class="compare-wrap"><table class="compare-table">' + head + body + '</table></div>'
      + '<div class="compare-cta">'
      + '<div><b>Обсудить выбранные товары с менеджером</b><p>Менеджер поможет выбрать подходящий материал и подготовит КП на всю партию.</p></div>'
      + '<button type="button" class="btn btn-primary btn-lg" data-cta="discuss">Обсудить с менеджером</button>'
      + '</div>';

    if (!wrap._kraskuCompareBound) {
      wrap._kraskuCompareBound = true;
    wrap.onclick = function (e) {
      var rm = e.target.closest('[data-remove]');
      if (rm) {
        ns.store.removeCompare(rm.getAttribute('data-remove'));
        ns.initComparePage();
        ns.toast('Товар убран из сравнения');
      }
    };
    }

    wrap.querySelector('[data-cta="discuss"]').addEventListener('click', function () {
      var list = '<div class="discuss-list">'
        + products.map(function (p) {
          return '<div class="discuss-item"><img src="' + ns.svgToDataUri(ns.productSvg(p, p.name)) + '" alt=""><b>' + ns.esc(p.name) + '</b><span>' + ns.formatPrice(p.pricePerKg) + '/кг</span></div>';
        }).join('')
        + '</div>';
      ns.openModal({
        title: 'Обсудить товары с менеджером',
        desc: 'Выбранные товары будут переданы менеджеру вместе с заявкой.',
        body: list + '<form data-request-form novalidate><div class="form-grid">'
          + ns.field('ФИО', 'name', 'text', true)
          + ns.field('Телефон', 'phone', 'tel', true)
          + ns.field('Email', 'email', 'email', true)
          + ns.field('Организация', 'org')
          + '</div></form>',
        foot: '<button type="submit" class="btn btn-primary btn-lg btn-block" data-send-manager>Отправить менеджеру</button>'
      });
      var dialog = document.querySelector('.modal.is-open');
      dialog.querySelector('[data-send-manager]').addEventListener('click', function (e) {
        e.preventDefault();
        var form = dialog.querySelector('[data-request-form]');
        if (!ns.validateForm(form)) return;
        var data = ns.collectForm(form);
        ns.submitRequest({
          products: products.map(function (p) { return { id: p.id, sku: p.sku }; }),
          contact: data,
          product: 'Обсуждение товаров с менеджером',
          source: 'discuss'
        }, { toast: 'Запрос отправлен менеджеру' });
        ns.closeModal();
      });
    });
  };

})(window.KRASKU);

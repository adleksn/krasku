/* ============================================================
   KRASKU.RU — product.js
   Карточка товара: галерея, цвет, фасовки, комплектации,
   доставка, расчёт веса/стоимости, табы, стандарты, FAQ, заявка.
   ============================================================ */

'use strict';

window.KRASKU = window.KRASKU || {};

(function (ns) {

  var state = null;
  var product = null;
  var PACKAGES = ns.api.getPackages();
  var DELIVERY = ns.api.getDeliveryInfo();

  function initState() {
    state = {
      colorSystem: product.colorSystems && product.colorSystems.length ? product.colorSystems[0] : null,
      packaging: { 1: 0, 10: 0, 15: 0, 30: 0 },
      activePackage: null,
      delivery: 'Доставка от производителя'
    };
  }

  function totalWeight() {
    return PACKAGES.reduce(function (sum, pk) {
      return sum + pk.multiplier * (state.packaging[pk.multiplier] || 0);
    }, 0);
  }

  function totalPrice() {
    return typeof product.pricePerKg === 'number' ? totalWeight() * product.pricePerKg : null;
  }

  function packagingSummary() {
    return PACKAGES.map(function (pk) {
      var q = state.packaging[pk.multiplier] || 0;
      return q ? pk.name + ' × ' + q : null;
    }).filter(Boolean).join(', ') || '—';
  }

  /* ---------- Иконка состояния ---------- */
  function stockBadge() {
    return '<span class="stock stock--' + (product.stock ? 'in' : 'out') + '">' + (product.stock ? 'В наличии' : 'Отсутствует') + '</span>';
  }

  function shortDescription() {
    var source = String(product.description || product.paintFor || '').replace(/\s+/g, ' ').trim();
    if (!source) return 'Промышленный лакокрасочный материал для профессионального применения.';
    var sentences = source.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [source];
    return sentences.slice(0, 2).join(' ').trim().slice(0, 360);
  }

  function highlightHtml() {
    if (product.slug === 'ак-503') {
      var ak503Highlights = [
        { icon: ns.ICONS.tag, label: 'Тип', value: product.type },
        { icon: ns.ICONS.shield, label: 'Назначение', value: product.purpose },
        { icon: ns.ICONS.factory, label: 'Применение', value: product.substrate },
        { icon: ns.ICONS.clock, label: 'Расход', value: product.consumption },
        { icon: ns.ICONS.palette, label: 'Цвет', value: product.color },
        { icon: ns.ICONS.tag, label: 'Нанесение', value: product.applicationTemperature }
      ];
      return '<dl class="product-highlight-grid">' + ak503Highlights.map(function (item) {
        return '<div class="product-highlight"><dt><span class="product-highlight-icon">' + item.icon + '</span>' + ns.esc(item.label) + '</dt><dd>' + ns.esc(item.value) + '</dd></div>';
      }).join('') + '</dl>';
    }
    var specs = ns.api.getSpecs(product);
    var highlights = [
      { icon: ns.ICONS.tag, label: 'Тип покрытия', value: [product.type, product.coating].filter(Boolean).join(' · ') },
      { icon: ns.ICONS.factory, label: 'Назначение', value: product.substrate },
      { icon: ns.ICONS.shield, label: 'Область применения', value: product.purpose },
      { icon: ns.ICONS.palette, label: 'Цвет', value: product.colorSystems && product.colorSystems.length ? 'Колеруется: ' + product.colorSystems.join(', ') : 'Не колеруется' },
      { icon: ns.ICONS.clock, label: 'Расход и высыхание', value: (specs['Расход (1 слой, г/м²)'] ? specs['Расход (1 слой, г/м²)'] + ' г/м²' : '') + (specs['Время высыхания до степени 3, ч'] ? ' · ' + specs['Время высыхания до степени 3, ч'] + ' ч' : '') }
    ].filter(function (item) { return item.value && item.value !== 'По запросу'; });
    return '<dl class="product-highlight-grid">' + highlights.map(function (item) {
      return '<div class="product-highlight"><dt><span class="product-highlight-icon">' + item.icon + '</span>' + ns.esc(item.label) + '</dt><dd>' + ns.esc(item.value) + '</dd></div>';
    }).join('') + '</dl>';
  }

  /* ---------- Галерея ---------- */
  function galleryHtml() {
    var images = product.images && product.images.length ? product.images : [product.image || ns.svgToDataUri(ns.productSvg(product, product.name, 0))];
    return '<div class="gallery-main" id="galleryMain"><img src="' + images[0] + '" alt="' + ns.esc(product.name) + '"></div>'
      + '<div class="gallery-thumbs" id="galleryThumbs">'
      + images.map(function (image, index) {
        return '<button type="button" class="gallery-thumb' + (index === 0 ? ' is-active' : '') + '" data-image="' + ns.esc(image) + '" aria-label="Изображение ' + (index + 1) + '">'
          + '<img src="' + image + '" alt="">'
        + '</button>';
      }).join('')
      + '</div>';
  }

  function switchImage(image) {
    document.getElementById('galleryMain').innerHTML = '<img src="' + image + '" alt="' + ns.esc(product.name) + '">';
    document.querySelectorAll('[data-image]').forEach(function (t) {
      t.classList.toggle('is-active', t.getAttribute('data-image') === image);
    });
  }

  /* ---------- Цветовые системы ---------- */
  function colorSystemsHtml() {
    return '<div class="buy-section">'
      + '<div class="buy-section-title">Цвет</div>'
      + '<div class="color-system-options" id="colorSystemOptions" role="radiogroup" aria-label="Система цвета">'
      + product.colorSystems.map(function (cs) {
        var active = cs === state.colorSystem;
        return '<button type="button" role="radio" aria-checked="' + active + '" class="color-system-opt' + (active ? ' is-active' : '') + '" data-color-system="' + cs + '">' + cs + '<small>система цвета</small></button>';
      }).join('')
      + '</div>'
      + '<p class="color-system-note">' + ns.ICONS.info + '<span id="colorSystemNote">Выбрана система: <b>' + state.colorSystem + '</b>. Конкретный цвет будет согласован с менеджером.</span></p>'
      + '</div>';
  }

  /* ---------- Фасовки ---------- */
  function packagingChipsHtml() {
    return '<div class="buy-section buy-section--pack-chips">'
      + '<div class="buy-section-title">Фасовка</div>'
      + '<div class="package-picker" id="packagePicker">'
      + '<div class="package-chip-list" role="group" aria-label="Выбор фасовки">'
      + PACKAGES.map(function (pk) {
        return '<button type="button" class="package-chip" data-pack-preset="' + pk.multiplier + '" aria-expanded="false">' + ns.esc(pk.name) + '</button>';
      }).join('')
      + '</div>'
      + '<div class="package-qty-panels">'
      + PACKAGES.map(function (pk) {
        return '<div class="package-qty-panel" data-pack-panel="' + pk.multiplier + '" aria-hidden="true">'
          + '<div class="pack-row">'
          + '<span class="pack-label">Количество: ' + ns.esc(pk.name) + '<small> · ' + (typeof product.pricePerKg === 'number' ? ns.formatPrice(product.pricePerKg * pk.multiplier) : 'Цена по запросу') + '</small></span>'
          + '<span class="stepper" role="group" aria-label="Количество ' + pk.name + '">'
          + '<button type="button" data-pack-minus="' + pk.multiplier + '" aria-label="Уменьшить количество ' + pk.name + '">' + ns.ICONS.minus + '</button>'
          + '<output data-pack-qty="' + pk.multiplier + '">0</output>'
          + '<button type="button" data-pack-plus="' + pk.multiplier + '" aria-label="Увеличить количество ' + pk.name + '">' + ns.ICONS.plus + '</button>'
          + '</span></div></div>';
      }).join('')
      + '</div></div></div>';
  }

  /* ---------- Доставка ---------- */
  function deliveryHtml() {
    return '<div class="buy-section">'
      + '<div class="buy-section-title">Доставка</div>'
      + '<div class="delivery-options" role="radiogroup" aria-label="Способ доставки">'
      + Object.keys(DELIVERY).map(function (d) {
        var active = d === state.delivery;
        return '<button type="button" role="radio" aria-checked="' + active + '" class="delivery-opt' + (active ? ' is-active' : '') + '" data-delivery="' + d + '">' + d + '<small>' + (d === 'Самовывоз' ? 'Бесплатно' : d === 'Доставка от производителя' ? 'От 1 дня' : 'По тарифу ТК') + '</small></button>';
      }).join('')
      + '</div>'
      + '<p class="delivery-note" id="deliveryNote">' + ns.esc(DELIVERY[state.delivery]) + '</p>'
      + '</div>';
  }

  /* ---------- Покупка ---------- */
  function buyBoxHtml() {
    return '<div class="buy-box">'
      + '<h1 class="buy-title">' + ns.esc(product.name) + '</h1>'
      + '<p class="product-summary">' + ns.esc(shortDescription()) + '</p>'
      + highlightHtml()
      + packagingChipsHtml()
      + '<div class="product-order-card">'
      + '<div class="buy-meta"><p class="buy-sku">Артикул: ' + ns.esc(product.sku) + '</p><div class="buy-badges">' + stockBadge() + '</div></div>'
      + '<div class="buy-price"><span id="buyPriceValue">от ' + ns.formatPrice(product.pricePerKg) + '</span><small id="buyPriceNote">' + (typeof product.pricePerKg === 'number' ? 'за 1 кг · предварительная цена производителя' : 'стоимость уточнит менеджер') + '</small></div>'
      + '<div class="buy-cta buy-cta--order">'
      + '<button type="button" class="btn btn-primary btn-lg" data-cta="product-add-request-item">Добавить в список заявки</button>'
      + '<button type="button" class="btn btn-primary btn-lg" data-cta="product-individual-order">Индивидуальный заказ</button>'
      + '<button type="button" class="btn btn-outline btn-lg" data-cta="product-fast-order">Быстрый заказ</button>'
      + '</div></div>'
      + (product.colorSystems.length ? colorSystemsHtml() : '')
      + deliveryHtml()
      + '<div class="buy-cta">'
      + '<button type="button" class="btn btn-outline btn-lg" data-cta="product-consult">Получить консультацию</button>'
      + '</div>'
      + '</div>';
  }

  /* ---------- Расчёт ---------- */
  function recalc() {
    var weight = totalWeight();
    var price = totalPrice();
    document.querySelectorAll('[data-pack-qty]').forEach(function (out) {
      out.textContent = state.packaging[out.getAttribute('data-pack-qty')] || 0;
    });
    var priceValue = document.getElementById('buyPriceValue');
    var priceNote = document.getElementById('buyPriceNote');
    if (!priceValue || !priceNote) return;
    if (weight && typeof product.pricePerKg === 'number') {
      priceValue.textContent = ns.formatPrice(price);
      priceNote.textContent = 'за выбранные фасовки · общий вес ' + ns.formatKg(weight);
    } else {
      priceValue.textContent = 'от ' + ns.formatPrice(product.pricePerKg);
      priceNote.textContent = typeof product.pricePerKg === 'number' ? 'за 1 кг · предварительная цена производителя' : 'стоимость уточнит менеджер';
    }
  }

  /* ---------- Заявка по товару ---------- */
  function requestSummary() {
    return '<b>' + ns.esc(product.name) + '</b>'
      + '<span>Артикул: ' + ns.esc(product.sku) + '</span>'
      + (state.colorSystem ? '<span>Цветовая система: ' + ns.esc(state.colorSystem) + ' (согласуется с менеджером)</span>' : '')
      + '<span>Фасовки: ' + ns.esc(packagingSummary()) + '</span>'
      + '<span>Доставка: ' + ns.esc(state.delivery) + '</span>'
      + '<span>Общий вес: ' + ns.formatKg(totalWeight()) + '</span>'
      + '<span class="req-total">Предварительная стоимость: ' + ns.formatPrice(totalPrice()) + (typeof product.pricePerKg === 'number' ? ' (' + ns.formatPrice(product.pricePerKg) + ' / кг)' : '') + '</span>';
  }

  function individualOrderSummary() {
    return '<b>Марка: ' + ns.esc(product.name) + '</b>'
      + '<span>Артикул: ' + ns.esc(product.sku) + '</span>'
      + (state.colorSystem ? '<span>Цветовая система: ' + ns.esc(state.colorSystem) + '</span>' : '')
      + '<span>Фасовки: ' + ns.esc(packagingSummary()) + '</span>'
      + '<span>Общий вес: ' + ns.formatKg(totalWeight()) + '</span>'
      + '<span class="req-total">Предварительная стоимость: ' + ns.formatPrice(totalPrice()) + '</span>';
  }

  function buildPayload() {
    return {
      product: product.name,
      sku: product.sku,
      productId: product.id,
      colorSystem: state.colorSystem,
      packaging: PACKAGES.reduce(function (acc, pk) {
        acc[pk.name] = state.packaging[pk.multiplier] || 0;
        return acc;
      }, {}),
      totalWeightKg: totalWeight(),
      delivery: state.delivery,
      pricePerKg: product.pricePerKg,
      totalPrice: totalPrice(),
      quantity: Object.keys(state.packaging).reduce(function (sum, key) { return sum + (state.packaging[key] || 0); }, 0) || 1,
      url: window.location.href
    };
  }

  function openProductRequest(kind) {
    if (kind !== 'Быстрый заказ') {
      ns.productConfigurationModal({
        title: 'Индивидуальный заказ',
        summary: individualOrderSummary(),
        payload: buildPayload(),
        product: product
      });
      return;
    }
    ns.requestModal({
      title: 'Быстрый заказ',
      desc: 'Оставьте контакты — менеджер быстро уточнит детали.',
      lg: true,
      summary: requestSummary(),
      payload: buildPayload()
    });
  }

  /* ---------- Табы (Описание / Характеристики / Инструкция / Документы / Доставка) ---------- */
  function tabsHtml() {
    var desc = ns.api.getProductDescription(product);
    var specs = ns.api.getSpecs(product);
    var t = ns.ICONS;

    return '<section class="section" aria-label="Описание товара">'
      + '<div class="container">'
      + '<div class="tabs" data-tabs="product" role="tablist">'
      + '<button class="tab-btn" id="tab-desc" role="tab" data-tab="panel-desc" aria-selected="true" aria-controls="panel-desc">Описание</button>'
      + '<button class="tab-btn" role="tab" data-tab="panel-specs" aria-selected="false" aria-controls="panel-specs" tabindex="-1">Характеристики</button>'
      + '<button class="tab-btn" role="tab" data-tab="panel-use" aria-selected="false" aria-controls="panel-use" tabindex="-1">Инструкция применения</button>'
      + '<button class="tab-btn" role="tab" data-tab="panel-docs" aria-selected="false" aria-controls="panel-docs" tabindex="-1">Документы</button>'
      + '<button class="tab-btn" role="tab" data-tab="panel-delivery" aria-selected="false" aria-controls="panel-delivery" tabindex="-1">Условия доставки</button>'
      + '</div>'

      + '<div class="tab-panel is-active" id="panel-desc" role="tabpanel" aria-labelledby="tab-desc" data-tab-panel="product">'
      + '<h2>Описание</h2><br>'
      + '<p>' + ns.esc(desc.text) + '</p><br>'
      + '<ul class="about-features">'
      + desc.benefits.map(function (b, index) {
        var icons = [t.factory, t.flask, t.palette, t.truck];
        return '<li class="about-feature">' + (icons[index] || t.check) + '<span>' + ns.esc(b) + '</span></li>';
      }).join('')
      + '</ul><br>'
      + '<h3 style="font-size:18px;margin-bottom:10px">Дополнительная информация</h3>'
      + '<p>' + ns.esc(desc.extra) + '</p>'
      + '</div>'

      + '<div class="tab-panel" id="panel-specs" role="tabpanel" aria-labelledby="tab-specs" data-tab-panel="product">'
      + '<h2>Характеристики</h2><br>'
      + '<table class="spec-table"><tbody>'
      + Object.keys(specs).map(function (k) { return '<tr><td>' + ns.esc(k) + '</td><td>' + ns.esc(specs[k]) + '</td></tr>'; }).join('')
      + '</tbody></table>'
      + '</div>'

      + '<div class="tab-panel" id="panel-use" role="tabpanel" aria-labelledby="tab-use" data-tab-panel="product">'
      + '<h2>Инструкция применения</h2><br>'
      + '<p>Подготовка поверхности: удалить рыхлую ржавчину, масла и загрязнения. Обезжирить. Для грунтовок ГФ и ЭП допустима поверхность со стойкой ржавчиной при условии удаления отслоений.</p><br>'
      + '<p>Нанесение: кисть, валик или безвоздушное распыление при температуре ' + (product.solubility === 'Водорастворимая' ? 'от +5 до +35 °C' : 'от −10 до +35 °C') + '. Вязкость доводится до рабочей по паспорту качества.</p><br>'
      + '<p>Высыхание: до степени 3 за 24 часа при 20 °C. Следующий слой — после набора механической прочности. Полная стойкость — через 7 суток.</p><br>'
      + '<p>Очистка инструмента: сразу после применения ' + (product.solubility === 'Водорастворимая' ? 'водой' : 'растворителем марки, указанной в паспорте') + '.</p>'
      + '</div>'

      + '<div class="tab-panel" id="panel-docs" role="tabpanel" aria-labelledby="tab-docs" data-tab-panel="product">'
      + '<h2>Документы</h2><br>'
      + '<div class="docs-grid">'
      + [['Паспорт качества', 'PDF · 0,4 МБ', t.doc], ['Сертификат соответствия', 'PDF · 0,8 МБ', t.shield], ['Инструкция по применению', 'PDF · 0,3 МБ', t.file]]
        .map(function (d) {
          return '<div class="doc-card"><span class="doc-icon">' + d[2] + '</span><h3>' + d[0] + '</h3><div class="doc-meta"><span class="chip">' + d[1] + '</span></div>'
            + '<div class="doc-actions"><button class="btn btn-sm btn-outline" data-doc-open="' + d[0] + '">' + t.doc + ' Открыть</button><button class="btn btn-sm btn-ghost" data-doc-download="' + d[0] + '">' + t.download + ' Скачать</button></div></div>';
        }).join('')
      + '</div>'
      + '</div>'

      + '<div class="tab-panel" id="panel-delivery" role="tabpanel" aria-labelledby="tab-delivery" data-tab-panel="product">'
      + '<h2>Условия доставки</h2><br>'
      + Object.keys(DELIVERY).map(function (d) {
        return '<h3 style="font-size:16px;margin:0 0 6px">' + ns.esc(d) + '</h3><p style="margin-bottom:16px">' + ns.esc(DELIVERY[d]) + '</p>';
      }).join('')
      + '</div>'
      + '</div></section>';
  }

  /* ---------- Цветовые стандарты ---------- */
  function colorStandardsHtml() {
    return '<section class="section section--gray" aria-label="Цветовые стандарты">'
      + '<div class="container">'
      + '<div class="section-head"><span class="eyebrow">Цветовые стандарты</span><h2>Три системы цвета</h2><p>Колеровка выполняется по каталогам RAL, ГОСТ и NCS. Конкретный оттенок согласует менеджер и при необходимости подтвердит выкрасом.</p></div>'
      + '<div class="info-grid">'
      + [['RAL', 'Европейский каталог из более чем 2000 оттенков, применяемый при колеровке промышленных ЛКМ. Универсален для проектной документации.'], ['ГОСТ', 'Цветовые стандарты, принятые для лакокрасочных материалов в России и странах СНГ. Удобны для типовых объектов.'], ['NCS', 'Скандинавская система Natural Color System, описывающая цвет по восприятию. Подходит для архитектурных и дизайнерских решений.']]
        .map(function (c) {
          return '<div class="color-system-card"><span class="color-system-badge">' + c[0] + '</span><p>' + c[1] + '</p></div>';
        }).join('')
      + '</div>'
      + '</div></section>';
  }

  /* ---------- FAQ товара ---------- */
  function faqHtml() {
    return '<section class="section" aria-label="Частые вопросы">'
      + '<div class="container-narrow">'
      + '<div class="section-head section-head--center"><span class="eyebrow">FAQ</span><h2>Часто задаваемые вопросы</h2></div>'
      + '<div data-faq>'
      + ns.api.getFaq().map(function (f) {
        return '<div class="faq-item">'
          + '<button type="button" class="faq-q">' + ns.esc(f.q) + '<span class="faq-icon">' + ns.ICONS.plus + '</span></button>'
          + '<div class="faq-a"><div><p>' + ns.esc(f.a) + '</p></div></div>'
          + '</div>';
      }).join('')
      + '</div>'
      + '</div></section>';
  }

  function injectProductSeo() {
    var old = document.getElementById('productJsonLd');
    if (old) old.remove();
    var data = {
      '@context': 'https://schema.org', '@type': 'Product',
      name: product.name,
      image: (product.images && product.images.length ? product.images : [product.image]).filter(Boolean),
      sku: product.sku,
      category: product.category,
      description: product.description || product.paintFor
    };
    if (typeof product.pricePerKg === 'number') data.offers = {
      '@type': 'Offer', priceCurrency: 'RUB', price: product.pricePerKg,
      availability: product.stock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
    };
    var breadcrumb = {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://krasku.ru/' },
        { '@type': 'ListItem', position: 2, name: 'Каталог', item: 'https://krasku.ru/catalog.html' },
        { '@type': 'ListItem', position: 3, name: product.category },
        { '@type': 'ListItem', position: 4, name: product.name }
      ]
    };
    var script = document.createElement('script');
    script.type = 'application/ld+json'; script.id = 'productJsonLd';
    script.textContent = JSON.stringify([data, breadcrumb]).replace(/<\/script/gi, '<\\/script');
    document.head.appendChild(script);
  }

  /* ---------- Инициализация ---------- */
  ns.initProductPage = function () {
    var params = new URLSearchParams(window.location.search);
    product = ns.api.getProduct(params.get('id'));
    if (!product) { window.location.href = ns.url('catalog'); return; }
    if (product.packaging && product.packaging.length) {
      PACKAGES = product.packaging.map(function (weight) { return { name: weight + ' кг', multiplier: weight }; });
    }

    initState();
    injectProductSeo();

    document.title = product.name + ' — KRASKU.RU';
    var bcCat = document.getElementById('bcCatPage');
    if (bcCat) {
      var cat = ns.api.getCategories().find(function (c) { return c.name === product.category; });
      bcCat.innerHTML = cat ? '<a href="' + ns.url('category', cat.slug) + '">' + product.category + '</a>' : product.category;
    }
    document.getElementById('bcProduct').textContent = product.name;

    var root = document.getElementById('productRoot');
    root.innerHTML = '<div class="product-layout">'
      + '<div id="galleryWrap">' + galleryHtml() + '</div>'
      + buyBoxHtml()
      + '</div>';
    root.insertAdjacentHTML('beforeend', tabsHtml());
    root.insertAdjacentHTML('beforeend', colorStandardsHtml());
    root.insertAdjacentHTML('beforeend', faqHtml());

    /* Галерея */
    document.getElementById('galleryThumbs').addEventListener('click', function (e) {
      var t = e.target.closest('[data-image]');
      if (t) switchImage(t.getAttribute('data-image'));
    });

    /* Цвет */
    if (state.colorSystem) {
      document.getElementById('colorSystemOptions').addEventListener('click', function (e) {
        var b = e.target.closest('[data-color-system]');
        if (!b) return;
        state.colorSystem = b.getAttribute('data-color-system');
        document.querySelectorAll('[data-color-system]').forEach(function (x) {
          var active = x === b;
          x.classList.toggle('is-active', active);
          x.setAttribute('aria-checked', String(active));
        });
        document.getElementById('colorSystemNote').innerHTML = 'Выбрана система: <b>' + state.colorSystem + '</b>. Конкретный цвет будет согласован с менеджером.';
      });
    }

    /* Фасовки: выбор и количество раскрываются в одном блоке. */
    document.getElementById('packagePicker').addEventListener('click', function (e) {
      var chip = e.target.closest('[data-pack-preset]');
      var plus = e.target.closest('[data-pack-plus]');
      var minus = e.target.closest('[data-pack-minus]');
      var key, mult;
      if (chip) {
        mult = Number(chip.getAttribute('data-pack-preset'));
        state.activePackage = mult;
        state.packaging[mult] = Math.max(1, state.packaging[mult] || 0);
        document.querySelectorAll('[data-pack-preset]').forEach(function (item) {
          var active = Number(item.getAttribute('data-pack-preset')) === mult;
          item.classList.toggle('is-active', active);
          item.setAttribute('aria-expanded', String(active));
        });
        document.querySelectorAll('[data-pack-panel]').forEach(function (panel) {
          var active = Number(panel.getAttribute('data-pack-panel')) === mult;
          panel.classList.toggle('is-open', active);
          panel.setAttribute('aria-hidden', String(!active));
        });
      }
      if (plus) { key = 'data-pack-plus'; mult = Number(plus.getAttribute(key)); state.packaging[mult] = (state.packaging[mult] || 0) + 1; }
      if (minus) { key = 'data-pack-minus'; mult = Number(minus.getAttribute(key)); state.packaging[mult] = Math.max(0, (state.packaging[mult] || 0) - 1); }
      if (chip || plus || minus) recalc();
    });

    /* Доставка */
    document.querySelector('[data-delivery]').closest('.delivery-options').addEventListener('click', function (e) {
      var b = e.target.closest('[data-delivery]');
      if (!b) return;
      state.delivery = b.getAttribute('data-delivery');
      document.querySelectorAll('[data-delivery]').forEach(function (x) {
        var active = x === b;
        x.classList.toggle('is-active', active);
        x.setAttribute('aria-checked', String(active));
      });
      document.getElementById('deliveryNote').textContent = DELIVERY[state.delivery];
    });

    /* CTA */
    document.querySelector('[data-cta="product-individual-order"]').addEventListener('click', function () { openProductRequest('Индивидуальный заказ'); });
    document.querySelector('[data-cta="product-add-request-item"]').addEventListener('click', function () {
      var payload = buildPayload();
      ns.store.addRequestItem(Object.assign({}, payload, { id: product.id, sourceUrl: window.location.href }));
      ns.toast('Товар добавлен в список заявки');
    });
    document.querySelector('[data-cta="product-fast-order"]').addEventListener('click', function () { openProductRequest('Быстрый заказ'); });
    document.querySelector('[data-cta="product-consult"]').addEventListener('click', function () {
      ns.technologistModal();
    });

    /* Документы в табах */
    document.querySelectorAll('[data-doc-open]').forEach(function (b) {
      b.addEventListener('click', function () { ns.toast('Документ «' + b.getAttribute('data-doc-open') + '» — mock PDF'); });
    });
    document.querySelectorAll('[data-doc-download]').forEach(function (b) {
      b.addEventListener('click', function () { ns.toast('Скачивание mock-файла…'); });
    });

    ns.initTabs(document.getElementById('productRoot'));
    ns.initFaq(document.getElementById('productRoot'));
    recalc();
  };

})(window.KRASKU);

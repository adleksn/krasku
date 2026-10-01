/* ============================================================
   KRASKU.RU — ui.js
   Модальные окна, табы, FAQ, сегменты, тосты, общие хелперы.
   ============================================================ */

'use strict';

window.KRASKU = window.KRASKU || {};

(function (ns) {

  /* ---------- helpers ---------- */
  ns.el = function (html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstChild;
  };

  ns.esc = function (s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };

  ns.toast = function (msg) {
    var el = document.querySelector('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      el.setAttribute('role', 'status');
      document.body.appendChild(el);
    }
    el.textContent = msg;
    requestAnimationFrame(function () { el.classList.add('is-visible'); });
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.classList.remove('is-visible'); }, 2600);
  };

  /* ---------- Segmented control ---------- */
  ns.initSegmented = function (root) {
    root.querySelectorAll('.segmented').forEach(function (seg) {
      seg.querySelectorAll('button').forEach(function (btn) {
        btn.addEventListener('click', function () {
          seg.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
          btn.setAttribute('aria-pressed', 'true');
        });
      });
    });
  };

  /* ---------- Клавиатурная навигация по табам (стрелки/Home/End) ---------- */
  ns.initRoving = function (tablist, buttons, onSelect) {
    tablist.addEventListener('keydown', function (e) {
      var k = e.key;
      if (k !== 'ArrowLeft' && k !== 'ArrowRight' && k !== 'Home' && k !== 'End') return;
      var idx = buttons.indexOf(document.activeElement);
      if (idx === -1) idx = buttons.indexOf(tablist.querySelector('[aria-selected="true"]'));
      if (idx === -1) idx = 0;
      if (k === 'ArrowRight') idx = (idx + 1) % buttons.length;
      else if (k === 'ArrowLeft') idx = (idx - 1 + buttons.length) % buttons.length;
      else if (k === 'Home') idx = 0;
      else idx = buttons.length - 1;
      e.preventDefault();
      var target = buttons[idx];
      if (onSelect) onSelect(target); else target.click();
      target.focus();
    });
  };

  /* ---------- Tabs (без якорей и прокрутки) ---------- */
  ns.initTabs = function (root) {
    root.querySelectorAll('[data-tabs]').forEach(function (tabs) {
      if (tabs._kraskuTabs) return;
      tabs._kraskuTabs = true;
      var panelId = tabs.getAttribute('data-tabs');
      var buttons = tabs.querySelectorAll('.tab-btn');
      var panels = root.querySelectorAll('[data-tab-panel="' + panelId + '"]');

      buttons.forEach(function (btn, i) {
        btn.addEventListener('click', function () {
          var target = btn.getAttribute('data-tab');
          buttons.forEach(function (b) {
            var active = b === btn;
            b.setAttribute('aria-selected', active ? 'true' : 'false');
            b.tabIndex = active ? 0 : -1;
          });
          panels.forEach(function (p) {
            p.classList.toggle('is-active', p.id === target);
          });
          btn.focus();
        });
      });

      ns.initRoving(tabs, Array.prototype.slice.call(buttons));
    });
  };

  /* ---------- FAQ accordion ---------- */
  ns.initFaq = function (root) {
    root.querySelectorAll('[data-faq]').forEach(function (wrap) {
      if (wrap._kraskuFaq) return;
      wrap._kraskuFaq = true;
      wrap.querySelectorAll('.faq-item').forEach(function (item) {
        var btn = item.querySelector('.faq-q');
        btn.setAttribute('aria-expanded', 'false');
        item.querySelector('.faq-a').setAttribute('aria-hidden', 'true');
        btn.addEventListener('click', function () {
          var open = item.classList.contains('is-open');
          wrap.querySelectorAll('.faq-item.is-open').forEach(function (o) {
            o.classList.remove('is-open');
            o.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
            o.querySelector('.faq-a').setAttribute('aria-hidden', 'true');
          });
          if (!open) {
            item.classList.add('is-open');
            btn.setAttribute('aria-expanded', 'true');
            item.querySelector('.faq-a').setAttribute('aria-hidden', 'false');
          }
        });
      });
    });
  };

  /* ---------- Modal ---------- */
  var currentModal = null;

  function closeModal() {
    if (!currentModal) return;
    var modal = currentModal;
    currentModal = null;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    var opener = document.querySelector('[data-modal-opener]');
    if (opener) opener.focus();
    document.body.classList.remove('no-scroll');
    setTimeout(function () { modal.remove(); }, 260);
  }

  ns.closeModal = closeModal;

  ns.openModal = function (opts) {
    opts = opts || {};
    var dialog = ns.el(
      '<div class="modal" role="dialog" aria-modal="true" aria-hidden="false" aria-labelledby="m-title">'
      + '<div class="modal-backdrop"></div>'
      + '<div class="modal-dialog' + (opts.lg ? ' modal-dialog--lg' : '') + '">'
      + '<div class="modal-head">'
      + '<div><h3 id="m-title">' + ns.esc(opts.title || 'Заявка') + '</h3>'
      + (opts.desc ? '<p>' + ns.esc(opts.desc) + '</p>' : '')
      + '</div>'
      + '<button type="button" class="btn-icon modal-close" aria-label="Закрыть окно">' + ns.ICONS.close + '</button>'
      + '</div>'
      + '<div class="modal-body">' + (opts.body || '') + '</div>'
      + (opts.foot ? '<div class="modal-foot">' + opts.foot + '</div>' : '')
      + '</div></div>'
    );
    document.body.appendChild(dialog);
    document.body.classList.add('no-scroll');
    currentModal = dialog;
    requestAnimationFrame(function () { dialog.classList.add('is-open'); });

    var backdrop = dialog.querySelector('.modal-backdrop');
    var closeBtn = dialog.querySelector('.modal-close');
    backdrop.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);

    var firstInput = dialog.querySelector('input, select, textarea, button:not(.modal-close)');
    if (firstInput) firstInput.focus();

    var lastFocusable = null;
    dialog.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); closeModal(); return; }
      if (e.key === 'Tab') {
        var focusable = dialog.querySelectorAll('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    if (opts.onOpen) opts.onOpen(dialog);
    return dialog;
  };

  /* ---------- Поля форм ---------- */
  ns.field = function (label, name, type, required) {
    type = type || 'text';
    return '<div class="field">'
      + '<label class="field-label" for="f-' + name + '">' + ns.esc(label) + (required ? ' <span class="req">*</span>' : '') + '</label>'
      + (type === 'textarea'
        ? '<textarea id="f-' + name + '" name="' + name + '" ' + (required ? 'required' : '') + '></textarea>'
        : type === 'select'
          ? '<select id="f-' + name + '" name="' + name + '" ' + (required ? 'required' : '') + '><option value="">Выберите…</option></select>'
          : '<input id="f-' + name + '" name="' + name + '" type="' + type + '" ' + (required ? 'required' : '') + '/>')
      + '</div>';
  };

  /* ---------- Базовая валидация ---------- */
  ns.validateForm = function (form) {
    var fields = form.querySelectorAll('[required]');
    var firstInvalid = null;
    fields.forEach(function (f) {
      if (f.disabled) return;
      var ok;
      if (f.type === 'radio') {
        ok = !!form.querySelector('input[type="radio"][name="' + f.name + '"]:checked');
      } else if (f.type === 'checkbox') {
        ok = f.checked;
      } else {
        ok = f.value && String(f.value).trim().length > 0;
      }
      if (f.type !== 'radio') f.style.borderColor = ok ? '' : '#a93b33';
      if (!ok && !firstInvalid) firstInvalid = f;
    });
    if (firstInvalid) {
      firstInvalid.focus();
      ns.toast('Заполните обязательные поля');
      return false;
    }
    return true;
  };

  ns.collectForm = function (form) {
    var data = {};
    form.querySelectorAll('[name]').forEach(function (f) {
      if (f.disabled) return;
      if (f.type === 'checkbox') {
        if (f.value && f.value !== 'on') {
          if (f.checked) (data[f.name] || (data[f.name] = [])).push(f.value);
        } else data[f.name] = f.checked;
        return;
      }
      if (f.type === 'radio' && !f.checked) return;
      if (f.name) data[f.name] = f.value.trim();
    });
    return data;
  };

  /* ---------- Единая отправка заявки (точка для WP-REST) ---------- */
  ns.submitRequest = function (payload, opts) {
    opts = opts || {};
    payload = payload || {};
    var requestId = ns.store.newRequestId();
    var label = payload.product || opts.title || 'Заявка с сайта';
    var sku = payload.sku || '';
    var total = payload.totalWeightKg ? ns.formatKg(payload.totalWeightKg) : (payload.quantity || '');
    var price = payload.totalPrice ? ns.formatPrice(payload.totalPrice) : '';
    ns.store.addRequest({
      id: requestId,
      date: ns.todayISO(),
      product: label,
      sku: sku,
      total: total,
      price: price,
      status: 'new',
      statusText: 'Новая заявка',
      payload: payload
    });
    ns.store.addMessage({
      from: 'manager',
      author: 'Менеджер KRASKU',
      subject: opts.messageSubject || ('Заявка ' + requestId + ' принята'),
      text: opts.messageText || ('Спасибо! Заявка № ' + requestId + ' принята. Менеджер свяжется с вами в течение рабочего дня.'),
      date: ns.todayISO(),
      read: false
    });
    /* Для WP-REST здесь будет POST на /wp-json/krasku/v1/request */
    console.log('[KRASKU] Заявка сформирована (payload для API):', JSON.stringify(payload, null, 2));
    ns.toast(opts.toast || 'Заявка отправлена. Менеджер свяжется с вами.');
    return requestId;
  };

  /* ---------- Универсальная заявка в модале ---------- */
  ns.requestModal = function (opts) {
    opts = opts || {};
    var summary = opts.summary || '';
    var body = (summary ? '<div class="req-summary">' + summary + '</div>' : '')
      + '<form data-request-form novalidate>'
      + '<div class="form-grid">'
      + ns.field('ФИО', 'name', 'text', true)
      + ns.field('Телефон', 'phone', 'tel', true)
      + ns.field('Email', 'email', 'email', true)
      + ns.field('Организация', 'org')
      + '<div class="span-2">' + ns.field('Комментарий', 'comment', 'textarea') + '</div>'
      + '</div></form>';

    var dialog = ns.openModal({
      title: opts.title || 'Отправить заявку',
      desc: opts.desc || 'Менеджер свяжется с вами в течение рабочего дня и подтвердит параметры заказа.',
      lg: true,
      body: body,
      foot: '<button type="submit" class="btn btn-primary btn-lg btn-block" data-request-submit>Отправить заявку</button>'
    });

    dialog.querySelector('[data-request-submit]').addEventListener('click', function (e) {
      e.preventDefault();
      var form = dialog.querySelector('[data-request-form]');
      if (!ns.validateForm(form)) return;
      var data = ns.collectForm(form);
      var payload = Object.assign({}, opts.payload || {}, data, {
        submittedAt: new Date().toISOString(),
        source: opts.source || 'modal'
      });
      ns.submitRequest(payload, { title: opts.title || 'Заявка' });
      ns.closeModal();
    });
  };

  /* ---------- Единая заявка по нескольким товарам ---------- */
  ns.requestListModal = function (items) {
    items = Array.isArray(items) ? items : [];
    if (!items.length) { ns.toast('Добавьте хотя бы один товар в список заявки'); return; }
    var summary = '<div class="req-summary request-list-summary">'
      + '<b>Состав заявки</b>'
      + items.map(function (item) {
        var details = [];
        if (item.sku) details.push('Артикул: ' + ns.esc(item.sku));
        if (item.colorSystem) details.push('Цветовая система: ' + ns.esc(item.colorSystem));
        if (item.packaging && Object.keys(item.packaging).length) details.push('Фасовки: ' + ns.esc(Object.keys(item.packaging).filter(function (key) { return item.packaging[key]; }).map(function (key) { return key + ' × ' + item.packaging[key]; }).join(', ') || 'уточняется'));
        return '<div><strong>' + ns.esc(item.product) + '</strong><span>' + (details.join(' · ') || 'Параметры уточнит менеджер') + '</span></div>';
      }).join('')
      + '</div>';
    var body = summary
      + '<form data-request-form novalidate><div class="form-grid">'
      + ns.field('ФИО', 'name', 'text', true)
      + ns.field('Телефон', 'phone', 'tel', true)
      + ns.field('Email', 'email', 'email', true)
      + ns.field('Организация', 'org')
      + '<div class="span-2"><fieldset class="config-group"><legend>Получение</legend><div class="config-options">'
      + '<label class="radio config-radio"><input type="radio" name="delivery" value="Самовывоз" checked><span class="box">' + ns.ICONS.check + '</span><span>Самовывоз</span></label>'
      + '<label class="radio config-radio"><input type="radio" name="delivery" value="Доставка"><span class="box">' + ns.ICONS.check + '</span><span>Доставка</span></label>'
      + '</div></fieldset></div>'
      + '<div class="span-2" data-request-list-address hidden>' + ns.field('Адрес доставки', 'address', 'text', false) + '</div>'
      + '<div class="span-2">' + ns.field('Комментарий', 'comment', 'textarea') + '</div>'
      + attachmentField()
      + '</div></form>';
    var dialog = ns.openModal({
      title: 'Отправить заявку менеджеру',
      desc: 'Менеджер уточнит параметры всех позиций, стоимость и условия поставки. Оплата на сайте не производится.',
      lg: true,
      body: body,
      foot: '<button type="submit" class="btn btn-primary btn-lg btn-block" data-request-submit>Отправить заявку</button>'
    });
    var form = dialog.querySelector('[data-request-form]');
    var address = dialog.querySelector('[data-request-list-address]');
    var addressInput = address.querySelector('input');
    form.addEventListener('change', function () {
      var delivery = form.querySelector('[name="delivery"]:checked').value === 'Доставка';
      address.hidden = !delivery;
      addressInput.required = delivery;
      addressInput.disabled = !delivery;
    });
    dialog.querySelector('[data-request-submit]').addEventListener('click', function (e) {
      e.preventDefault();
      if (!ns.validateForm(form)) return;
      var data = ns.collectForm(form);
      ns.submitRequest(Object.assign({}, data, {
        product: 'Заявка на несколько товаров (' + items.length + ')',
        items: items,
        submittedAt: new Date().toISOString(),
        source: 'request-list'
      }), { title: 'Заявка на несколько товаров' });
      ns.store.clearRequestList();
      ns.closeModal();
    });
  };

  /* ---------- Индивидуальный заказ: параметры комплекта + контакты ---------- */
  function configRadio(name, value, label, checked) {
    return '<label class="radio config-radio"><input type="radio" name="' + name + '" value="' + ns.esc(value) + '"' + (checked ? ' checked' : '') + ' required><span class="box">' + ns.ICONS.check + '</span><span>' + ns.esc(label) + '</span></label>';
  }

  function configCheckbox(name, value, label) {
    return '<label class="radio config-radio"><input type="checkbox" name="' + name + '" value="' + ns.esc(value) + '"><span class="box">' + ns.ICONS.check + '</span><span>' + ns.esc(label) + '</span></label>';
  }

  function configGroup(label, content) {
    return '<fieldset class="config-group"><legend>' + ns.esc(label) + '</legend><div class="config-options">' + content + '</div></fieldset>';
  }

  function isWaterProduct(product) {
    return product && /(водн|акрил)/i.test(product.solubility || product.base || '');
  }

  function productFormKind(product) {
    var name = (product && product.name) || '';
    if (isWaterProduct(product)) return 'water';
    if (/грунт[- ]?эмал/i.test(name)) return 'ground-enamel';
    if (/шпатл/i.test(name)) return 'putty';
    return 'organic';
  }

  function surfaceOptions(name) {
    return configCheckbox(name, 'concrete', 'Бетон')
      + configCheckbox(name, 'wood', 'Дерево')
      + configCheckbox(name, 'metal', 'Металл');
  }

  function configurationFields(product) {
    var kind = productFormKind(product);
    if (kind === 'water') {
      return configGroup('Тип водной продукции',
        configRadio('configurationWaterProduct', 'interior', 'Краска интерьерная', true)
        + configRadio('configurationWaterProduct', 'facade', 'Краска фасадная')
        + configRadio('configurationWaterProduct', 'wood', 'Краска для дерева'))
        + configGroup('Выберите комплектацию',
        configRadio('configurationWaterMode', 'water-self', 'Самостоятельный товар', true)
        + configRadio('configurationWaterMode', 'water-complex', 'Выбрать комплекс + (краска-эмаль + грунт)'))
        + '<div data-config-mode-control="configurationWaterMode" data-config-when="water-complex" hidden>'
        + configGroup('Уровень комплектации', configRadio('configurationTier', 'economy', 'Эконом', true) + configRadio('configurationTier', 'master', 'Мастер') + configRadio('configurationTier', 'profi', 'Профи'))
        + configGroup('Область работ', configRadio('configurationWorkArea', 'interior', 'Внутренние', true) + configRadio('configurationWorkArea', 'exterior', 'Наружные'))
        + configGroup('Поверхность', surfaceOptions('configurationSurface'))
        + '</div>';
    }
    if (kind === 'ground-enamel') {
      return configGroup('Выберите комплектацию', configRadio('configurationGroundEnamelMode', 'ground-enamel', 'Грунт-эмаль', true))
        + configGroup('Поверхность', surfaceOptions('configurationGroundEnamelSurface'))
        + configGroup('Ржавчина', configRadio('configurationRust', 'yes', 'Есть', true) + configRadio('configurationRust', 'no', 'Нет'));
    }
    if (kind === 'putty') {
      return configGroup('Выберите комплектацию', configRadio('configurationPuttyMode', 'putty', 'Шпатлёвка', true))
        + configGroup('Поверхность', surfaceOptions('configurationPuttySurface'));
    }
    return configGroup('Выберите комплектацию',
      configRadio('configurationOrganicMode', 'organic-self', 'Самостоятельный товар', true)
      + configRadio('configurationOrganicMode', 'enamel-kit', 'Выбрать комплект + (отвердитель, растворитель)')
      + configRadio('configurationOrganicMode', 'enamel-system', 'Выбрать комплекс + (комплект + совместимый грунт)'))
      + configGroup('Поверхность', surfaceOptions('configurationSurface'));
  }

  ns.productConfigurationModal = function (opts) {
    opts = opts || {};
    var body = '<form data-config-request-form novalidate>'
      + '<div class="configuration-steps" aria-label="Этапы оформления"><span class="is-active" data-config-indicator="1">1. Комплектация</span><span data-config-indicator="2">2. Контакты</span></div>'
      + '<section class="config-step is-active" data-config-step="1">'
      + (opts.summary ? '<div class="req-summary">' + opts.summary + '</div>' : '')
      + '<h4>Комплектация</h4>'
      + ns.field('Марка', 'configurationBrand', 'text', true)
      + '<p class="config-intro">Выберите комплектацию — совместимые компоненты подберёт менеджер.</p>'
      + configurationFields(opts.product)
      + configGroup('Получение', configRadio('configurationDelivery', 'pickup', 'Самовывоз', true) + configRadio('configurationDelivery', 'delivery', 'Доставка'))
      + '<div class="config-address" data-config-address hidden>' + ns.field('Адрес доставки', 'configurationAddress', 'text', false) + '</div>'
      + '</section>'
      + '<section class="config-step" data-config-step="2" hidden><h4>Контакты</h4><div class="form-grid">'
      + ns.field('ФИО', 'name', 'text', true)
      + ns.field('Телефон', 'phone', 'tel', true)
      + ns.field('Email', 'email', 'email', true)
      + ns.field('Организация', 'org')
      + '<div class="span-2">' + ns.field('Комментарий', 'comment', 'textarea') + '</div>'
      + '<div class="span-2 field"><label class="field-label" for="f-attachment">Прикрепить файл / ТЗ / реквизиты <span class="field-hint">(необязательно)</span></label><input id="f-attachment" name="attachment" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"></div>'
      + '</div></section></form>';

    var dialog = ns.openModal({
      title: opts.title || 'Индивидуальный заказ',
      desc: 'Заполните параметры – менеджер рассчитает стоимость и выставит счет с НДС.',
      lg: true,
      body: body,
      foot: '<button type="button" class="btn btn-outline btn-lg" data-config-back hidden>Назад</button><button type="button" class="btn btn-primary btn-lg" data-config-next>Продолжить</button><button type="button" class="btn btn-primary btn-lg" data-config-submit hidden>Отправить заявку</button>'
    });
    var form = dialog.querySelector('[data-config-request-form]');
    var next = dialog.querySelector('[data-config-next]');
    var back = dialog.querySelector('[data-config-back]');
    var submit = dialog.querySelector('[data-config-submit]');

    function syncConditional() {
      form.querySelectorAll('[data-config-mode-control]').forEach(function (section) {
        var control = section.getAttribute('data-config-mode-control');
        var selected = form.querySelector('[name="' + control + '"]:checked');
        var active = selected && selected.value === section.getAttribute('data-config-when');
        section.hidden = !active;
        section.querySelectorAll('input, select, textarea').forEach(function (input) { input.disabled = !active; });
      });
      var delivery = form.querySelector('[name="configurationDelivery"]:checked');
      var address = form.querySelector('[data-config-address]');
      var addressInput = address.querySelector('input');
      var deliveryActive = delivery && delivery.value === 'delivery';
      address.hidden = !deliveryActive;
      addressInput.required = !!deliveryActive;
      addressInput.disabled = !deliveryActive;
    }

    function setStep(step) {
      form.querySelectorAll('[data-config-step]').forEach(function (section) {
        var active = Number(section.getAttribute('data-config-step')) === step;
        section.hidden = !active;
        section.classList.toggle('is-active', active);
      });
      dialog.querySelectorAll('[data-config-indicator]').forEach(function (indicator) {
        indicator.classList.toggle('is-active', Number(indicator.getAttribute('data-config-indicator')) === step);
      });
      back.hidden = step === 1;
      next.hidden = step !== 1;
      submit.hidden = step !== 2;
      var focus = form.querySelector('[data-config-step="' + step + '"] input, [data-config-step="' + step + '"] textarea');
      if (focus) focus.focus();
    }

    form.addEventListener('change', syncConditional);
    next.addEventListener('click', function () {
      if (!ns.validateForm(form.querySelector('[data-config-step="1"]'))) return;
      setStep(2);
    });
    back.addEventListener('click', function () { setStep(1); });
    submit.addEventListener('click', function () {
      if (!ns.validateForm(form.querySelector('[data-config-step="2"]'))) return;
      var data = ns.collectForm(form);
      var configuration = {
        productKind: productFormKind(opts.product),
        waterMode: data.configurationWaterMode || '',
        waterProduct: data.configurationWaterProduct || '',
        organicMode: data.configurationOrganicMode || '',
        groundEnamelMode: data.configurationGroundEnamelMode || '',
        puttyMode: data.configurationPuttyMode || '',
        brand: data.configurationBrand || '',
        tier: data.configurationTier || '',
        workArea: data.configurationWorkArea || '',
        surface: data.configurationSurface || [],
        rust: data.configurationRust || '',
        delivery: data.configurationDelivery,
        address: data.configurationAddress || '',
        attachment: data.attachment || ''
      };
      ['configurationBrand', 'configurationWaterProduct', 'configurationWaterMode', 'configurationOrganicMode', 'configurationGroundEnamelMode', 'configurationPuttyMode', 'configurationTier', 'configurationSurface', 'configurationRust', 'configurationDelivery', 'configurationAddress', 'attachment'].forEach(function (key) { delete data[key]; });
      var payload = Object.assign({}, opts.payload || {}, data, { configuration: configuration, submittedAt: new Date().toISOString(), source: 'product-configuration-modal' });
      ns.submitRequest(payload, { title: opts.title || 'Индивидуальный заказ' });
      ns.closeModal();
    });
    syncConditional();
    var brandInput = form.querySelector('[name="configurationBrand"]');
    if (brandInput) brandInput.value = (opts.product && (opts.product.brand || opts.product.name)) || '';
  };

  function attachmentField() {
    return '<div class="span-2 field"><label class="field-label" for="f-request-attachment">Прикрепить файл / ТЗ / реквизиты <span class="field-hint">(необязательно)</span></label><input id="f-request-attachment" name="attachment" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"></div>';
  }

  function contactFields() {
    return '<div class="form-grid">'
      + ns.field('ФИО', 'name', 'text', true)
      + ns.field('Телефон', 'phone', 'tel', true)
      + ns.field('Email', 'email', 'email', true)
      + ns.field('Организация', 'org')
      + '<div class="span-2">' + ns.field('Комментарий', 'comment', 'textarea') + '</div>'
      + attachmentField()
      + '</div>';
  }

  function deliveryFields(prefix) {
    return configGroup('Получение', configRadio(prefix + 'Delivery', 'pickup', 'Без доставки', true) + configRadio(prefix + 'Delivery', 'delivery', 'С доставкой'))
      + '<div class="config-address" data-delivery-address="' + prefix + '" hidden>' + ns.field('Адрес доставки', prefix + 'Address', 'text', false) + '</div>';
  }

  function enableConditional(form) {
    form.querySelectorAll('[data-config-mode-control]').forEach(function (section) {
      var selected = form.querySelector('[name="' + section.getAttribute('data-config-mode-control') + '"]:checked');
      var active = selected && selected.value === section.getAttribute('data-config-when');
      section.hidden = !active;
      section.querySelectorAll('input, select, textarea').forEach(function (input) { input.disabled = !active; });
    });
    form.querySelectorAll('[data-delivery-address]').forEach(function (address) {
      var prefix = address.getAttribute('data-delivery-address');
      var selected = form.querySelector('[name="' + prefix + 'Delivery"]:checked');
      var active = selected && selected.value === 'delivery';
      var input = address.querySelector('input');
      address.hidden = !active;
      input.required = !!active;
      input.disabled = !active;
    });
  }

  function submitStandaloneConfiguration(dialog, source, title, configurationKeys) {
    var form = dialog.querySelector('[data-standalone-config-form]');
    dialog.querySelector('[data-standalone-config-submit]').addEventListener('click', function () {
      if (!ns.validateForm(form)) return;
      var data = ns.collectForm(form);
      var configuration = {};
      configurationKeys.forEach(function (key) {
        configuration[key] = data[key] || '';
        delete data[key];
      });
      var payload = Object.assign({}, data, { configuration: configuration, submittedAt: new Date().toISOString(), source: source });
      ns.submitRequest(payload, { title: title });
      ns.closeModal();
    });
    form.addEventListener('change', function () { enableConditional(form); });
    enableConditional(form);
  }

  ns.technologistModal = function () {
    var body = '<form data-standalone-config-form novalidate>'
      + '<h4>Что требуется подобрать</h4><p class="config-intro">Выберите вариант — технолог подберёт совместимые материалы без поиска по каталогу.</p>'
      + configGroup('Выберите комплектацию',
        configRadio('technologistMode', 'single', 'Самостоятельный товар', true)
        + configRadio('technologistMode', 'water-complex', 'Комплекс: краска, эмаль или лазурь')
        + configRadio('technologistMode', 'organic-kit', 'Комплект эмали')
        + configRadio('technologistMode', 'organic-complex', 'Комплекс эмаль + грунт')
        + configRadio('technologistMode', 'ground-enamel', 'Грунт-эмаль')
        + configRadio('technologistMode', 'putty', 'Шпатлёвка'))
      + '<div data-config-mode-control="technologistMode" data-config-when="single">' + ns.field('Марка или тип материала', 'technologistProduct', 'text', true) + '</div>'
      + '<div data-config-mode-control="technologistMode" data-config-when="water-complex" hidden>'
      + configGroup('Уровень комплектации', configRadio('technologistTier', 'economy', 'Эконом', true) + configRadio('technologistTier', 'master', 'Мастер') + configRadio('technologistTier', 'profi', 'Профи'))
      + configGroup('Область работ', configRadio('technologistWorkArea', 'interior', 'Внутренние', true) + configRadio('technologistWorkArea', 'exterior', 'Наружные'))
      + configGroup('Поверхность', configRadio('technologistWaterSurface', 'concrete-brick', 'Бетон / кирпич', true) + configRadio('technologistWaterSurface', 'plaster-putty', 'Штукатурка / шпатлёвка') + configRadio('technologistWaterSurface', 'wood', 'Дерево') + configRadio('technologistWaterSurface', 'metal', 'Металл'))
      + '</div>'
      + '<div data-config-mode-control="technologistMode" data-config-when="organic-kit" hidden>' + ns.field('Марка эмали', 'technologistEnamelKitBrand', 'text', true) + '</div>'
      + '<div data-config-mode-control="technologistMode" data-config-when="organic-complex" hidden>' + ns.field('Марка эмали', 'technologistEnamelSystemBrand', 'text', true) + configGroup('Поверхность', surfaceOptions('technologistEnamelSurface')) + '</div>'
      + '<div data-config-mode-control="technologistMode" data-config-when="ground-enamel" hidden>' + configGroup('Поверхность', surfaceOptions('technologistGroundSurface')) + configGroup('Ржавчина', configRadio('technologistRust', 'yes', 'Есть', true) + configRadio('technologistRust', 'no', 'Нет')) + '</div>'
      + '<div data-config-mode-control="technologistMode" data-config-when="putty" hidden>' + configGroup('Поверхность', surfaceOptions('technologistPuttySurface')) + '</div>'
      + deliveryFields('technologist')
      + '<h4>Контакты</h4>' + contactFields() + '</form>';
    var dialog = ns.openModal({
      title: 'Подберём краску под вашу задачу',
      desc: 'Заполните параметры — менеджер рассчитает стоимость и выставит счёт с НДС.',
      lg: true,
      body: body,
      foot: '<button type="button" class="btn btn-primary btn-lg btn-block" data-standalone-config-submit>Отправить заявку</button>'
    });
    submitStandaloneConfiguration(dialog, 'technologist-modal', 'Подберём краску под вашу задачу', ['technologistMode', 'technologistProduct', 'technologistTier', 'technologistWorkArea', 'technologistWaterSurface', 'technologistEnamelKitBrand', 'technologistEnamelSystemBrand', 'technologistEnamelSurface', 'technologistGroundSurface', 'technologistPuttySurface', 'technologistRust', 'technologistDelivery', 'technologistAddress', 'attachment']);
  };

  ns.invoiceModal = function () {
    var body = '<form data-standalone-config-form novalidate>'
      + ns.field('Указать марку', 'invoiceBrand', 'text', true)
      + configGroup('Выберите комплектацию', configRadio('invoiceMode', 'kit', 'Выбрать комплект + (отвердитель, растворитель)', true) + configRadio('invoiceMode', 'complex', 'Выбрать комплекс + (комплект + совместимый грунт)'))
      + deliveryFields('invoice')
      + '<h4>Контакты</h4>' + contactFields() + '</form>';
    var dialog = ns.openModal({
      title: 'Запросить счет с НДС',
      desc: 'Заполните параметры – менеджер рассчитает стоимость и выставит счет с НДС.',
      lg: true,
      body: body,
      foot: '<button type="button" class="btn btn-primary btn-lg btn-block" data-standalone-config-submit>Запросить счет с НДС</button>'
    });
    submitStandaloneConfiguration(dialog, 'invoice-modal', 'Запросить счёт с НДС', ['invoiceBrand', 'invoiceMode', 'invoiceDelivery', 'invoiceAddress', 'attachment']);
  };

})(window.KRASKU);

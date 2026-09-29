# WP-INTEGRATION.md — план натяжки KRASKU.RU на WordPress

Цель: перенести статический сайт (HTML + vanilla JS + localStorage) на
WordPress так, чтобы **не переписывать вёрстку и клиентскую логику**, а
только заменить источник данных и построение ссылок. Для этого в кодовой
базе выделены два слоя-адаптера:

- **`js/api.js`** — слой доступа к данным (сейчас: mock-массивы из
  `js/data.js`, адаптер `'mock'`). При миграции внутренности методов
  заменяются на `fetch`-запросы к REST API WordPress, контракт для UI
  сохраняется.
- **`js/url.js`** — единый построитель ссылок `ns.url(route, arg)`.
  Все ссылки в JS уже идут через него (проверено: `grep -rn '\.html' js/`
  не даёт прямых href в компонентах, кроме карты ROUTES).

---

## 1. Архитектура после рефакторинга

Порядок подключения скриптов (одинаков во всех 18 страницах):

```
data.js      — mock-данные и генераторы SVG/спецификаций (останется только для 'mock')
api.js       — NS.api: единственная точка чтения контента
url.js       — NS.url: построение ссылок
store.js     — localStorage: избранное, сравнение, заявки, сообщения, чат
ui.js        — модалки, табы, FAQ, формы, NS.submitRequest (точка для REST-заявок)
layout.js    — шапка, подвал, мобильное меню, поиск
filters.js   — карточка товара, категория с фильтрами
product.js   — страница товара
compare.js   — страница сравнения
main.js      — диспетчер страниц (boot по `body[data-page]`) и рендеры
```

Правило: **UI никогда не обращается к `ns.products/ns.categories/...`
напрямую** — только через `ns.api.*`. Единственное место с прямым доступом
к данным — внутренности `api.js`.

### Контракт `ns.api` (должен остаться неизменным при натяжке)

| Метод | Возвращает | Заменяется на REST-эндпоинт |
|---|---|---|
| `getCategories()` | массив `{slug,name,desc,count}` | `/wp/v2/product_cat` + подсчёт |
| `getProducts()` | все товары | `/wp/v2/product?_embed` (пагинация) |
| `getProduct(id)` | товар по id | `/wp/v2/product/{id}?_embed` |
| `getProductBySku(sku)` | товар по артикулу | `/?product_sku={sku}` |
| `getProductsByCategory(name)` | товары категории | `/wp/v2/product?product_cat={slug}` |
| `getCategoryBySlug(slug)` | категория | `/wp/v2/product_cat?slug={slug}` |
| `getArticles()` | статьи | `/wp/v2/posts` |
| `getArticle(id)` | статья | `/wp/v2/posts/{id}` |
| `getFaq()` | FAQ | CPT `faq` (см. §5) |
| `getDocs()` | документы | CPT `doc` или медиафайлы |
| `getDocCats()` | рубрики документов | таксономия `doc_cat` |
| `getPartners()` | логотипы партнёров | CPT `partner` |
| `getRequestsSeed()`, `getMessagesSeed()`, `getChatSeed()` | mock-сиды для ЛК | удалить, читать реальные данные |
| `getSpecs(p)`, `getProductDescription(p)` | спека/описание | из ACF-полей товара (см. §4) |
| `getDeliveryInfo()`, `getPackages()`, `getPackageSets()` | доставка/фасовки/комплекты | настройки сайта (настраиваемые) |
| `search(q)` | товары по запросу | `/wp/v2/product?search={q}` |

Важно: `getSpecs`/`getProductDescription`/`search` сейчас являются чистыми
функциями от данных. При миграции спецификации и описания переносятся в
ACF-поля товара (тогда `getSpecs(p)`/`getProductDescription(p)` читают
`p.acf.*`), а `search` уходит на сервер.

---

## 2. Страницы → шаблоны темы

Каждая страница сейчас имеет `<body data-page="…">` — это же значение
использует `main.js` для диспетчеризации. В WordPress это значение должен
проставлять шаблон (`body_class`).

| Статический файл | data-page | WordPress шаблон |
|---|---|---|
| `index.html` | home | `front-page.php` |
| `catalog.html` | catalog | `page-templates/catalog.php` (или `archive-product.php`) |
| `category.html?cat=` | category | `taxonomy-product_cat.php` |
| `product.html?id=` | product | `single-product.php` |
| `articles.html` | articles | `archive.php` (для `post`) |
| `article.html?id=` | article | `single.php` |
| `faq.html` | faq | `page-templates/faq.php` |
| `docs.html?cat=` | docs | `archive-doc.php` |
| `about.html` | about | `page-templates/about.php` |
| `contacts.html` | contacts | `page-templates/contacts.php` |
| `tinting.html` | tinting | `page-templates/tinting.php` |
| `account.html` | account | `page-templates/account.php` |
| `favorites.html` | favorites | `page-templates/favorites.php` |
| `compare.html` | compare | `page-templates/compare.php` |
| `requests.html` | requests | `page-templates/requests.php` |
| `chat.html` | chat | `page-templates/chat.php` |
| `search.html?q=` | search | `search.php` |
| `404.html` | 404 | `404.php` |

Все шаблоны включают один общий скелет (шапку-слот `[data-slot="header"]`,
`<main>`, `[data-slot="footer"]`) и подключают JS в порядке §1 — можно
вынести в `functions.php` через `wp_enqueue_script` с правильным порядком
зависимостей.

### Как «съесть» HTML в шаблонах
1. Статические блоки (разметка секций, форм, слайдеров) копируются в
   шаблоны как есть.
2. Динамические контейнеры (`#catalogGrid`, `#productGrid`, `#homeCats`,
   `#productRoot`, `#docsGrid`, …) остаются пустыми дивами — их наполняет
   JS через `ns.api` (сейчас — из mock, после миграции — из REST).
3. Точки, где данные подставляются сервером напрямую (title, хлебные
   крошки, SEO-описания), заполняются через `the_title()`,
   `yoast/wp_head` и т.п. вместо JS — это отдельный этап, не обязательный
   для первой версии.

---

## 3. Подключение ассетов (functions.php)

```php
add_action( 'wp_enqueue_scripts', 'krasku_assets' );
function krasku_assets() {
    $base = get_stylesheet_directory_uri() . '/assets';

    wp_enqueue_style( 'krasku', $base . '/css/styles.css', [], '1.0' );

    $deps = [];
    foreach ( [ 'data.js', 'api.js', 'url.js', 'store.js', 'ui.js',
                'layout.js', 'filters.js', 'product.js', 'compare.js',
                'main.js' ] as $i => $f ) {
        if ( $i > 0 ) $deps[] = $prev; // порядок = зависимость
        $prev = 'krasku-' . basename( $f, '.js' );
        wp_enqueue_script( $prev, $base . '/js/' . $f, $i > 0 ? [ $deps[ $i - 1 ] ] : [], '1.0', true );
    }

    // Базовый URL для REST (чтобы работал не только в корне)
    wp_localize_script( 'krasku-api', 'KRASKU_CONFIG', [
        'restUrl'  => esc_url_raw( rest_url() ),
        'nonce'    => wp_create_nonce( 'wp_rest' ),
        'homeUrl'  => esc_url_raw( home_url( '/' ) ),
    ] );
}
```

Версию темы (`'1.0'`) и дату выпуска верните вручную при каждом релизе,
иначе браузер закеширует старые файлы.

---

## 4. Модель данных: CPT «Товар» и ACF

### 4.1 Регистрация CPT (functions.php)

```php
add_action( 'init', 'krasku_post_types' );
function krasku_post_types() {
    register_post_type( 'product', [
        'labels'      => [ 'name' => 'Товары', 'singular_name' => 'Товар' ],
        'public'      => true,
        'has_archive' => true,
        'rewrite'     => [ 'slug' => 'product' ],
        'menu_icon'   => 'dashicons-admin-multisite',
        'supports'    => [ 'title', 'editor', 'thumbnail', 'excerpt' ],
    ] );
    register_post_type( 'faq', [
        'labels' => [ 'name' => 'FAQ', 'singular_name' => 'Вопрос' ],
        'public' => true, 'rewrite' => [ 'slug' => 'faq' ],
        'supports' => [ 'title', 'editor' ],
    ] );
    register_post_type( 'doc', [
        'labels' => [ 'name' => 'Документы', 'singular_name' => 'Документ' ],
        'public' => true, 'rewrite' => [ 'slug' => 'docs' ],
        'supports' => [ 'title', 'editor', 'thumbnail' ],
    ] );
    register_post_type( 'partner', [
        'labels' => [ 'name' => 'Партнёры', 'singular_name' => 'Партнёр' ],
        'public' => true, 'rewrite' => [ 'slug' => 'partners' ],
        'supports' => [ 'title' ],
    ] );
}

// Таксономии
add_action( 'init', 'krasku_taxonomies' );
function krasku_taxonomies() {
    $taxes = [ 'product_cat' => [ 'name' => 'Категории', 'singular' => 'Категория' ] ];
    foreach ( $taxes as $key => $t ) {
        register_taxonomy( $key, 'product', [
            'label' => $t['name'], 'hierarchical' => true,
            'rewrite' => [ 'slug' => 'category' ], 'show_admin_column' => true,
        ] );
    }
    // Фильтры на странице категории — как отдельные таксономии:
    $filters = [ 'brand' => 'Марка', 'type' => 'Тип продукта',
                 'coating' => 'Тип покрытия', 'substrate' => 'Подложка',
                 'purpose' => 'Назначение', 'solubility' => 'Растворимость' ];
    foreach ( $filters as $key => $label ) {
        register_taxonomy( $key, 'product', [
            'label' => $label, 'hierarchical' => false,
            'show_in_rest' => true, 'show_admin_column' => true,
        ] );
    }
    register_taxonomy( 'doc_cat', 'doc', [ 'label' => 'Рубрики документов',
        'hierarchical' => true, 'show_admin_column' => true ] );
}
```

### 4.2 Поля товара (ACF Pro — field group `product`)

Прямое соответствие полям mock-данных (строки 153–174 `data.js`):

| Поле mock | ACF-поле | Тип |
|---|---|---|
| `id` | `post ID` | — |
| `name` | `post_title` | текст |
| `sku` | `sku` | текст |
| `category` | `product_cat` (таксономия) | выбор |
| `brand, type, coating, substrate, purpose, solubility` | таксономии §4.1 | выбор |
| `surfaces` | `surfaces` | чекбокс: «Металл», «Дерево», «Бетон», «Дорожная», «Интерьерная», «Фасадная»; можно выбрать несколько |
| `pricePerKg` | `price_per_kg` | число |
| `stock` | `in_stock` | true/false |
| `packaging` | `packaging_available` | повторяемое (1, 10, 15, 30 кг) |
| `colorSystems` | `color_systems` | чекбокс (RAL, ГОСТ, NCS) |
| `paintFor` | `paint_for` | текст |
| `image` | `_thumbnail_id` | изображение |
| — | `specs` (группа: расход, время высыхания, t° нанесения, t° эксплуатации, нелетучие) | повторяемое |
| — | `description` (текст, преимущества, доп.) | группа |

Спецификации и описания перестанут генерироваться в JS — они станут
полями в админке. `ns.api.getSpecs(p)` и `ns.api.getProductDescription(p)`
тогда просто читают `p.acf`.

### 4.2.1 Двухэтапный каталог

Создайте на странице настроек ACF поле `surface_catalogue_enabled` типа
true/false. Его включают только после того, как для всех опубликованных
товаров заполнено поле `surfaces`. В данные, которые шаблон передаёт в
`window.KRASKU.catalogSnapshot`, добавьте флаг (его значение формируется
в PHP через `get_field('surface_catalogue_enabled', 'option')`):

```js
catalogConfig: { surfaceCatalogueEnabled: true }
```

Поле `surfaces` возвращается массивом названий, например
`['Металл', 'Дерево']`. Пустой массив означает, что товар не участвует в
каталоге по поверхности.

### 4.3 REST-адаптер в `js/api.js` (схема, первая версия)

```js
var rest = {
  _get: function (url) {
    return fetch(KRASKU_CONFIG.restUrl + url, { headers: { 'X-WP-Nonce': KRASKU_CONFIG.nonce } })
      .then(function (r) { return r.json(); });
  },

  getCategories: function () {
    return rest._get('wp/v2/product_cat?per_page=100&_fields=slug,name,description').then(function (rows) {
      return rows.map(function (c) {
        return { slug: c.slug, name: c.name, desc: c.description || '', count: c.count || 0 };
      });
    });
  },

  getProducts: function () {
    return rest._get('wp/v2/product?per_page=100&_fields=id,slug,title,acf').then(function (rows) {
      return rows.map(rest._mapProduct);
    });
  },

  _mapProduct: function (row) {
    var a = row.acf || {};
    return {
      id: row.id, slug: row.slug, name: row.title.rendered,
      sku: a.sku, category: a.category_name, brand: a.brand,
      type: a.type, coating: a.coating, substrate: a.substrate,
      surfaces: Array.isArray(a.surfaces) ? a.surfaces : [],
      purpose: a.purpose, solubility: a.solubility,
      pricePerKg: +a.price_per_kg, stock: !!a.in_stock,
      packaging: a.packaging_available || [1, 10, 15, 30],
      colorSystems: a.color_systems || [],
      paintFor: a.paint_for || '',
      image: row._embedded && row._embedded['wp:featuredmedia'] ? row._embedded['wp:featuredmedia'][0].source_url : '',
      acf: a
    };
  }
};
```

⚠️ Проблема синхронности: **текущий UI синхронный** (`ns.api.getProducts()`
возвращает массив, `renderCategories` вызывается сразу). REST — асинхронный
(promise). На этапе натяжки проще всего держать гибрид:

1. На сервере в шаблонах выводить данные прямо в JS-переменные
   (`wp_localize_script` / JSON в `<script type="application/json">`),
   а `api.js` в адаптере `'wp-embedded'` читать их синхронно.
2. Либо обернуть UI в промисы (крупная доработка) — рекомендую только если
   планируется фильтрация/поиск на сервере.

Поэтому в `api.js` предусмотрен переключатель адаптера:
`ns.api.setAdapter('mock' | 'rest' | 'wp-embedded')` — `'wp-embedded'`
читает данные из JSON-блока, который отдаёт шаблон. Это самый короткий
путь без переписывания компонентов.

---

## 5. Формы и заявки → WordPress REST

Все отправки форм уже сходятся в **один** метод `ns.submitRequest(payload,
opts)` (`ui.js`). Сейчас он пишет в localStorage и делает
`console.log`. При натяжке достаточно добавить POST:

```js
fetch(KRASKU_CONFIG.restUrl + 'krasku/v1/request', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': KRASKU_CONFIG.nonce },
  body: JSON.stringify(payload)
});
```

На стороне PHP:

```php
add_action( 'rest_api_init', function () {
    register_rest_route( 'krasku/v1', '/request', [
        'methods'  => 'POST',
        'callback' => 'krasku_handle_request',
        'permission_callback' => '__return_true',
    ] );
} );

function krasku_handle_request( WP_REST_Request $req ) {
    $payload = $req->get_json_params();
    // 1. Сохранить заявку как post_type 'request' (или CPT-статус).
    // 2. Отправить письмо менеджеру (wp_mail) со всеми полями payload.
    // 3. Вернуть { ok: true, requestId: 'ЗК-...' }.
    return [ 'ok' => true ];
}
```

`payload` уже содержит структурированные данные: на товарной странице —
`product, sku, colorSystem, packaging, totalWeightKg, totalPrice, delivery,
url`; из формы — `name, phone, email, org, comment`; из сравнения —
`products[]`. Ничего менять в UI не нужно.

---

## 6. Ссылки: `js/url.js`

Все ссылки идут через `ns.url(route, arg)`. При переносе достаточно
заменить содержимое `ROUTES` на пермалинки:

```js
var ROUTES = {
  home: function () { return KRASKU_CONFIG.homeUrl; },
  catalog: function () { return KRASKU_CONFIG.homeUrl + 'catalog/'; },
  category: function (slug) { return KRASKU_CONFIG.homeUrl + 'category/' + slug + '/'; },
  product: function (id) { return KRASKU_CONFIG.homeUrl + 'product/' + id + '/'; },
  // ...остальные по аналогии
};
```

Полный список маршрутов см. в комментарии в `url.js`. Обратите внимание:
многие страницы передают `id` (числовой id товара/статьи из mock).
В WordPress это должен быть `post->ID`; в REST-адаптере `_mapProduct`
сохраняет `row.id` — совпадает автоматически.

---

## 7. Чеклист миграции

1. [ ] Перенести ассеты в тему (`css/`, `js/`), подключить через
      `functions.php` (§3).
2. [ ] Создать CPT: `product`, `faq`, `doc`, `partner` (§4.1).
3. [ ] Создать таксономии: `product_cat` + 6 фильтров + `doc_cat`.
4. [ ] Импортировать данные из `js/data.js` (скрипт-импортёр:
      JSON → WP REST, см. §8).
5. [ ] Настроить ACF-поля товара (§4.2).
6. [ ] Сделать шаблоны страниц с пустыми контейнерами (§2).
7. [ ] Настроить `url.js` под пермалинки (§6).
8. [ ] Включить адаптер `'wp-embedded'` в `api.js`, вывести данные через
      `wp_localize_script` (§4.3, п.1).
9. [ ] Перевести `ns.submitRequest` на REST POST + `wp_mail` (§5).
10. [ ] Реврайты `.htaccess`/nginx: старые адреса `*.html` → новые пермалинки
      (301) для SEO.

---

## 8. Импорт mock-данных (одноразовый скрипт)

Данные лежат в `js/data.js` в виде массивов `KRASKU.*`. Импортёр — обычный
PHP-скрипт/CLI, который:

- для каждой записи `KRASKU.products` создаёт `post_type=product`, заполняет
  ACF, привязывает таксономии, ставит `post_name` из `id` для стабильных
  URL;
- `KRASKU.categories` → `product_cat` (сохранить `slug`);
- `KRASKU.articles` → `post` (или CPT `article`);
- `KRASKU.faq`, `KRASKU.docs` (+ `doc_cat`), `KRASKU.partners` → свои CPT;
- `KRASKU.packages/packageSets/deliveryInfo` → опции темы
  (`update_option`) и отдавать через `wp_localize_script`.

Полезный ключ: `slug` категорий и `id` товаров из mock используются в URL
и localStorage (избранное/сравнение хранят id). Чтобы не потерять
пользовательские избранные списки, при импорте стоит сохранить те же
`post_name` (например, `product/P1/`), а id подменятся автоматически —
избранное по id обновится только если сохранить старые id. Рекомендуется
держать `slug` стабильным и, если нужно, мигрировать localStorage через
разовый JS-сниппет (маппинг старый id → новый id).

---

## 9. Что осталось нетронутым

- Вёрстка/стили: `css/` полностью переиспользуется.
- Компоненты и их инициализация (`main.js` `boot`, `product.js`,
  `filters.js`, `compare.js`, `chat.js`) не меняются.
- Логика избранного/сравнения/заявок в `store.js` — не меняется (это
  «личный кабинет» на клиенте; в перспективе можно заменить на аккаунт WP).
- SVG-генераторы изображений товаров/статей (`data.js`) — работают как есть,
  до появления реальных картинок.

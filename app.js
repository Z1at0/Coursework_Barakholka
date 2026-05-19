// ===== Состояние и константы =====
const STORAGE_KEY = 'barakholka.ads.v1';
const CATEGORIES = ['Электроника', 'Одежда', 'Мебель', 'Книги', 'Спорт', 'Детям', 'Авто', 'Другое'];
const CONDITIONS = ['Новое', 'Отличное', 'Хорошее', 'Удовлетворительное'];

const state = {
  ads: [],
  query: '',
  category: '',
  currency: 'RUB',
  rates: { RUB: 1 }, // курсы относительно RUB
};

// ===== Утилиты хранилища =====
const storage = {
  load() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  },
  save(ads) { localStorage.setItem(STORAGE_KEY, JSON.stringify(ads)); },
};

// Стартовый набор объявлений (если хранилище пустое)
const SEED = [
  {
    id: cryptoId(),
    title: 'Велосипед горный Stels Navigator',
    price: 12000, currency: 'RUB',
    category: 'Спорт', condition: 'Хорошее',
    city: 'Москва',
    description: 'Велосипед в хорошем состоянии, 21 скорость, недавно ТО.',
    image: 'https://picsum.photos/seed/bike/600/450',
    createdAt: Date.now() - 3600_000 * 24 * 2,
  },
  {
    id: cryptoId(),
    title: 'iPhone 11 64GB',
    price: 18500, currency: 'RUB',
    category: 'Электроника', condition: 'Отличное',
    city: 'Санкт-Петербург',
    description: 'Аккумулятор 87%, без сколов и царапин, полный комплект.',
    image: 'https://picsum.photos/seed/phone/600/450',
    createdAt: Date.now() - 3600_000 * 5,
  },
  {
    id: cryptoId(),
    title: 'Диван-кровать',
    price: 7500, currency: 'RUB',
    category: 'Мебель', condition: 'Удовлетворительное',
    city: 'Казань',
    description: 'Раскладной, механизм еврокнижка. Самовывоз.',
    image: 'https://picsum.photos/seed/sofa/600/450',
    createdAt: Date.now() - 3600_000 * 24 * 7,
  },
];

function cryptoId() {
  return (crypto?.randomUUID?.() || Math.random().toString(36).slice(2)) + Date.now().toString(36);
}

// ===== Внешний API: курсы валют (реальные данные) =====
// Используем open.er-api.com — бесплатный, без ключа.
async function fetchRates() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/RUB');
    if (!res.ok) throw new Error('Network');
    const data = await res.json();
    if (data?.result !== 'success') throw new Error('Bad data');
    state.rates = {
      RUB: 1,
      USD: data.rates.USD,
      EUR: data.rates.EUR,
      CNY: data.rates.CNY,
    };
    const ts = new Date(data.time_last_update_unix * 1000);
    document.getElementById('rateInfo').textContent =
      `курсы от ${ts.toLocaleDateString('ru-RU')}`;
  } catch (e) {
    document.getElementById('rateInfo').textContent = 'курсы недоступны';
    state.rates = { RUB: 1, USD: 1 / 90, EUR: 1 / 100, CNY: 1 / 12 }; // запасные
  }
}

function formatPrice(rub) {
  const cur = state.currency;
  const rate = state.rates[cur] ?? 1;
  const val = rub * rate;
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency', currency: cur, maximumFractionDigits: cur === 'RUB' ? 0 : 2,
  }).format(val);
}

function timeAgo(ts) {
  const diff = (Date.now() - ts) / 1000;
  if (diff < 60) return 'только что';
  if (diff < 3600) return `${Math.floor(diff / 60)} мин назад`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ч назад`;
  return new Date(ts).toLocaleDateString('ru-RU');
}

// ===== Утилита экранирования =====
function esc(s = '') {
  return String(s).replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}

// ===== Компоненты (возвращают строки HTML) =====
function CardComponent(ad) {
  return `
    <a class="card" href="#/ad/${ad.id}">
      <img class="card__image" src="${esc(ad.image)}" alt="${esc(ad.title)}" loading="lazy" />
      <div class="card__body">
        <span class="card__badge">${esc(ad.category)}</span>
        <h3 class="card__title">${esc(ad.title)}</h3>
        <div class="card__price">${formatPrice(ad.price)}</div>
        <div class="card__meta">
          <span>${esc(ad.city)}</span>
          <span>${timeAgo(ad.createdAt)}</span>
        </div>
      </div>
    </a>`;
}

function ToolbarComponent() {
  const opts = ['<option value="">Все категории</option>',
    ...CATEGORIES.map(c => `<option value="${c}" ${state.category===c?'selected':''}>${c}</option>`)
  ].join('');
  return `
    <div class="toolbar">
      <input id="searchInput" class="toolbar__input" type="search"
        placeholder="Поиск по названию или описанию…" value="${esc(state.query)}" />
      <select id="categorySelect" class="toolbar__select">${opts}</select>
      <a class="btn" href="#/new">+ Подать объявление</a>
    </div>`;
}

// ===== Страницы =====
function ListPage() {
  const filtered = state.ads
    .filter(a => !state.category || a.category === state.category)
    .filter(a => {
      if (!state.query) return true;
      const q = state.query.toLowerCase();
      return a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q);
    })
    .sort((a, b) => b.createdAt - a.createdAt);

  const cards = filtered.length
    ? `<div class="list">${filtered.map(CardComponent).join('')}</div>`
    : `<div class="empty">Ничего не найдено. Попробуйте изменить запрос или <a href="#/new">подать объявление</a>.</div>`;

  return `
    <h1 class="page-title">Объявления</h1>
    ${ToolbarComponent()}
    ${cards}
  `;
}

function DetailsPage(id) {
  const ad = state.ads.find(a => a.id === id);
  if (!ad) return `<div class="empty">Объявление не найдено. <a href="#/">К списку</a></div>`;
  return `
    <a href="#/" class="nav__link">← Назад</a>
    <h1 class="page-title" style="margin-top:8px">${esc(ad.title)}</h1>
    <article class="details">
      <img class="details__image" src="${esc(ad.image)}" alt="${esc(ad.title)}" />
      <div class="details__body">
        <div class="details__price">${formatPrice(ad.price)}</div>
        <div class="details__meta">
          <span><b>Категория:</b> ${esc(ad.category)}</span>
          <span><b>Состояние:</b> ${esc(ad.condition)}</span>
          <span><b>Город:</b> ${esc(ad.city)}</span>
          <span><b>Опубликовано:</b> ${timeAgo(ad.createdAt)}</span>
        </div>
        <p class="details__desc">${esc(ad.description)}</p>
        <div class="details__actions">
          <button class="btn" id="contactBtn">Связаться с продавцом</button>
          <button class="btn btn--danger" data-delete="${ad.id}">Удалить</button>
        </div>
      </div>
    </article>
  `;
}

function NewAdPage() {
  const catOpts = CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('');
  const condOpts = CONDITIONS.map(c => `<option value="${c}">${c}</option>`).join('');
  return `
    <h1 class="page-title">Новое объявление</h1>
    <form class="form" id="adForm" novalidate>
      <div class="form__row">
        <label class="form__label" for="f-title">Заголовок *</label>
        <input id="f-title" name="title" class="form__input" maxlength="120" required />
      </div>
      <div class="form__row form__row--two">
        <div class="form__row">
          <label class="form__label" for="f-price">Цена в рублях *</label>
          <input id="f-price" name="price" class="form__input" type="number" min="0" step="1" required />
        </div>
        <div class="form__row">
          <label class="form__label" for="f-city">Город *</label>
          <input id="f-city" name="city" class="form__input" required />
        </div>
      </div>
      <div class="form__row form__row--two">
        <div class="form__row">
          <label class="form__label" for="f-cat">Категория *</label>
          <select id="f-cat" name="category" class="form__select" required>${catOpts}</select>
        </div>
        <div class="form__row">
          <label class="form__label" for="f-cond">Состояние *</label>
          <select id="f-cond" name="condition" class="form__select" required>${condOpts}</select>
        </div>
      </div>
      <div class="form__row">
        <label class="form__label" for="f-image">Ссылка на фото</label>
        <input id="f-image" name="image" class="form__input" type="url" placeholder="https://…" />
      </div>
      <div class="form__row">
        <label class="form__label" for="f-desc">Описание *</label>
        <textarea id="f-desc" name="description" class="form__textarea" required></textarea>
      </div>
      <div class="form__error" id="formError"></div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button type="submit" class="btn">Опубликовать</button>
        <a href="#/" class="btn btn--ghost">Отмена</a>
      </div>
    </form>
  `;
}

// ===== Роутер =====
function parseHash() {
  const h = location.hash.replace(/^#/, '') || '/';
  const parts = h.split('/').filter(Boolean);
  if (parts.length === 0) return { name: 'list' };
  if (parts[0] === 'new') return { name: 'new' };
  if (parts[0] === 'ad' && parts[1]) return { name: 'details', id: parts[1] };
  return { name: 'list' };
}

function render() {
  const route = parseHash();
  const app = document.getElementById('app');
  if (route.name === 'new') app.innerHTML = NewAdPage();
  else if (route.name === 'details') app.innerHTML = DetailsPage(route.id);
  else app.innerHTML = ListPage();
  bindPageEvents(route);
  highlightNav(route);
}

function highlightNav(route) {
  document.querySelectorAll('.nav__link').forEach(a => a.classList.remove('nav__link--active'));
  const map = { list: 'a.nav__link[href="#/"]', new: 'a.nav__link[href="#/new"]' };
  const sel = map[route.name];
  if (sel) document.querySelector(sel)?.classList.add('nav__link--active');
}

// ===== События на страницах =====
function bindPageEvents(route) {
  if (route.name === 'list') {
    const s = document.getElementById('searchInput');
    const c = document.getElementById('categorySelect');
    s?.addEventListener('input', e => { state.query = e.target.value; renderListOnly(); });
    c?.addEventListener('change', e => { state.category = e.target.value; renderListOnly(); });
  }

  if (route.name === 'details') {
    document.getElementById('contactBtn')?.addEventListener('click', () => {
      alert('В демо-версии контакты скрыты. Здесь будет форма связи с продавцом.');
    });
    document.querySelector('[data-delete]')?.addEventListener('click', e => {
      const id = e.currentTarget.getAttribute('data-delete');
      if (confirm('Удалить объявление?')) {
        state.ads = state.ads.filter(a => a.id !== id);
        storage.save(state.ads);
        location.hash = '#/';
      }
    });
  }

  if (route.name === 'new') {
    const form = document.getElementById('adForm');
    form?.addEventListener('submit', e => {
      e.preventDefault();
      const fd = new FormData(form);
      const data = Object.fromEntries(fd.entries());
      const err = validateAd(data);
      const errBox = document.getElementById('formError');
      if (err) { errBox.textContent = err; return; }
      errBox.textContent = '';
      const ad = {
        id: cryptoId(),
        title: data.title.trim(),
        price: Number(data.price),
        currency: 'RUB',
        category: data.category,
        condition: data.condition,
        city: data.city.trim(),
        description: data.description.trim(),
        image: data.image?.trim() || `https://picsum.photos/seed/${encodeURIComponent(data.title)}/600/450`,
        createdAt: Date.now(),
      };
      state.ads.push(ad);
      storage.save(state.ads);
      location.hash = `#/ad/${ad.id}`;
    });
  }
}

function validateAd(d) {
  if (!d.title || d.title.trim().length < 3) return 'Заголовок должен содержать минимум 3 символа.';
  if (!d.price || Number(d.price) <= 0) return 'Укажите положительную цену.';
  if (!d.city?.trim()) return 'Укажите город.';
  if (!d.category) return 'Выберите категорию.';
  if (!d.condition) return 'Выберите состояние.';
  if (!d.description || d.description.trim().length < 10) return 'Описание должно быть минимум 10 символов.';
  if (d.image && !/^https?:\/\//i.test(d.image)) return 'Ссылка на фото должна начинаться с http(s)://';
  return null;
}

// Частичный перерендер только списка (без сброса фокуса инпута)
function renderListOnly() {
  const route = parseHash();
  if (route.name !== 'list') return;
  const filtered = state.ads
    .filter(a => !state.category || a.category === state.category)
    .filter(a => {
      if (!state.query) return true;
      const q = state.query.toLowerCase();
      return a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q);
    })
    .sort((a, b) => b.createdAt - a.createdAt);

  // удалить предыдущий список/empty
  const main = document.getElementById('app');
  const old = main.querySelector('.list, .empty');
  if (old) old.remove();
  const html = filtered.length
    ? `<div class="list">${filtered.map(CardComponent).join('')}</div>`
    : `<div class="empty">Ничего не найдено.</div>`;
  main.insertAdjacentHTML('beforeend', html);
}

// ===== Инициализация =====
async function init() {
  state.ads = storage.load();
  if (state.ads.length === 0) {
    state.ads = SEED;
    storage.save(state.ads);
  }

  document.getElementById('currency').addEventListener('change', e => {
    state.currency = e.target.value;
    render();
  });

  window.addEventListener('hashchange', render);

  await fetchRates();
  render();

  // авто-обновление курсов раз в 5 минут (реал-тайм-данные)
  setInterval(async () => {
    await fetchRates();
    if (parseHash().name === 'list' || parseHash().name === 'details') render();
  }, 5 * 60 * 1000);
}

init();
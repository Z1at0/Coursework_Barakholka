// ===== Константы =====
const STORAGE_KEY = 'barakholka.ads.v1';
const CATEGORIES = ['Электроника', 'Одежда', 'Мебель', 'Книги', 'Спорт', 'Детям', 'Авто', 'Другое'];
const CONDITIONS = ['Новое', 'Отличное', 'Хорошее', 'Удовлетворительное'];

class IdGenerator {
  create() {
    return (crypto?.randomUUID?.() || Math.random().toString(36).slice(2)) + Date.now().toString(36);
  }
}

class AppState {
  #ads = [];
  #query = '';
  #category = '';
  #currency = 'RUB';
  #rates = { RUB: 1 };

  get ads() { return this.#ads; }
  set ads(value) { this.#ads = value; }

  get query() { return this.#query; }
  set query(value) { this.#query = value; }

  get category() { return this.#category; }
  set category(value) { this.#category = value; }

  get currency() { return this.#currency; }
  set currency(value) { this.#currency = value; }

  get rates() { return this.#rates; }
  set rates(value) { this.#rates = value; }

  addAd(ad) {
    this.#ads.push(ad);
  }

  removeAd(id) {
    this.#ads = this.#ads.filter(ad => ad.id !== id);
  }

  findAd(id) {
    return this.#ads.find(ad => ad.id === id);
  }

  getFilteredAds() {
    return this.#ads
      .filter(ad => !this.#category || ad.category === this.#category)
      .filter(ad => {
        if (!this.#query) return true;
        const query = this.#query.toLowerCase();
        return ad.title.toLowerCase().includes(query) || ad.description.toLowerCase().includes(query);
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  }
}

class AdStorage {
  constructor(key) {
    this.key = key;
  }

  load() {
    try {
      return JSON.parse(localStorage.getItem(this.key)) || [];
    } catch {
      return [];
    }
  }

  save(ads) {
    localStorage.setItem(this.key, JSON.stringify(ads));
  }
}

class SeedFactory {
  constructor(idGenerator) {
    this.idGenerator = idGenerator;
  }

  create() {
    return [
      {
        id: this.idGenerator.create(),
        title: 'Велосипед горный Stels Navigator',
        price: 12000, currency: 'RUB',
        category: 'Спорт', condition: 'Хорошее',
        city: 'Москва',
        description: 'Велосипед в хорошем состоянии, 21 скорость, недавно ТО.',
        image: 'https://picsum.photos/seed/bike/600/450',
        createdAt: Date.now() - 3600_000 * 24 * 2,
      },
      {
        id: this.idGenerator.create(),
        title: 'iPhone 11 64GB',
        price: 18500, currency: 'RUB',
        category: 'Электроника', condition: 'Отличное',
        city: 'Санкт-Петербург',
        description: 'Аккумулятор 87%, без сколов и царапин, полный комплект.',
        image: 'https://picsum.photos/seed/phone/600/450',
        createdAt: Date.now() - 3600_000 * 5,
      },
      {
        id: this.idGenerator.create(),
        title: 'Диван-кровать',
        price: 7500, currency: 'RUB',
        category: 'Мебель', condition: 'Удовлетворительное',
        city: 'Казань',
        description: 'Раскладной, механизм еврокнижка. Самовывоз.',
        image: 'https://picsum.photos/seed/sofa/600/450',
        createdAt: Date.now() - 3600_000 * 24 * 7,
      },
    ];
  }
}

class HtmlEscaper {
  escape(value = '') {
    return String(value).replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[char]));
  }
}

class Formatter {
  constructor(state) {
    this.state = state;
  }

  price(rub) {
    const currency = this.state.currency;
    const rate = this.state.rates[currency] ?? 1;
    const value = rub * rate;
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
      maximumFractionDigits: currency === 'RUB' ? 0 : 2,
    }).format(value);
  }

  timeAgo(timestamp) {
    const diff = (Date.now() - timestamp) / 1000;
    if (diff < 60) return 'только что';
    if (diff < 3600) return `${Math.floor(diff / 60)} мин назад`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ч назад`;
    return new Date(timestamp).toLocaleDateString('ru-RU');
  }
}

class CurrencyService {
  constructor(state, rateInfoElementId) {
    this.state = state;
    this.rateInfoElementId = rateInfoElementId;
  }

  async fetchRates() {
    try {
      const response = await fetch('https://open.er-api.com/v6/latest/RUB');
      if (!response.ok) throw new Error('Network');
      const data = await response.json();
      if (data?.result !== 'success') throw new Error('Bad data');
      this.state.rates = {
        RUB: 1,
        USD: data.rates.USD,
        EUR: data.rates.EUR,
        CNY: data.rates.CNY,
      };
      const timestamp = new Date(data.time_last_update_unix * 1000);
      this.setRateInfo(`курсы от ${timestamp.toLocaleDateString('ru-RU')}`);
    } catch {
      this.setRateInfo('курсы недоступны');
      this.state.rates = { RUB: 1, USD: 1 / 90, EUR: 1 / 100, CNY: 1 / 12 };
    }
  }

  setRateInfo(text) {
    document.getElementById(this.rateInfoElementId).textContent = text;
  }
}

class AdValidator {
  validate(data) {
    if (!data.title || data.title.trim().length < 3) return 'Заголовок должен содержать минимум 3 символа.';
    if (!data.price || Number(data.price) <= 0) return 'Укажите положительную цену.';
    if (!data.city?.trim()) return 'Укажите город.';
    if (!data.category) return 'Выберите категорию.';
    if (!data.condition) return 'Выберите состояние.';
    if (!data.description || data.description.trim().length < 10) return 'Описание должно быть минимум 10 символов.';
    if (data.image && !/^https?:\/\//i.test(data.image)) return 'Ссылка на фото должна начинаться с http(s)://';
    return null;
  }
}

class AdFactory {
  constructor(idGenerator) {
    this.idGenerator = idGenerator;
  }

  create(data) {
    return {
      id: this.idGenerator.create(),
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
  }
}

class Component {
  constructor(escaper, formatter, state) {
    this.escaper = escaper;
    this.formatter = formatter;
    this.state = state;
  }

  esc(value) {
    return this.escaper.escape(value);
  }

  render() {
    return '';
  }
}

class CardComponent extends Component {
  constructor(ad, escaper, formatter, state) {
    super(escaper, formatter, state);
    this.ad = ad;
  }

  render() {
    return `
    <a class="card" href="#/ad/${this.ad.id}">
      <img class="card__image" src="${this.esc(this.ad.image)}" alt="${this.esc(this.ad.title)}" loading="lazy" />
      <div class="card__body">
        <span class="card__badge">${this.esc(this.ad.category)}</span>
        <h3 class="card__title">${this.esc(this.ad.title)}</h3>
        <div class="card__price">${this.formatter.price(this.ad.price)}</div>
        <div class="card__meta">
          <span>${this.esc(this.ad.city)}</span>
          <span>${this.formatter.timeAgo(this.ad.createdAt)}</span>
        </div>
      </div>
    </a>`;
  }
}

class ToolbarComponent extends Component {
  render() {
    const options = ['<option value="">Все категории</option>',
      ...CATEGORIES.map(category => (
        `<option value="${category}" ${this.state.category === category ? 'selected' : ''}>${category}</option>`
      )),
    ].join('');

    return `
    <div class="toolbar">
      <input id="searchInput" class="toolbar__input" type="search"
        placeholder="Поиск по названию или описанию…" value="${this.esc(this.state.query)}" />
      <select id="categorySelect" class="toolbar__select">${options}</select>
      <a class="btn" href="#/new">+ Подать объявление</a>
    </div>`;
  }
}

class Page extends Component {
  bindEvents() {}
}

class ListPage extends Page {
  render() {
    const cards = this.renderAds(this.state.getFilteredAds(), true);

    return `
    <h1 class="page-title">Объявления</h1>
    ${new ToolbarComponent(this.escaper, this.formatter, this.state).render()}
    ${cards}
  `;
  }

  renderAds(ads, withLinkText = false) {
    if (ads.length) {
      const cards = ads
        .map(ad => new CardComponent(ad, this.escaper, this.formatter, this.state).render())
        .join('');
      return `<div class="list">${cards}</div>`;
    }

    if (withLinkText) {
      return `<div class="empty">Ничего не найдено. Попробуйте изменить запрос или <a href="#/new">подать объявление</a>.</div>`;
    }

    return `<div class="empty">Ничего не найдено.</div>`;
  }

  bindEvents(app) {
    document.getElementById('searchInput')?.addEventListener('input', event => {
      this.state.query = event.target.value;
      app.renderListOnly();
    });
    document.getElementById('categorySelect')?.addEventListener('change', event => {
      this.state.category = event.target.value;
      app.renderListOnly();
    });
  }
}

class DetailsPage extends Page {
  constructor(id, escaper, formatter, state) {
    super(escaper, formatter, state);
    this.id = id;
  }

  render() {
    const ad = this.state.findAd(this.id);
    if (!ad) return `<div class="empty">Объявление не найдено. <a href="#/">К списку</a></div>`;

    return `
    <a href="#/" class="nav__link">← Назад</a>
    <h1 class="page-title" style="margin-top:8px">${this.esc(ad.title)}</h1>
    <article class="details">
      <img class="details__image" src="${this.esc(ad.image)}" alt="${this.esc(ad.title)}" />
      <div class="details__body">
        <div class="details__price">${this.formatter.price(ad.price)}</div>
        <div class="details__meta">
          <span><b>Категория:</b> ${this.esc(ad.category)}</span>
          <span><b>Состояние:</b> ${this.esc(ad.condition)}</span>
          <span><b>Город:</b> ${this.esc(ad.city)}</span>
          <span><b>Опубликовано:</b> ${this.formatter.timeAgo(ad.createdAt)}</span>
        </div>
        <p class="details__desc">${this.esc(ad.description)}</p>
        <div class="details__actions">
          <button class="btn" id="contactBtn">Связаться с продавцом</button>
          <button class="btn btn--danger" data-delete="${ad.id}">Удалить</button>
        </div>
      </div>
    </article>
  `;
  }

  bindEvents(app) {
    document.getElementById('contactBtn')?.addEventListener('click', () => {
      alert('В демо-версии контакты скрыты. Здесь будет форма связи с продавцом.');
    });
    document.querySelector('[data-delete]')?.addEventListener('click', event => {
      const id = event.currentTarget.getAttribute('data-delete');
      if (confirm('Удалить объявление?')) {
        this.state.removeAd(id);
        app.storage.save(this.state.ads);
        location.hash = '#/';
      }
    });
  }
}

class NewAdPage extends Page {
  constructor(escaper, formatter, state, validator, adFactory) {
    super(escaper, formatter, state);
    this.validator = validator;
    this.adFactory = adFactory;
  }

  render() {
    const categoryOptions = CATEGORIES.map(category => `<option value="${category}">${category}</option>`).join('');
    const conditionOptions = CONDITIONS.map(condition => `<option value="${condition}">${condition}</option>`).join('');

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
          <select id="f-cat" name="category" class="form__select" required>${categoryOptions}</select>
        </div>
        <div class="form__row">
          <label class="form__label" for="f-cond">Состояние *</label>
          <select id="f-cond" name="condition" class="form__select" required>${conditionOptions}</select>
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

  bindEvents(app) {
    const form = document.getElementById('adForm');
    form?.addEventListener('submit', event => {
      event.preventDefault();
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      const error = this.validator.validate(data);
      const errorBox = document.getElementById('formError');

      if (error) {
        errorBox.textContent = error;
        return;
      }

      errorBox.textContent = '';
      const ad = this.adFactory.create(data);
      this.state.addAd(ad);
      app.storage.save(this.state.ads);
      location.hash = `#/ad/${ad.id}`;
    });
  }
}

class Router {
  parse() {
    const hash = location.hash.replace(/^#/, '') || '/';
    const parts = hash.split('/').filter(Boolean);
    if (parts.length === 0) return { name: 'list' };
    if (parts[0] === 'new') return { name: 'new' };
    if (parts[0] === 'ad' && parts[1]) return { name: 'details', id: parts[1] };
    return { name: 'list' };
  }
}

class PageFactory {
  constructor(escaper, formatter, state, validator, adFactory) {
    this.escaper = escaper;
    this.formatter = formatter;
    this.state = state;
    this.validator = validator;
    this.adFactory = adFactory;
  }

  create(route) {
    if (route.name === 'new') {
      return new NewAdPage(this.escaper, this.formatter, this.state, this.validator, this.adFactory);
    }
    if (route.name === 'details') {
      return new DetailsPage(route.id, this.escaper, this.formatter, this.state);
    }
    return new ListPage(this.escaper, this.formatter, this.state);
  }
}

class NavigationView {
  highlight(route) {
    document.querySelectorAll('.nav__link').forEach(link => link.classList.remove('nav__link--active'));
    const map = { list: 'a.nav__link[href="#/"]', new: 'a.nav__link[href="#/new"]' };
    const selector = map[route.name];
    if (selector) document.querySelector(selector)?.classList.add('nav__link--active');
  }
}

class BarakholkaApp {
  constructor() {
    this.idGenerator = new IdGenerator();
    this.state = new AppState();
    this.storage = new AdStorage(STORAGE_KEY);
    this.seedFactory = new SeedFactory(this.idGenerator);
    this.escaper = new HtmlEscaper();
    this.formatter = new Formatter(this.state);
    this.currencyService = new CurrencyService(this.state, 'rateInfo');
    this.validator = new AdValidator();
    this.adFactory = new AdFactory(this.idGenerator);
    this.router = new Router();
    this.pageFactory = new PageFactory(
      this.escaper,
      this.formatter,
      this.state,
      this.validator,
      this.adFactory,
    );
    this.navigation = new NavigationView();
    this.appElement = document.getElementById('app');
  }

  async init() {
    this.state.ads = this.storage.load();
    if (this.state.ads.length === 0) {
      this.state.ads = this.seedFactory.create();
      this.storage.save(this.state.ads);
    }

    document.getElementById('currency').addEventListener('change', event => {
      this.state.currency = event.target.value;
      this.render();
    });

    window.addEventListener('hashchange', () => this.render());

    await this.currencyService.fetchRates();
    this.render();

    setInterval(async () => {
      await this.currencyService.fetchRates();
      const route = this.router.parse();
      if (route.name === 'list' || route.name === 'details') this.render();
    }, 5 * 60 * 1000);
  }

  render() {
    const route = this.router.parse();
    const page = this.pageFactory.create(route);
    this.appElement.innerHTML = page.render();
    page.bindEvents(this);
    this.navigation.highlight(route);
  }

  renderListOnly() {
    const route = this.router.parse();
    if (route.name !== 'list') return;

    const oldContent = this.appElement.querySelector('.list, .empty');
    if (oldContent) oldContent.remove();

    const page = new ListPage(this.escaper, this.formatter, this.state);
    this.appElement.insertAdjacentHTML('beforeend', page.renderAds(this.state.getFilteredAds()));
  }
}

new BarakholkaApp().init();

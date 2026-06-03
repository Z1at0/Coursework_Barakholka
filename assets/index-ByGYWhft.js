var _=s=>{throw TypeError(s)};var b=(s,t,e)=>t.has(s)||_("Cannot "+e);var n=(s,t,e)=>(b(s,t,"read from private field"),e?e.call(s):t.get(s)),u=(s,t,e)=>t.has(s)?_("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(s):t.set(s,e),c=(s,t,e,r)=>(b(s,t,"write to private field"),r?r.call(s,e):t.set(s,e),e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const h of a.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&r(h)}).observe(document,{childList:!0,subtree:!0});function e(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(i){if(i.ep)return;i.ep=!0;const a=e(i);fetch(i.href,a)}})();const $="barakholka.ads.v1",w=["Электроника","Одежда","Мебель","Книги","Спорт","Детям","Авто","Другое"],A=["Новое","Отличное","Хорошее","Удовлетворительное"];class S{create(){return(crypto?.randomUUID?.()||Math.random().toString(36).slice(2))+Date.now().toString(36)}}var o,l,d,p,m;class I{constructor(){u(this,o,[]);u(this,l,"");u(this,d,"");u(this,p,"RUB");u(this,m,{RUB:1})}get ads(){return n(this,o)}set ads(t){c(this,o,t)}get query(){return n(this,l)}set query(t){c(this,l,t)}get category(){return n(this,d)}set category(t){c(this,d,t)}get currency(){return n(this,p)}set currency(t){c(this,p,t)}get rates(){return n(this,m)}set rates(t){c(this,m,t)}addAd(t){n(this,o).push(t)}removeAd(t){c(this,o,n(this,o).filter(e=>e.id!==t))}findAd(t){return n(this,o).find(e=>e.id===t)}getFilteredAds(){return n(this,o).filter(t=>!n(this,d)||t.category===n(this,d)).filter(t=>{if(!n(this,l))return!0;const e=n(this,l).toLowerCase();return t.title.toLowerCase().includes(e)||t.description.toLowerCase().includes(e)}).sort((t,e)=>e.createdAt-t.createdAt)}}o=new WeakMap,l=new WeakMap,d=new WeakMap,p=new WeakMap,m=new WeakMap;class R{constructor(t){this.key=t}load(){try{return JSON.parse(localStorage.getItem(this.key))||[]}catch{return[]}}save(t){localStorage.setItem(this.key,JSON.stringify(t))}}class B{constructor(t){this.idGenerator=t}create(){return[{id:this.idGenerator.create(),title:"Велосипед горный Stels Navigator",price:12e3,currency:"RUB",category:"Спорт",condition:"Хорошее",city:"Москва",description:"Велосипед в хорошем состоянии, 21 скорость, недавно ТО.",image:"https://picsum.photos/seed/bike/600/450",createdAt:Date.now()-36e5*24*2},{id:this.idGenerator.create(),title:"iPhone 11 64GB",price:18500,currency:"RUB",category:"Электроника",condition:"Отличное",city:"Санкт-Петербург",description:"Аккумулятор 87%, без сколов и царапин, полный комплект.",image:"https://picsum.photos/seed/phone/600/450",createdAt:Date.now()-36e5*5},{id:this.idGenerator.create(),title:"Диван-кровать",price:7500,currency:"RUB",category:"Мебель",condition:"Удовлетворительное",city:"Казань",description:"Раскладной, механизм еврокнижка. Самовывоз.",image:"https://picsum.photos/seed/sofa/600/450",createdAt:Date.now()-36e5*24*7}]}}class L{escape(t=""){return String(t).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}}class F{constructor(t){this.state=t}price(t){const e=this.state.currency,r=this.state.rates[e]??1,i=t*r;return new Intl.NumberFormat("ru-RU",{style:"currency",currency:e,maximumFractionDigits:e==="RUB"?0:2}).format(i)}timeAgo(t){const e=(Date.now()-t)/1e3;return e<60?"только что":e<3600?`${Math.floor(e/60)} мин назад`:e<86400?`${Math.floor(e/3600)} ч назад`:new Date(t).toLocaleDateString("ru-RU")}}class U{constructor(t,e){this.state=t,this.rateInfoElementId=e}async fetchRates(){try{const t=await fetch("https://open.er-api.com/v6/latest/RUB");if(!t.ok)throw new Error("Network");const e=await t.json();if(e?.result!=="success")throw new Error("Bad data");this.state.rates={RUB:1,USD:e.rates.USD,EUR:e.rates.EUR,CNY:e.rates.CNY};const r=new Date(e.time_last_update_unix*1e3);this.setRateInfo(`курсы от ${r.toLocaleDateString("ru-RU")}`)}catch{this.setRateInfo("курсы недоступны"),this.state.rates={RUB:1,USD:1/90,EUR:1/100,CNY:1/12}}}setRateInfo(t){document.getElementById(this.rateInfoElementId).textContent=t}}class x{validate(t){return!t.title||t.title.trim().length<3?"Заголовок должен содержать минимум 3 символа.":!t.price||Number(t.price)<=0?"Укажите положительную цену.":t.city?.trim()?t.category?t.condition?!t.description||t.description.trim().length<10?"Описание должно быть минимум 10 символов.":t.image&&!/^https?:\/\//i.test(t.image)?"Ссылка на фото должна начинаться с http(s)://":null:"Выберите состояние.":"Выберите категорию.":"Укажите город."}}class D{constructor(t){this.idGenerator=t}create(t){return{id:this.idGenerator.create(),title:t.title.trim(),price:Number(t.price),currency:"RUB",category:t.category,condition:t.condition,city:t.city.trim(),description:t.description.trim(),image:t.image?.trim()||`https://picsum.photos/seed/${encodeURIComponent(t.title)}/600/450`,createdAt:Date.now()}}}class f{constructor(t,e,r){this.escaper=t,this.formatter=e,this.state=r}esc(t){return this.escaper.escape(t)}render(){return""}}class q extends f{constructor(t,e,r,i){super(e,r,i),this.ad=t}render(){return`
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
    </a>`}}class C extends f{render(){const t=['<option value="">Все категории</option>',...w.map(e=>`<option value="${e}" ${this.state.category===e?"selected":""}>${e}</option>`)].join("");return`
    <div class="toolbar">
      <input id="searchInput" class="toolbar__input" type="search"
        placeholder="Поиск по названию или описанию…" value="${this.esc(this.state.query)}" />
      <select id="categorySelect" class="toolbar__select">${t}</select>
      <a class="btn" href="#/new">+ Подать объявление</a>
    </div>`}}class g extends f{bindEvents(){}}class E extends g{render(){const t=this.renderAds(this.state.getFilteredAds(),!0);return`
    <h1 class="page-title">Объявления</h1>
    ${new C(this.escaper,this.formatter,this.state).render()}
    ${t}
  `}renderAds(t,e=!1){return t.length?`<div class="list">${t.map(i=>new q(i,this.escaper,this.formatter,this.state).render()).join("")}</div>`:e?'<div class="empty">Ничего не найдено. Попробуйте изменить запрос или <a href="#/new">подать объявление</a>.</div>':'<div class="empty">Ничего не найдено.</div>'}bindEvents(t){document.getElementById("searchInput")?.addEventListener("input",e=>{this.state.query=e.target.value,t.renderListOnly()}),document.getElementById("categorySelect")?.addEventListener("change",e=>{this.state.category=e.target.value,t.renderListOnly()})}}class O extends g{constructor(t,e,r,i){super(e,r,i),this.id=t}render(){const t=this.state.findAd(this.id);return t?`
    <a href="#/" class="nav__link">← Назад</a>
    <h1 class="page-title" style="margin-top:8px">${this.esc(t.title)}</h1>
    <article class="details">
      <img class="details__image" src="${this.esc(t.image)}" alt="${this.esc(t.title)}" />
      <div class="details__body">
        <div class="details__price">${this.formatter.price(t.price)}</div>
        <div class="details__meta">
          <span><b>Категория:</b> ${this.esc(t.category)}</span>
          <span><b>Состояние:</b> ${this.esc(t.condition)}</span>
          <span><b>Город:</b> ${this.esc(t.city)}</span>
          <span><b>Опубликовано:</b> ${this.formatter.timeAgo(t.createdAt)}</span>
        </div>
        <p class="details__desc">${this.esc(t.description)}</p>
        <div class="details__actions">
          <button class="btn" id="contactBtn">Связаться с продавцом</button>
          <button class="btn btn--danger" data-delete="${t.id}">Удалить</button>
        </div>
      </div>
    </article>
  `:'<div class="empty">Объявление не найдено. <a href="#/">К списку</a></div>'}bindEvents(t){document.getElementById("contactBtn")?.addEventListener("click",()=>{alert("В демо-версии контакты скрыты. Здесь будет форма связи с продавцом.")}),document.querySelector("[data-delete]")?.addEventListener("click",e=>{const r=e.currentTarget.getAttribute("data-delete");confirm("Удалить объявление?")&&(this.state.removeAd(r),t.storage.save(this.state.ads),location.hash="#/")})}}class N extends g{constructor(t,e,r,i,a){super(t,e,r),this.validator=i,this.adFactory=a}render(){const t=w.map(r=>`<option value="${r}">${r}</option>`).join(""),e=A.map(r=>`<option value="${r}">${r}</option>`).join("");return`
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
          <select id="f-cat" name="category" class="form__select" required>${t}</select>
        </div>
        <div class="form__row">
          <label class="form__label" for="f-cond">Состояние *</label>
          <select id="f-cond" name="condition" class="form__select" required>${e}</select>
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
  `}bindEvents(t){const e=document.getElementById("adForm");e?.addEventListener("submit",r=>{r.preventDefault();const i=new FormData(e),a=Object.fromEntries(i.entries()),h=this.validator.validate(a),y=document.getElementById("formError");if(h){y.textContent=h;return}y.textContent="";const v=this.adFactory.create(a);this.state.addAd(v),t.storage.save(this.state.ads),location.hash=`#/ad/${v.id}`})}}class k{parse(){const e=(location.hash.replace(/^#/,"")||"/").split("/").filter(Boolean);return e.length===0?{name:"list"}:e[0]==="new"?{name:"new"}:e[0]==="ad"&&e[1]?{name:"details",id:e[1]}:{name:"list"}}}class G{constructor(t,e,r,i,a){this.escaper=t,this.formatter=e,this.state=r,this.validator=i,this.adFactory=a}create(t){return t.name==="new"?new N(this.escaper,this.formatter,this.state,this.validator,this.adFactory):t.name==="details"?new O(t.id,this.escaper,this.formatter,this.state):new E(this.escaper,this.formatter,this.state)}}class P{highlight(t){document.querySelectorAll(".nav__link").forEach(i=>i.classList.remove("nav__link--active"));const r={list:'a.nav__link[href="#/"]',new:'a.nav__link[href="#/new"]'}[t.name];r&&document.querySelector(r)?.classList.add("nav__link--active")}}class j{constructor(){this.idGenerator=new S,this.state=new I,this.storage=new R($),this.seedFactory=new B(this.idGenerator),this.escaper=new L,this.formatter=new F(this.state),this.currencyService=new U(this.state,"rateInfo"),this.validator=new x,this.adFactory=new D(this.idGenerator),this.router=new k,this.pageFactory=new G(this.escaper,this.formatter,this.state,this.validator,this.adFactory),this.navigation=new P,this.appElement=document.getElementById("app")}async init(){this.state.ads=this.storage.load(),this.state.ads.length===0&&(this.state.ads=this.seedFactory.create(),this.storage.save(this.state.ads)),document.getElementById("currency").addEventListener("change",t=>{this.state.currency=t.target.value,this.render()}),window.addEventListener("hashchange",()=>this.render()),await this.currencyService.fetchRates(),this.render(),setInterval(async()=>{await this.currencyService.fetchRates();const t=this.router.parse();(t.name==="list"||t.name==="details")&&this.render()},5*60*1e3)}render(){const t=this.router.parse(),e=this.pageFactory.create(t);this.appElement.innerHTML=e.render(),e.bindEvents(this),this.navigation.highlight(t)}renderListOnly(){if(this.router.parse().name!=="list")return;const e=this.appElement.querySelector(".list, .empty");e&&e.remove();const r=new E(this.escaper,this.formatter,this.state);this.appElement.insertAdjacentHTML("beforeend",r.renderAds(this.state.getFilteredAds()))}}new j().init();

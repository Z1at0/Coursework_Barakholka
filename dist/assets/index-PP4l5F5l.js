(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const c of s.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function r(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(n){if(n.ep)return;n.ep=!0;const s=r(n);fetch(n.href,s)}})();const p="barakholka.ads.v1",y=["Электроника","Одежда","Мебель","Книги","Спорт","Детям","Авто","Другое"],w=["Новое","Отличное","Хорошее","Удовлетворительное"],a={ads:[],query:"",category:"",currency:"RUB",rates:{RUB:1}},u={load(){try{return JSON.parse(localStorage.getItem(p))||[]}catch{return[]}},save(t){localStorage.setItem(p,JSON.stringify(t))}},$=[{id:d(),title:"Велосипед горный Stels Navigator",price:12e3,currency:"RUB",category:"Спорт",condition:"Хорошее",city:"Москва",description:"Велосипед в хорошем состоянии, 21 скорость, недавно ТО.",image:"https://picsum.photos/seed/bike/600/450",createdAt:Date.now()-36e5*24*2},{id:d(),title:"iPhone 11 64GB",price:18500,currency:"RUB",category:"Электроника",condition:"Отличное",city:"Санкт-Петербург",description:"Аккумулятор 87%, без сколов и царапин, полный комплект.",image:"https://picsum.photos/seed/phone/600/450",createdAt:Date.now()-36e5*5},{id:d(),title:"Диван-кровать",price:7500,currency:"RUB",category:"Мебель",condition:"Удовлетворительное",city:"Казань",description:"Раскладной, механизм еврокнижка. Самовывоз.",image:"https://picsum.photos/seed/sofa/600/450",createdAt:Date.now()-36e5*24*7}];function d(){return(crypto?.randomUUID?.()||Math.random().toString(36).slice(2))+Date.now().toString(36)}async function g(){try{const t=await fetch("https://open.er-api.com/v6/latest/RUB");if(!t.ok)throw new Error("Network");const e=await t.json();if(e?.result!=="success")throw new Error("Bad data");a.rates={RUB:1,USD:e.rates.USD,EUR:e.rates.EUR,CNY:e.rates.CNY};const r=new Date(e.time_last_update_unix*1e3);document.getElementById("rateInfo").textContent=`курсы от ${r.toLocaleDateString("ru-RU")}`}catch{document.getElementById("rateInfo").textContent="курсы недоступны",a.rates={RUB:1,USD:1/90,EUR:1/100,CNY:1/12}}}function v(t){const e=a.currency,r=a.rates[e]??1,i=t*r;return new Intl.NumberFormat("ru-RU",{style:"currency",currency:e,maximumFractionDigits:e==="RUB"?0:2}).format(i)}function h(t){const e=(Date.now()-t)/1e3;return e<60?"только что":e<3600?`${Math.floor(e/60)} мин назад`:e<86400?`${Math.floor(e/3600)} ч назад`:new Date(t).toLocaleDateString("ru-RU")}function o(t=""){return String(t).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}function b(t){return`
    <a class="card" href="#/ad/${t.id}">
      <img class="card__image" src="${o(t.image)}" alt="${o(t.title)}" loading="lazy" />
      <div class="card__body">
        <span class="card__badge">${o(t.category)}</span>
        <h3 class="card__title">${o(t.title)}</h3>
        <div class="card__price">${v(t.price)}</div>
        <div class="card__meta">
          <span>${o(t.city)}</span>
          <span>${h(t.createdAt)}</span>
        </div>
      </div>
    </a>`}function E(){const t=['<option value="">Все категории</option>',...y.map(e=>`<option value="${e}" ${a.category===e?"selected":""}>${e}</option>`)].join("");return`
    <div class="toolbar">
      <input id="searchInput" class="toolbar__input" type="search"
        placeholder="Поиск по названию или описанию…" value="${o(a.query)}" />
      <select id="categorySelect" class="toolbar__select">${t}</select>
      <a class="btn" href="#/new">+ Подать объявление</a>
    </div>`}function L(){const t=a.ads.filter(r=>!a.category||r.category===a.category).filter(r=>{if(!a.query)return!0;const i=a.query.toLowerCase();return r.title.toLowerCase().includes(i)||r.description.toLowerCase().includes(i)}).sort((r,i)=>i.createdAt-r.createdAt),e=t.length?`<div class="list">${t.map(b).join("")}</div>`:'<div class="empty">Ничего не найдено. Попробуйте изменить запрос или <a href="#/new">подать объявление</a>.</div>';return`
    <h1 class="page-title">Объявления</h1>
    ${E()}
    ${e}
  `}function B(t){const e=a.ads.find(r=>r.id===t);return e?`
    <a href="#/" class="nav__link">← Назад</a>
    <h1 class="page-title" style="margin-top:8px">${o(e.title)}</h1>
    <article class="details">
      <img class="details__image" src="${o(e.image)}" alt="${o(e.title)}" />
      <div class="details__body">
        <div class="details__price">${v(e.price)}</div>
        <div class="details__meta">
          <span><b>Категория:</b> ${o(e.category)}</span>
          <span><b>Состояние:</b> ${o(e.condition)}</span>
          <span><b>Город:</b> ${o(e.city)}</span>
          <span><b>Опубликовано:</b> ${h(e.createdAt)}</span>
        </div>
        <p class="details__desc">${o(e.description)}</p>
        <div class="details__actions">
          <button class="btn" id="contactBtn">Связаться с продавцом</button>
          <button class="btn btn--danger" data-delete="${e.id}">Удалить</button>
        </div>
      </div>
    </article>
  `:'<div class="empty">Объявление не найдено. <a href="#/">К списку</a></div>'}function I(){const t=y.map(r=>`<option value="${r}">${r}</option>`).join(""),e=w.map(r=>`<option value="${r}">${r}</option>`).join("");return`
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
  `}function f(){const e=(location.hash.replace(/^#/,"")||"/").split("/").filter(Boolean);return e.length===0?{name:"list"}:e[0]==="new"?{name:"new"}:e[0]==="ad"&&e[1]?{name:"details",id:e[1]}:{name:"list"}}function l(){const t=f(),e=document.getElementById("app");t.name==="new"?e.innerHTML=I():t.name==="details"?e.innerHTML=B(t.id):e.innerHTML=L(),U(t),S(t)}function S(t){document.querySelectorAll(".nav__link").forEach(i=>i.classList.remove("nav__link--active"));const r={list:'a.nav__link[href="#/"]',new:'a.nav__link[href="#/new"]'}[t.name];r&&document.querySelector(r)?.classList.add("nav__link--active")}function U(t){if(t.name==="list"){const e=document.getElementById("searchInput"),r=document.getElementById("categorySelect");e?.addEventListener("input",i=>{a.query=i.target.value,_()}),r?.addEventListener("change",i=>{a.category=i.target.value,_()})}if(t.name==="details"&&(document.getElementById("contactBtn")?.addEventListener("click",()=>{alert("В демо-версии контакты скрыты. Здесь будет форма связи с продавцом.")}),document.querySelector("[data-delete]")?.addEventListener("click",e=>{const r=e.currentTarget.getAttribute("data-delete");confirm("Удалить объявление?")&&(a.ads=a.ads.filter(i=>i.id!==r),u.save(a.ads),location.hash="#/")})),t.name==="new"){const e=document.getElementById("adForm");e?.addEventListener("submit",r=>{r.preventDefault();const i=new FormData(e),n=Object.fromEntries(i.entries()),s=q(n),c=document.getElementById("formError");if(s){c.textContent=s;return}c.textContent="";const m={id:d(),title:n.title.trim(),price:Number(n.price),currency:"RUB",category:n.category,condition:n.condition,city:n.city.trim(),description:n.description.trim(),image:n.image?.trim()||`https://picsum.photos/seed/${encodeURIComponent(n.title)}/600/450`,createdAt:Date.now()};a.ads.push(m),u.save(a.ads),location.hash=`#/ad/${m.id}`})}}function q(t){return!t.title||t.title.trim().length<3?"Заголовок должен содержать минимум 3 символа.":!t.price||Number(t.price)<=0?"Укажите положительную цену.":t.city?.trim()?t.category?t.condition?!t.description||t.description.trim().length<10?"Описание должно быть минимум 10 символов.":t.image&&!/^https?:\/\//i.test(t.image)?"Ссылка на фото должна начинаться с http(s)://":null:"Выберите состояние.":"Выберите категорию.":"Укажите город."}function _(){if(f().name!=="list")return;const e=a.ads.filter(s=>!a.category||s.category===a.category).filter(s=>{if(!a.query)return!0;const c=a.query.toLowerCase();return s.title.toLowerCase().includes(c)||s.description.toLowerCase().includes(c)}).sort((s,c)=>c.createdAt-s.createdAt),r=document.getElementById("app"),i=r.querySelector(".list, .empty");i&&i.remove();const n=e.length?`<div class="list">${e.map(b).join("")}</div>`:'<div class="empty">Ничего не найдено.</div>';r.insertAdjacentHTML("beforeend",n)}async function D(){a.ads=u.load(),a.ads.length===0&&(a.ads=$,u.save(a.ads)),document.getElementById("currency").addEventListener("change",t=>{a.currency=t.target.value,l()}),window.addEventListener("hashchange",l),await g(),l(),setInterval(async()=>{await g(),(f().name==="list"||f().name==="details")&&l()},5*60*1e3)}D();

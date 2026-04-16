
/* ── ОТПРАВКА КОРЗИНЫ (products.html) ── */
window.submitCartForm = function() {
  var form = document.querySelector('#cart-form, .cart-form, form[name="cart"]');
  // Корзина products.html использует injectCartUI — найдём её форму
  var cartForm = document.querySelector('#global-cart-send-overlay form');
  if (cartForm) {
    cartForm.dispatchEvent(new Event('submit', {bubbles: true, cancelable: true}));
  }
};




/* shared.js */

/* ── PHONE MASK ── */
function applyPhoneMask(input) {
  input.addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '');
    if (v.startsWith('8')) v = '7' + v.slice(1);
    if (v.length > 0 && !v.startsWith('7')) v = '7' + v;
    v = v.slice(0, 11);
    let out = '';
    if (v.length > 0)  out = '+7';
    if (v.length > 1)  out += ' (' + v.slice(1, 4);
    if (v.length >= 4) out += ') ' + v.slice(4, 7);
    if (v.length >= 7) out += '-' + v.slice(7, 9);
    if (v.length >= 9) out += '-' + v.slice(9, 11);
    this.value = out;
  });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Backspace' && this.value === '+7 (') { this.value = ''; e.preventDefault(); }
  });
  input.addEventListener('focus', function () { if (!this.value) this.value = '+7 ('; });
  input.addEventListener('blur',  function () { if (this.value === '+7 (') this.value = ''; });
}

/* ── MOBILE NAV ── */
function initBurger() {
  const burger = document.getElementById('burger');
  const mobileNav = document.getElementById('mobileNav');
  if (!burger || !mobileNav) return;
  burger.addEventListener('click', () => mobileNav.classList.toggle('open'));
  document.addEventListener('click', e => {
    if (!burger.contains(e.target) && !mobileNav.contains(e.target))
      mobileNav.classList.remove('open');
  });
}

/* ── ACTIVE NAV ── */
function setActiveNav() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a, .mobile-nav a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop();
    if (href === path) a.classList.add('active');
  });
}

/* ── MODAL ── */
function openModal(title) {
  const ov = document.getElementById('modal-overlay');
  if (!ov) return;
  if (title) { const t = document.getElementById('modal-title'); if (t) t.textContent = title; }
  ov.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  const ov = document.getElementById('modal-overlay');
  if (!ov) return;
  ov.classList.remove('open');
  document.body.style.overflow = '';
}
function initModal() {
  const ov = document.getElementById('modal-overlay');
  if (!ov) return;
  ov.addEventListener('click', e => { if (e.target === ov) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  ov.querySelectorAll('input[type="tel"]').forEach(applyPhoneMask);

  // Перехватываем все формы в модале — отправляем через fetch
  ov.querySelectorAll('form').forEach(function(form) {
    if (form._fsHandled) return;
    form._fsHandled = true;
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = form.querySelector('[type=submit]');
      var orig = btn ? btn.textContent : '';
      if (btn) { btn.textContent = 'Отправляем…'; btn.disabled = true; }

      var fd = new FormData(form);
      // Удаляем _next чтобы formsubmit не делал редирект
      fd.delete('_next');

      fetch('https://formsubmit.co/ajax/non_86@mail.ru', {
        method: 'POST',
        body: fd,
        headers: { 'Accept': 'application/json' }
      })
      .then(function(r) { return r.json(); })
      .then(function(d) {
        if (d.success === 'true' || d.success === true) {
          if (btn) { btn.textContent = '✓ Отправлено'; btn.style.background = '#aaff00'; btn.style.color = '#000'; }
          form.reset();
          setTimeout(function() {
            if (btn) { btn.textContent = orig; btn.style.background = ''; btn.style.color = ''; btn.disabled = false; }
            closeModal();
          }, 2500);
        } else {
          if (btn) { btn.textContent = 'Ошибка — попробуйте ещё раз'; btn.disabled = false; }
        }
      })
      .catch(function() {
        // Fallback — обычная отправка если fetch не сработал
        form.removeEventListener('submit', arguments.callee);
        form.submit();
      });
    });
  });
}

/* ── SCROLL REVEAL ── */
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ── INIT ── */

/* ── ОБРАБОТЧИК ФОРМ FormSubmit (все формы на сайте) ── */
function initAllForms() {
  document.querySelectorAll('form[data-w3f], form#modal-form').forEach(function(form) {
    if (form._handled) return;
    form._handled = true;

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = form.querySelector('[type=submit]');
      var orig = btn ? btn.textContent : '';
      if (btn) { btn.textContent = 'Отправляем…'; btn.disabled = true; }

      var fd = new FormData(form);

      fetch('https://formsubmit.co/ajax/non_86@mail.ru', {
        method: 'POST',
        body: fd,
        headers: { 'Accept': 'application/json' }
      })
      .then(function(r) { return r.json(); })
      .then(function(d) {
        if (d.success === 'true' || d.success === true) {
          if (btn) {
            btn.textContent = '✓ Отправлено';
            btn.style.cssText += ';background:#aaff00!important;color:#000!important;';
          }
          form.reset();
          setTimeout(function() {
            if (btn) { btn.textContent = orig; btn.style.background = ''; btn.style.color = ''; btn.disabled = false; }
            if (typeof closeModal === 'function') closeModal();
          }, 2500);
        } else {
          if (btn) { btn.textContent = 'Ошибка — попробуйте ещё раз'; btn.disabled = false; }
        }
      })
      .catch(function() {
        if (btn) { btn.textContent = 'Ошибка соединения'; btn.disabled = false; }
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initBurger();
  setActiveNav();
  initModal();
  initReveal();
  initAllForms();
  document.querySelectorAll('input[type="tel"]').forEach(applyPhoneMask);
});

/* ── CALCULATOR ── */
function clearCalc(panelId) {
  var panel = document.getElementById(panelId);
  if (!panel) return;
  panel.querySelectorAll('input[type="number"]').forEach(function(el) { el.value = ''; });
  panel.querySelectorAll('select').forEach(function(el) { el.selectedIndex = 0; });
  panel.querySelectorAll('.result-num').forEach(function(el) { el.textContent = '—'; });
  // Сбросить подписи с динамическими значениями
  var labels = { r1bl:'Штук досок', r2bl:'Штук досок', r3al:'Штук в 1 м³', r3bl:'Штук в партии' };
  Object.keys(labels).forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.textContent = labels[id];
  });
}

function switchCalcTab(btn, panelId) {
  document.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.calc-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(panelId).classList.add('active');
}
function fmt(n, dec) {
  if (isNaN(n) || !isFinite(n) || n <= 0) return '—';
  if (dec === 0) return Math.round(n).toLocaleString('ru');
  return n.toFixed(dec !== undefined ? dec : 2).replace(/\.?0+$/, '').replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');
}
function pn(v) {
  if (!v && v !== 0) return NaN;
  return parseFloat(String(v).replace(',','.'));
}
function fmt(n, unit, dec) {
  if (isNaN(n) || n <= 0) return '—';
  dec = (dec === undefined) ? 4 : dec;
  var s = parseFloat(n.toFixed(dec)).toString().replace(/\.?0+$/,'');
  s = s.replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');
  return unit ? s + ' ' + unit : s;
}
function fmtRub(n) {
  if (isNaN(n) || n <= 0) return '—';
  var vatOn = (typeof window.vatOn === 'undefined') ? true : window.vatOn;
  var multiplier = vatOn ? 1 : 1/1.22;
  return Math.round(n * multiplier).toLocaleString('ru') + ' ₽';
}

function getVal(id) {
  var el = document.getElementById(id);
  return el ? pn(el.value) : NaN;
}
function setVal(id, n, dec) {
  var el = document.getElementById(id);
  if (!el) return;
  if (isNaN(n) || n <= 0) return;
  var d = (dec === undefined) ? 6 : dec;
  if (d === 0) {
    el.value = Math.round(n).toString();
  } else {
    el.value = parseFloat(n.toFixed(d)).toString().replace(/\.?0+$/,'');
  }
  el.classList.add('cf-computed');
}
function setRes(id, text) {
  var el = document.getElementById(id);
  if (el) {
    el.textContent = text || '—';
    el.classList.toggle('na', !text || text === '—');
  }
}

function smartCalc(trigger) {
  // Считываем все поля
  var T  = getVal('f-thickness') / 1000; // мм→м
  var W  = getVal('f-width')     / 1000; // мм→м
  var L  = getVal('f-length');           // м
  var BA = getVal('f-board-area');       // м²
  var N  = getVal('f-count');            // шт
  var TA = getVal('f-total-area');       // м²
  var V  = getVal('f-volume');           // м³
  var PE = getVal('f-price-each');       // ₽/шт
  var PM = getVal('f-price-m3');         // ₽/м³
  var TP = getVal('f-total-price');      // ₽

  // Вычисляем площадь и объём одной доски
  if (isNaN(BA) && W > 0 && L > 0) BA = W * L;
  var BV = (T > 0 && W > 0 && L > 0) ? T * W * L : NaN;

  // Заполняем поле "площадь одной доски" если оно пустое
  if (!isNaN(BA) && trigger !== 'boardArea') setVal('f-board-area', BA, 6);

  // Пересчитываем партию
  if (trigger === 'volume' && !isNaN(V) && !isNaN(BV) && BV > 0) {
    N  = V / BV;
    TA = N * BA;
    setVal('f-count', N, 0);
    setVal('f-total-area', TA, 4);
  } else if (trigger === 'totalArea' && !isNaN(TA) && !isNaN(BA) && BA > 0) {
    N = TA / BA;
    V = N * BV;
    setVal('f-count', N, 0);
    setVal('f-volume', V, 2);
  } else if (!isNaN(N)) {
    if (!isNaN(BA) && BA > 0) { TA = N * BA; setVal('f-total-area', TA, 4); }
    if (!isNaN(BV) && BV > 0) { V  = N * BV; setVal('f-volume', V, 2); }
  } else if (!isNaN(V) && !isNaN(BV) && BV > 0) {
    N  = V / BV;
    TA = !isNaN(BA) ? N * BA : NaN;
    setVal('f-count', N, 0);
    if (!isNaN(TA)) setVal('f-total-area', TA, 4);
  }

  // Пересчитываем цену
  if (trigger === 'totalPrice' && !isNaN(TP)) {
    if (!isNaN(N)  && N  > 0) PE = TP / N;
    if (!isNaN(V)  && V  > 0) PM = TP / V;
    setVal('f-price-each', PE, 2);
    setVal('f-price-m3',   PM, 0);
  } else if (trigger === 'priceEach' && !isNaN(PE) && !isNaN(N) && N > 0) {
    TP = PE * N;
    PM = (!isNaN(V) && V > 0) ? TP / V : NaN;
    setVal('f-total-price', TP, 0);
    if (!isNaN(PM)) setVal('f-price-m3', PM, 0);
  } else if (trigger === 'priceM3' && !isNaN(PM) && !isNaN(V) && V > 0) {
    TP = PM * V;
    PE = (!isNaN(N) && N > 0) ? TP / N : NaN;
    setVal('f-total-price', TP, 0);
    if (!isNaN(PE)) setVal('f-price-each', PE, 2);
  } else if (!isNaN(PE) && !isNaN(N) && N > 0) {
    TP = PE * N;
    PM = (!isNaN(V) && V > 0) ? TP / V : NaN;
    if (!document.getElementById('f-total-price').classList.contains('cf-computed'))
      setVal('f-total-price', TP, 0);
    if (!isNaN(PM) && !document.getElementById('f-price-m3').classList.contains('cf-computed'))
      setVal('f-price-m3', PM, 0);
  } else if (!isNaN(PM) && !isNaN(V) && V > 0) {
    TP = PM * V;
    PE = (!isNaN(N) && N > 0) ? TP / N : NaN;
    if (!document.getElementById('f-total-price').classList.contains('cf-computed'))
      setVal('f-total-price', TP, 0);
    if (!isNaN(PE) && !document.getElementById('f-price-each').classList.contains('cf-computed'))
      setVal('f-price-each', PE, 2);
  }

  // Заново читаем все значения (могли обновиться)
  N  = getVal('f-count');
  TA = getVal('f-total-area');
  V  = getVal('f-volume');
  PE = getVal('f-price-each');
  PM = getVal('f-price-m3');
  TP = getVal('f-total-price');

  var perM3 = (!isNaN(BV) && BV > 0) ? 1/BV : NaN;
  var PM2   = (!isNaN(TP) && !isNaN(TA) && TA > 0) ? TP/TA : NaN;
  var pogon = (!isNaN(N) && L > 0) ? N * L : NaN;

  // Выводим результаты
  setRes('r-board-area', !isNaN(BA) ? fmt(BA,'м²',4) : '—');
  setRes('r-board-vol',  !isNaN(BV) ? fmt(BV,'м³',6) : '—');
  setRes('r-per-m3',     !isNaN(perM3) ? fmt(perM3,'шт',0) : '—');
  setRes('r-count',      !isNaN(N)  ? fmt(N, 'шт',0) : '—');
  setRes('r-total-area', !isNaN(TA) ? fmt(TA,'м²',4) : '—');
  setRes('r-volume',     !isNaN(V)  ? fmt(V, 'м³',0) : '—');
  setRes('r-price-each', !isNaN(PE) ? fmtRub(PE) : '—');
  setRes('r-price-m3',   !isNaN(PM) ? fmtRub(PM) + ' /м³' : '—');
  setRes('r-total-price',!isNaN(TP) ? fmtRub(TP) : '—');
  // Дополнительные результаты если есть элементы
  var pm2el = document.getElementById('r-price-m2');
  if (pm2el) pm2el.textContent = !isNaN(PM2) ? fmtRub(PM2)+' /м²' : '—';
  var pogel = document.getElementById('r-pogon');
  if (pogel) pogel.textContent = !isNaN(pogon) ? fmt(pogon,'п.м.',1) : '—';
}

function clearAll() {
  var ids = ['f-thickness','f-width','f-length','f-board-area',
             'f-count','f-total-area','f-volume',
             'f-price-each','f-price-m3','f-total-price'];
  ids.forEach(function(id) {
    var el = document.getElementById(id);
    if (el) { el.value = ''; el.classList.remove('cf-computed'); }
  });
  var rids = ['r-board-area','r-board-vol','r-per-m3','r-count',
              'r-total-area','r-volume','r-price-each','r-price-m3','r-total-price'];
  rids.forEach(function(id) { setRes(id, '—'); });
}

// Запятая → точка в полях калькулятора
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.cf-input').forEach(function(inp) {
    inp.addEventListener('keypress', function(e) {
      if (e.key === ',') {
        e.preventDefault();
        var pos = this.selectionStart;
        this.value = this.value.slice(0,pos)+'.'+this.value.slice(pos);
        this.setSelectionRange(pos+1,pos+1);
        this.dispatchEvent(new Event('input'));
      }
    });
    // При ручном вводе снимаем класс computed
    inp.addEventListener('input', function() {
      this.classList.remove('cf-computed');
    });
  });
});

/* ── EASTER EGG: тройной клик по логотипу ── */
function initEasterEgg() {
  const logo = document.querySelector('.logo-text');
  if (!logo) return;
  let clicks = 0, timer;
  logo.style.cursor = 'pointer';
  logo.addEventListener('click', () => {
    clicks++;
    clearTimeout(timer);
    if (clicks >= 3) {
      clicks = 0;
      showEasterEgg();
    } else {
      timer = setTimeout(() => { clicks = 0; }, 600);
    }
  });

  // Закрыть по клику или ESC
  document.addEventListener('click', e => {
    const ov = document.getElementById('egg-overlay');
    if (ov && e.target === ov) hideEasterEgg();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') hideEasterEgg();
  });
}

function showEasterEgg() {
  const ov = document.getElementById('egg-overlay');
  const cv = document.getElementById('matrix-canvas');
  if (!ov || !cv) return;
  ov.classList.add('show');
  cv.classList.add('show');
  document.body.style.overflow = 'hidden';
  startMatrix(cv);
}
function hideEasterEgg() {
  const ov = document.getElementById('egg-overlay');
  const cv = document.getElementById('matrix-canvas');
  if (!ov) return;
  ov.classList.remove('show');
  cv.classList.remove('show');
  document.body.style.overflow = '';
  stopMatrix();
}

let matrixRaf;
function startMatrix(canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const cols = Math.floor(canvas.width / 18);
  const drops = Array(cols).fill(1);
  const chars = 'ОПТЭЛANGARSОСНА01лес01WOOD01';
  function draw() {
    ctx.fillStyle = 'rgba(10,15,10,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#aaff00';
    ctx.font = '14px monospace';
    for (let i = 0; i < drops.length; i++) {
      const ch = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(ch, i * 18, drops[i] * 18);
      if (drops[i] * 18 > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
    matrixRaf = requestAnimationFrame(draw);
  }
  draw();
}
function stopMatrix() {
  if (matrixRaf) cancelAnimationFrame(matrixRaf);
  const cv = document.getElementById('matrix-canvas');
  if (cv) { const ctx = cv.getContext('2d'); ctx.clearRect(0,0,cv.width,cv.height); }
}

/* обновляем DOMContentLoaded */
document.addEventListener('DOMContentLoaded', () => {
  initEasterEgg();
});

/* ═══════════════════════════════════════════════
   ГЛОБАЛЬНАЯ КОРЗИНА — работает на всех страницах
═══════════════════════════════════════════════ */
(function() {
  const CART_KEY = 'optel_cart';

  function loadCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch(e) { return []; }
  }
  function saveCart(cart) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch(e) {}
  }
  function fmtP(n) { return Math.round(n).toLocaleString('ru') + ' ₽'; }

  window.renderGlobalCart = renderGlobalCart;
  function renderGlobalCart() {
    const bar  = document.getElementById('global-cart-bar');
    const list = document.getElementById('global-cart-list');
    const cnt  = document.getElementById('global-cart-count');
    if (!bar) return;
    const cart = loadCart();
    if (!cart.length) {
      bar.classList.remove('visible');
      document.body.classList.remove('cart-open');
      return;
    }
    bar.classList.add('visible');
    document.body.classList.add('cart-open');
    if (cnt) cnt.textContent = cart.length;
    if (list) {
      if (cart.length > 0) {
        list.style.display = 'flex';
        list.innerHTML = cart.map(item =>
          `<div class="cart-tag">
            <span>${item.name} · ${item.size} · ${item.len} · ${item.sort} · ${item.vol} · <b>${item.price}</b></span>
            <span class="cart-tag-remove" onclick="globalRemoveFromCart('${item.type}')">×</span>
          </div>`
        ).join('');
      } else {
        list.style.display = 'none';
        list.innerHTML = '';
      }
    }
  }

  window.globalRemoveFromCart = function(type) {
    let cart = loadCart().filter(i => i.type !== type);
    saveCart(cart);
    renderGlobalCart();
    // Вешаем listeners на формы инжектированных модалок
    if (window.initFormListeners) setTimeout(window.initFormListeners, 100);
  };

  window.globalClearCart = function() {
    saveCart([]);
    renderGlobalCart();
    // Вешаем listeners на формы инжектированных модалок
    if (window.initFormListeners) setTimeout(window.initFormListeners, 100);
  };

  window.globalSendCart = function() {
    const cart = loadCart();
    if (!cart.length) return;
    const summary = cart.map(i =>
      `${i.name}: ${i.size}, ${i.len}, ${i.sort}, ${i.vol}, цена: ${i.price}`
    ).join('\n');
    const ov = document.getElementById('global-cart-send-overlay');
    const sf = document.getElementById('global-cart-summary');
    const hf = document.getElementById('global-cart-hidden');
    if (sf) sf.textContent = summary;
    if (hf) hf.value = summary;
    if (ov) { ov.classList.add('open'); document.body.style.overflow = 'hidden'; }
    const tel = document.querySelector('#global-cart-send-overlay input[type="tel"]');
    if (tel) applyPhoneMask(tel);
  };

  window.closeGlobalCartSend = function() {
    const ov = document.getElementById('global-cart-send-overlay');
    if (ov) { ov.classList.remove('open'); document.body.style.overflow = ''; }
  };

  // Инжектируем HTML корзины на все страницы
  function injectCartUI() {
    // Не инжектировать если уже есть (страница products.html имеет свою)
    if (document.getElementById('global-cart-bar')) return;
    const bar = document.createElement('div');
    bar.id = 'global-cart-bar';
    bar.className = 'cart-bar';
    bar.style.cssText = '';
    bar.innerHTML = `
      <div class="cart-bar-inner">
        <div class="cart-bar-left">
          <span class="cart-title">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M1 1h2l2.4 7.4a1 1 0 00.9.6h6.2a1 1 0 00.9-.7L15 4H4" stroke="#aaff00" stroke-width="1.4" fill="none" stroke-linecap="round"/>
              <circle cx="6" cy="13.5" r="1" fill="#aaff00"/><circle cx="12" cy="13.5" r="1" fill="#aaff00"/>
            </svg>
            Корзина
            <span id="global-cart-count" style="background:var(--lime);color:#000;border-radius:50%;width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;"></span>
          </span>
          <div class="cart-items-list" id="global-cart-list"></div>
        </div>
        <div class="cart-bar-actions">
          <button class="cart-clear" onclick="globalClearCart()">Очистить</button>
          <a href="products.html" class="btn btn-ghost" style="font-size:12px;padding:7px 14px;white-space:nowrap;">Изменить</a>
          <button class="cart-send-btn" onclick="globalSendCart()">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style="vertical-align:-1px;margin-right:4px;">
              <path d="M2 2h3.5L7 6l-1.5 1A7 7 0 009 10.5L10 9l4 1.5V14a1 1 0 01-1 1C5.4 15 1 10.6 1 5a1 1 0 011-1z" fill="currentColor"/>
            </svg>
            Отправить запрос
          </button>
        </div>
      </div>`;
    document.body.appendChild(bar);

    // Модалка отправки
    const ov = document.createElement('div');
    ov.className = 'modal-overlay';
    ov.id = 'global-cart-send-overlay';
    ov.innerHTML = `
      <div class="modal">
        <button class="modal-close" onclick="closeGlobalCartSend()">✕</button>
        <h3 style="font-family:var(--font-display);font-size:24px;letter-spacing:1px;">Отправить запрос</h3>
        <div id="global-cart-summary" style="background:var(--surface);border-radius:6px;padding:10px 14px;font-size:12px;color:var(--text2);margin:12px 0 16px;white-space:pre-line;"></div>
        <div class="form-group"><label class="form-label">Имя *</label><input type="text" id="gcart-name" class="form-input" placeholder="Иванов Иван"></div>
        <div class="form-group"><label class="form-label">Телефон *</label><input type="tel" id="gcart-phone" class="form-input" placeholder="+7 (___) ___-__-__"></div>
        <div class="form-group"><label class="form-label">Компания</label><input type="text" id="gcart-company" class="form-input" placeholder='ООО "Ваша компания"'></div>
        <div class="form-group"><label class="form-label">Комментарий</label><textarea id="gcart-comment" class="form-textarea" style="min-height:55px;" placeholder="Дополнительно..."></textarea></div>
        <button type="button" class="modal-submit" onclick="submitCartForm()">Отправить →</button>
        <div class="modal-note">Нажимая кнопку, вы принимаете <a href="privacy.html" style="color:var(--lime);">политику конфиденциальности</a> и даёте согласие на <a href="data-policy.html" style="color:var(--lime);">обработку персональных данных</a>.</div>
      </div>`;
    document.body.appendChild(ov);
    ov.addEventListener('click', e => { if (e.target === ov) closeGlobalCartSend(); });

    renderGlobalCart();
    // Вешаем listeners на формы инжектированных модалок
    if (window.initFormListeners) setTimeout(window.initFormListeners, 100);
  }

  window.submitCartForm = function() {
    var nameVal    = document.getElementById('gcart-name')    ? document.getElementById('gcart-name').value.trim()    : '';
    var phoneVal   = document.getElementById('gcart-phone')   ? document.getElementById('gcart-phone').value.trim()   : '';
    var companyVal = document.getElementById('gcart-company') ? document.getElementById('gcart-company').value.trim() : '';
    var commentVal = document.getElementById('gcart-comment') ? document.getElementById('gcart-comment').value.trim() : '';
    var summaryEl  = document.getElementById('global-cart-summary');
    var summaryVal = summaryEl ? summaryEl.textContent.trim() : '';

    if (!phoneVal || phoneVal.replace(/\D/g,'').length < 10) {
      var ph = document.getElementById('gcart-phone');
      if (ph) { ph.style.borderColor = '#ff5555'; ph.focus(); }
      return;
    }

    // Создаём форму с латинскими именами полей
    var fd = new FormData();
    Object.keys(data).forEach(function(k) { if (k !== '_next') fd.append(k, data[k]); });

    fetch('https://formsubmit.co/ajax/non_86@mail.ru', {
      method: 'POST',
      body: fd,
      headers: { 'Accept': 'application/json' }
    })
    .then(function(r) { return r.json(); })
    .then(function(d) {
      if (d.success === 'true' || d.success === true) {
        if (window.showFormToast) showFormToast('✓ Запрос отправлен — свяжемся сразу!', false);
        closeGlobalCartSend();
        saveCart([]);
        renderGlobalCart();
      } else {
        if (window.showFormToast) showFormToast('Ошибка отправки — попробуйте ещё раз', true);
      }
    })
    .catch(function() {
      if (window.showFormToast) showFormToast('Ошибка соединения', true);
    });

    // Уведомление пользователю
    if (window.showFormToast) showFormToast('✓ Запрос отправлен — свяжемся сразу!', false);
    closeGlobalCartSend();

    // Очищаем поля
    ['gcart-name','gcart-phone','gcart-company','gcart-comment'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) { el.value = ''; el.style.borderColor = ''; }
    });

    // Удаляем форму через паузу
    setTimeout(function() {
      if (form.parentNode) form.parentNode.removeChild(form);
      // iframe оставляем — нужен для завершения запроса
      setTimeout(function() {
        var fr = document.getElementById(iframeId);
        if (fr) fr.parentNode.removeChild(fr);
      }, 10000);
    }, 1000);
  };

  document.addEventListener('DOMContentLoaded', function() { if (!document.querySelector('.sale-banner')) injectCartUI(); });
  // Слушаем изменения localStorage с других вкладок
  window.addEventListener('storage', e => { if (e.key === 'optel_cart') renderGlobalCart(); });
})();

/* ═══════════════════════════════════════════
   УВЕДОМЛЕНИЕ ОБ ОТПРАВКЕ ФОРМЫ
═══════════════════════════════════════════ */
(function() {
  // Создаём тост-элемент
  function getOrCreateToast() {
    let el = document.getElementById('form-sent-toast');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'form-sent-toast';
    el.style.cssText = [
      'display:none',
      'position:fixed',
      'top:80px',
      'left:50%',
      'transform:translateX(-50%)',
      'background:var(--surface)',
      'border:1px solid rgba(170,255,0,0.35)',
      'border-left:3px solid var(--lime)',
      'border-radius:8px',
      'padding:14px 24px',
      'z-index:9000',
      'font-family:var(--font-body)',
      'font-size:14px',
      'font-weight:600',
      'color:var(--text)',
      'box-shadow:0 8px 30px rgba(0,0,0,0.5)',
      'white-space:nowrap',
      'display:none',
      'align-items:center',
      'gap:10px',
      'max-width:90vw',
    ].join(';');
    document.body.appendChild(el);
    return el;
  }

  function showFormToast(msg, isError) {
    const el = getOrCreateToast();
    const color = isError ? '#ff5555' : 'var(--lime)';
    const icon  = isError
      ? '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8" stroke="#ff5555" stroke-width="1.5"/><path d="M6 6l6 6M12 6l-6 6" stroke="#ff5555" stroke-width="1.5" stroke-linecap="round"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8" stroke="#aaff00" stroke-width="1.5"/><path d="M5.5 9l2.5 2.5 5-5" stroke="#aaff00" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    el.style.borderLeftColor = color;
    el.innerHTML = icon + '<span>' + msg + '</span>';
    el.style.display = 'flex';
    clearTimeout(el._t);
    el._t = setTimeout(() => { el.style.display = 'none'; }, 4500);
  }

  window.initFormListeners = initFormListeners;
  function initFormListeners() {
    document.querySelectorAll('form[action*="formsubmit"]').forEach(function(form) {
      if (form._sentListenerAdded) return;
      form._sentListenerAdded = true;
      form.addEventListener('submit', function(e) {
        // FormSubmit отправляет через fetch или redirect.
        // Мы используем обычный POST — браузер уходит на страницу формсабмита.
        // Чтобы перехватить и показать уведомление — используем fetch.
        e.preventDefault();
        const data = new FormData(form);
        // Добавим _next чтобы FormSubmit не редиректил
        data.set('_next', window.location.href + '?sent=1');

        // Добавим служебные поля
        if (!data.get('_source')) {
          data.set('_source', document.title || window.location.pathname);
        }

        // 1. Сразу показываем уведомление и закрываем форму
        showFormToast('✓ Сообщение отправлено — свяжемся сразу!', false);
        form.reset();

        // 2. Закрыть модалку
        var modal = form.closest('.modal-overlay, .pm-overlay');
        if (modal) {
          setTimeout(function() {
            if (modal.id === 'modal-overlay' && window.closeModal) closeModal();
            else if (modal.classList.contains('pm-overlay') && window.closePM) {
              closePM(modal.id.replace('pm-',''));
            }
            // Для global-cart-send-overlay
            else if (modal.id === 'global-cart-send-overlay' && window.closeGlobalCartSend) {
              closeGlobalCartSend();
            }
          }, 400);
        }

        // 3. Отправляем через скрытый iframe (обходит CORS)
        var iframeName = 'submit_iframe_' + Date.now();
        var iframe = document.createElement('iframe');
        iframe.name = iframeName;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        form.target = iframeName;
        // Временно ставим action без _next чтобы FormSubmit принял
        var origAction = form.action;
        form.submit();
        setTimeout(function() {
          form.target = '';
          document.body.removeChild(iframe);
        }, 5000);
      });
    });
  }

  // Вешаем на DOMContentLoaded и повторно через MutationObserver
  // (для форм, добавленных динамически — корзина и т.д.)
  document.addEventListener('DOMContentLoaded', initFormListeners);
  // Для форм внутри динамически инжектированных модалок
  window.addEventListener('load', initFormListeners);
})();

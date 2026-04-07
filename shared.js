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
}

/* ── SCROLL REVEAL ── */
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  initBurger();
  setActiveNav();
  initModal();
  initReveal();
  document.querySelectorAll('input[type="tel"]').forEach(applyPhoneMask);
});

/* ── CALCULATOR ── */
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
function c1calc() {
  const m3=parseFloat(document.getElementById('c1v').value), tv=document.getElementById('c1t').value, thm=parseFloat(document.getElementById('c1th').value);
  let th=tv?parseFloat(tv.split(',')[0]):(thm>0?thm:NaN), wb=tv?parseFloat(tv.split(',')[1]):NaN;
  if(isNaN(m3)||m3<=0||isNaN(th)||th<=0){document.getElementById('r1a').textContent='—';document.getElementById('r1b').textContent='—';return;}
  document.getElementById('r1a').textContent=fmt(m3/(th/1000))+' м²';
  if(!isNaN(wb)){document.getElementById('r1b').textContent=fmt(m3/((th/1000)*(wb/1000)*3),0)+' шт';document.getElementById('r1bl').textContent='Штук досок (длина 3 м)';}
  else document.getElementById('r1b').textContent='—';
}
function c2calc() {
  const m2=parseFloat(document.getElementById('c2v').value), tv=document.getElementById('c2t').value, thm=parseFloat(document.getElementById('c2th').value), res=parseFloat(document.getElementById('c2r').value)/100;
  let th=tv?parseFloat(tv):(thm>0?thm:NaN);
  if(isNaN(m2)||m2<=0||isNaN(th)||th<=0){document.getElementById('r2a').textContent='—';document.getElementById('r2b').textContent='—';return;}
  const m3c=m2*(th/1000);
  document.getElementById('r2a').textContent=fmt(m3c*(1+res))+' м³';
  document.getElementById('r2b').textContent=fmt(m3c)+' м³';
}
function c3calc() {
  const th=parseFloat(document.getElementById('c3a').value)/1000, wb=parseFloat(document.getElementById('c3b').value)/1000, len=parseFloat(document.getElementById('c3c').value), m3p=parseFloat(document.getElementById('c3d').value);
  if(isNaN(th)||isNaN(wb)||isNaN(len)||th<=0||wb<=0){['r3a','r3b','r3c'].forEach(id=>document.getElementById(id).textContent='—');return;}
  const per=1/(th*wb*len);
  document.getElementById('r3a').textContent=fmt(per,0)+' шт';
  document.getElementById('r3al').textContent='Штук в 1 м³ (длина '+len+' м)';
  if(!isNaN(m3p)&&m3p>0){document.getElementById('r3b').textContent=fmt(per*m3p,0)+' шт';document.getElementById('r3bl').textContent='Штук в '+m3p+' м³';}
  document.getElementById('r3c').textContent=fmt(1/th)+' м²';
}
function c4calc() {
  const area=parseFloat(document.getElementById('c4a').value), tv=document.getElementById('c4t').value, res=parseFloat(document.getElementById('c4r').value)/100;
  if(!tv||isNaN(area)||area<=0){['r4a','r4b','r4c'].forEach(id=>document.getElementById(id).textContent='—');return;}
  const p=tv.split(','), th=parseFloat(p[0])/1000, wb=parseFloat(p[1])/1000, len=parseFloat(p[2]);
  const m3=area*th*(1+res);
  document.getElementById('r4a').textContent=fmt(m3)+' м³';
  document.getElementById('r4b').textContent=fmt(Math.ceil(m3/(th*wb*len)),0)+' шт';
  document.getElementById('r4c').textContent='Уточните по телефону';
}

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
        <div class="modal-note">Соглашаетесь с <a href="privacy.html" style="color:var(--lime);">политикой</a>.</div>
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
    var form = document.createElement('form');
    form.method  = 'POST';
    form.action  = 'https://formsubmit.co/non_86@mail.ru';
    form.style.cssText = 'position:absolute;left:-9999px;top:-9999px;visibility:hidden;';

    var data = {
      '_subject':  'Заявка из корзины ОПТЭЛ',
      '_captcha':  'false',
      '_template': 'box',
      '_next':     window.location.href,
      'source':    'Корзина',
      'cart':      summaryVal,
      'name':      nameVal || 'Не указано',
      'phone':     phoneVal,
      'company':   companyVal,
      'comment':   commentVal,
    };

    Object.keys(data).forEach(function(key) {
      var inp = document.createElement('input');
      inp.type = 'hidden';
      inp.name = key;
      inp.value = data[key];
      form.appendChild(inp);
    });

    document.body.appendChild(form);

    // Отправляем в скрытый iframe
    var iframeId = 'optel_cart_frame';
    var existing = document.getElementById(iframeId);
    if (existing) existing.parentNode.removeChild(existing);

    var iframe = document.createElement('iframe');
    iframe.id   = iframeId;
    iframe.name = iframeId;
    iframe.style.cssText = 'position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;';
    document.body.appendChild(iframe);

    form.target = iframeId;
    form.submit();

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

  document.addEventListener('DOMContentLoaded', injectCartUI);
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

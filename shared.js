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

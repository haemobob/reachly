import { services, concepts, clamp, buildBrief } from './model.js';
import { startOrb } from './orb.js';
const $ = (q, node = document) => node.querySelector(q);
const $$ = (q, node = document) => [...node.querySelectorAll(q)];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
if (!reducedMotion.matches) document.body.classList.add('motion-enabled');
$('#year').textContent = new Date().getFullYear();

// Native dialogs retain focus and handle Escape without a custom focus trap.
const projectDialog = $('#project-dialog');
const privacyDialog = $('#privacy-dialog');
let lastFocus;
function openDialog(dialog) { lastFocus = document.activeElement; dialog.showModal(); }
$$('.project-open').forEach(button => button.addEventListener('click', () => { closeMenu(); openDialog(projectDialog); }));
$('.privacy-open').addEventListener('click', () => openDialog(privacyDialog));
$$('dialog').forEach(dialog => {
  $('.dialog-close', dialog).addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => lastFocus?.focus());
});

const menuToggle = $('.menu-toggle');
const menu = $('#mobile-menu');
function closeMenu() { menu.classList.remove('open'); menu.inert = true; menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.setAttribute('aria-label', 'Open menu'); }
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open)); menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); menu.classList.toggle('open', open); menu.inert = !open;
});
$$('a', menu).forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
const mobile = matchMedia('(max-width: 740px)');
mobile.addEventListener('change', closeMenu);

// Shared tab behavior: selection, roving focus, and arrow-key navigation.
function setupTabs(selector, update, vertical = false) {
  const tabs = $$(selector);
  function select(index, focus = false) {
    tabs.forEach((tab, i) => { tab.classList.toggle('active', i === index); tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
    if (focus) tabs[index].focus();
    update(index);
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(index));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === (vertical ? 'ArrowDown' : 'ArrowRight')) next = (index + 1) % tabs.length;
      if (event.key === (vertical ? 'ArrowUp' : 'ArrowLeft')) next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); select(next, true); }
    });
  });
  return select;
}
setupTabs('.service-tab', index => {
  const s = services[index];
  $('#service-panel').setAttribute('aria-labelledby', $$('.service-tab')[index].id);
  $('#service-title').textContent = s.title;
  $('#service-description').textContent = s.description;
  $('#service-tags').replaceChildren(...s.tags.map(tag => { const el = document.createElement('span'); el.textContent = tag; return el; }));
  $('.service-art').dataset.art = index;
  $('.art-headline').innerHTML = s.headline;
  $('.art-sticker').innerHTML = s.sticker;
}, true);

let conceptIndex = 0;
let conceptAnimation;
const selectConcept = setupTabs('.concept-switch button', index => {
  conceptIndex = index;
  const c = concepts[index];
  const panel = $('#concept-panel');
  panel.dataset.theme = index;
  panel.setAttribute('aria-labelledby', `concept-tab-${index}`);
  $('#concept-photo').src = c.image; $('#concept-photo').alt = c.alt;
  $('#concept-brand').textContent = c.brand;
  $('#concept-headline').innerHTML = c.headline;
  $('#concept-link').textContent = c.link;
  $('#concept-category').textContent = c.category;
  $('#concept-name').textContent = c.name;
  $('#concept-description').textContent = c.description;
  $('#concept-number').textContent = String(index + 1).padStart(2, '0');
  if (!reducedMotion.matches && typeof panel.animate === 'function') {
    conceptAnimation?.cancel();
    conceptAnimation = panel.animate([{ clipPath: 'inset(0 100% 0 0)', opacity: .6 }, { clipPath: 'inset(0 0 0 0)', opacity: 1 }], { duration: 550, easing: 'cubic-bezier(.2,.7,.3,1)' });
  }
});
$('#concept-next').addEventListener('click', () => selectConcept((conceptIndex + 1) % concepts.length));

// Draggable paper-world hero: pointer rotation, keyboard control, click to switch.
const stage = $('.hero-stage');
let rotation = { x: 5, y: -10 }; let dragging; let heroIndex = 0;
function rotateHero(x, y) { rotation = { x: clamp(x, -15, 15), y: clamp(y, -30, 30) }; stage.style.setProperty('--rotate-x', rotation.x + 'deg'); stage.style.setProperty('--rotate-y', rotation.y + 'deg'); }
function changeHero() {
  heroIndex = (heroIndex + 1) % concepts.length;
  const c = concepts[heroIndex];
  const site = $('.coffee-site');
  site.style.background = c.background; site.style.color = c.ink;
  $('.mock-nav b', site).textContent = c.brand;
  $('.mock-eyebrow', site).textContent = c.eyebrow;
  $('.coffee-layout h3', site).innerHTML = c.hero;
  const photo = $('.coffee-layout img', site); photo.src = c.image; photo.alt = c.alt;
}
stage.addEventListener('pointerdown', event => {
  if (event.button !== 0) return;
  stage.setPointerCapture(event.pointerId);
  dragging = { px: event.clientX, py: event.clientY, x: rotation.x, y: rotation.y, moved: false };
  stage.classList.add('dragging');
});
stage.addEventListener('pointermove', event => {
  if (!dragging || reducedMotion.matches) return;
  const dx = event.clientX - dragging.px, dy = event.clientY - dragging.py;
  if (Math.abs(dx) + Math.abs(dy) > 7) dragging.moved = true;
  rotateHero(dragging.x - dy * .075, dragging.y + dx * .075);
});
stage.addEventListener('pointerup', () => { if (dragging && !dragging.moved) changeHero(); dragging = null; stage.classList.remove('dragging'); });
stage.addEventListener('pointercancel', () => { dragging = null; stage.classList.remove('dragging'); });
stage.addEventListener('lostpointercapture', () => { dragging = null; stage.classList.remove('dragging'); });
stage.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); changeHero(); return; }
  const map = { ArrowLeft: [0, -5], ArrowRight: [0, 5], ArrowUp: [5, 0], ArrowDown: [-5, 0] };
  if (map[event.key]) { event.preventDefault(); if (!reducedMotion.matches) rotateHero(rotation.x + map[event.key][0], rotation.y + map[event.key][1]); }
});
setTimeout(() => stage.classList.add('ready'), 1450);

// A real comparison control, assisted by scroll only until the visitor takes over.
const range = $('#compare-range'); let comparisonManual = false;
range.addEventListener('input', () => { comparisonManual = true; $('.comparison').style.setProperty('--split', range.value + '%'); });
const visibleSections = new Set();
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('in-view'); visibleSections.add(entry.target.id || entry.target.className); }
  else visibleSections.delete(entry.target.id || entry.target.className);
}), { threshold: .12 });
$$('main > section').forEach(section => observer.observe(section));
let ticking = false, lastY = scrollY;
const process = $('#process');
function scrollFrame() {
  ticking = false;
  if (reducedMotion.matches) return;
  const y = scrollY;
  const heroOffset = clamp(y * .1, 0, 60);
  $('.hero-collage').style.translate = `0 ${heroOffset}px`;
  if (!comparisonManual && visibleSections.has('approach')) {
    const rect = $('.comparison').getBoundingClientRect();
    const progress = clamp((innerHeight - rect.top) / (innerHeight + rect.height), 0, 1);
    const split = clamp(90 - progress * 100, 5, 95);
    range.value = String(Math.round(split)); $('.comparison').style.setProperty('--split', split + '%');
  }
  if (!mobile.matches) {
    const distance = Math.max(1, process.offsetHeight - innerHeight);
    const progress = clamp(-process.getBoundingClientRect().top / distance, 0, 1);
    process.style.setProperty('--progress', Math.max(12, progress * 100) + '%');
    const step = Math.min(2, Math.floor(progress * 3));
    $$('.process-step').forEach((el, i) => el.classList.toggle('active', i === step));
  }
  // The Drive RGB-split reference inspires a restrained ink separation here only.
  if (visibleSections.has('work')) {
    const velocity = clamp((y - lastY) * .09, -3, 3);
    $('#concept-headline').style.textShadow = `${velocity}px 0 #ff5b2755, ${-velocity}px 0 #92b2ce44`;
    clearTimeout(scrollFrame.reset); scrollFrame.reset = setTimeout(() => $('#concept-headline').style.textShadow = 'none', 100);
  }
  if (visibleSections.has('contact')) $('.contact-star').style.setProperty('--star-turn', (y * .065 % 360) + 'deg');
  lastY = y;
}
addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(scrollFrame); ticking = true; } }, { passive: true });
addEventListener('resize', scrollFrame, { passive: true });
scrollFrame();
$$('.magnetic').forEach(button => {
  button.addEventListener('pointermove', event => { if (reducedMotion.matches || event.pointerType !== 'mouse') return; const rect = button.getBoundingClientRect(); button.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * .08}px, ${(event.clientY - rect.top - rect.height / 2) * .13}px)`; });
  button.addEventListener('pointerleave', () => button.style.transform = '');
});
reducedMotion.addEventListener('change', event => { document.body.classList.toggle('motion-enabled', !event.matches); if (event.matches) { $('.hero-collage').style.translate = ''; $('#concept-headline').style.textShadow = 'none'; $('.contact-star').style.setProperty('--star-turn', '0deg'); } else scrollFrame(); });
startOrb($('#orb'), reducedMotion);

// No fake submission: a local project planner produces an exportable brief.
const form = $('#project-form'); const storageKey = 'reachly-project-draft-v1'; let brief = '';
function formData() { const data = new FormData(form); return { name: String(data.get('name') || ''), business: String(data.get('business') || ''), email: String(data.get('email') || ''), message: String(data.get('message') || ''), goals: data.getAll('goals').map(String) }; }
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
  if (saved && typeof saved === 'object') {
    ['name', 'business', 'email', 'message'].forEach(key => { if (typeof saved[key] === 'string') form.elements[key].value = saved[key].slice(0, key === 'message' ? 2000 : 200); });
    if (Array.isArray(saved.goals)) $$('input[name="goals"]', form).forEach(el => el.checked = saved.goals.includes(el.value));
  }
} catch { /* Private browsing and disabled storage still allow the planner. */ }
form.addEventListener('input', () => { try { localStorage.setItem(storageKey, JSON.stringify(formData())); } catch {} });
form.addEventListener('submit', event => { event.preventDefault(); if (!form.reportValidity()) return; brief = buildBrief(formData()); $('#brief-text').textContent = brief; form.hidden = true; $('.planner-intro').hidden = true; $('#brief-result').hidden = false; $('#download-brief').focus(); projectDialog.scrollTop = 0; });
$('#edit-brief').addEventListener('click', () => { form.hidden = false; $('.planner-intro').hidden = false; $('#brief-result').hidden = true; form.elements.name.focus(); });
$('#download-brief').addEventListener('click', () => { const url = URL.createObjectURL(new Blob([brief], { type: 'text/plain;charset=utf-8' })); const a = document.createElement('a'); a.href = url; a.download = 'reachly-project-brief.txt'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1500); });
$('#copy-brief').addEventListener('click', async () => { try { await navigator.clipboard.writeText(brief); $('#copy-status').textContent = 'Copied. Your brief is ready to share.'; } catch { const selection = getSelection(); const range = document.createRange(); range.selectNodeContents($('#brief-text')); selection.removeAllRanges(); selection.addRange(range); $('#copy-status').textContent = 'Select and copy the highlighted brief, or use Download brief.'; } });
$('#clear-draft').addEventListener('click', () => { try { localStorage.removeItem(storageKey); } catch {} form.reset(); brief = ''; $('#brief-text').textContent = ''; $('#brief-result').hidden = true; form.hidden = false; $('.planner-intro').hidden = false; $('#privacy-status').textContent = 'Your saved project draft has been cleared from this browser.'; });

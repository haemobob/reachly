import { services, concepts, clamp, buildBrief } from './model.js';
import { startOrb } from './orb.js';
import { setupMotion } from './motion.js';
import { startWorld } from './world.js';
const $ = (q, node = document) => node.querySelector(q);
const $$ = (q, node = document) => [...node.querySelectorAll(q)];
const systemMotion = matchMedia('(prefers-reduced-motion: reduce)');
const reducedMotion = new EventTarget();
let motionPaused = false;
try { motionPaused = localStorage.getItem('reachly-motion-paused') === 'true'; } catch {}
const motionButton = $('#motion-toggle');
function syncMotion() {
  reducedMotion.matches = systemMotion.matches || motionPaused;
  document.body.classList.toggle('motion-paused', reducedMotion.matches);
  document.body.classList.toggle('motion-enabled', !reducedMotion.matches);
  motionButton.setAttribute('aria-pressed', String(reducedMotion.matches));
  motionButton.disabled = systemMotion.matches;
  motionButton.textContent = systemMotion.matches ? 'Reduced motion on' : motionPaused ? 'Resume motion' : 'Pause motion';
  const event = new Event('change'); event.matches = reducedMotion.matches; reducedMotion.dispatchEvent(event);
}
systemMotion.addEventListener('change', syncMotion);
motionButton.addEventListener('click', () => {
  motionPaused = !motionPaused;
  try { localStorage.setItem('reachly-motion-paused', String(motionPaused)); } catch {}
  syncMotion();
});
syncMotion();
if (!reducedMotion.matches) document.body.classList.add('motion-enabled');
$('#year').textContent = new Date().getFullYear();

// Native dialogs retain focus and handle Escape without a custom focus trap.
const projectDialog = $('#project-dialog');
const privacyDialog = $('#privacy-dialog');
let lastFocus;
function openDialog(dialog) { lastFocus = document.activeElement; dialog.showModal(); }
$$('.project-open').forEach(button => button.addEventListener('click', () => {
  if (button.dataset.goal) {
    const goal = $$('input[name="goals"]').find(el => el.value === button.dataset.goal);
    if (goal) { goal.checked = true; form.dispatchEvent(new Event('input')); }
    form.hidden = false; $('.planner-intro').hidden = false; $('#brief-result').hidden = true;
  }
  closeMenu(); openDialog(projectDialog);
}));
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
const menuBackground = $$('main, .footer, .header');
function closeMenu() {
  const restoreFocus = menu.contains(document.activeElement);
  menuBackground.forEach(el => { el.inert = false; });
  if (restoreFocus) menuToggle.focus({ preventScroll: true });
  menu.classList.remove('open'); menu.inert = true;
  document.body.classList.remove('menu-open');
  menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.setAttribute('aria-label', 'Open menu');
}
menuToggle.addEventListener('click', () => {
  if (menuToggle.getAttribute('aria-expanded') === 'true') { closeMenu(); return; }
  menuToggle.setAttribute('aria-expanded', 'true'); menuToggle.setAttribute('aria-label', 'Close menu');
  menu.classList.add('open'); menu.inert = false;
  menuBackground.forEach(el => { el.inert = true; });
  document.body.classList.add('menu-open');
  $('a', menu).focus();
});
$('.menu-close', menu).addEventListener('click', closeMenu);
$$('a', menu).forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
  if (event.key !== 'Tab' || menu.inert) return;
  const controls = $$('a, button', menu);
  const index = controls.indexOf(document.activeElement);
  const next = (index + (event.shiftKey ? -1 : 1) + controls.length) % controls.length;
  event.preventDefault(); controls[next].focus();
});
const mobile = matchMedia('(max-width: 740px)');
mobile.addEventListener('change', closeMenu);

// Native scrolling also works by touch and keyboard when JavaScript is unavailable.
const projectRail = $('#project-rail');
const railButtons = $$('[data-rail-dir]');
function syncRailButtons() {
  const end = projectRail.scrollWidth - projectRail.clientWidth;
  railButtons.forEach(button => { button.disabled = Number(button.dataset.railDir) < 0 ? projectRail.scrollLeft <= 5 : projectRail.scrollLeft >= end - 5; });
}
railButtons.forEach(button => button.addEventListener('click', () => {
  const card = $('.project-card', projectRail);
  const step = card.getBoundingClientRect().width + parseFloat(getComputedStyle(projectRail).gap);
  projectRail.scrollBy({ left: Number(button.dataset.railDir) * step, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
}));
projectRail.addEventListener('scroll', syncRailButtons, { passive: true });
addEventListener('resize', syncRailButtons);
syncRailButtons();

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
const serviceArt = [
  '<div class="art-window"><div class="art-top">yourbusiness.com <span>↗</span></div><div class="art-headline">HELLO,<br><em>WORLD.</em></div><div class="art-grid"><i></i><i></i><i></i></div><div class="art-line"></div></div><span class="art-sticker">YOUR<br>STORY.</span>',
  '<div class="presence-art"><div class="presence-orbit"></div><div class="presence-center">your brand</div><span class="presence-node">Website</span><span class="presence-node">Business profile</span><span class="presence-node">Social channels</span></div>',
  '<div class="roadmap-art"><span class="roadmap-label">A PLAN WITH PURPOSE.</span><div class="roadmap-title">FIRST THINGS<br>FIRST.</div><div class="roadmap-path"><b>Clarify</b><i></i><b>Prioritize</b><i></i><b>Create</b></div><div class="roadmap-foot"><span>YOUR GOALS</span><span>YOUR NEXT STEP ↗</span></div></div>',
  '<div class="workflow-art"><div class="workflow-title">AN ILLUSTRATIVE WORKFLOW</div><div class="flow-node">New inquiry <span>01</span></div><div class="flow-connector"></div><div class="flow-node">Route the details <span>02</span></div><div class="flow-connector"></div><div class="flow-node">Notify the team <span>03</span></div></div>',
  '<div class="search-art"><div class="search-query">Your business, easier to find <span>↗</span></div><div class="search-result"><small>yourbusiness.com / services</small><b>Clear pages. Relevant information.</b><span>Structure, metadata, and search foundations.</span></div><div class="search-result"><small>ILLUSTRATIVE SEARCH RESULT</small><span>Search performance is never guaranteed.</span></div></div>'
];
const selectService = setupTabs('.service-tab', index => {
  const s = services[index];
  $('#service-panel').setAttribute('aria-labelledby', $$('.service-tab')[index].id);
  $('#service-title').textContent = s.title;
  $('#service-description').textContent = s.description;
  $('#service-caption').textContent = s.caption;
  $('#service-tags').replaceChildren(...s.tags.map(tag => { const el = document.createElement('span'); el.textContent = tag; return el; }));
  const art = $('.service-art');
  art.dataset.art = index;
  art.innerHTML = serviceArt[index]; // Fixed site-authored templates, never visitor data.
  $('.service-project').dataset.goal = s.goal;
  if (!reducedMotion.matches && typeof art.animate === 'function') art.animate([{ opacity: .65, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 240, easing: 'ease-out' });
}, true);
selectService(0);

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
$$('.spotlight-button').forEach(button => button.addEventListener('click', () => {
  selectConcept(Number(button.dataset.explore));
  $('#work').scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
  $('#concept-panel').focus({ preventScroll: true });
}));

// Draggable paper-world hero: pointer rotation, keyboard control, click to switch.
const stage = $('.hero-stage');
let rotation = { x: 5, y: -10 }; let dragging; let heroIndex = 0;
function rotateHero(x, y) { rotation = { x: clamp(x, -15, 15), y: clamp(y, -30, 30) }; stage.style.setProperty('--rotate-x', rotation.x + 'deg'); stage.style.setProperty('--rotate-y', rotation.y + 'deg'); }
function changeHero() {
  heroIndex = (heroIndex + 1) % concepts.length;
  const c = concepts[heroIndex];
  $('#hero-demo-number').textContent = String(heroIndex + 1).padStart(2, '0');
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
  if (!dragging) return;
  const dx = event.clientX - dragging.px, dy = event.clientY - dragging.py;
  if (Math.abs(dx) + Math.abs(dy) > 7) dragging.moved = true;
  if (reducedMotion.matches) return;
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
function setComparison(value) {
  const split = clamp(value, 5, 95);
  range.value = String(Math.round(split)); $('.comparison').style.setProperty('--split', split + '%');
}
// Smaller pointer feedback is separate from the image-spot animation.
$$('.magnetic').forEach(button => {
  button.addEventListener('pointermove', event => { if (reducedMotion.matches || event.pointerType !== 'mouse') return; const rect = button.getBoundingClientRect(); button.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * .06}px, ${(event.clientY - rect.top - rect.height / 2) * .1}px)`; });
  button.addEventListener('pointerleave', () => button.style.transform = '');
});
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) {
    $$('.magnetic').forEach(el => el.style.transform = '');
    conceptAnimation?.cancel();
  }
});
setupMotion({ motion: reducedMotion, getComparisonManual: () => comparisonManual, setComparison });
startOrb($('#orb'), reducedMotion);
startWorld(stage, reducedMotion);

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

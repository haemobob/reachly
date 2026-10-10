import { pointerPose } from './model.js';

// ScrollTrigger is progressively enhanced; the entire page is readable without it.
// The gooey line filter and image spots adapt the two supplied Drive components.
export function setupMotion({ motion, getComparisonManual, setComparison }) {
  const { gsap, ScrollTrigger } = window;
  if (!gsap || !ScrollTrigger) return () => {};
  gsap.registerPlugin(ScrollTrigger);
  let media;
  let entranceDone = false;
  const $ = q => document.querySelector(q);
  const $$ = q => [...document.querySelectorAll(q)];
  function install() {
    media?.revert();
    $('.portfolio')?.style.removeProperty('clip-path');
    $$('.project-visual').forEach(el => el.style.removeProperty('clip-path'));
    $$('.goo-shell').forEach(el => el.classList.remove('goo-filter'));
    document.body.classList.remove('gsap-active');
    if (motion.matches) return;
    document.body.classList.add('gsap-active');
    media = gsap.matchMedia();
    media.add({ desktop: '(min-width: 1000px)', pointer: '(hover: hover) and (pointer: fine)', allowed: '(prefers-reduced-motion: no-preference)' }, context => {
      if (!context.conditions.allowed) return;
      const removers = [];
      if (!entranceDone) {
        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .fromTo('.hero-line', { yPercent: 22, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .8, stagger: .13 })
          .fromTo('.hero-intro', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .55 }, .28);
        entranceDone = true;
      }
      $$('.goo-shell').forEach(el => el.classList.add('goo-filter'));
      gsap.fromTo('.goo-inner', { filter: 'blur(.12em)' }, {
        filter: 'blur(0em)', duration: .85, stagger: .12, ease: 'power3.out',
        scrollTrigger: { trigger: '.manifesto-title', start: 'top 82%', once: true },
        onComplete: () => $$('.goo-shell').forEach(el => el.classList.remove('goo-filter'))
      });
      // The transformation has its own scroll language and always yields to input.
      ScrollTrigger.create({ trigger: '.comparison', start: 'top 85%', end: 'bottom 40%',
        onUpdate: self => { if (!getComparisonManual()) setComparison(88 - self.progress * 76); }
      });
      // An aperture opens onto the concept, rather than another generic fade-in.
      gsap.fromTo('.concept-image', { clipPath: 'inset(12% 8% 12% 8% round 36px)' }, {
        clipPath: 'inset(0% 0% 0% 0% round 10px)', ease: 'none',
        scrollTrigger: { trigger: '.concept-image', start: 'top 90%', end: 'top 28%', scrub: .45 }
      });
      // Open the actual work section, so the transition reveals real client content.
      // Inset travel stays small; project information remains readable throughout.
      gsap.fromTo('.portfolio', { clipPath: 'inset(0% 5% 0% 5% round 42px)' }, {
        clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none',
        scrollTrigger: { trigger: '.portfolio', start: 'top 95%', end: 'top 35%', scrub: .35 }
      });
      gsap.fromTo('.project-visual', { clipPath: 'inset(0% 0% 8% 0% round 8px)' }, {
        clipPath: 'inset(0% 0% 0% 0% round 8px)', stagger: .08, ease: 'none',
        scrollTrigger: { trigger: '.project-grid', start: 'top 90%', end: 'top 40%', scrub: .3 }
      });
      if (context.conditions.desktop) {
        // Native scrolling + GSAP pin/scrub adapt Scroll Animation/9's master
        // timeline. No Lenis: wheel, keyboard and touch retain browser behavior.
        gsap.timeline({ scrollTrigger: { trigger: '.hero-world', start: 'top 12%', end: '+=65%', pin: true, scrub: .8, anticipatePin: 1, invalidateOnRefresh: true } })
          .to('.hero-stage', { '--world-turn': 1.45, ease: 'none' }, 0)
          .to('.hero-collage', { scale: .86, yPercent: -5, ease: 'none' }, 0)
          .to('.hero-browser', { rotationZ: -18, xPercent: -10, ease: 'none' }, 0)
          .to('.phone', { rotationZ: 22, xPercent: 12, ease: 'none' }, 0);
        // Native scrollLeft preserves touch, focus reveal and button navigation.
        const rail = $('#project-rail');
        let railManual = false;
        const manualRail = () => { railManual = true; };
        for (const el of [rail, ...$$('[data-rail-dir]')]) {
          for (const name of ['pointerdown', 'keydown', 'focusin', 'click']) {
            el.addEventListener(name, manualRail);
            removers.push(() => el.removeEventListener(name, manualRail));
          }
        }
        ScrollTrigger.create({ id: 'client-gallery', trigger: rail, start: 'top 14%',
          end: () => '+=' + Math.max(1, rail.scrollWidth - rail.clientWidth),
          pin: true, anticipatePin: 1, invalidateOnRefresh: true,
          onUpdate: self => { if (!railManual) rail.scrollLeft = self.progress * (rail.scrollWidth - rail.clientWidth); }
        });
        gsap.fromTo('.blueprint-sheet', { rotation: -3, scale: .96 }, { rotation: 1.5, scale: 1, ease: 'none',
          scrollTrigger: { trigger: '.services', start: 'top 80%', end: 'bottom 65%', scrub: .8 } });
        gsap.timeline({ scrollTrigger: { trigger: '.process-track', start: 'top 42%',
          end: () => '+=' + Math.max(400, $('.process-track').scrollWidth - $('.process-track').clientWidth),
          pin: '.process', scrub: .8, invalidateOnRefresh: true } })
          .fromTo('.process-rail > span', { scaleX: 0 }, { scaleX: 1, ease: 'none' }, 0)
          .to('.process-track', { x: () => -Math.max(0, $('.process-track').scrollWidth - $('.process-track').clientWidth), ease: 'none' }, 0);
      }
      gsap.fromTo('.manifesto-photo', { yPercent: 15, rotation: 12 }, { yPercent: -10, rotation: -4, ease: 'none',
        scrollTrigger: { trigger: '.manifesto', start: 'top bottom', end: 'bottom top', scrub: .8 } });
      // The inspected 30-blind source splits its masks into center-opening bars.
      // Twelve DOM bars use that staggered scale reveal over Reachly's own image.
      let blinds = $('.image-blinds');
      if (!blinds) {
        blinds = document.createElement('div'); blinds.className = 'image-blinds'; blinds.setAttribute('aria-hidden', 'true');
        for (let i = 0; i < 12; i++) blinds.append(document.createElement('span'));
        $('.concept-image').append(blinds);
      }
      gsap.fromTo('.image-blinds > span', { scaleY: 1 }, { scaleY: 0, stagger: .02, ease: 'power3.out',
        scrollTrigger: { trigger: '.work', start: 'top 60%', end: 'top 5%', scrub: .8 } });
      if (context.conditions.pointer) {
        $$('.spotlight-button').forEach(button => {
          const card = button.querySelector('.spot-card');
          const img = card.querySelector('img');
          let bounds;
          gsap.set(card, { xPercent: -50, yPercent: -50, x: 0, y: 0, scale: .08, autoAlpha: 0 });
          const toX = gsap.quickTo(card, 'x', { duration: .35, ease: 'power3.out' });
          const toY = gsap.quickTo(card, 'y', { duration: .35, ease: 'power3.out' });
          const toRX = gsap.quickTo(card, 'rotationX', { duration: .4, ease: 'power3.out' });
          const toRY = gsap.quickTo(card, 'rotationY', { duration: .4, ease: 'power3.out' });
          function open() { bounds = button.getBoundingClientRect(); gsap.to(card, { scale: 1, autoAlpha: 1, duration: .5, ease: 'power3.out', overwrite: 'auto' }); }
          function close() {
            if (button.matches(':focus-visible')) return;
            gsap.to(card, { scale: .08, autoAlpha: 0, x: 0, y: 0, rotationX: 0, rotationY: 0, duration: .3, ease: 'power2.in', overwrite: 'auto' });
            gsap.to(img, { x: 0, y: 0, duration: .3, overwrite: 'auto' });
          }
          function move(event) {
            if (event.pointerType !== 'mouse' || !bounds) return;
            const pose = pointerPose(event.clientX - bounds.left - bounds.width / 2, event.clientY - bounds.top - bounds.height / 2);
            toX(pose.x); toY(pose.y); toRX(pose.rotateX); toRY(pose.rotateY);
            gsap.to(img, { x: -pose.x, y: -pose.y, duration: .35, overwrite: 'auto' });
          }
          for (const [name, fn] of [['pointerenter', open], ['focus', open], ['pointerleave', close], ['blur', close], ['pointermove', move]]) {
            button.addEventListener(name, fn); removers.push(() => button.removeEventListener(name, fn));
          }
        });
      }
      return () => {
        removers.forEach(fn => fn());
        $$('.goo-shell').forEach(el => el.classList.remove('goo-filter'));
      };
    });
  }
  install();
  motion.addEventListener('change', install);
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  $$('img').forEach(img => { if (!img.complete) img.addEventListener('load', () => ScrollTrigger.refresh(), { once: true }); });
  addEventListener('pageshow', () => ScrollTrigger.refresh());
  return () => { media?.revert(); motion.removeEventListener('change', install); };
}

import { pointerPose, processStages } from './model.js';

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
    $$('.handoff-work > span').forEach(el => el.style.removeProperty('clip-path'));
    $('.handoff-line')?.style.removeProperty('transform');
    $$('.goo-shell').forEach(el => el.classList.remove('goo-filter'));
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
      // Drive Scroll Animation / 53: diagonal nine-mask order, adapted to a section boundary.
      // CSS grid replaces its duplicated background images; native scrolling remains intact.
      gsap.fromTo('.handoff-work > span', { clipPath: 'polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)' }, {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        stagger: index => (Math.floor(index / 3) + index % 3) * .08, ease: 'power2.out',
        scrollTrigger: { trigger: '.handoff-work', start: 'top 95%', end: 'bottom 55%', scrub: .35 }
      });
      gsap.fromTo('.handoff-line', { scaleX: .04 }, {
        scaleX: 1, transformOrigin: 'left', ease: 'none',
        scrollTrigger: { trigger: '.handoff-plan', start: 'top 90%', end: 'bottom 65%', scrub: .25 }
      });
      if (context.conditions.desktop) {
        gsap.fromTo('.process-rail > span', { scaleY: 0 }, { scaleY: 1, ease: 'none',
          scrollTrigger: { trigger: '.process-track', start: 'top 52%', end: 'bottom 52%', scrub: .25 }
        });
        const steps = $$('.process-step');
        function activate(i) {
          steps.forEach((el, index) => el.classList.toggle('active', i === index));
          $('#process-count').textContent = String(i + 1).padStart(2, '0');
          $('#process-name').textContent = processStages[i].toUpperCase();
        }
        steps.forEach((el, i) => ScrollTrigger.create({ trigger: el, start: 'top 55%', end: 'bottom 55%', onEnter: () => activate(i), onEnterBack: () => activate(i) }));
      }
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

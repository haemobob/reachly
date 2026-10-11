import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
let context: gsap.Context | undefined;
function setup() {
  context?.revert();
  if (document.documentElement.dataset.motion === "paused") return;
  context = gsap.context(() => {
    gsap.from(".hero-title", { y: 25, duration: 1.15, ease: "power3.out" });
    gsap.from(".hero-project", {
      y: 35,
      rotation: -10,
      duration: 1.4,
      ease: "power3.out",
    });
    gsap.to(".orbit-stamp", {
      rotation: 8,
      scrollTrigger: {
        trigger: ".studio-hero",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
    });
    gsap.utils.toArray<HTMLElement>(".work-image").forEach((el) =>
      gsap.from(el.querySelector("img"), {
        y: 35,
        scale: 1.04,
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          end: "bottom 55%",
          scrub: 1,
        },
      }),
    );
    gsap.to(".invite-lines", {
      rotation: 15,
      scale: 1.12,
      scrollTrigger: {
        trigger: ".possibilities-invite",
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });
  });
}
setup();
window.addEventListener("reachly:motion", setup);
window.addEventListener("pagehide", (event) => {
  if (event.persisted) return;
  context?.revert();
  window.removeEventListener("reachly:motion", setup);
});

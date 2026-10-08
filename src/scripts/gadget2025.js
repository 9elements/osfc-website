import { register } from "swiper/element/bundle";
register();

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

gsap.to(".gadget-intro__illustration", {
  scrollTrigger: {
    scrub: 1.5,
    start: "top bottom",
    end: "bottom top",
    trigger: ".gadget-intro__illustration",
    invalidateOnRefresh: true,
  },
  "--progress": 1,
});

gsap.utils.toArray(".gadget-intro__illustration-line").forEach((line) => {
  gsap.to(line, {
    scrollTrigger: {
      scrub: 2,
      start: "top bottom",
      end: "center center",
      trigger: line,
      invalidateOnRefresh: true,
    },
    "--progress": 1,
  });
});

const pointerMediaQuery = window.matchMedia("(pointer: fine)");

/**
 * Add a slight parallax effect to the keycap when moving the mouse
 *
 * @param {boolean} enabled - Whether to enable or disable the pointer listener.
 * @property {Function|null} [setupPointerListener.cleanup] - Cleanup function to remove listeners and CSS variables.
 */
function setupPointerListener(enabled) {
  if (enabled) {
    let targetX = 0,
      targetY = 0;
    let state = { x: 0, y: 0 };

    function onMouseMove(e) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      targetX = (e.clientX - centerX) / centerX;
      targetY = (e.clientY - centerY) / centerY;
    }

    window.addEventListener("mousemove", onMouseMove);

    const ticker = () => {
      state.x += (targetX - state.x) * 0.2;
      state.y += (targetY - state.y) * 0.2;

      document.documentElement.style.setProperty(
        "--pointer-x",
        state.x.toFixed(4),
      );
      document.documentElement.style.setProperty(
        "--pointer-y",
        state.y.toFixed(4),
      );
    };

    gsap.ticker.add(ticker);

    // Store cleanup for later removal
    setupPointerListener.cleanup = () => {
      window.removeEventListener("mousemove", onMouseMove);
      gsap.ticker.remove(ticker);
    };
  } else if (setupPointerListener.cleanup) {
    setupPointerListener.cleanup();
    setupPointerListener.cleanup = null;
    document.documentElement.style.removeProperty("--pointer-x");
    document.documentElement.style.removeProperty("--pointer-y");
  }
}

setupPointerListener(pointerMediaQuery.matches);

pointerMediaQuery.addEventListener("change", (e) => {
  setupPointerListener(e.matches);
});

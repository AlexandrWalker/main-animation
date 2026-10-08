/**
 * Анмиация параллакса
 */
window.initQueue.push(function () {

  if(!document.querySelector('.parallax')) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".parallax",
      start: "top top",
      end: "+=150%",
      scrub: 1,
      pin: true,
      anticipatePin: 1
    }
  });

  gsap.set(".parallax__item", {
    y: "100vh",
    opacity: 0
  });

  tl.to(".parallax__bg", {
    y: "-30vh",
    ease: "none"
  }, 0);

  tl.to(".parallax__item", {
    opacity: 1,
    y: 0,
    stagger: 0.35,
    ease: "power2.out"
  }, 0);

});

window.initQueue.push(function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const parallaxItems = document.querySelectorAll('[data-parallax]');
  if (!parallaxItems.length) return;

  parallaxItems.forEach(item => {
    const speedAttr = item.getAttribute('data-parallax-y');
    const speed = speedAttr ? parseFloat(speedAttr) : 180;

    gsap.set(item, {
      force3D: true,
      transformPerspective: 1000,
      backfaceVisibility: 'hidden'
    });

    gsap.fromTo(item,
      {
        y: speed
      },
      {
        y: -speed,
        ease: "none",
        scrollTrigger: {
          trigger: item,
          start: "top 95%",
          end: "bottom 5%",
          scrub: true
        }
      }
    );
  });
});
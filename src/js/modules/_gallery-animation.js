/**
 * Анимация картинок галереи
 */
window.initQueue.push(function () {
  if (!document.querySelector(('[data-anim="gallery"]'))) return;

  gsap.utils.toArray('[data-anim="gallery"]').forEach(dataAnimItem => {
    gsap.from(dataAnimItem, {
      duration: 0.8,
      opacity: 0,
      scale: 0.8,
      y: 40,
      stagger: {
        each: 0.15,
        from: 'start'
      },
      ease: 'power.out',
      scrollTrigger: {
        trigger: dataAnimItem,
        start: 'top center',
        end: 'bottom top',
        toggleActions: 'play none none none',
      }
    });
  });
});
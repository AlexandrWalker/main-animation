/**
 * Инициализация Fabcybox
 */
Fancybox.bind('[data-fancybox]', {
  Html: {
    autoSize: false,
  },
  on: {
    'Carousel.ready': () => {
      lenis.stop();
    },
    destroy: () => {
      lenis.start();
    }
  }
});
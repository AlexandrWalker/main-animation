/**
 * Подключение ScrollTrigger
 * Подключение SplitText
 */
gsap.registerPlugin(ScrollTrigger, SplitText);

/**
 * Глобальная функция инициализации контента страницы
 * Вызывается при первой загрузке и при каждом переходе Barba
 */
window.initPageContent = function () {
  // Очищаем массив очередей анимаций перед повторным заполнением
  window.initQueue = [];

  //=include modules/_btn-animation.js
  //=include modules/_text-animation.js
  //=include modules/_parallax-animation.js
  //=include modules/_gallery-animation.js
  //=include modules/_block-animation.js

  // Запуск стандартных слайдеров и кастомных клип-слайдеров
  if (typeof window.initSliders === 'function') window.initSliders();
  if (typeof window.initClipSliders === 'function') window.initClipSliders();

  // Запуск очереди анимаций GSAP
  if (window.initQueue && window.initQueue.length) {
    window.initQueue.forEach(initFunc => {
      try { initFunc(); } catch (err) { console.error('[GSAP Init Error]', err); }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {

  const checkEditMode = document.querySelector('.bx-panel-toggle-on') ?? null;

  //=include modules/_init-lenis.js

  //=include modules/_header.js

  //=include modules/_trash.js

  //=include modules/_sliders.js

  //=include modules/_clip-slider.js

  //=include modules/_init-fancybox.js

  //=include modules/_ios-safe.js

  // Запускаем скрипты для первой (стартовой) страницы
  window.initPageContent();

  //=include modules/_init-barba.js

  window.addEventListener('resize', function () { ScrollTrigger.update() });

});
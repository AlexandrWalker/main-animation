/**
 * iOS-safe ScrollTrigger refresh handler
 */
(function () {
  let resizeTimer;
  let lastWidth = window.innerWidth;
  let lastHeight = window.innerHeight;

  // Функция для стабильного пересчёта
  const safeRefresh = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;

      // Проверяем — реально ли изменился размер экрана
      const widthChanged = Math.abs(currentWidth - lastWidth) > 50;
      const heightChanged = Math.abs(currentHeight - lastHeight) > 150;

      if (widthChanged || heightChanged) {
        lastWidth = currentWidth;
        lastHeight = currentHeight;
        console.log('refresh');
        ScrollTrigger.refresh();
      }
    }, 250); // debounce 250ms — достаточно для всех платформ
  };

  // Реакция на изменение ориентации (особенно важно для iOS)
  window.addEventListener('orientationchange', () => {
    setTimeout(() => ScrollTrigger.refresh(), 300);
  });

  // Реакция на реальный resize, но фильтруем “мусорные” вызовы
  window.addEventListener('resize', safeRefresh);
})();
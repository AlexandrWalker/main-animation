/**
 * Инициализация Lenis
*/
window.initQueue = [];
if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}
(function () {
  const MENU_CLOSE_DURATION = 400;
  // Глобальная настройка конфигурации
  const PRELOADER_CONFIG = {
    mode: 'overlay',
    assets: {
      logoWhiteSrc: './images/logo/gear-black.svg',
      logoCyanSrc: './images/logo/gear-white.svg',
    },
    logoWidth: 70,
    logoHeight: 70,
    safetyTimeoutMs: 8000,
    overlayHideDelayMs: 600,
  };

  const preloaderEl = document.querySelector('.preloader');
  if (!preloaderEl) {
    // Если прелоадера нет в DOM (переход Barba) — сразу активируем анимации страницы
    if (window.initQueue && window.initQueue.length) {
      window.initQueue.forEach(initFunc => {
        try { initFunc(); } catch (err) { console.error(err); }
      });
    }
    return;
  }

  // Блокируем скролл и выставляем активный класс
  document.body.classList.add('no-scroll');
  document.documentElement.classList.add('preloader--active');

  function restoreScroll() {
    document.body.classList.remove('no-scroll');
  }

  function clearSafety() {
    try { clearTimeout(safetyTimer); } catch (e) { }
  }

  // Страховочный таймер
  const safetyTimer = setTimeout(() => {
    if (preloaderEl.style.display !== 'none') {
      preloaderEl.style.display = 'none';
      restoreScroll();
      if (window.initQueue && window.initQueue.length) {
        window.initQueue.forEach(initFunc => {
          try { initFunc(); } catch (err) { console.error(err); }
        });
      }
    }
  }, PRELOADER_CONFIG.safetyTimeoutMs);

  const canvas = document.getElementById('logo-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function initCanvas() {
    const { logoWidth, logoHeight } = PRELOADER_CONFIG;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = logoWidth * dpr;
    canvas.height = logoHeight * dpr;
    if (ctx.setTransform) ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    return { logoWidth, logoHeight };
  }

  // Анимация скрытия всего прелоадера
  function hidePreloader() {
    gsap.set(canvas, { opacity: 0 });

    gsap.to(preloaderEl, {
      scaleY: 0,
      duration: 0.7,
      ease: 'power2.inOut',
      transformOrigin: 'top center',
      onComplete() {
        preloaderEl.style.display = 'none';
        restoreScroll();
        clearSafety();
        document.documentElement.classList.remove('preloader--active');

        // Запуск всех анимаций страницы после исчезновения прелоадера
        if (window.initQueue && window.initQueue.length) {
          window.initQueue.forEach(initFunc => {
            try { initFunc(); } catch (err) { console.error(err); }
          });
        }
      },
    });

    gsap.to(canvas, {
      scaleY: 2,
      duration: 0.7,
      ease: 'power2.inOut',
      transformOrigin: 'bottom center',
    });
  }

  // Режим Overlay с заполнением логотипа, процентов и ползунка
  function startOverlayPreloader() {
    const { logoWidth, logoHeight } = initCanvas();
    let fillHeight = 0;

    const logoWhite = new Image();
    const logoCyan = new Image();
    let loadedCount = 0;

    const percentEl = document.querySelector('.preloader__percent');
    const progressBarEl = document.querySelector('.preloader__progress-bar');

    function draw() {
      ctx.clearRect(0, 0, logoWidth, logoHeight);
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(logoWhite, 0, 0, logoWidth, logoHeight);
      ctx.globalCompositeOperation = 'source-atop';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, logoHeight - fillHeight, logoWidth, fillHeight);
      ctx.globalCompositeOperation = 'source-over';
    }

    function onImageLoaded() {
      loadedCount++;
      if (loadedCount === 2) startAnimation();
    }

    logoWhite.onload = logoWhite.onerror = onImageLoaded;
    logoCyan.onload = logoCyan.onerror = onImageLoaded;
    logoWhite.src = PRELOADER_CONFIG.assets.logoWhiteSrc;
    logoCyan.src = PRELOADER_CONFIG.assets.logoCyanSrc;

    function startAnimation() {
      const percentEl = document.querySelector('.preloader__percent');
      const progressBarEl = document.querySelector('.preloader__progress-bar');
      const carEl = document.querySelector('.preloader__car');
      draw();
      const progress = { val: 0 };

      // Функция синхронного обновления всех элементов интерфейса
      function updatePreloaderUI() {
        fillHeight = (progress.val / 100) * logoHeight;
        draw();

        if (percentEl) {
          percentEl.textContent = `${Math.floor(progress.val)}%`;
        }

        if (progressBarEl) {
          gsap.set(progressBarEl, { scaleX: progress.val / 100 });
        }

        // Двигаем машинку строго впереди линии загрузки (от 0% до 100%)
        if (carEl) {
          gsap.set(carEl, { left: `${progress.val}%` });
        }
      }

      // 1. Быстрый старт до 30%
      gsap.to(progress, {
        val: 30,
        duration: 0.4,
        ease: 'power2.out',
        onUpdate: updatePreloaderUI
      });

      // 2. Медленное движение до 85% во время ожидания загрузки страницы
      gsap.to(progress, {
        val: 85,
        duration: 2.5,
        ease: 'power1.out',
        delay: 0.4,
        onUpdate: updatePreloaderUI
      });

      // 3. Рывок до 100% при полном наступлении события load
      window.addEventListener('load', function onLoad() {
        window.removeEventListener('load', onLoad);
        gsap.killTweensOf(progress);

        gsap.to(progress, {
          val: 100,
          duration: 0.4,
          ease: 'power2.out',
          onUpdate: updatePreloaderUI,
          onComplete() {
            // тут убрал чтобы лого и процент не пропадал после прелоадера
            // Мягко растворяем интерфейс перед схлопыванием шторки
            // const tlFade = gsap.timeline({
            // onComplete: () => {
            setTimeout(hidePreloader, PRELOADER_CONFIG.overlayHideDelayMs);
            // }
            // });

            // tlFade.to([percentEl, progressBarEl], {
            //   opacity: 0,
            //   duration: 0.2,
            //   ease: 'power2.in'
            // });
          },
        });
      });
    }
  }

  // Режим SingleLogo
  function startSingleLogoPreloader() {
    const { logoWidth, logoHeight } = initCanvas();
    const logo = new Image();

    function showAndWait() {
      window.addEventListener('load', function onLoad() {
        window.removeEventListener('load', onLoad);
        hidePreloader();
      });
    }

    logo.onload = () => {
      ctx.clearRect(0, 0, logoWidth, logoHeight);
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(logo, 0, 0, logoWidth, logoHeight);
      gsap.fromTo(canvas,
        { opacity: 0.2, scaleY: 0.98 },
        { opacity: 1, scaleY: 1, duration: 0.4, ease: 'power2.out' }
      );
      showAndWait();
    };

    logo.onerror = showAndWait;
    logo.src = PRELOADER_CONFIG.assets.logoWhiteSrc;
  }

  // Точка входа
  if (PRELOADER_CONFIG.mode === 'singleLogo') {
    startSingleLogoPreloader();
  } else {
    startOverlayPreloader();
  }
})();
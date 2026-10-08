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

  /**

   * Функция эффекта наведения кнопки (btn--radial)

   *

   * Функция эффекта наведения кнопки (btn--border)

   */

  window.initQueue.push(function () {

    const isMobile = () => window.innerWidth < 600;

  

    function getEventCoords(e) {

      const isTouch = e.type.startsWith('touch');

      if (isTouch) {

        const touch = (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0]);

        return touch ? { clientX: touch.clientX, clientY: touch.clientY } : null;

      }

      return { clientX: e.clientX, clientY: e.clientY };

    }

  

    function setCoordinates(button, e) {

      const rect = button.getBoundingClientRect();

      const coords = getEventCoords(e);

      if (!coords) return;

  

      button.style.setProperty('--x', `${coords.clientX - rect.left}px`);

      button.style.setProperty('--y', `${coords.clientY - rect.top}px`);

    }

  

    function initButtonEffect(button, activeClass) {

      button.addEventListener('mouseenter', (e) => {

        if (isMobile()) return;

        setCoordinates(button, e);

        button.classList.add(activeClass);

      });

  

      button.addEventListener('mouseleave', (e) => {

        if (isMobile()) return;

        setCoordinates(button, e);

        button.classList.remove(activeClass);

      });

  

      button.addEventListener('touchstart', (e) => {

        if (!isMobile()) return;

        setCoordinates(button, e);

        button.classList.add(activeClass);

      }, { passive: true });

    }

  

    function setupAllButtons() {

      document.querySelectorAll('.btn--radial').forEach(btn => {

        initButtonEffect(btn, 'btn-active');

      });

  

      document.querySelectorAll('.btn--border').forEach(btn => {

        initButtonEffect(btn, 'btn--border-active');

      });

    }

  

    setupAllButtons();

  

    document.addEventListener('touchstart', (e) => {

      if (!isMobile()) return;

      const targetButton = e.target.closest('.btn--radial, .btn--border');

      if (!targetButton) {

        document.querySelectorAll('.btn--radial.btn-active').forEach(b => b.classList.remove('btn-active'));

        document.querySelectorAll('.btn--border.btn--border-active').forEach(b => b.classList.remove('btn--border-active'));

      }

    }, { passive: true });

  

    document.addEventListener('touchmove', () => {

      if (!isMobile()) return;

      document.querySelectorAll('.btn--radial.btn-active').forEach(b => b.classList.remove('btn-active'));

      document.querySelectorAll('.btn--border.btn--border-active').forEach(b => b.classList.remove('btn--border-active'));

    }, { passive: true });

  });

  

  /**

   * Функция эффекта наведения кнопки (btn--magnetic)

   */

  window.initQueue.push(function () {

    const MAGNETIC_STRENGTH = 0.2;

  

    function handleMagneticMove(button, clientX, clientY) {

      const icon = button.querySelector('.btn-icon');

      if (!icon) return;

  

      const iconRect = icon.getBoundingClientRect();

      const iconCenterX = iconRect.left + iconRect.width / 2;

      const iconCenterY = iconRect.top + iconRect.height / 2;

  

      const deltaX = clientX - iconCenterX;

      const deltaY = clientY - iconCenterY;

  

      const moveX = deltaX * MAGNETIC_STRENGTH;

      const moveY = deltaY * MAGNETIC_STRENGTH;

  

      button.classList.add('is-magnetic-active');

      icon.style.setProperty('--icon-x', `${moveX}px`);

      icon.style.setProperty('--icon-y', `${moveY}px`);

    }

  

    function resetMagneticButton(button) {

      button.classList.remove('is-magnetic-active');

      const icon = button.querySelector('.btn-icon');

      if (icon) {

        icon.style.setProperty('--icon-x', `0px`);

        icon.style.setProperty('--icon-y', `0px`);

      }

    }

  

    document.addEventListener('mousemove', (e) => {

      const button = e.target.closest('.btn--magnetic');

      if (button) {

        handleMagneticMove(button, e.clientX, e.clientY);

      }

    });

  

    document.addEventListener('mouseout', (e) => {

      const button = e.target.closest('.btn--magnetic');

      if (button && !button.contains(e.relatedTarget)) {

        resetMagneticButton(button);

      }

    });

  

    document.addEventListener('touchstart', (e) => {

      const button = e.target.closest('.btn--magnetic');

      if (button) {

        const touch = e.touches[0];

        handleMagneticMove(button, touch.clientX, touch.clientY);

      } else {

        document.querySelectorAll('.btn--magnetic.is-magnetic-active').forEach(resetMagneticButton);

      }

    }, { passive: true });

  

    document.addEventListener('touchmove', (e) => {

      const button = e.target.closest('.btn--magnetic');

      if (button) {

        const touch = e.touches[0];

        handleMagneticMove(button, touch.clientX, touch.clientY);

      }

    }, { passive: true });

  

    document.addEventListener('touchend', () => {

      document.querySelectorAll('.btn--magnetic.is-magnetic-active').forEach(resetMagneticButton);

    });

  });
  /**
   * Анимация текста
   */
  window.initQueue.push(function () {
    gsap.utils.toArray('[data-split="title"]').forEach(dataSplitLines => {
      if (!dataSplitLines.length) return;
      const textSplits = dataSplitLines.querySelectorAll('*');
  
      textSplits.forEach(textSplit => {
        if (!textSplit) return;
  
        SplitText.create(textSplit, {
          type: "words,lines",
          mask: "lines",
          linesClass: "line",
          autoSplit: true,
          onSplit: inst => {
  
            gsap.from(inst.lines, {
              y: 50,
              // rotation: 2.5,
              opacity: 0,
              stagger: 0.1,
              duration: 0.6,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: dataSplitLines,
                start: "top 90%",
                once: true
              }
            });
  
            const hasAccent = dataSplitLines.hasAttribute('data-accent') || textSplit.hasAttribute('data-accent');
  
            if (hasAccent) {
              const rect = dataSplitLines.getBoundingClientRect();
              const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
              const absoluteTop = rect.top + scrollTop;
              const thresholdSpace = window.innerHeight * 0.85;
  
              if (absoluteTop <= thresholdSpace) {
                gsap.set(inst.lines, {
                  '--accent-size': '100%',
                  '--accent-pos': 'right'
                });
  
                gsap.fromTo(inst.lines,
                  {
                    '--accent-size': '100%',
                    '--accent-pos': 'right'
                  },
                  {
                    scrollTrigger: {
                      trigger: document.documentElement,
                      start: 'top top',
                      end: () => `top+=${rect.top + rect.height / 1.3} top`,
                      scrub: true
                    },
                    '--accent-size': '0%',
                    ease: 'power1.out'
                  }
                );
              } else {
  
                gsap.timeline({
                  scrollTrigger: {
                    trigger: dataSplitLines,
                    start: "top 90%",
                    end: "bottom 15%",
                    scrub: true
                  }
                })
                  .to(inst.lines, {
                    '--accent-size': '100%',
                    '--accent-pos': 'left',
                    duration: 0.35,
                    ease: 'power2.out',
                    stagger: 0.05
                  })
                  .to(inst.lines, {
                    '--accent-pos': 'right',
                    duration: 0.01
                  })
                  .to(inst.lines, {
                    '--accent-size': '0%',
                    duration: 0.35,
                    ease: 'power2.in',
                    stagger: 0.05
                  });
              }
            }
          }
        });
      });
    });
  });
  
  window.initQueue.push(function () {
    gsap.utils.toArray('[data-split="text"]').forEach(dataSplitLines => {
      if (!dataSplitLines.length) return;
      const textSplits = dataSplitLines.querySelectorAll('*');
      textSplits.forEach(textSplit => {
        if (textSplit) SplitText.create(textSplit, {
          type: "words,lines",
          mask: "lines",
          linesClass: "line",
          autoSplit: true,
          onSplit: inst => gsap.from(inst.lines, {
            y: 30,
            // rotation: 2.5,
            opacity: 0,
            stagger: 0.05,
            duration: 0.8,
            scrollTrigger: {
              trigger: dataSplitLines,
              start: "top 90%",
              end: "bottom top"
            }
          })
        });
      });
    });
  });
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
  /**
   * Анимация блоков
   */
  window.initQueue.push(function () {
    // const isMobile = window.innerWidth < 600;
    // if (isMobile) return;
  
    const animContainers = document.querySelectorAll('.anim-items');
  
    if (!animContainers.length) return;
  
    animContainers.forEach(container => {
      const items = container.querySelectorAll('.anim-item');
      if (!items.length) return;
  
      const animType = container.getAttribute('data-anim') || 'fade';
  
      // Базовый конфиг
      let animConfig = {
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: { each: 0.15, from: "start" },
        scrollTrigger: {
          trigger: container,
          start: "top 90%",
          onEnter: () => container.classList.add('anim-animated')
        }
      };
  
      // Применяем логику в зависимости от направления
      switch (animType) {
        // 1. Четные слева, нечетные справа
        case 'chess':
          animConfig.x = (index) => (index % 2 === 0 ? -100 : 100);
          break;
  
        // 2. Левая половина слева, правая — справа
        case 'sides':
          animConfig.x = (index, target, targets) => {
            const middle = (targets.length - 1) / 2;
            return index < middle ? -100 : 100;
          };
          break;
  
        // 3. Вылетают из одной центральной точки (эффект взрыва)
        case 'out-of-center':
          animConfig.x = (index, target, targets) => {
            const middle = (targets.length - 1) / 2;
            return (index - middle) * 50; // Чем дальше от центра, тем сильнее вылет
          };
          animConfig.scale = 0.5;
          animConfig.ease = "back.out(1.2)";
          break;
  
        // 4. По очереди из четырех разных углов (циклично)
        case 'cascade-corners':
          animConfig.x = (index) => {
            const positionsX = [-60, 60, -60, 60];
            return positionsX[index % 4];
          };
          animConfig.y = (index) => {
            const positionsY = [-60, -60, 60, 60];
            return positionsY[index % 4];
          };
          break;
  
        case 'rows-up':
          animConfig.y = 60;
          animConfig.stagger = {
            amount: 0.4,
            grid: "auto",
            from: "start"
          };
          break;
  
        case 'rows-right':
          animConfig.x = 60;
          animConfig.stagger = {
            amount: 0.4,
            grid: "auto",
            from: "start"
          };
          break;
  
        // Стандартные варианты из прошлого шага
        case 'slide-up': animConfig.y = 50; break;
        case 'slide-right': animConfig.x = -50; break;
        case 'zoom': animConfig.scale = 0.5; animConfig.ease = "back.out(1.5)"; break;
        case 'flip':
          animConfig.rotationX = -70;
          animConfig.transformOrigin = "top center";
          gsap.set(items, { perspective: 1000 });
          break;
        case 'fade':
        default:
          break;
      }
  
      gsap.from(items, animConfig);
    });
  });

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

  /**

   * Функция для шапки

   */

  (function () {

    // Настройки компонента шапки

    const CONFIG = {

      headerSelector: '.header',

      sectionsSelector: 'section',

      firstSectionSelector: '.hero',

      footerSelector: '.footer',

      themeAttribute: 'data-header-theme',

      classThemeDark: 'header-theme-dark',

      classThemeLight: 'header-theme-light',

      classFixed: 'header-fixed',

      classOffTop: 'header-off-top',

      classAtFooter: 'header-at-footer',

      classHidden: 'header-hidden',

      hideOnScroll: true,

      hideDuration: 0.4,

      showDuration: 0.4,

      hideEase: 'power2.in',

      showEase: 'power2.out',

      scrollThreshold: 5,

      animateBg: false,

      bgInitial: 'rgba(255, 255, 255, 0)',

      bgScrolled: 'rgba(255, 255, 255, 1)',

      animateShadow: false,

      shadowInitial: '0px 0px 0px rgba(0, 0, 0, 0)',

      shadowScrolled: '0px 0px 20px rgba(0, 0, 0, 0.3)',

      animateHeight: true,

      heightMultiplier: 0.7,

    };

  

    // Проверка наличия шапки на странице

    const header = document.querySelector(CONFIG.headerSelector);

    if (!header) return;

  

    // Инициализация базовых переменных и зон скролла

    const footer = document.querySelector(CONFIG.footerSelector);

    const htmlEl = document.documentElement;

    const headerHeight = header.offsetHeight;

    const firstSection = CONFIG.firstSectionSelector

      ? document.querySelector(CONFIG.firstSectionSelector)

      : null;

    const scrollZone = firstSection

      ? firstSection.offsetHeight

      : headerHeight;

  

    // Функция определения текущей темы под шапкой

    const updateTheme = () => {

      const sections = document.querySelectorAll(CONFIG.sectionsSelector);

      const headerBottom = header.getBoundingClientRect().bottom;

      let foundTheme = null;

      for (const section of sections) {

        const rect = section.getBoundingClientRect();

        const intersects = rect.top <= headerBottom && rect.bottom >= 0;

        if (intersects) {

          const theme = section.getAttribute(CONFIG.themeAttribute);

          if (theme) {

            foundTheme = theme;

            break;

          }

        }

      }

      htmlEl.classList.remove(CONFIG.classThemeDark, CONFIG.classThemeLight);

      if (foundTheme === 'dark') {

        htmlEl.classList.add(CONFIG.classThemeDark);

      } else if (foundTheme === 'light') {

        htmlEl.classList.add(CONFIG.classThemeLight);

      }

    };

  

    // Установка начальных стилей через GSAP

    const initialStyles = {

      yPercent: 0,

      height: headerHeight,

    };

    if (CONFIG.animateBg) {

      initialStyles.backgroundColor = CONFIG.bgInitial;

    }

    if (CONFIG.animateShadow) {

      initialStyles.boxShadow = CONFIG.shadowInitial;

    }

    gsap.set(header, initialStyles);

  

    // Сборка объекта параметров для scrub-анимации

    const animateTo = {

      ease: 'none',

      duration: 1,

    };

    if (CONFIG.animateBg) {

      animateTo.backgroundColor = CONFIG.bgScrolled;

    }

    if (CONFIG.animateShadow) {

      animateTo.boxShadow = CONFIG.shadowScrolled;

    }

    if (CONFIG.animateHeight) {

      animateTo.height = headerHeight * CONFIG.heightMultiplier;

    }

  

    // Запуск плавного изменения размеров и фона шапки при скролле первой секции

    const hasScrubAnimation = CONFIG.animateBg || CONFIG.animateShadow || CONFIG.animateHeight;

    if (hasScrubAnimation) {

      const tlScrub = gsap.timeline({

        scrollTrigger: {

          trigger: document.documentElement,

          start: 'top top',

          end: `+=\${scrollZone}`,

          scrub: true,

          onEnter: () => htmlEl.classList.add(CONFIG.classFixed),

          onLeaveBack: () => {

            htmlEl.classList.remove(CONFIG.classFixed);

            htmlEl.classList.remove(CONFIG.classOffTop);

          },

        }

      });

      tlScrub.to(header, animateTo);

    }

  

    // Переключение состояния шапки при выходе за пределы первой секции

    ScrollTrigger.create({

      trigger: document.documentElement,

      start: `top+=\${scrollZone} top`,

      onEnter: () => htmlEl.classList.add(CONFIG.classOffTop),

      onLeaveBack: () => htmlEl.classList.remove(CONFIG.classOffTop),

    });

  

    // Отслеживание вхождения шапки в зону футера

    if (footer) {

      ScrollTrigger.create({

        trigger: footer,

        start: 'top bottom',

        onEnter: () => htmlEl.classList.add(CONFIG.classAtFooter),

        onLeaveBack: () => htmlEl.classList.remove(CONFIG.classAtFooter),

      });

    }

  

    // Вспомогательные переменные для логики скрытия шапки

    let lastScrollY = window.scrollY || window.pageYOffset;

    let isHidden = false;

    let ticking = false;

  

    // Определение нижней точки первой секции для начала скрытия

    const getFirstSectionBottom = () => {

      if (!firstSection) return scrollZone;

      return firstSection.getBoundingClientRect().bottom + window.scrollY;

    };

  

    // Функции анимации скрытия и показа шапки

    const hideHeader = () => {

      if (isHidden) return;

      isHidden = true;

      htmlEl.classList.add(CONFIG.classHidden);

      gsap.to(header, {

        yPercent: -100,

        duration: CONFIG.hideDuration,

        ease: CONFIG.hideEase,

        overwrite: 'auto',

      });

    };

    const showHeader = () => {

      if (!isHidden) return;

      isHidden = false;

      htmlEl.classList.remove(CONFIG.classHidden);

      gsap.to(header, {

        yPercent: 0,

        duration: CONFIG.showDuration,

        ease: CONFIG.showEase,

        overwrite: 'auto',

      });

    };

  

    // Обработка направления скролла и пороговых значений

    const handleScroll = () => {

      const currentScrollY = window.scrollY || window.pageYOffset;

      const delta = currentScrollY - lastScrollY;

      const absDelta = Math.abs(delta);

      updateTheme();

      if (CONFIG.hideOnScroll) {

        if (absDelta >= CONFIG.scrollThreshold) {

          const scrollingDown = delta > 0;

          const firstSectionBottom = getFirstSectionBottom();

          if (scrollingDown && currentScrollY > firstSectionBottom) {

            hideHeader();

          }

          if (!scrollingDown) {

            showHeader();

          }

          if (currentScrollY <= 0) {

            showHeader();

          }

          lastScrollY = currentScrollY;

        }

      } else {

        lastScrollY = currentScrollY;

      }

      ticking = false;

    };

  

    // Оптимизация вызовов скролла через requestAnimationFrame

    const onScroll = () => {

      if (!ticking) {

        requestAnimationFrame(handleScroll);

        ticking = true;

      }

    };

  

    // Подписка на события скролла браузера и визуального вьюпорта (iOS)

    window.addEventListener('scroll', onScroll, { passive: true });

    if (window.visualViewport) {

      window.visualViewport.addEventListener('scroll', onScroll, { passive: true });

      window.visualViewport.addEventListener('resize', () => {

        lastScrollY = window.scrollY || window.pageYOffset;

      });

    }

  

    // Первоначальный запуск проверки темы при инициализации

    updateTheme();

  })();

  (function () {

    // ================= Кэш элементов =================

    const folding = document.querySelector('.folding');

    if (!folding) return;

  

    const foldingItems = Array.from(document.querySelectorAll('.folding-item'));

    const len = foldingItems.length;

  

    // ================= Инициализация data-index и data-scale =================

    foldingItems.forEach((item, i) => {

      item.dataset.index = i + 1; // индексы с 1

      item.dataset.scale = 1;     // стартовый scale = 1

    });

  

    // Присваиваем data-min-scale начиная со второй карточки с конца

    let minScaleStart = 0.92;

    const minScaleStep = 0.03;

    for (let i = len - 2; i >= 0; i--) {

      const item = foldingItems[i];

      const scale = Math.max(0.5, minScaleStart);

      item.dataset.minScale = scale;

      minScaleStart -= minScaleStep;

    }

    foldingItems[len - 1].dataset.minScale = 1;

  

    // Начальный scale для всех карточек

    foldingItems.forEach(item => item.style.transform = 'scale(1)');

  

    let scrollPos = window.pageYOffset;

    let inc = 0.006;

    let inc2 = 0.008;

  

    // ================= Функция скролла =================

    function foldingAnimation() {

      const top = window.pageYOffset;

  

      // глобальная переменная для расстояния от верхней границы

      window.scrollDistanceFromTop = top;

  

      const isMobile = window.innerWidth < 834;

      const activeBlock = $('.folding-active');

      const element = activeBlock[0];

      if (!element) return;

  

      const distanceToTop = activeBlock.offset().top - $(window).scrollTop() - (isMobile ? 0 : 160);

      const dataIndex = parseInt(activeBlock.attr('data-index'));

      const h = element.clientHeight / 200;

  

      // реальная разница скролла

      let delta = top - scrollPos;

      // защита от экстремального скачка

      if (Math.abs(delta) > 300) delta = delta > 0 ? 300 : -300;

  

      if (isMobile) {

        inc = 0.006;

        inc2 = 0.006;

  

        if (delta < 0) { // ↑ вверх

          const prevBlock = activeBlock.prev();

  

          if (!prevBlock.length && dataIndex === 1) {

            activeBlock.css('transform', 'scale(1)');

            element.dataset.scale = 1;

          } else {

            if (dataIndex != 1 && distanceToTop > h) {

              const prev = activeBlock.prev();

              if (prev.length && prev[0]) {

                activeBlock.removeClass('folding-active');

                prev.addClass('folding-active');

                prev.css('transform', `scale(${prev[0].dataset.scale})`);

              }

            }

  

            if (prevBlock.length && prevBlock[0]) {

              let blockScale = parseFloat(prevBlock[0].dataset.scale || 1);

              blockScale += Math.abs(delta) * 0.006;

              blockScale = Math.min(blockScale, 1);

  

              prevBlock.css('transform', `scale(${blockScale})`);

              prevBlock[0].dataset.scale = blockScale;

  

              const newOpacity = Math.max(0, 1 - (distanceToTop / h));

              prevBlock.find('.over').css('opacity', newOpacity);

            }

          }

        } else { // ↓ вниз

          if (distanceToTop < 200 && dataIndex != len) {

            const next = activeBlock.next();

            if (next.length && next[0]) {

              activeBlock.removeClass('folding-active');

              next.addClass('folding-active');

            }

          }

  

          const prevBlock = activeBlock.prev();

          if (prevBlock.length && prevBlock[0]) {

            let blockScale = parseFloat(prevBlock[0].dataset.scale || 1);

            blockScale -= Math.abs(delta) * 0.006;

  

            const minScale = parseFloat(prevBlock[0].dataset.minScale || 1);

            blockScale = Math.max(minScale, blockScale);

  

            prevBlock.css('transform', `scale(${blockScale})`);

            prevBlock[0].dataset.scale = blockScale;

  

            const newOpacity = Math.min(0.6, distanceToTop / h + 0.02);

            prevBlock.find('.over').css('opacity', newOpacity);

          }

        }

  

      } else { // ================= Desktop =================

        inc = 0.006;

        inc2 = 0.008;

  

        if (delta < 0) { // ↑ вверх

          const prevBlock = activeBlock.prev();

  

          if (!prevBlock.length && dataIndex === 1) {

            activeBlock.css('transform', 'scale(1)');

            element.dataset.scale = 1;

          } else {

            if (dataIndex != 1 && distanceToTop > h * 200) {

              const prev = activeBlock.prev();

              if (prev.length && prev[0]) {

                activeBlock.removeClass('folding-active');

                prev.addClass('folding-active');

                prev.css('transform', `scale(${prev[0].dataset.scale})`);

              }

            }

  

            if (prevBlock.length && prevBlock[0]) {

              let blockScale = parseFloat(prevBlock[0].dataset.scale || 1);

              blockScale += Math.abs(delta) * 0.0025;

              blockScale = Math.min(blockScale, 1);

  

              prevBlock.css('transform', `scale(${blockScale})`);

              prevBlock[0].dataset.scale = blockScale;

  

              const newOpacity = Math.max(0, 1 - (distanceToTop / h));

              prevBlock.find('.over').css('opacity', newOpacity);

            }

          }

  

        } else { // ↓ вниз

          if (distanceToTop < h && dataIndex != len) {

            const next = activeBlock.next();

            if (next.length && next[0]) {

              activeBlock.removeClass('folding-active');

              next.addClass('folding-active');

              next[0].dataset.scale = parseFloat(next[0].dataset.scale || 1);

            }

          }

  

          const prevBlock = activeBlock.prev();

          if (prevBlock.length && prevBlock[0]) {

            let blockScale = parseFloat(prevBlock[0].dataset.scale || 1);

            blockScale -= Math.abs(delta) * 0.002;

  

            const minScale = parseFloat(prevBlock[0].dataset.minScale || 1);

            blockScale = Math.max(minScale, blockScale);

  

            prevBlock.css('transform', `scale(${blockScale})`);

            prevBlock[0].dataset.scale = blockScale;

  

            const newOpacity = Math.min(0.6, distanceToTop / h);

            prevBlock.find('.over').css('opacity', newOpacity);

          }

        }

      }

  

      scrollPos = top;

    }

  

    function resetFolding() {

      foldingItems.forEach(item => {

        item.dataset.scale = 1;

        item.style.transform = 'scale(1)';

      });

  

      foldingItems.forEach(item => item.classList.remove('folding-active'));

      if (foldingItems[0]) {

        foldingItems[0].classList.add('folding-active');

      }

  

      scrollPos = window.pageYOffset;

    }

  

    function onScroll() {

      const foldingRect = folding.getBoundingClientRect();

  

      if (foldingRect.top <= 0) {

        if (!folding.classList.contains('fixed')) {

          scrollPos = window.pageYOffset; // фиксируем старт

        }

  

        folding.classList.add('fixed');

        foldingAnimation();

      } else {

        if (folding.classList.contains('fixed')) {

          folding.classList.remove('fixed');

          resetFolding();

        }

      }

    }

  

    function scrollLoop() {

      onScroll();

      requestAnimationFrame(scrollLoop);

    }

  

    requestAnimationFrame(scrollLoop);

  })();

  

  const templateProducts = document.querySelectorAll('.template-product');

  

  if (templateProducts.length != 0) {

    templateProducts.forEach(templateProduct => {

  

      const templateProductSliders = templateProduct.querySelectorAll('.template-product__content');

  

      if (templateProductSliders.length > 1) {

        templateProductSliders.forEach(templateProductSlider => {

          const templateProductSliderMini = templateProductSlider.querySelector('.template-product__slider--mini');

          const templateProductSliderBig = templateProductSlider.querySelector('.template-product__slider--big');

          const templateProductSliderPrev = templateProductSlider.querySelector('.template-product-button-prev');

          const templateProductSliderNext = templateProductSlider.querySelector('.template-product-button-next');

          templateSlider(templateProductSliderMini, templateProductSliderBig, templateProductSliderPrev, templateProductSliderNext);

        });

      } else {

        const templateProductSliderMini = templateProduct.querySelector('.template-product__slider--mini');

        const templateProductSliderBig = templateProduct.querySelector('.template-product__slider--big');

        const templateProductSliderPrev = templateProduct.querySelector('.template-product-button-prev');

        const templateProductSliderNext = templateProduct.querySelector('.template-product-button-next');

        templateSlider(templateProductSliderMini, templateProductSliderBig, templateProductSliderPrev, templateProductSliderNext);

      }

  

      function templateSlider(slider1, slider2, prev, next) {

        const templateSliderMini = new Swiper(slider1, {

          slidesPerView: 3,

          spaceBetween: 10,

          speed: 800,

  

          grabCursor: false,

          mousewheel: false,

          watchSlidesProgress: true,

          touchEvents: {

            prevent: true

          },

          breakpoints: {

            769: {

              spaceBetween: 20,

            },

          },

        });

  

        const templateSliderBig = new Swiper(slider2, {

          slidesPerView: 1,

          spaceBetween: 0,

          speed: 800,

  

          grabCursor: true,

          mousewheel: {

            forceToAxis: true,

          },

          thumbs: {

            swiper: templateSliderMini,

          },

          navigation: {

            prevEl: prev,

            nextEl: next,

          },

          pagination: {

            el: ".swiper-pagination",

            clickable: true,

          },

          touchEvents: {

            prevent: true

          },

        });

      }

  

    });

  }

  

  const productSliderMin = new Swiper('.product__slider-min', {

    slidesPerGroup: 1,

    slidesPerView: 4,

    spaceBetween: 10,

    loop: false,

    speed: 500,

    simulateTouch: true,

    watchOverflow: true,

    watchSlidesProgress: true,

  

    direction: 'horizontal',

    touchStartPreventDefault: true,

    touchMoveStopPropagation: true,

    threshold: 8,

    touchAngle: 25,

  

    mousewheel: {

      forceToAxis: true,

      sensitivity: 1,

      releaseOnEdges: true

    },

  });

  

  const productSliderBig = new Swiper('.product__slider-big', {

    slidesPerGroup: 1,

    slidesPerView: 1,

    spaceBetween: 0,

    loop: false,

    speed: 500,

    simulateTouch: true,

    watchOverflow: true,

    watchSlidesProgress: true,

    grabCursor: true,

  

    direction: 'horizontal',

    touchStartPreventDefault: true,

    touchMoveStopPropagation: true,

    threshold: 8,

    touchAngle: 25,

  

    mousewheel: {

      forceToAxis: true,

      sensitivity: 1,

      releaseOnEdges: true

    },

    pagination: { el: ".swiper-pagination", clickable: true },

    thumbs: {

      swiper: productSliderMin,

    },

  });

  

  /**

    * Инициализация TransferElements

    */

  const transferGeneralElems = document.querySelectorAll('.general');

  transferGeneralElems.forEach(transferGeneralElem => {

    const transferElem = transferGeneralElem.querySelector('.general__btns');

    const transferPos = transferGeneralElem.querySelector('.general__foot');

  

    // $(window).on('resize load', function () {

    if (window.innerWidth <= 600 && transferElem && transferPos) {

      new TransferElements(

        {

          sourceElement: transferGeneralElem.querySelector('.general__btns'),

          breakpoints: {

            600: {

              targetElement: transferGeneralElem.querySelector('.general__foot')

            }

          },

        }

      );

    }

    // });

  });

  

  /**

   * Анимация border-radius при скролле

   */

  (function () {

    const animatedContainers = document.querySelectorAll('.animated-container');

    if (!animatedContainers.length) return;

    animatedContainers.forEach(animatedContainer => {

      const animatedBox = animatedContainer.querySelector('.animated-box');

      gsap.to(animatedBox, {

        borderRadius: '0%', // Конечное значение border-radius

        duration: 1, // Длительность анимации (в секундах)

        ease: 'power2.inOut', // Плавность анимации

  

        // Настройки ScrollTrigger

        scrollTrigger: {

          trigger: animatedContainer, // Элемент-триггер

          start: 'top center', // Начало анимации: верх секции достигает центра экрана

          end: 'bottom center', // Конец анимации: низ секции достигает центра экрана

          scrub: true, // Анимация следует за скроллом

          toggleClass: { targets: animatedBox, className: 'active' } // Опционально: добавление класса

        }

      });

    });

  })();

  

  function advanFunc() {

  

    let advanTimeline = gsap.timeline({

      scrollTrigger: {

        trigger: ".advan",

        start: "top bottom-=30%",

      }

    })

  }

  

  function certificateFunc() {

  

    let certificatePin = gsap.timeline({

      scrollTrigger: {

        trigger: ".advan",

        start: "bottom bottom",

        end: 'bottom top',

        pin: true,

        pinSpacing: false,

      }

    })

  }

  

  if (document.querySelector('.advan')) {

    advanFunc();

    certificateFunc();

  }

  

  function temp1Func() {

  

    let tempTimeline = gsap.timeline({

      scrollTrigger: {

        trigger: ".template-1",

        start: "top bottom-=30%",

      }

    })

  }

  

  function temp2Func() {

  

    let tempPin = gsap.timeline({

      scrollTrigger: {

        trigger: ".template-1",

        start: "bottom bottom",

        end: 'bottom top',

        pin: true,

        pinSpacing: false,

      }

    })

  }

  

  if (document.querySelector('.template-1')) {

    temp1Func();

    temp2Func();

  }

  

  function galleryFunc() {

  

    let galleryTimeline = gsap.timeline({

      scrollTrigger: {

        trigger: ".gallery",

        start: "top bottom-=30%",

      }

    })

  }

  

  function footerFunc() {

  

    let footerPin = gsap.timeline({

      scrollTrigger: {

        trigger: ".gallery",

        start: "bottom bottom",

        end: 'bottom top',

        pin: true,

        pinSpacing: false,

      }

    })

  }

  

  if (document.querySelector('.gallery')) {

    galleryFunc();

    footerFunc();

  }

  

  (function () {

  

    // ─── Конфиг ────────────────────────────────────────────────────────────────

  

    /**

     * Список фраз для посимвольной печати.

     *

     * Каждая фраза — массив строк (строк = линий).

     * Каждая строка — массив слов.

     *

     * Структура:

     * [

     *   [                          ← фраза

     *     ['слово1', 'слово2'],    ← первая линия

     *     ['слово3'],              ← вторая линия

     *     ['слово4', 'слово5'],    ← третья линия

     *   ],

     * ]

     *

     * Слова совпадают с data-word в HTML — через них применяются CSS-стили.

     * Порядок слов в массиве = порядок печати слева направо, сверху вниз.

     */

  

    if (!document.querySelector('.typewriter')) return;

  

    const PHRASES = [

      [

        ['за!'],

        ['уровень'],

        ['в', ' цифре'],

      ],

      [

        ['след.'],

        ['фраза'],

        ['прямо', ' здесь'],

      ],

      [

        ['и ещё'],

        ['одна'],

        ['строка'],

      ],

    ];

  

    /**

     * Скорость печати одного символа (секунды).

     * TYPE_VARIANCE добавляет случайный разброс — имитация живого набора.

     */

    const TYPE_SPEED = 0.07;

    const TYPE_VARIANCE = 0.04;

  

    /** Скорость удаления одного символа (секунды). */

    const DELETE_SPEED = 0.04;

  

    /**

     * Паузы (секунды):

     * PAUSE_AFTER_TYPE   — после полного набора фразы

     * PAUSE_AFTER_DELETE — после полного удаления (перед следующей фразой)

     */

    const PAUSE_AFTER_TYPE = 2.0;

    const PAUSE_AFTER_DELETE = 0.5;

  

    // ─── DOM ───────────────────────────────────────────────────────────────────

  

    const cursorEl = document.querySelector('.typewriter__cursor');

  

    /**

     * Собираем все .typewriter__word в Map: data-word → элемент.

     *

     * Map выбран вместо объекта потому что:

     * - гарантирует порядок вставки (важно при итерации)

     * - ключи строго строковые без коллизий с прототипом

     *

     * Пример результата:

     * wordMap = {

     *   'за!'     → <span data-word="за!">,

     *   'уровень' → <span data-word="уровень">,

     *   'в'       → <span data-word="в">,

     *   'цифре'   → <span data-word="цифре">,

     * }

     */

    const wordMap = new Map();

    document.querySelectorAll('.typewriter__word').forEach(el => {

      wordMap.set(el.dataset.word, el);

    });

  

    // ─── Курсор: мигание ───────────────────────────────────────────────────────

  

    /**

     * Бесконечное мигание курсора.

     * pause() / resume() синхронизируют мигание с циклом печати:

     * курсор статичен во время набора/удаления, мигает в паузах.

     */

    const cursorTween = gsap.to(cursorEl, {

      opacity: 0,

      duration: 0.5,

      repeat: -1,

      yoyo: true,

      ease: 'none',

    });

  

    // ─── Вспомогательные функции ───────────────────────────────────────────────

  

    /**

     * Случайная задержка вокруг TYPE_SPEED.

     * @returns {number} секунды

     */

    function getTypeDelay() {

      return TYPE_SPEED + (Math.random() * 2 - 1) * TYPE_VARIANCE;

    }

  

    /**

     * Promise-обёртка над setTimeout для await-синтаксиса.

     * @param {number} seconds

     */

    function sleep(seconds) {

      return new Promise(resolve => setTimeout(resolve, seconds * 1000));

    }

  

    /**

     * Перемещает курсор в конец указанного элемента-слова.

     *

     * Курсор физически один в DOM, но логически "принадлежит"

     * последнему напечатанному слову. Для этого переносим его

     * в нужный .typewriter__word через appendChild.

     *

     * appendChild перемещает существующий узел — клонирование не нужно.

     * Курсор автоматически исчезает из предыдущего места.

     *

     * @param {HTMLElement} wordEl — элемент слова, куда переносим курсор

     */

    function moveCursorTo(wordEl) {

      wordEl.appendChild(cursorEl);

    }

  

    /**

     * Печатает одно слово посимвольно в указанный элемент.

     *

     * Каждый символ — отдельный <span> внутри .typewriter__word.

     * Пробел → &nbsp; чтобы браузер не "съел" пробелы в конце.

     *

     * @param {HTMLElement} wordEl — элемент слова

     * @param {string}      word   — строка для печати

     */

    async function typeWord(wordEl, word) {

      for (const char of word) {

        const span = document.createElement('span');

        span.innerHTML = char === ' ' ? '&nbsp;' : char;

        // Вставляем символ перед курсором чтобы курсор всегда был в конце

        wordEl.insertBefore(span, cursorEl);

        await sleep(getTypeDelay());

      }

    }

  

    /**

     * Удаляет все символы из указанного элемента-слова (справа налево).

     *

     * Выбираем только span-символы (не курсор) через селектор span:not(.typewriter__cursor).

     * Реверсируем массив — удаление идёт с последнего символа.

     *

     * @param {HTMLElement} wordEl — элемент слова

     */

    async function deleteWord(wordEl) {

      const spans = Array.from(

        wordEl.querySelectorAll('span:not(.typewriter__cursor)')

      ).reverse();

  

      for (const span of spans) {

        span.remove();

        await sleep(DELETE_SPEED);

      }

    }

  

    /**

     * Печатает целую фразу: перебирает строки и слова по порядку.

     *

     * Перед каждым словом курсор переезжает в его контейнер —

     * визуально курсор "следует" за набором.

     *

     * @param {string[][][]} phrase — трёхмерный массив [линии[слова]]

     */

    async function typePhrase(phrase) {

      cursorTween.pause();

      gsap.set(cursorEl, { opacity: 1 });

  

      for (const line of phrase) {

        for (const word of line) {

          const wordEl = wordMap.get(word);

          if (!wordEl) continue;

  

          // Курсор переезжает в текущее слово перед его набором

          moveCursorTo(wordEl);

          await typeWord(wordEl, word);

        }

      }

  

      cursorTween.resume();

    }

  

    /**

     * Удаляет целую фразу: перебирает слова в обратном порядке.

     *

     * flat() разворачивает [линии[слова]] → плоский массив слов.

     * reverse() — удаление идёт от последнего слова к первому.

     *

     * Перед удалением каждого слова курсор переезжает в него —

     * курсор "отступает" вместе с удалением.

     *

     * @param {string[][][]} phrase

     */

    async function deletePhrase(phrase) {

      cursorTween.pause();

      gsap.set(cursorEl, { opacity: 1 });

  

      // flat() разворачивает вложенные массивы строк и слов

      const allWords = phrase.flat().reverse();

  

      for (const word of allWords) {

        const wordEl = wordMap.get(word);

        if (!wordEl) continue;

  

        moveCursorTo(wordEl);

        await deleteWord(wordEl);

      }

  

      cursorTween.resume();

    }

  

    /**

     * Обновляет data-word у всех .typewriter__word и пересобирает wordMap.

     *

     * Нужно при смене фразы: HTML-структура (строки/слова) остаётся той же,

     * но слова меняются. Обновляем атрибуты и переключаем CSS-стили.

     *

     * Порядок обхода: сначала все слова первой линии, потом второй и т.д.

     * — совпадает с порядком в PHRASES[phraseIndex].

     *

     * @param {string[][][]} phrase — новая фраза

     */

    function applyPhraseToDOM(phrase) {

      // Плоский список новых слов в порядке обхода

      const newWords = phrase.flat();

  

      // Все существующие .typewriter__word в порядке DOM

      const wordEls = Array.from(document.querySelectorAll('.typewriter__word'));

  

      wordEls.forEach((el, i) => {

        const newWord = newWords[i];

        if (!newWord) return;

  

        // Меняем data-word → CSS [data-word="..."] автоматически подхватит новые стили

        el.dataset.word = newWord;

      });

  

      // Пересобираем Map с актуальными ключами

      wordMap.clear();

      document.querySelectorAll('.typewriter__word').forEach(el => {

        wordMap.set(el.dataset.word, el);

      });

    }

  

    // ─── Основной цикл ─────────────────────────────────────────────────────────

  

    /**

     * Бесконечный цикл смены фраз.

     *

     * Порядок для каждой фразы:

     * 1. applyPhraseToDOM — обновляем data-word (CSS-стили переключаются)

     * 2. typePhrase       — посимвольный набор всех слов

     * 3. sleep            — пауза чтения

     * 4. deletePhrase     — посимвольное удаление в обратном порядке

     * 5. sleep            — пауза перед следующей фразой

     */

    async function runLoop() {

      let index = 0;

  

      while (true) {

        const phrase = PHRASES[index % PHRASES.length];

  

        applyPhraseToDOM(phrase);

        await typePhrase(phrase);

        await sleep(PAUSE_AFTER_TYPE);

        await deletePhrase(phrase);

        await sleep(PAUSE_AFTER_DELETE);

  

        index++;

      }

    }

  

    runLoop();

  

  })();

  

  // Оборачиваем всё в функцию которая запустится когда страница загрузится

  window.addEventListener("load", function () {

    if (!document.getElementById('my-svg')) return;

    // Шарик стартует на cx=30 и должен доехать до cx=570

    // считаем путь который он проедет

    var startX = 30;

    var endX = 570;

    var distance = endX - startX; // 540px

  

    // Создаём общий таймлайн для всей анимации

    // once: true это самое важное здесь, означает что триггер сработает только один раз

    var tl = gsap.timeline({

      scrollTrigger: {

        trigger: "#my-svg",       // следим именно за этим элементом

        start: "top 80%",         // когда верх SVG доходит до 80% высоты экрана

        once: true,               // срабатывает один раз и всё, больше не повторяется

        // markers: true,         // можно раскомментировать чтобы видеть маркеры при отладке

      }

    });

  

    // Первый прямоугольник растягиваем по ширине

    // scaleX меняет именно горизонтальный масштаб, то есть фигура как бы вытягивается вправо

    // но тут есть нюанс: масштабирование идёт от центра элемента по умолчанию

    // поэтому задаём transformOrigin чтобы растяжка шла от левого края

    tl.from("#rect1", {

      scaleX: 0,

      duration: 0.8,

      ease: "power2.out",

      transformOrigin: "left center",

    });

  

    // Второй прямоугольник делаем с небольшой задержкой через позицию "-=0.5"

    // это значит что анимация второго прямоугольника начнётся на 0.5 секунды раньше

    // чем закончится первая, они немного перекрываются и выглядит плавнее

    tl.from("#rect2", {

      scaleX: 0,

      duration: 0.8,

      ease: "power2.out",

      transformOrigin: "left center",

    }, "-=0.5");

  

    // Теперь шарик. Он будет катиться слева направо

    // rotation здесь это реальное вращение шарика вокруг своей оси

    // а x это горизонтальное смещение

    // считаем угол поворота по формуле: путь делим на радиус

    // шарик проходит 300px, радиус 20px, значит поворот = 300 / 20 * (180 / Math.PI) градусов

    // var ballPath = 300;

    // var ballRadius = 20;

    // var rotationDeg = (ballPath / ballRadius) * (180 / Math.PI);

  

    // tl.from("#ball", {

    //   x: -300,

    //   rotation: -rotationDeg,   // минус потому что катится в правую сторону, так правильнее

    //   duration: 1.2,

    //   ease: "power1.inOut",

    // }, "-=0.4");

  

    // Шарик едет по прямой от левого края до правого

    // x это смещение относительно начальной позиции (cx=30)

    // rotation крутит шарик вокруг своей оси

    // важно: transformOrigin ставим в центр шарика чтобы он крутился на месте

    // а не вокруг угла SVG

    tl.to("#ball", {

      x: distance,

      duration: 1.4,

      ease: "power1.inOut",

    }, 0);

  

  

  });

  

  (function () {

    const container = document.querySelector(".advan");

  

    if (!container) return;

  

    const stick = document.getElementById("stick-img");

    const stickWrapper = document.querySelector(".img-wrapper-2");

  

    if (!stick && !stickWrapper) return;

  

    const maxAngle = 22;

  

    gsap.set(stick, {

      rotation: 27,

      transformOrigin: "bottom center",

    });

  

    // Флаг что курсор внутри контейнера

    const isInside = false;

  

    container.addEventListener("mouseenter", function () {

      isInside = true;

    });

  

    container.addEventListener("mouseleave", function () {

      isInside = false;

      gsap.to(stick, {

        rotation: 27,

        duration: 1,

        ease: "elastic.out(1, 0.3)",

        transformOrigin: "bottom center",

      });

    });

  

    document.addEventListener("mousemove", function (e) {

      if (!isInside) return;

  

      // Берём rect от wrapper а не от img, потому что img крутится

      // и её bottom постоянно смещается. wrapper стоит на месте.

      var wrapperRect = stickWrapper.getBoundingClientRect();

  

      // Якорь это нижний центр wrapper

      var anchorX = wrapperRect.left + wrapperRect.width / 2;

      var anchorY = wrapperRect.bottom;

  

      var dx = e.clientX - anchorX;

      var dy = e.clientY - anchorY;

  

      var distance = Math.sqrt(dx * dx + dy * dy);

  

      // Берём размер контейнера как радиус притяжения

      var containerRect = container.getBoundingClientRect();

      var magnetRadius = Math.max(containerRect.width, containerRect.height);

  

      var influence = 1 - Math.min(distance / magnetRadius, 1);

  

      var angleRad = Math.atan2(dx, -dy);

      var angleDeg = angleRad * (180 / Math.PI);

  

      var clampedAngle = Math.max(-maxAngle, Math.min(maxAngle, angleDeg));

  

      var finalAngle = 27 + clampedAngle * influence;

  

      gsap.to(stick, {

        rotation: finalAngle,

        duration: 0.4,

        ease: "power2.out",

        transformOrigin: "bottom center",

      });

    });

  })();

  

  (function () {

    // ─────────────────────────────────────────────

    //  ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ — настройки анимации

    // ─────────────────────────────────────────────

  

    /**

     * SPIN_DEGREES — на сколько градусов повернётся изображение за одну волну.

     * Положительное значение → вращение по часовой стрелке.

     * Отрицательное значение → вращение против часовой стрелки.

     * Например, 720 = два полных оборота.

     */

    var SPIN_DEGREES = 1440;

  

    /**

     * TRIGGER_DELAY — задержка перед запуском анимации в миллисекундах.

     * После загрузки страницы (или после предыдущего цикла) ждём столько времени,

     * прежде чем запустить волну вращения.

     * 3000 = 3 секунды.

     */

    var TRIGGER_DELAY = 3000;

  

    /**

     * SPIN_DURATION — продолжительность самой анимации вращения в секундах.

     * За это время картинка пройдёт весь путь от 0 до SPIN_DEGREES,

     * постепенно замедляясь к концу.

     * 1.8 = 1.8 секунды.

     */

    var SPIN_DURATION = 1.8;

  

    // ─────────────────────────────────────────────

    //  Регистрируем плагин ScrollTrigger в GSAP

    // ─────────────────────────────────────────────

  

    // ─────────────────────────────────────────────

    //  Получаем ссылку на DOM-элемент

    // ─────────────────────────────────────────────

  

    /*

     * Ищем изображение по id. Все дальнейшие манипуляции идут с этим элементом.

     */

    var img = document.getElementById("spin-image");

  

    if (!document.getElementById('img')) return;

  

    // ─────────────────────────────────────────────

    //  Переменная для хранения id таймера

    // ─────────────────────────────────────────────

  

    /*

     * spinTimer хранит идентификатор, который возвращает setTimeout/setInterval.

     * Это позволяет при необходимости остановить таймер через clearTimeout/clearInterval.

     * Объявляем глобально, чтобы доступ к нему был из любой части кода.

     */

    var spinTimer = null;

  

    // ─────────────────────────────────────────────

    //  Текущий накопленный угол поворота

    // ─────────────────────────────────────────────

  

    /*

     * currentRotation — хранит суммарный угол, на который уже повернулась картинка.

     * Нужен, чтобы каждая новая волна продолжала вращение, а не сбрасывала его в 0.

     * Например, после первой волны = 720, после второй = 1440 и т.д.

     */

    var currentRotation = 0;

  

    // ─────────────────────────────────────────────

    //  Основная функция — запуск одной волны вращения

    // ─────────────────────────────────────────────

  

    /**

     * triggerSpin() — создаёт GSAP-твин (tween), который анимирует поворот картинки.

     *

     * Принцип работы:

     *  1. Рассчитываем целевой угол: текущий + SPIN_DEGREES.

     *  2. Запускаем gsap.to() — плавный переход от текущего к целевому значению.

     *  3. Используем ease: "power4.out" — резкий старт и плавное замедление к концу.

     *  4. По завершении анимации (onComplete) планируем следующую волну через setTimeout.

     */

    function triggerSpin() {

      // Вычисляем, куда должна доповернуться картинка

      var targetRotation = currentRotation + SPIN_DEGREES;

  

      /*

       * gsap.to(target, vars) — анимирует элемент ОТ текущего состояния ДО указанных значений.

       *

       * Параметры:

       *   img          — DOM-элемент, который анимируем.

       *   duration     — длительность анимации (берём из глобальной переменной SPIN_DURATION).

       *   rotation     — целевой угол поворота в градусах (GSAP понимает CSS transform: rotate).

       *   ease         — тип кривой ускорения:

       *                    "power4.out" → очень резкое начало + плавное замедление (волновой эффект).

       *                    Число 4 — мощность кривой (чем больше, тем резче старт).

       *   onComplete   — колбэк, вызываемый когда анимация полностью завершена.

       */

      gsap.to(img, {

        duration: SPIN_DURATION,

        rotationY: targetRotation,

        ease: "elastic.out(1, 0.3)",

        onComplete: function () {

          currentRotation = targetRotation;

        }

      });

    }

  

    // ─────────────────────────────────────────────

    //  ScrollTrigger — запуск первой волны при

    //  появлении картинки в зоне видимости экрана

    // ─────────────────────────────────────────────

  

    /*

     * ScrollTrigger.create() регистрирует триггер, который следит за

     * позицией скролла и вызывает колбэки при определённых условиях.

     *

     * Параметры:

     *   trigger    — элемент, за которым следим (наша картинка).

     *   start      — когда триггер "срабатывает":

     *                  "top 80%" = верхний край картинки достиг 80% высоты вьюпорта

     *                  (то есть когда картинка появилась на 20% снизу экрана).

     *   once       — true означает, что триггер сработает только один раз.

     *                После первого срабатывания он автоматически уничтожается.

     *   onEnter    — колбэк, вызываемый в момент срабатывания триггера.

     */

    ScrollTrigger.create({

      trigger: img,

      start: "top 80%",

      once: true,

      onEnter: function () {

        /*

         * Картинка вошла в зону видимости.

         * Запускаем первую волну сразу (без начальной задержки),

         * чтобы пользователь сразу увидел эффект.

         * Все последующие волны уже будут разделены паузой TRIGGER_DELAY.

         */

        triggerSpin();

      }

    });

  

    // ─────────────────────────────────────────────

    //  Дополнительно: функция для ручной остановки

    // ─────────────────────────────────────────────

  

    /**

     * stopSpin() — останавливает текущую анимацию и отменяет запланированный таймер.

     * Вызывай её из консоли браузера или по событию, если нужно остановить эффект.

     *

     * Пример из консоли:  stopSpin();

     */

    function stopSpin() {

      // Отменяем ожидающий таймер (если анимация завершена и ждём следующей волны)

      if (spinTimer !== null) {

        clearTimeout(spinTimer);

        spinTimer = null;

      }

      // Останавливаем все текущие GSAP-анимации на элементе

      gsap.killTweensOf(img);

  

      console.log("Анимация остановлена. currentRotation =", currentRotation);

    }

  

    /**

     * resumeSpin() — возобновляет анимацию после остановки.

     * Вызывай из консоли браузера.

     *

     * Пример из консоли:  resumeSpin();

     */

    function resumeSpin() {

      triggerSpin();

    }

  })();

  /**

   * Инициализация слайдера

   */

  window.initSliders = function () {

    (function swiperWrapper() {

  

      // ================================================================

      // ЗАЩИТА ОТ ЛИШНЕЙ РАБОТЫ

      // Если на странице вообще нет ни одного .swiper - выходим сразу.

      // Это важно для страниц где слайдеров нет: не создаём замыкания,

      // не вешаем обработчики, не тратим память

      // ================================================================

      if (!document.querySelector('.swiper')) return;

  

      // ================================================================

      // ГЛОБАЛЬНЫЕ НАСТРОЙКИ ИМПУЛЬСА

      //

      // Импульс - это физика кнопок навигации. При быстрых повторных

      // кликах слайдер «разгоняется» и перелистывает больше слайдов за раз.

      //

      // Все слайдеры на странице используют один и тот же набор настроек.

      // Чтобы изменить физику - меняй только этот объект

      // ================================================================

      const globalImpulseOptions = {

  

        // Максимальный интервал между кликами в мс, который считается

        // «быстрым». Если пользователь кликнул повторно быстрее чем за

        // 200мс - клик добавляет импульс к предыдущему

        fastClickDelay: 200,

  

        // Насколько сильно каждый быстрый клик увеличивает импульс.

        // Формула: impulse += (fastClickDelay - delta) * accelerationFactor

        // При delta=0 (мгновенный клик) прирост = 200 * 0.23 = 46 единиц

        accelerationFactor: 0.23,

  

        // Коэффициент затухания импульса (0–1).

        // Каждые decayInterval мс: impulse = impulse * friction

        // При 0.85 импульс теряет 15% каждые 40мс - достаточно плавно

        friction: 0.85,

  

        // Верхняя граница накопленного импульса.

        // Итоговый шаг = 1 + round(impulse), максимум = 1 + 2 = 3 слайда за клик

        maxExtraSteps: 2,

  

        // Как часто пересчитывается затухание (мс).

        // 40мс ≈ каждые 2–3 кадра при 60fps - достаточно плавно

        decayInterval: 40,

      };

  

  

      // ================================================================

      // КОНФИГУРАЦИЯ СЛАЙДЕРОВ

      //

      // Массив объектов - один объект на один слайдер.

      // Чтобы добавить новый слайдер - добавь объект в массив.

      // Вся логика (импульс, highlight, edge-трекер) подключается

      // автоматически при инициализации

      // ================================================================

      const slidersConfig = [

        {

          // CSS-селектор корневого элемента слайдера (.swiper)

          sliderSelector: '.category__slider',

  

          // CSS-селекторы кнопок навигации

          prevSelector: '.category-button-prev',

          nextSelector: '.category-button-next',

  

          // Опции Swiper - передаются напрямую в new Swiper()

          swiperOptions: {

  

            // Сколько слайдов прокручивается за одно нажатие кнопки навигации.

            // 1 = по одному слайду. При freeMode работает как минимальный шаг

            slidesPerGroup: 1,

  

            // Сколько слайдов видно одновременно.

            // 1 = один слайд на всю ширину контейнера (для мобилки без брейкпоинта)

            slidesPerView: 1,

  

            // Отступ между слайдами в пикселях

            spaceBetween: 10,

  

            // Длительность анимации перехода в мс

            speed: 500,

  

            // Показывает курсор-«руку» при наведении на слайдер

            grabCursor: true,

  

            // Отключаем бесконечную петлю - слайдер имеет начало и конец.

            // При loop: true нужны дополнительные клоны слайдов

            loop: false,

  

            // Коэффициент чувствительности к свайпу.

            // 1.6 = свайп на 100px воспринимается как 160px

            touchRatio: 1.6,

  

            // Включает «резиновый» эффект на краях слайдера

            resistance: true,

  

            // Насколько сильно сопротивление на краях (0–1).

            // 0.4 = умеренное натяжение, не слишком тугое

            resistanceRatio: 0.4,

  

            // Не центрируем активный слайд - он прижат к левому краю

            centeredSlides: false,

  

            // При centeredSlides: false не даёт последним слайдам

            // уезжать за правый край контейнера

            centeredSlidesBounds: true,

  

            // Разрешает симулировать тач-события мышью на десктопе

            simulateTouch: true,

  

            // Горизонтальный слайдер

            direction: 'horizontal',

  

            // Блокирует дефолтный тач-ивент браузера при начале свайпа.

            // Нужно чтобы страница не скроллилась одновременно со слайдером

            touchStartPreventDefault: true,

  

            // Останавливает всплытие события touchmove выше по DOM.

            // Предотвращает конфликты с внешними скролл-контейнерами

            touchMoveStopPropagation: true,

  

            // Минимальный сдвиг пальца в px чтобы свайп вообще засчитался.

            // 8px - защита от случайных микро-касаний

            threshold: 8,

  

            // Максимальный угол отклонения свайпа от горизонтали в градусах.

            // Если пользователь свайпает под углом > 25° - вертикальный скролл

            touchAngle: 25,

  

            // ---- РЕЖИМ СВОБОДНОЙ ПРОКРУТКИ ----

            freeMode: {

              // Включает freeMode: слайдер останавливается где угодно,

              // не привязывается к позициям слайдов

              enabled: true,

  

              // После отпускания слайдер продолжает движение по инерции

              momentum: true,

  

              // Насколько далеко улетает слайдер после свайпа.

              // 0.85 = 85% от скорости свайпа

              momentumRatio: 0.85,

  

              // Коэффициент скорости инерции относительно скорости свайпа.

              // 1 = без изменений

              momentumVelocityRatio: 1,

  

              // Отключает эффект отскока от краёв при инерционном движении

              momentumBounce: false,

  

              // Притягивает слайдер к ближайшему слайду после остановки.

              // Это ключевая настройка: freeMode + sticky = «свободный свайп,

              // но останавливается ровно на слайде»

              sticky: true,

            },

  

            // ---- УПРАВЛЕНИЕ КОЛЕСОМ МЫШИ ----

            mousewheel: {

              // Реагирует только на горизонтальную прокрутку колеса.

              // Вертикальная прокрутка страницы не перехватывается

              forceToAxis: true,

  

              // Чувствительность колеса. 1 = стандартная

              sensitivity: 1,

  

              // Когда слайдер упёрся в край - колесо отдаётся

              // родительскому скроллу (не «застревает» в слайдере)

              releaseOnEdges: true,

            },

  

            // ---- АДАПТИВНЫЕ БРЕЙКПОИНТЫ ----

            // Ключ = минимальная ширина экрана в px.

            // Swiper применяет настройки брейкпоинта когда ширина >= ключа.

            // Настройки мержатся поверх базовых swiperOptions

            breakpoints: {

  

              // Мобильная версия (0px и выше, то есть по умолчанию)

              0: {

                slidesPerGroup: 1,

                slidesPerView: 1,    // один слайд на весь экран

                spaceBetween: 10,

                sticky: true,        // freeMode.sticky для мобилки

              },

  

              // Планшет (от 601px)

              601: {

                slidesPerGroup: 1,

                slidesPerView: 3,    // три слайда одновременно

                spaceBetween: 10,

                sticky: true,        // sticky оставляем и на планшете

              },

  

              // Десктоп (от 835px)

              835: {

                slidesPerGroup: 1,

                slidesPerView: 6,    // шесть слайдов одновременно

                spaceBetween: 20,

                sticky: false,       // на десктопе sticky отключаем -

                // там работает edge-трекер с виртуальным активным

              },

            },

  

            // Встроенную навигацию Swiper отключаем полностью.

            // Кнопками управляем сами через attachImpulse -

            // иначе при клике сработают два обработчика одновременно

            navigation: false,

          },

        },

        {

          sliderSelector: '.reviews__slider',

          prevSelector: '.reviews-button-prev',

          nextSelector: '.reviews-button-next',

          swiperOptions: {

            slidesPerGroup: 1,

            slidesPerView: 1.2,

            spaceBetween: 10,

            speed: 500,

            grabCursor: true,

            loop: false,

            touchRatio: 1.6,

            resistance: true,

            resistanceRatio: 0.4,

            centeredSlides: false,

            centeredSlidesBounds: true,

            simulateTouch: true,

            direction: 'horizontal',

            touchStartPreventDefault: true,

            touchMoveStopPropagation: true,

            threshold: 8,

            touchAngle: 25,

            freeMode: {

              enabled: true,

              momentum: true,

              momentumRatio: 0.85,

              momentumVelocityRatio: 1,

              momentumBounce: false,

              sticky: true,

            },

            mousewheel: {

              forceToAxis: true,

              sensitivity: 1,

              releaseOnEdges: true,

            },

            breakpoints: {

              0: {

                slidesPerGroup: 1,

                slidesPerView: 1.2,

                spaceBetween: 10,

                sticky: true,

              },

              601: {

                slidesPerGroup: 1,

                slidesPerView: 2,

                spaceBetween: 10,

                sticky: true,

              },

              835: {

                slidesPerGroup: 1,

                slidesPerView: 3,

                spaceBetween: 20,

                sticky: false,

              },

            },

            navigation: false,

          },

        },

        {

          sliderSelector: '.advan__slider',

          prevSelector: '.advan-button-prev',

          nextSelector: '.advan-button-next',

          swiperOptions: {

            slidesPerGroup: 1,

            slidesPerView: 1,

            spaceBetween: 10,

            speed: 500,

            grabCursor: true,

            loop: false,

            touchRatio: 1.6,

            resistance: true,

            resistanceRatio: 0.4,

            centeredSlides: false,

            centeredSlidesBounds: true,

            simulateTouch: true,

            direction: 'horizontal',

            touchStartPreventDefault: true,

            touchMoveStopPropagation: true,

            threshold: 8,

            touchAngle: 25,

  

            // watchSlidesProgress: true,

            // slideVisibleClass: 'slide-visible',

  

            freeMode: {

              enabled: true,

              momentum: true,

              momentumRatio: 0.85,

              momentumVelocityRatio: 1,

              momentumBounce: false,

              sticky: true,

            },

            mousewheel: {

              forceToAxis: true,

              sensitivity: 1,

              releaseOnEdges: true,

            },

            breakpoints: {

              0: {

                slidesPerGroup: 1,

                slidesPerView: 1,

                spaceBetween: 10,

                sticky: true,

              },

              601: {

                slidesPerGroup: 1,

                slidesPerView: 2,

                spaceBetween: 10,

                sticky: true,

              },

              835: {

                slidesPerGroup: 1,

                slidesPerView: 3,

                spaceBetween: 20,

                sticky: false,

              },

            },

            navigation: false,

          },

        },

      ];

  

  

      // ================================================================

      // ИНИЦИАЛИЗАЦИЯ ВСЕХ СЛАЙДЕРОВ

      //

      // Перебираем массив конфигов, для каждого:

      // 1. Проверяем что DOM-элементы существуют

      // 2. Создаём экземпляр Swiper

      // 3. Подключаем три системы: highlight, edgeTracker, navigation

      //

      // Порядок создания важен - каждая следующая система получает

      // ссылку на предыдущую:

      //   highlight не зависит ни от чего

      //   edgeTracker получает highlight (чтобы двигать фон)

      //   navigation получает обоих (чтобы знать что перехватить)

      // ================================================================

      slidersConfig.forEach(({ sliderSelector, prevSelector, nextSelector, swiperOptions }) => {

  

        // Если элемент слайдера не найден - пропускаем без краша.

        // Актуально для страниц где только часть слайдеров присутствует

        if (!document.querySelector(sliderSelector)) {

          console.warn(`Swiper: элемент "${sliderSelector}" не найден, пропускаем.`);

          return;

        }

  

        const prevEl = document.querySelector(prevSelector);

        const nextEl = document.querySelector(nextSelector);

  

        // highlight-элементы опциональны - не все слайдеры их имеют.

        // ?? null гарантирует что получим null, а не undefined

        const fromEl = document.querySelector(`${sliderSelector} .category__slider-highlight--from`) ?? null;

        const toEl = document.querySelector(`${sliderSelector} .category__slider-highlight--to`) ?? null;

  

        // Кнопки навигации обязательны - без них импульс не к чему привязать

        if (!prevEl || !nextEl) {

          console.warn(`Swiper: кнопки навигации для "${sliderSelector}" не найдены.`);

          return;

        }

  

        const swiper = new Swiper(sliderSelector, swiperOptions);

  

        // Создаём три взаимосвязанные системы строго по порядку

        const highlight = createHighlight(swiper, fromEl, toEl);

        const edgeTracker = createEdgeTracker(swiper, highlight);

        createNavigation(swiper, prevEl, nextEl, highlight, edgeTracker);

      });

  

  

      // ================================================================

      // СИСТЕМА 1: HIGHLIGHT - анимированный фон «резинка»

      //

      // Визуально: синий прямоугольник который перескакивает между

      // слайдами с эффектом резинки - сжимается к одному краю и

      // одновременно вырастает с другого края на новом слайде.

      //

      // Реализация через два DOM-элемента:

      //   --from: старый фон, сжимается и исчезает

      //   --to:   новый фон, появляется и растягивается

      // Оба анимируются одновременно - это даёт эффект непрерывности

      //

      // Если highlight-элементов нет в DOM - функция возвращает заглушку

      // с тем же API. Это позволяет edgeTracker и navigation работать

      // с любым слайдером независимо от наличия highlight

      // ================================================================

      function createHighlight(swiper, fromEl, toEl) {

  

        const hasElements = fromEl !== null && toEl !== null;

  

        // ---- ЗАГЛУШКА (когда highlight-элементов нет в DOM) ----

        if (!hasElements) {

          return {

            // animateTo и snapInstant ничего не делают визуально,

            // но getGeometry всё равно считает реальную геометрию слайдов -

            // edgeTracker использует её для других целей

            animateTo: () => { },

            snapInstant: () => { },

            getGeometry: (index) => {

              const slide = swiper.slides[index];

              if (!slide) return null;

              const wrapperOffset = swiper.translate ?? 0;

              return {

                x: slide.offsetLeft + wrapperOffset,

                width: slide.offsetWidth,

              };

            },

            getCurrentX: () => 0,

            getCurrentW: () => 0,

          };

        }

  

        // ---- РЕАЛЬНАЯ РЕАЛИЗАЦИЯ ----

  

        const DURATION = 320;   // длительность обеих фаз анимации в мс

  

        // Замедление к концу - старый фон плавно схлопывается

        const EASE_OUT = `cubic-bezier(0.4, 0, 0.2, 1)`;

  

        // «Пружина» с небольшим перелётом - новый фон упруго вырастает

        const EASE_SNAP = `cubic-bezier(0.34, 1.4, 0.64, 1)`;

  

        // Текущая позиция и ширина активного highlight.

        // Обновляются после каждой анимации - используются как

        // стартовая точка для следующей

        let currentX = 0;

        let currentWidth = 0;

  

        // ID текущего requestAnimationFrame - нужен чтобы отменить

        // незавершённую анимацию если пришла новая команда

        let rafId = null;

  

        // ------------------------------------------------------------

        // Считает позицию и ширину слайда относительно контейнера.

        //

        // slide.offsetLeft - позиция слайда внутри swiper-wrapper.

        // swiper.translate - текущий сдвиг wrapper (отрицательный при прокрутке).

        // Сумма даёт позицию слайда относительно видимой области контейнера

        // ------------------------------------------------------------

        function getGeometry(index) {

          const slide = swiper.slides[index];

          if (!slide) return null;

          const wrapperOffset = swiper.translate ?? 0;

          return {

            x: slide.offsetLeft + wrapperOffset,

            width: slide.offsetWidth,

          };

        }

  

        // ------------------------------------------------------------

        // Устанавливает геометрию элемента мгновенно, без анимации.

        // transition: none важен - без него браузер может интерполировать

        // даже «мгновенные» изменения если они идут сразу за анимацией

        // ------------------------------------------------------------

        function setInstant(el, x, width, visible) {

          el.style.transition = 'none';

          el.style.transform = `translateX(${x}px)`;

          el.style.width = `${width}px`;

          el.classList.toggle('is-visible', visible);

        }

  

        // ------------------------------------------------------------

        // Устанавливает геометрию с CSS-переходом.

        // Три свойства анимируются одновременно:

        //   transform - позиция (translateX)

        //   width     - размер

        //   opacity   - появление/исчезновение (чуть быстрее основной анимации)

        // ------------------------------------------------------------

        function setAnimated(el, x, width, duration, easing, visible) {

          el.style.transition = [

            `transform ${duration}ms ${easing}`,

            `width ${duration}ms ${easing}`,

            `opacity ${duration * 0.6}ms ease`,  // opacity исчезает за 60% времени

          ].join(', ');

          el.style.transform = `translateX(${x}px)`;

          el.style.width = `${width}px`;

          el.classList.toggle('is-visible', visible);

        }

  

        // ------------------------------------------------------------

        // Главная функция анимации резинки.

        //

        // Параметры:

        //   toX, toWidth - геометрия целевого слайда

        //   dir          - направление ('next' | 'prev')

        //

        // Алгоритм:

        //   1. Мгновенно расставляем оба слоя в стартовые позиции

        //      (без transition чтобы браузер не анимировал подготовку)

        //   2. Через два RAF включаем transition и задаём конечные позиции

        //

        // Почему два RAF:

        //   Один RAF гарантирует что браузер начал новый цикл рендера.

        //   Второй RAF гарантирует что стили из шага 1 уже применены

        //   и transition не захватит мгновенные изменения.

        //   Без двух RAF браузер может «слить» шаг 1 и шаг 2 в один -

        //   тогда анимация стартует не с нужной позиции

        // ------------------------------------------------------------

        function animateTo(toX, toWidth, dir) {

          if (rafId) cancelAnimationFrame(rafId);

  

          const fromX = currentX;

          const fromWidth = currentWidth;

  

          // --from схлопывается к тому краю куда движется слайдер:

          //   next → к правому краю (fromX + fromWidth)

          //   prev → к левому краю (fromX, т.е. на месте но ширина → 0)

          const collapseX = dir === 'next' ? fromX + fromWidth : fromX;

  

          // --to появляется с противоположного края нового слайда:

          //   next → с левого края нового слайда (toX)

          //   prev → с правого края нового слайда (toX + toWidth)

          const startX = dir === 'next' ? toX : toX + toWidth;

  

          // ШАГ 1: мгновенная расстановка (без анимации)

          setInstant(fromEl, fromX, fromWidth, true);  // --from на старом месте

          setInstant(toEl, startX, 0, true);  // --to в точке входа, ширина 0

  

          // ШАГ 2: запускаем анимацию через двойной RAF

          rafId = requestAnimationFrame(() => {

            rafId = requestAnimationFrame(() => {

              rafId = null;

  

              // --from сжимается к краю и исчезает (opacity → 0 через is-visible: false)

              setAnimated(fromEl, collapseX, 0, DURATION, EASE_OUT, false);

  

              // --to растягивается до полного размера нового слайда

              setAnimated(toEl, toX, toWidth, DURATION, EASE_SNAP, true);

            });

          });

  

          // Сразу фиксируем новую «текущую» геометрию.

          // Не ждём конца анимации - если придёт следующий вызов animateTo

          // до завершения, он возьмёт правильную целевую позицию как стартовую

          currentX = toX;

          currentWidth = toWidth;

        }

  

        // ------------------------------------------------------------

        // Мгновенная установка highlight на указанный слайд без анимации.

        // Используется при:

        //   - инициализации (первый слайд)

        //   - свайпе рукой (нет смысла в резинке во время жеста)

        //   - ресайзе (геометрия изменилась, пересчитываем без анимации)

        // ------------------------------------------------------------

        function snapInstant(index) {

          if (rafId) { cancelAnimationFrame(rafId); rafId = null; }

          const geo = getGeometry(index);

          if (!geo) return;

  

          // --from показываем с полной шириной (он «основной» слой в покое)

          setInstant(fromEl, geo.x, geo.width, true);

          // --to скрываем (ширина 0, невидим) - он используется только во время анимации

          setInstant(toEl, geo.x, 0, false);

          currentX = geo.x;

          currentWidth = geo.width;

        }

  

        // ------------------------------------------------------------

        // СОБЫТИЯ SWIPER

        // ------------------------------------------------------------

  

        // Обычная смена слайда (кнопки, свайп, slideTo).

        // Определяем направление по изменению activeIndex и запускаем резинку

        swiper.on('slideChange', () => {

          const curr = swiper.activeIndex;

          const prev = swiper.previousIndex ?? curr;

          const dir = curr >= prev ? 'next' : 'prev';

          const geo = getGeometry(curr);

          if (geo) animateTo(geo.x, geo.width, dir);

        });

  

        // После завершения CSS-перехода синхронизируем слои:

        // переносим финальное состояние на --from, скрываем --to.

        // Это нужно чтобы следующая animateTo стартовала от корректного --from

        swiper.on('transitionEnd', () => {

          setInstant(fromEl, currentX, currentWidth, true);

          setInstant(toEl, currentX, 0, false);

        });

  

        // Во время активного свайпа руками - двигаем highlight вживую

        // без резинки. swiper.animating = true означает что идёт

        // анимированный переход (не ручной свайп), в этом случае пропускаем

        swiper.on('setTranslate', () => {

          if (swiper.animating) return;

          const geo = getGeometry(swiper.activeIndex);

          if (!geo) return;

          if (rafId) { cancelAnimationFrame(rafId); rafId = null; }

          setInstant(fromEl, geo.x, geo.width, true);

          setInstant(toEl, geo.x, 0, false);

          currentX = geo.x;

          currentWidth = geo.width;

        });

  

        // При изменении размера контейнера пересчитываем позицию мгновенно.

        // Геометрия слайдов изменилась - плавная анимация здесь неуместна

        swiper.on('resize', () => snapInstant(swiper.activeIndex));

  

        // Инициализация: ставим highlight на первый активный слайд

        snapInstant(swiper.activeIndex ?? 0);

  

        return {

          animateTo,    // запустить анимацию резинки к конкретной геометрии

          snapInstant,  // мгновенно поставить highlight на слайд по индексу

          getGeometry,  // получить {x, width} слайда - нужен edgeTracker'у

          getCurrentX: () => currentX,      // текущая X позиция (для отладки)

          getCurrentW: () => currentWidth,  // текущая ширина (для отладки)

        };

      }

  

  

      // ================================================================

      // СИСТЕМА 2: EDGE TRACKER - виртуальный активный слайд на краях

      //

      // Проблема которую решает эта система:

      //   При slidesPerView: 6 Swiper считает последним «достижимым»

      //   активным слайдом тот что стоит на позиции (totalSlides - 6).

      //   Слайды правее него никогда не получают swiper-slide-active.

      //

      // Решение:

      //   Когда swiper.isEnd = true, перехватываем клики кнопок навигации

      //   и вручную перемещаем «виртуальный активный» по оставшимся слайдам.

      //   Wrapper при этом не двигается - пустого пространства не появляется.

      //

      // Классы которые вешаются на слайды:

      //   is-virtual-active  - текущий «виртуальный» активный слайд

      //   is-before-edge     - слайд который был swiper-slide-active в момент

      //                        входа в виртуальный режим. Нужен чтобы убрать

      //                        его активные стили пока highlight ушёл дальше

      // ================================================================

      function createEdgeTracker(swiper, highlight) {

  

        const VIRTUAL_CLASS = 'is-virtual-active';

        const BEFORE_EDGE_CLASS = 'is-before-edge';

  

        // null = не в виртуальном режиме, число = индекс виртуального активного

        let virtualIndex = null;

  

        // ------------------------------------------------------------

        // Возвращает индексы всех слайдов которые сейчас видны

        // в пределах контейнера (полностью или частично).

        //

        // Используется чтобы найти последний видимый слайд -

        // именно до него нужно дойти в виртуальном режиме

        // ------------------------------------------------------------

        function getVisibleIndices() {

          const containerWidth = swiper.width;

          // Math.abs потому что swiper.translate отрицательный при прокрутке вправо

          const offset = Math.abs(swiper.translate ?? 0);

          const visible = [];

  

          swiper.slides.forEach((slide, i) => {

            const left = slide.offsetLeft;

            const right = left + slide.offsetWidth;

            // Слайд виден если его правый край правее левой границы контейнера

            // И его левый край левее правой границы контейнера

            if (right > offset && left < offset + containerWidth) {

              visible.push(i);

            }

          });

  

          return visible;

        }

  

        // ------------------------------------------------------------

        // Снимает класс is-before-edge со всех слайдов

        // ------------------------------------------------------------

        function clearBeforeEdge() {

          swiper.slides.forEach(s => s.classList.remove(BEFORE_EDGE_CLASS));

        }

  

        // ------------------------------------------------------------

        // Вешает is-before-edge на тот слайд который сейчас является

        // swiper-slide-active. Вызывается один раз при входе

        // в виртуальный режим (virtualIndex переходит из null в число)

        // ------------------------------------------------------------

        function markBeforeEdge() {

          clearBeforeEdge();

          swiper.slides.forEach(s => {

            if (s.classList.contains('swiper-slide-active')) {

              s.classList.add(BEFORE_EDGE_CLASS);

            }

          });

        }

  

        // ------------------------------------------------------------

        // Полный сброс виртуального режима:

        //   - убирает is-virtual-active со всех слайдов

        //   - убирает is-before-edge со всех слайдов

        //   - сбрасывает virtualIndex в null

        //

        // Вызывается при:

        //   - slideChange (wrapper сдвинулся - реальный activeIndex изменился)

        //   - fromEdge (слайдер ушёл от края)

        //   - handleEdgePrev когда виртуальный вернулся к realActive

        // ------------------------------------------------------------

        function clearVirtual() {

          swiper.slides.forEach(s => s.classList.remove(VIRTUAL_CLASS));

          clearBeforeEdge();

          virtualIndex = null;

        }

  

        // ------------------------------------------------------------

        // Устанавливает виртуальный активный слайд на указанный индекс.

        //

        // При первом вызове (virtualIndex === null):

        //   помечает текущий swiper-slide-active через is-before-edge

        //

        // При всех вызовах:

        //   - снимает is-virtual-active со всех слайдов

        //   - вешает is-virtual-active на целевой слайд

        //   - двигает highlight к целевому слайду через резинку

        // ------------------------------------------------------------

        function setVirtualActive(index, dir) {

          // Первый вход в виртуальный режим - помечаем «старый» активный

          if (virtualIndex === null) {

            markBeforeEdge();

          }

  

          // Сбрасываем класс со всех, is-before-edge не трогаем -

          // он должен оставаться на swiper-slide-active весь виртуальный режим

          swiper.slides.forEach(s => s.classList.remove(VIRTUAL_CLASS));

          virtualIndex = index;

          swiper.slides[index]?.classList.add(VIRTUAL_CLASS);

  

          // Двигаем highlight - highlight.getGeometry работает даже без DOM-элементов

          const geo = highlight.getGeometry(index);

          if (geo) highlight.animateTo(geo.x, geo.width, dir);

        }

  

        // ------------------------------------------------------------

        // Перехватчик кнопки «следующий» когда wrapper упёрся в конец.

        //

        // Возвращает true если перехватил клик (навигация должна остановиться).

        // Возвращает false если не на краю - навигация работает как обычно.

        //

        // Логика:

        //   Находим последний видимый слайд.

        //   Если виртуальный ещё не дошёл до него - двигаем дальше.

        //   Если уже на последнем - возвращаем true (блокируем) но не двигаем

        // ------------------------------------------------------------

        function handleEdgeNext() {

          if (!swiper.isEnd) return false;

  

          const visible = getVisibleIndices();

          if (!visible.length) return false;

  

          const lastVisible = visible[visible.length - 1];

          const current = virtualIndex ?? swiper.activeIndex;

  

          // Уже на последнем слайде - некуда идти, но клик поглощаем

          if (current >= lastVisible) return true;

  

          setVirtualActive(current + 1, 'next');

          return true;

        }

  

        // ------------------------------------------------------------

        // Перехватчик кнопки «предыдущий» когда активен виртуальный режим.

        //

        // Возвращает true если перехватил (виртуальный ещё не у realActive).

        // Возвращает false если виртуальный вернулся к realActive -

        // тогда сбрасываем виртуальный режим и отдаём клик обычной навигации

        // ------------------------------------------------------------

        function handleEdgePrev() {

          // Если виртуального режима нет - не перехватываем

          if (virtualIndex === null) return false;

  

          const current = virtualIndex;

          const realActive = swiper.activeIndex;

  

          if (current <= realActive) {

            // Виртуальный вернулся к реальному - выходим из виртуального режима

            clearVirtual();

            // Возвращаем highlight на реальный активный слайд

            highlight.snapInstant(realActive);

            // false = отдаём клик обычной навигации (слайдер поедет влево)

            return false;

          }

  

          setVirtualActive(current - 1, 'prev');

          return true;

        }

  

        // Когда wrapper реально сдвинулся (обычный slideChange) -

        // виртуальный режим больше не нужен, сбрасываем

        swiper.on('slideChange', () => {

          if (virtualIndex !== null) {

            clearVirtual();

          }

        });

  

        // fromEdge срабатывает когда слайдер уходит от края.

        // Это значит wrapper начал двигаться - сбрасываем виртуальный режим

        swiper.on('fromEdge', () => {

          clearVirtual();

        });

  

        return {

          handleEdgeNext,              // вызывается из navigation при клике next

          handleEdgePrev,              // вызывается из navigation при клике prev

          clearVirtual,                // публичный сброс (вызывается из navigation)

          getVirtualIndex: () => virtualIndex,  // нужен navigation для updateDisabled

        };

      }

  

  

      // ================================================================

      // СИСТЕМА 3: NAVIGATION - кнопки + импульс + disabled-состояние

      //

      // Объединяет три вещи которые тесно связаны:

      //

      // 1. ИМПУЛЬС - физика разгона при быстрых кликах.

      //    При медленных кликах = 1 слайд за клик.

      //    При быстрых = до 1 + maxExtraSteps слайдов за клик.

      //

      // 2. EDGE-ПРИОРИТЕТ - перед обычной навигацией проверяем

      //    не нужно ли перехватить клик для виртуального активного.

      //

      // 3. DISABLED - синхронизация состояния кнопок с позицией слайдера.

      //    Важный нюанс: кнопка next не блокируется пока есть куда двигать

      //    виртуальный активный (даже если wrapper уже упёрся в конец)

      // ================================================================

      function createNavigation(swiper, prevEl, nextEl, highlight, edgeTracker) {

  

        const {

          fastClickDelay = 200,

          accelerationFactor = 0.23,

          friction = 0.85,

          maxExtraSteps = 2,

          decayInterval = 40,

        } = globalImpulseOptions;

  

        let lastClickTime = 0;   // timestamp последнего клика

        let lastDirection = null; // направление последнего клика

        let extraImpulse = 0;   // накопленный импульс (дробное число 0..maxExtraSteps)

        let decayTimer = null; // setInterval для затухания импульса

  

        // ------------------------------------------------------------

        // Полный сброс импульса.

        // Вызывается при начале свайпа рукой - жест и импульс кнопок

        // не должны складываться (иначе после свайпа кнопка «улетит» далеко)

        // ------------------------------------------------------------

        function resetImpulse() {

          extraImpulse = 0;

          lastDirection = null;

          if (decayTimer) clearInterval(decayTimer);

          decayTimer = null;

        }

  

        // ------------------------------------------------------------

        // Накопление импульса при каждом клике.

        //

        // Формула прироста: (fastClickDelay - delta) * accelerationFactor

        // Чем меньше delta (быстрее кликают) - тем больше прирост.

        // При delta >= fastClickDelay импульс сбрасывается в 0

        // («медленный» клик начинает разгон заново).

        //

        // После каждого клика запускается таймер затухания:

        // если кликать перестали - импульс плавно угасает

        // ------------------------------------------------------------

        function accumulateImpulse(direction) {

          const now = Date.now();

          const delta = now - lastClickTime;

  

          // Смена направления - обнуляем чтобы разгон не тащился в другую сторону

          if (lastDirection !== null && lastDirection !== direction) {

            extraImpulse = 0;

          }

  

          extraImpulse = delta < fastClickDelay

            ? Math.min(extraImpulse + (fastClickDelay - delta) * accelerationFactor, maxExtraSteps)

            : 0;

  

          lastClickTime = now;

          lastDirection = direction;

  

          // Перезапускаем таймер затухания при каждом клике

          if (decayTimer) clearInterval(decayTimer);

          decayTimer = setInterval(() => {

            extraImpulse *= friction;

            if (extraImpulse < 0.2) {

              extraImpulse = 0;

              clearInterval(decayTimer);

              decayTimer = null;

            }

          }, decayInterval);

        }

  

        // ------------------------------------------------------------

        // Вспомогательная функция - те же видимые индексы что в edgeTracker.

        // Дублирование оправдано: navigation не должна зависеть от

        // внутренних деталей edgeTracker

        // ------------------------------------------------------------

        function getVisibleIndicesForNav() {

          const containerWidth = swiper.width;

          const offset = Math.abs(swiper.translate ?? 0);

          const visible = [];

          swiper.slides.forEach((slide, i) => {

            const left = slide.offsetLeft;

            const right = left + slide.offsetWidth;

            if (right > offset && left < offset + containerWidth) visible.push(i);

          });

          return visible;

        }

  

        // ------------------------------------------------------------

        // Обновляет disabled-состояние кнопок.

        //

        // Используем el.disabled = bool (не toggleAttribute) - потому что

        // toggleAttribute('disabled') на обычных <button> физически

        // блокирует DOM-события и клик не доходит до обработчика.

        // CSS-класс swiper-button-disabled нужен для визуального стиля.

        //

        // Кнопка next блокируется только если:

        //   - wrapper упёрся в конец (isEnd)

        //   - И виртуальный активный уже на последнем видимом слайде

        //

        // Пока виртуальный не дошёл до конца - кнопка остаётся активной

        // ------------------------------------------------------------

        function updateDisabled() {

          if (swiper.params.loop) return; // в loop-режиме кнопки всегда активны

  

          // prev блокируется только если мы в самом начале И нет виртуального режима

          const isStart = swiper.isBeginning && edgeTracker.getVirtualIndex() === null;

  

          let nextBlocked = false;

          if (swiper.isEnd) {

            const visible = getVisibleIndicesForNav();

            const lastVisible = visible[visible.length - 1] ?? swiper.activeIndex;

            const currentVirt = edgeTracker.getVirtualIndex() ?? swiper.activeIndex;

            // Блокируем только когда виртуальный достиг последнего видимого

            nextBlocked = currentVirt >= lastVisible;

          }

  

          prevEl.classList.toggle('swiper-button-disabled', isStart);

          nextEl.classList.toggle('swiper-button-disabled', nextBlocked);

  

          // Устанавливаем свойство disabled напрямую (не атрибут) -

          // это позволяет нашим click-обработчикам всё равно срабатывать

          // (обработчик добавлен до того как элемент стал disabled)

          prevEl.disabled = isStart;

          nextEl.disabled = nextBlocked;

        }

  

        // ------------------------------------------------------------

        // Центральный обработчик клика по кнопке навигации.

        //

        // Порядок приоритетов:

        //   1. edgeTracker.handleEdgeNext/Prev - виртуальный режим края

        //   2. Обычная навигация с импульсом через Swiper API

        // ------------------------------------------------------------

        function handle(direction) {

          // Даём edgeTracker первый шанс перехватить клик

          if (direction === 'next' && edgeTracker.handleEdgeNext()) {

            updateDisabled();

            return;

          }

          if (direction === 'prev' && edgeTracker.handleEdgePrev()) {

            updateDisabled();

            return;

          }

  

          // Edge не перехватил - обычная навигация с импульсом

          accumulateImpulse(direction);

          const steps = 1 + Math.round(extraImpulse);

  

          if (swiper.params.loop) {

            // В loop-режиме используем realIndex и slideToLoop

            // чтобы корректно работать с клонированными слайдами

            const total = swiper.slides.length - (swiper.loopedSlides ?? 0) * 2;

            const curr = swiper.realIndex;

            const target = direction === 'next'

              ? (curr + steps) % total

              : (curr - steps + total) % total;

            swiper.slideToLoop(target);

          } else {

            const base = swiper.activeIndex;

            const target = direction === 'next'

              ? Math.min(base + steps, swiper.slides.length - 1)

              : Math.max(base - steps, 0);

            swiper.slideTo(target);

          }

  

          updateDisabled();

        }

  

        // Вешаем обработчики на кнопки.

        // preventDefault на случай если кнопки это <a href="...">

        nextEl.addEventListener('click', (e) => { e.preventDefault(); handle('next'); });

        prevEl.addEventListener('click', (e) => { e.preventDefault(); handle('prev'); });

  

        // Сбрасываем импульс при начале ручного свайпа

        swiper.on('touchStart', resetImpulse);

  

        // Обновляем disabled при каждом переходе и при ресайзе

        swiper.on('slideChange', updateDisabled);

        swiper.on('resize', updateDisabled);

  

        // Очищаем таймер при уничтожении слайдера

        swiper.on('destroy', () => {

          if (decayTimer) clearInterval(decayTimer);

          decayTimer = null;

        });

  

        // Устанавливаем начальное состояние кнопок

        updateDisabled();

      }

  

    })();

  };

  function initClipSlider(selector) {

    const containers = document.querySelectorAll(selector);

    if (!containers.length) return null;

  

    containers.forEach(container => {

      // Поиск элементов управления по стандартным классам Swiper

      const paginationEl = container.querySelector('.swiper-pagination');

      const btnNext = container.querySelector('.swiper-button-next');

      const btnPrev = container.querySelector('.swiper-button-prev');

  

      const swiper = new Swiper(container, {

        slidesPerView: 1,

        loop: false,

        speed: 0,

        grabCursor: true,

        allowTouchMove: false,

        init: false,

      });

  

      const total = () => swiper.slides.length;

      let prevIndex = 0;

      let blocked = false;

      const DURATION = 500;

  

      // Генерация стандартных буллетов Swiper

      function renderBullets() {

        if (!paginationEl) return;

        paginationEl.innerHTML = '';

        for (let i = 0; i < total(); i++) {

          const b = document.createElement('span');

          b.className = 'swiper-pagination-bullet';

          b.dataset.index = i;

          if (i === swiper.activeIndex) b.classList.add('swiper-pagination-bullet-active');

          paginationEl.appendChild(b);

        }

      }

  

      // Обновление активного состояния буллетов

      function updateBullets() {

        if (!paginationEl) return;

        paginationEl.querySelectorAll('.swiper-pagination-bullet').forEach((b, i) => {

          b.classList.toggle('swiper-pagination-bullet-active', i === swiper.activeIndex);

        });

      }

  

      swiper.on('slideChange', () => {

        animate(prevIndex, swiper.activeIndex);

        prevIndex = swiper.activeIndex;

        updateBullets();

      });

  

      function goTo(index) {

        if (blocked) return;

        const to = ((index % total()) + total()) % total();

        if (to === swiper.activeIndex) return;

        blocked = true;

        setTimeout(() => { blocked = false; }, DURATION);

        swiper.slideTo(to, 0);

      }

  

      function go(isRight) {

        goTo(swiper.activeIndex + (isRight ? 1 : -1));

      }

  

      // Кастомная анимация кадрирования и масштабирования картинок

      function animate(from, to) {

        if (from === to) return;

        const isRight = to > from || (from === total() - 1 && to === 0);

        const cur = swiper.slides[from];

        const next = swiper.slides[to];

        if (!cur || !next) return;

  

        cur.classList.remove('s--active', 's--active-prev');

  

        const nextImg = next.querySelector('img');

        if (nextImg) {

          nextImg.style.transition = 'none';

          nextImg.style.transform = 'scale(1.3)';

          nextImg.getBoundingClientRect();

        }

  

        next.classList.add('s--active');

        if (!isRight) next.classList.add('s--active-prev');

  

        requestAnimationFrame(() => requestAnimationFrame(() => {

          if (nextImg) {

            nextImg.style.transition = 'transform 0.5s ease';

            nextImg.style.transform = 'scale(1)';

          }

        }));

  

        const curImg = cur.querySelector('img');

        if (curImg) {

          curImg.style.transition = 'transform 0.2s ease';

          curImg.style.transform = 'scale(1)';

        }

  

        container.querySelector('.swiper-slide.s--prev')?.classList.remove('s--prev');

        let prev = to - 1;

        if (prev < 0) prev = total() - 1;

        swiper.slides[prev].classList.add('s--prev');

      }

  

      // Логика кастомного свайпа через Pointer Events

      let startX = null;

      const THRESHOLD = 50;

  

      container.addEventListener('pointerdown', e => {

        if (e.pointerType === 'mouse' && e.button !== 0) return;

        startX = e.clientX;

        container.setPointerCapture?.(e.pointerId);

      }, { passive: true });

  

      container.addEventListener('pointerup', e => {

        if (startX !== null) {

          const dx = e.clientX - startX;

          if (Math.abs(dx) >= THRESHOLD) go(dx < 0);

        }

        startX = null;

      });

  

      // Навешивание событий на локальные стандартные кнопки

      btnNext?.addEventListener('click', () => go(true));

      btnPrev?.addEventListener('click', () => go(false));

  

      if (paginationEl) {

        paginationEl.addEventListener('click', e => {

          const bullet = e.target.closest('[data-index]');

          if (!bullet) return;

          const to = Number(bullet.dataset.index);

          if (!Number.isNaN(to)) goTo(to);

        });

      }

  

      swiper.slides[0]?.classList.add('s--active');

      swiper.slides[total() - 1]?.classList.add('s--prev');

  

      swiper.init();

      renderBullets();

    });

  }

  

  window.initClipSliders = function () {

    // Массив селекторов всех независимых слайдеров на странице

    const clipSliders = ['.showcase__slider'];

  

    // Инициализация конфигурации

    clipSliders.forEach(selector => initClipSlider(selector));

  };

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

  // Запускаем скрипты для первой (стартовой) страницы
  window.initPageContent();

  barba.init({

    transitions: [{

      name: 'overlay-transition',

      

      // Анимация ухода со страницы (закрытие шторки)

      leave(data) {

        const done = this.async();

        

        // Блокируем скролл Lenis в момент начала перехода

        if (window.lenis && typeof window.lenis.stop === 'function') {

          window.lenis.stop();

        }

  

        const tl = gsap.timeline({ onComplete: done });

  

        tl.to('.page-transition-overlay', {

          scaleY: 1,

          duration: 0.5,

          ease: 'power4.inOut',

          transformOrigin: 'bottom center'

        });

  

        tl.to(data.current.container, {

          opacity: 0,

          duration: 0.3

        }, '-=0.3');

      },

  

      // Анимация появления новой страницы (открытие шторки)

      enter(data) {

        const tl = gsap.timeline();

  

        window.scrollTo(0, 0);

  

        tl.to('.page-transition-overlay', {

          scaleY: 0,

          duration: 0.5,

          ease: 'power4.inOut',

          transformOrigin: 'top center'

        });

  

        tl.from(data.next.container, {

          opacity: 0,

          y: 20,

          duration: 0.4,

          ease: 'power2.out'

        }, '-=0.3');

      },

  

      // Полное завершение перехода

      after(data) {

        // 1. Уничтожаем старые слайдеры Swiper

        document.querySelectorAll('.swiper').forEach(el => {

          if (el.swiper && typeof el.swiper.destroy === 'function') {

            el.swiper.destroy(true, true);

          }

        });

  

        // 2. Корректно убиваем старые ScrollTrigger

        if (typeof ScrollTrigger !== 'undefined') {

          ScrollTrigger.getAll().forEach(trigger => trigger.kill());

          gsap.registerPlugin(ScrollTrigger, SplitText);

        }

  

        // 3. Адаптируем размеры Lenis-скролла и включаем его обратно

        if (window.lenis) {

          window.lenis.resize();

          window.lenis.scrollTo(0, { immediate: true });

          // Разблокируем скролл, так как страница полностью готова

          window.lenis.start();

        }

  

        // 4. Запускаем глобальную реинициализацию для новой страницы

        if (typeof window.initPageContent === 'function') {

          window.initPageContent();

        }

  

        // 5. Обновляем геометрию триггеров

        requestAnimationFrame(() => {

          if (typeof ScrollTrigger !== 'undefined') {

            ScrollTrigger.refresh(true);

          }

        });

      }

    }]

  });

  window.addEventListener('resize', function () { ScrollTrigger.update() });

});
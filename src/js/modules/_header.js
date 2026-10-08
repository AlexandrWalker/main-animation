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
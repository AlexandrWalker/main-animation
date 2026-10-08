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
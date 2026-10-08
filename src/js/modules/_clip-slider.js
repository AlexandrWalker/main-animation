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
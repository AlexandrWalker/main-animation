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
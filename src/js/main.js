document.addEventListener('DOMContentLoaded', () => {

  const checkEditMode = document.querySelector('.bx-panel-toggle-on') ?? null;

  /**
   * Подключение ScrollTrigger
   * Подключение SplitText
   */
  gsap.registerPlugin(ScrollTrigger, SplitText);

  /**
   * Инициализация Lenis
   */
  const lenis = new Lenis({
    anchors: {
      offset: -60,
    },
  });

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  /**
   * Инициализация слайдера
   */
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

});

// (function () {

//   function attachMomentum(swiper, options = {}) {
//     if (!swiper.params.navigation) return;

//     const {
//       minSpeed = 180,
//       maxSpeed = 500,
//       acceleration = 0.45,
//       decay = 0.85,
//       resetDelay = 400
//     } = options;

//     let lastClickTime = 0;
//     let velocity = 0;

//     function calculateSpeed() {
//       const now = Date.now();
//       const delta = now - lastClickTime;

//       if (delta > resetDelay) {
//         velocity = 0;
//       } else {
//         velocity += (resetDelay - delta) * acceleration;
//       }

//       lastClickTime = now;
//       velocity *= decay;

//       const dynamicSpeed = Math.max(
//         minSpeed,
//         Math.min(maxSpeed, maxSpeed - velocity)
//       );

//       return dynamicSpeed;
//     }

//     swiper.on('navigationNext', () => {
//       swiper.params.speed = calculateSpeed();
//     });

//     swiper.on('navigationPrev', () => {
//       swiper.params.speed = calculateSpeed();
//     });
//   }

//   function initMomentumForAllSwipers(options = {}) {
//     document.querySelectorAll('.swiper').forEach(el => {
//       if (el.swiper && !el.swiper.__momentumAttached) {
//         attachMomentum(el.swiper, options);
//         el.swiper.__momentumAttached = true; // защита от повторного подключения
//       }
//     });
//   }

//   /* Запуск после полной загрузки страницы */
//   window.addEventListener('load', () => {
//     initMomentumForAllSwipers({
//       acceleration: 0.5,
//       minSpeed: 80,
//       maxSpeed: 450
//     });
//   });

// })();
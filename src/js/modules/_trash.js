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
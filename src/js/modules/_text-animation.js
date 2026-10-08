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
gsap.registerPlugin(ScrollTrigger, SplitText);

document.addEventListener('DOMContentLoaded', () => {
  //=include modules/_trash.js

  window.addEventListener('resize', function () { ScrollTrigger.update() });

});
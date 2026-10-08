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
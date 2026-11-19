function createSoftSnapScroller(container, itemSelector, isEnabled) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let settleTimer = 0;
  let settleFrame = 0;
  let direction = 0;
  let lastScrollLeft = container.scrollLeft;
  let activePointer = null;
  let activeTouch = false;

  function stop() {
    clearTimeout(settleTimer);
    cancelAnimationFrame(settleFrame);
    settleFrame = 0;
  }

  function settle() {
    if (!isEnabled() || activePointer !== null || activeTouch || !direction) return;
    const current = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;
    if (maxScroll <= 1) return;
    const containerLeft = container.getBoundingClientRect().left;
    const positions = [...new Set([0, ...[...container.querySelectorAll(itemSelector)]
      .map(item => Math.min(item.getBoundingClientRect().left - containerLeft + current, maxScroll))])]
      .sort((a, b) => a - b);
    if (positions.some(position => Math.abs(position - current) <= 1)) return;
    const upperIndex = positions.findIndex(position => position > current);
    if (upperIndex < 1) return;
    const lower = positions[upperIndex - 1];
    const upper = positions[upperIndex];
    const threshold = Math.min(48, (upper - lower) * .2);
    const target = direction > 0
      ? (current - lower >= threshold ? upper : lower)
      : (upper - current >= threshold ? lower : upper);
    const distance = target - current;
    if (Math.abs(distance) <= 1) return;
    if (reducedMotion.matches) {
      container.scrollLeft = target;
      return;
    }
    const duration = Math.min(520, Math.max(280, Math.abs(distance) * 1.7));
    const started = performance.now();
    const animate = now => {
      const progress = Math.min(1, (now - started) / duration);
      const eased = progress * progress * (3 - 2 * progress);
      container.scrollLeft = current + distance * eased;
      if (progress < 1) settleFrame = requestAnimationFrame(animate);
      else settleFrame = 0;
    };
    settleFrame = requestAnimationFrame(animate);
  }

  function schedule() {
    clearTimeout(settleTimer);
    settleTimer = window.setTimeout(settle, 140);
  }

  container.addEventListener('scroll', () => {
    const position = container.scrollLeft;
    if (!settleFrame && Math.abs(position - lastScrollLeft) > .5) direction = Math.sign(position - lastScrollLeft);
    lastScrollLeft = position;
    if (!settleFrame) schedule();
  }, { passive: true });
  container.addEventListener('wheel', event => {
    if (!isEnabled()) return;
    if (!event.shiftKey && Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
    const movement = event.shiftKey ? event.deltaY : event.deltaX;
    if (!movement) return;
    stop();
    if ((movement < 0 && container.scrollLeft <= 0) ||
        (movement > 0 && container.scrollLeft >= container.scrollWidth - container.clientWidth - 1)) return;
    event.preventDefault();
    direction = Math.sign(movement);
    container.scrollLeft += movement;
    schedule();
  }, { passive: false });
  container.addEventListener('pointerdown', event => {
    if (!isEnabled()) return;
    stop();
    activePointer = event.pointerId;
    direction = 0;
    lastScrollLeft = container.scrollLeft;
  });
  container.addEventListener('touchstart', () => {
    if (!isEnabled()) return;
    stop();
    activeTouch = true;
  }, { passive: true });
  const releaseTouch = () => {
    activeTouch = false;
    schedule();
  };
  container.addEventListener('touchend', releaseTouch, { passive: true });
  container.addEventListener('touchcancel', releaseTouch, { passive: true });
  const releasePointer = event => {
    if (event.pointerId !== activePointer) return;
    activePointer = null;
    schedule();
  };
  window.addEventListener('pointerup', releasePointer);
  window.addEventListener('pointercancel', releasePointer);
  window.addEventListener('resize', () => {
    if (!isEnabled()) { stop(); direction = 0; }
  });
  return { stop };
}

const inpatientSwipeMedia = window.matchMedia('(max-width: 768px)');

function enableInpatientSwipe(container, itemSelector, label) {
  const snap = createSoftSnapScroller(container, itemSelector, () => inpatientSwipeMedia.matches);
  container.setAttribute('aria-label', label);
  if (container.tagName !== 'UL') container.setAttribute('role', 'region');

  const updateKeyboardAccess = () => {
    if (inpatientSwipeMedia.matches) container.tabIndex = 0;
    else container.removeAttribute('tabindex');
  };
  updateKeyboardAccess();
  inpatientSwipeMedia.addEventListener('change', updateKeyboardAccess);

  let startX = 0;
  let startScroll = 0;
  let pointerId = null;

  container.addEventListener('pointerdown', event => {
    if (!inpatientSwipeMedia.matches || event.pointerType !== 'mouse' || event.button !== 0) return;
    startX = event.clientX;
    startScroll = container.scrollLeft;
    pointerId = event.pointerId;
    container.setPointerCapture(pointerId);
  });
  container.addEventListener('pointermove', event => {
    if (event.pointerId !== pointerId) return;
    const distance = event.clientX - startX;
    if (Math.abs(distance) <= 5 && !container.classList.contains('is-dragging')) return;
    container.classList.add('is-dragging');
    container.scrollLeft = startScroll - distance;
  });
  const stopDrag = event => {
    if (event.pointerId !== pointerId) return;
    pointerId = null;
    container.classList.remove('is-dragging');
  };
  container.addEventListener('pointerup', stopDrag);
  container.addEventListener('pointercancel', stopDrag);
  container.addEventListener('lostpointercapture', stopDrag);
  container.addEventListener('dragstart', event => event.preventDefault());
  container.addEventListener('keydown', event => {
    if (!inpatientSwipeMedia.matches || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return;
    event.preventDefault();
    snap.stop();
    container.scrollBy({ left: (event.key === 'ArrowRight' ? 1 : -1) * 280, behavior: 'smooth' });
  });
}

enableInpatientSwipe(document.querySelector('.inpatient-benefits'), 'article', 'Преимущества стационара — горизонтальная прокрутка');
enableInpatientSwipe(document.querySelector('.inpatient-reason-grid'), 'li', 'Когда необходим стационар — горизонтальная прокрутка');
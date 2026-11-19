const inpatientCostInfo = document.querySelector('.inpatient-cost-info');
const inpatientDrugsDialog = document.querySelector('#inpatient-drugs-dialog');

if (inpatientCostInfo && inpatientDrugsDialog) {
  const closeButton = inpatientDrugsDialog.querySelector('.inpatient-drugs-close');
  const handle = inpatientDrugsDialog.querySelector('.inpatient-drugs-handle');
  const mobile = matchMedia('(max-width: 600px)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let closeTimer = 0;
  let dragStartY = null;
  let handleDragged = false;

  function finishClose() {
    clearTimeout(closeTimer);
    closeTimer = 0;
    if (inpatientDrugsDialog.open) inpatientDrugsDialog.close();
  }

  function closeDialog() {
    if (!inpatientDrugsDialog.open || closeTimer) return;
    inpatientDrugsDialog.classList.remove('is-open');
    inpatientDrugsDialog.style.removeProperty('transform');
    if (mobile.matches && !reducedMotion.matches) {
      closeTimer = setTimeout(finishClose, 320);
    } else finishClose();
  }

  inpatientCostInfo.addEventListener('click', () => {
    if (inpatientDrugsDialog.open) return;
    inpatientDrugsDialog.showModal();
    document.documentElement.classList.add('inpatient-drugs-open');
    if (mobile.matches) {
      void inpatientDrugsDialog.offsetWidth;
      requestAnimationFrame(() => inpatientDrugsDialog.classList.add('is-open'));
    }
    (mobile.matches ? handle : closeButton).focus({ preventScroll: true });
  });

  closeButton.addEventListener('click', closeDialog);
  handle.addEventListener('click', () => {
    if (!handleDragged) closeDialog();
  });
  handle.addEventListener('pointerdown', event => {
    dragStartY = event.clientY;
    handleDragged = false;
    handle.setPointerCapture(event.pointerId);
  });
  handle.addEventListener('pointermove', event => {
    if (dragStartY === null) return;
    const distance = Math.max(0, event.clientY - dragStartY);
    if (distance <= 8) return;
    handleDragged = true;
    inpatientDrugsDialog.style.transform = `translateY(${distance}px)`;
  });
  handle.addEventListener('pointerup', event => {
    if (dragStartY === null) return;
    const distance = Math.max(0, event.clientY - dragStartY);
    dragStartY = null;
    inpatientDrugsDialog.style.removeProperty('transform');
    if (distance > 72) closeDialog();
    setTimeout(() => { handleDragged = false; }, 0);
  });
  handle.addEventListener('pointercancel', () => {
    dragStartY = null;
    inpatientDrugsDialog.style.removeProperty('transform');
  });
  inpatientDrugsDialog.addEventListener('cancel', event => {
    event.preventDefault();
    closeDialog();
  });
  inpatientDrugsDialog.addEventListener('click', event => {
    if (event.target === inpatientDrugsDialog) closeDialog();
  });
  inpatientDrugsDialog.addEventListener('close', () => {
    clearTimeout(closeTimer);
    closeTimer = 0;
    inpatientDrugsDialog.classList.remove('is-open');
    inpatientDrugsDialog.style.removeProperty('transform');
    document.documentElement.classList.remove('inpatient-drugs-open');
    inpatientCostInfo.focus({ preventScroll: true });
  });
}

const saleDialog = document.createElement('dialog');
saleDialog.className = 'sale-dialog';
saleDialog.setAttribute('aria-labelledby', 'sale-dialog-title');
saleDialog.innerHTML = `
  <button class="sale-dialog-handle" type="button" aria-label="Закрыть условия акции"><span></span></button>
  <button class="sale-dialog-close" type="button" aria-label="Закрыть условия акции"><img src="assets/sale-modal-close.svg" alt=""></button>
  <div class="sale-dialog-scroll">
    <div class="sale-dialog-media"><img src="assets/sale-modal-art.png" alt=""></div>
    <div class="sale-dialog-body">
      <div class="sale-dialog-intro"><h2 id="sale-dialog-title">Чекап для кошек и собак от 0 до 6 лет</h2><p>Программа позволяет оценить состояние организма в период роста и развития и своевременно выявить возможные отклонения.</p></div>
      <div class="sale-dialog-details"><h3>В обследование входит</h3><ul>
        <li>Прием пациентов с заболеваниями желудочно-кишечного тракта;</li>
        <li>Осмотр, выбор диагностического плана и терапевтического плана;</li>
        <li>Предоставление владельцам информации о состоянии животного, текущего лечения и прогнозах в письменной и устной форме;</li>
      </ul></div>
      <div class="sale-dialog-price"><strong>12 000 ₽</strong><small>Цена указана с учетом скидки</small></div>
    </div>
  </div>`;
document.body.append(saleDialog);

let saleDialogTrigger = null;
const saleSheetMedia = window.matchMedia('(max-width:600px)');
const saleReducedMotion = window.matchMedia('(prefers-reduced-motion:reduce)');
let saleCloseTimer = 0;

function finishSaleDialogClose() {
  clearTimeout(saleCloseTimer);
  saleCloseTimer = 0;
  if (saleDialog.open) saleDialog.close();
}

function closeSaleDialog() {
  if (!saleDialog.open || saleCloseTimer) return;
  saleDialog.classList.remove('is-open');
  saleDialog.style.removeProperty('transform');
  if (saleSheetMedia.matches && !saleReducedMotion.matches) {
    saleCloseTimer = window.setTimeout(finishSaleDialogClose, 340);
  } else finishSaleDialogClose();
}

document.addEventListener('click', event => {
  const trigger = event.target.closest('button.sale-tag');
  if (!trigger) return;
  saleDialogTrigger = trigger;
  saleDialog.showModal();
  if (saleSheetMedia.matches) {
    void saleDialog.offsetWidth;
    requestAnimationFrame(() => {
      if (saleDialog.open && !saleCloseTimer) saleDialog.classList.add('is-open');
    });
  }
  saleDialog.querySelector(saleSheetMedia.matches ? '.sale-dialog-handle' : '.sale-dialog-close').focus({ preventScroll: true });
});
saleDialog.querySelector('.sale-dialog-close').addEventListener('click', closeSaleDialog);
saleDialog.addEventListener('cancel', event => {
  event.preventDefault();
  closeSaleDialog();
});
const saleHandle = saleDialog.querySelector('.sale-dialog-handle');
let handleStartY = null;
let handleMoved = false;
saleHandle.addEventListener('pointerdown', event => {
  handleStartY = event.clientY;
  handleMoved = false;
  saleHandle.setPointerCapture(event.pointerId);
});
saleHandle.addEventListener('pointermove', event => {
  if (handleStartY === null) return;
  const distance = Math.max(0, event.clientY - handleStartY);
  if (distance > 8) handleMoved = true;
  saleDialog.style.transform = `translateY(${distance}px)`;
});
saleHandle.addEventListener('pointerup', event => {
  if (handleStartY === null) return;
  const distance = Math.max(0, event.clientY - handleStartY);
  handleStartY = null;
  saleDialog.style.removeProperty('transform');
  if (distance > 72) closeSaleDialog();
});
saleHandle.addEventListener('pointercancel', () => {
  handleStartY = null;
  saleDialog.style.removeProperty('transform');
});
saleHandle.addEventListener('click', event => {
  if (handleMoved) { event.preventDefault(); handleMoved = false; return; }
  closeSaleDialog();
});
saleDialog.addEventListener('click', event => {
  if (event.target === saleDialog) closeSaleDialog();
});
saleDialog.addEventListener('close', () => {
  clearTimeout(saleCloseTimer);
  saleCloseTimer = 0;
  saleDialog.classList.remove('is-open');
  saleDialog.style.removeProperty('transform');
  if (saleDialogTrigger?.isConnected) saleDialogTrigger.focus({ preventScroll: true });
  saleDialogTrigger = null;
});

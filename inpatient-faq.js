const faqs = [
  ['Как понять, что питомцу нужен стационар?', 'Решение о госпитализации принимает врач после осмотра. Стационар может потребоваться, если животному нужен постоянный контроль, лечение после операции, интенсивная терапия или наблюдение при тяжёлом состоянии.'],
  ['Как определяется категория стационара?', 'Категория зависит от состояния пациента, необходимого объёма лечения, мониторинга и степени медицинской поддержки.'],
  ['Можно ли оставить питомца после операции?', 'Да. После плановых операций питомец может оставаться под наблюдением врачей до утра следующего дня для контроля состояния, восстановления после наркоза и обезболивания.'],
  ['Что входит в стоимость госпитализации?', 'В стоимость включены большинство медикаментов, расходные материалы, кормление по назначению, мониторинг, лечение в стационаре, реанимационные мероприятия и кратковременная седация при необходимости.'],
  ['Как владельцы узнают о состоянии питомца?', 'Специалисты регулярно информируют владельцев о состоянии животного, ходе лечения и динамике восстановления.']
];
const faqList = document.querySelector('#faq-list');
const mobileFaq = window.matchMedia('(max-width: 600px)');
const faqSheetMedia = window.matchMedia('(max-width: 480px)');
faqList.setAttribute('role', 'region');
faqList.setAttribute('aria-label', 'Частые вопросы');
const syncFaqKeyboardAccess = () => {
  if (mobileFaq.matches) faqList.tabIndex = 0;
  else faqList.removeAttribute('tabindex');
};
syncFaqKeyboardAccess();
mobileFaq.addEventListener('change', syncFaqKeyboardAccess);

faqList.innerHTML = faqs.map(([question, answer], index) => `
  <details class="faq-item" data-faq-index="${index}"><summary><span>${question}</span><span class="faq-symbol"><img src="assets/faq-plus.svg" alt=""></span></summary><div class="faq-answer"><p>${answer}</p></div></details>
`).join('');

const faqSheet = document.createElement('dialog');
faqSheet.id = 'faq-sheet';
faqSheet.className = 'faq-sheet';
faqSheet.setAttribute('aria-labelledby', 'faq-sheet-title');
faqSheet.setAttribute('aria-describedby', 'faq-sheet-answer');
faqSheet.innerHTML = `
  <button class="faq-sheet-handle" type="button" aria-label="Закрыть ответ на вопрос"><span></span></button>
  <div class="faq-sheet-content">
    <h2 id="faq-sheet-title"></h2>
    <p id="faq-sheet-answer"></p>
  </div>
  <div class="faq-sheet-help">
    <button class="button button-outline" type="button" data-chat-open>Связаться с нами</button>
  </div>`;
document.body.append(faqSheet);

const faqSheetHandle = faqSheet.querySelector('.faq-sheet-handle');
const faqSheetTitle = faqSheet.querySelector('#faq-sheet-title');
const faqSheetAnswer = faqSheet.querySelector('#faq-sheet-answer');
faqSheet.querySelector('.faq-sheet-help button').addEventListener('click', () => closeFaqSheet(true));
const faqSheetReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let faqSheetTrigger = null;
let faqSheetCloseTimer = 0;
let faqSheetDragStartY = null;
let faqSheetDragDistance = 0;
let faqSheetIgnoreHandleClick = false;

function finishFaqSheetClose() {
  clearTimeout(faqSheetCloseTimer);
  faqSheetCloseTimer = 0;
  if (faqSheet.open) faqSheet.close();
  faqSheet.style.removeProperty('transform');
  document.documentElement.classList.remove('faq-sheet-open');
  document.body.classList.remove('faq-sheet-open');
  document.body.style.removeProperty('--faq-scrollbar-gap');
  if (faqSheetTrigger?.isConnected) faqSheetTrigger.focus({ preventScroll: true });
  faqSheetTrigger = null;
}

function closeFaqSheet(immediate = false) {
  if (!faqSheet.open) return;
  if (faqSheetCloseTimer) {
    if (immediate) finishFaqSheetClose();
    return;
  }
  faqSheet.classList.remove('is-open');
  faqSheet.style.removeProperty('transform');
  if (immediate || faqSheetReducedMotion.matches) finishFaqSheetClose();
  else faqSheetCloseTimer = window.setTimeout(finishFaqSheetClose, 320);
}

function openFaqSheet(item, trigger) {
  if (!faqSheetMedia.matches) return;
  const [question, answer] = faqs[Number(item.dataset.faqIndex)];
  faqSheetTitle.textContent = question.replace(/<br\s*\/?>/gi, ' ');
  faqSheetAnswer.textContent = answer;
  faqSheetTrigger = trigger;
  if (!faqSheet.open) {
    const scrollbarGap = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
    document.body.style.setProperty('--faq-scrollbar-gap', `${scrollbarGap}px`);
    document.documentElement.classList.add('faq-sheet-open');
    document.body.classList.add('faq-sheet-open');
    faqSheet.showModal();
    void faqSheet.offsetWidth;
    requestAnimationFrame(() => {
      if (faqSheet.open && faqSheetMedia.matches) faqSheet.classList.add('is-open');
    });
  }
  faqSheetHandle.focus({ preventScroll: true });
}

faqSheet.addEventListener('cancel', event => {
  event.preventDefault();
  closeFaqSheet();
});
faqSheet.addEventListener('click', event => {
  if (event.target === faqSheet) closeFaqSheet();
});
faqSheetHandle.addEventListener('click', () => {
  if (faqSheetIgnoreHandleClick) return;
  closeFaqSheet();
});
faqSheetHandle.addEventListener('pointerdown', event => {
  faqSheetDragStartY = event.clientY;
  faqSheetDragDistance = 0;
  faqSheetIgnoreHandleClick = false;
  faqSheetHandle.setPointerCapture(event.pointerId);
});
faqSheetHandle.addEventListener('pointermove', event => {
  if (faqSheetDragStartY === null) return;
  faqSheetDragDistance = Math.max(0, event.clientY - faqSheetDragStartY);
  if (faqSheetDragDistance <= 8) return;
  faqSheetIgnoreHandleClick = true;
  faqSheet.style.transform = `translateY(${faqSheetDragDistance}px)`;
});
faqSheetHandle.addEventListener('pointerup', () => {
  if (faqSheetDragStartY === null) return;
  faqSheetDragStartY = null;
  if (faqSheetDragDistance > 72) closeFaqSheet();
  else faqSheet.style.removeProperty('transform');
  window.setTimeout(() => { faqSheetIgnoreHandleClick = false; }, 0);
});
faqSheetHandle.addEventListener('pointercancel', () => {
  faqSheetDragStartY = null;
  faqSheet.style.removeProperty('transform');
});
faqSheetMedia.addEventListener('change', () => {
  if (!faqSheetMedia.matches) closeFaqSheet(true);
});

// Keep closed mobile cards equal in height without letting an open answer stretch its neighbours.
const sizeClosedFaqCards = () => {
  if (!mobileFaq.matches) {
    faqList.style.removeProperty('--faq-closed-height');
    return;
  }

  let tallest = 0;
  faqList.querySelectorAll('.faq-item').forEach(item => {
    const measure = document.createElement('details');
    measure.className = 'faq-item';
    measure.append(item.querySelector('summary').cloneNode(true));
    measure.style.cssText = `position:absolute;top:0;left:0;visibility:hidden;pointer-events:none;width:${item.getBoundingClientRect().width}px;height:auto!important`;
    faqList.append(measure);
    tallest = Math.max(tallest, measure.getBoundingClientRect().height);
    measure.remove();
  });
  faqList.style.setProperty('--faq-closed-height', `${Math.ceil(tallest)}px`);
};
let faqSizeFrame;
const scheduleClosedFaqSize = () => {
  cancelAnimationFrame(faqSizeFrame);
  faqSizeFrame = requestAnimationFrame(sizeClosedFaqCards);
};
scheduleClosedFaqSize();
window.addEventListener('resize', scheduleClosedFaqSize);
mobileFaq.addEventListener('change', scheduleClosedFaqSize);
document.fonts?.ready.then(scheduleClosedFaqSize);

document.querySelectorAll('.faq-item').forEach(item => {
  const summary = item.querySelector('summary');
  const answer = item.querySelector('.faq-answer');
  const icon = item.querySelector('.faq-symbol img');
  let expanded = item.open;
  let animation;
  icon.src = expanded ? 'assets/faq-minus.svg' : 'assets/faq-plus.svg';
  summary.setAttribute('aria-expanded', String(expanded));
  const syncFaqSheetTrigger = () => {
    if (faqSheetMedia.matches) {
      summary.setAttribute('aria-haspopup', 'dialog');
      summary.setAttribute('aria-controls', 'faq-sheet');
      animation?.cancel();
      item.open = false;
      expanded = false;
      icon.src = 'assets/faq-plus.svg';
      summary.setAttribute('aria-expanded', 'false');
      answer.style.removeProperty('height');
      answer.style.removeProperty('overflow');
      animation = null;
    } else {
      summary.removeAttribute('aria-haspopup');
      summary.removeAttribute('aria-controls');
    }
  };
  syncFaqSheetTrigger();
  faqSheetMedia.addEventListener('change', syncFaqSheetTrigger);
  summary.addEventListener('click', event => {
    event.preventDefault();
    if (faqSheetMedia.matches) {
      openFaqSheet(item, summary);
      return;
    }
    const opening = !expanded;
    const start = item.open ? answer.getBoundingClientRect().height : 0;
    animation?.cancel();
    if (opening) item.open = true;
    expanded = opening;
    summary.setAttribute('aria-expanded', String(expanded));
    icon.src = expanded ? 'assets/faq-minus.svg' : 'assets/faq-plus.svg';
    const end = opening ? answer.scrollHeight : 0;
    answer.style.height = `${start}px`;
    answer.style.overflow = 'hidden';
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 360;
    animation = answer.animate([
      { height: `${start}px`, opacity: opening ? 0 : 1 },
      { height: `${end}px`, opacity: opening ? 1 : 0 }
    ], { duration, easing: 'cubic-bezier(.22, 1, .36, 1)' });
    animation.onfinish = () => {
      if (!expanded) item.open = false;
      answer.style.removeProperty('height');
      answer.style.removeProperty('overflow');
      animation = null;
    };
  });
  item.addEventListener('click', event => {
    if (!faqSheetMedia.matches || event.target.closest('summary')) return;
    openFaqSheet(item, summary);
  });
});

let faqDragStartX = 0;
let faqDragStartScroll = 0;
let faqPointerId = null;
let faqSuppressClick = false;
const faqSnap = createSoftSnapScroller(faqList, '.faq-item', () => mobileFaq.matches);
faqList.addEventListener('pointerdown', event => {
  if (!mobileFaq.matches || event.pointerType !== 'mouse' || event.button !== 0) return;
  faqPointerId = event.pointerId;
  faqDragStartX = event.clientX;
  faqDragStartScroll = faqList.scrollLeft;
  faqSuppressClick = false;
});
faqList.addEventListener('pointermove', event => {
  if (event.pointerId !== faqPointerId) return;
  const distance = event.clientX - faqDragStartX;
  if (Math.abs(distance) <= 5 && !faqSuppressClick) return;
  if (!faqSuppressClick) {
    faqSuppressClick = true;
    faqList.classList.add('is-dragging');
    faqList.setPointerCapture(event.pointerId);
  }
  faqList.scrollLeft = faqDragStartScroll - distance;
});
const stopFaqDrag = event => {
  if (event.pointerId !== faqPointerId) return;
  faqPointerId = null;
  faqList.classList.remove('is-dragging');
  window.setTimeout(() => { faqSuppressClick = false; }, 0);
};
window.addEventListener('pointerup', stopFaqDrag);
window.addEventListener('pointercancel', stopFaqDrag);
faqList.addEventListener('lostpointercapture', stopFaqDrag);
faqList.addEventListener('dragstart', event => event.preventDefault());
faqList.addEventListener('click', event => {
  if (!faqSuppressClick) return;
  event.preventDefault();
  event.stopPropagation();
  faqSuppressClick = false;
}, true);
faqList.addEventListener('keydown', event => {
  if (!mobileFaq.matches || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return;
  event.preventDefault();
  faqSnap.stop();
  faqList.scrollBy({ left: (event.key === 'ArrowRight' ? 1 : -1) * (faqList.clientWidth - 56), behavior: 'smooth' });
});

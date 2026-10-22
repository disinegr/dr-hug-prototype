const doctorGrid = document.querySelector('#doctor-grid');
doctorGrid.innerHTML = Array.from({ length: 6 }, () => `
  <article class="doctor-card"><div class="doctor-photo"><a class="doctor-profile-link" href="doctor.html" aria-label="Подробнее о враче Кулешове Алексее"></a><img src="assets/doctor.png" alt="Кулешов Алексей"></div><div class="doctor-details"><div class="doctor-person"><h3><a href="doctor.html">Кулешов Алексей</a></h3><p>Вед. гастроэнтеролог,<br>научный руководитель</p></div><div class="doctor-booking"><strong>Прием 2 200 ₽</strong><a class="button button-outline" href="tel:+74994600294">Записаться</a></div></div></article>
`).join('');

const reviewTrack = document.querySelector('#review-track');
reviewTrack.innerHTML = Array.from({ length: 7 }, () => `
  <article class="review-card"><div class="review-stars" aria-label="Оценка: 4 из 5"><img src="assets/star.svg" alt=""><img src="assets/star.svg" alt=""><img src="assets/star.svg" alt=""><img src="assets/star.svg" alt=""><img src="assets/star-empty.svg" alt=""></div><p>Большое спасибо всем сотрудникам ветклиники! Мы очень рады, что нам порекомендовали именно вас! Такое вежливое обращение с животными, такое уважение к ним вызывает уважение к самим специалистам — профессионалам своего дела.</p><div class="review-bottom"><span>Диана <span class="stars"><img src="assets/star.svg" alt=""><img src="assets/star.svg" alt=""><img src="assets/star.svg" alt=""><img src="assets/star.svg" alt=""><img src="assets/star-empty.svg" alt=""></span></span><a href="#reviews">см. отзыв</a></div></article>
`).join('');

const reviewViewport = reviewTrack.parentElement;
reviewViewport.tabIndex = 0;
reviewViewport.setAttribute('role', 'region');
reviewViewport.setAttribute('aria-label', 'Отзывы — прокрутка по горизонтали');
let reviewDragStartX = 0;
let reviewDragStartScroll = 0;
let reviewDragging = false;
let suppressReviewClick = false;

reviewViewport.addEventListener('wheel', event => {
  const movement = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
  const next = reviewViewport.scrollLeft + movement;
  if ((movement < 0 && reviewViewport.scrollLeft <= 0) ||
      (movement > 0 && reviewViewport.scrollLeft >= reviewViewport.scrollWidth - reviewViewport.clientWidth - 1)) return;
  event.preventDefault();
  reviewViewport.scrollLeft = next;
}, { passive: false });

reviewViewport.addEventListener('pointerdown', event => {
  if (event.pointerType !== 'mouse' || event.button !== 0) return;
  reviewDragStartX = event.clientX;
  reviewDragStartScroll = reviewViewport.scrollLeft;
  reviewDragging = true;
  suppressReviewClick = false;
});
reviewViewport.addEventListener('pointermove', event => {
  if (!reviewDragging) return;
  const distance = event.clientX - reviewDragStartX;
  if (Math.abs(distance) <= 5 && !suppressReviewClick) return;
  if (!suppressReviewClick) {
    suppressReviewClick = true;
    reviewViewport.classList.add('is-dragging');
    reviewViewport.setPointerCapture(event.pointerId);
  }
  reviewViewport.scrollLeft = reviewDragStartScroll - distance;
});
function stopReviewDrag() {
  reviewDragging = false;
  reviewViewport.classList.remove('is-dragging');
}
reviewViewport.addEventListener('pointerup', stopReviewDrag);
reviewViewport.addEventListener('pointercancel', stopReviewDrag);
reviewViewport.addEventListener('lostpointercapture', stopReviewDrag);
reviewViewport.addEventListener('click', event => {
  if (!suppressReviewClick) return;
  event.preventDefault();
  event.stopPropagation();
  suppressReviewClick = false;
}, true);
reviewViewport.addEventListener('keydown', event => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.preventDefault();
  reviewViewport.scrollBy({ left: (event.key === 'ArrowRight' ? 1 : -1) * 180, behavior: 'smooth' });
});

const mobileDoctors = window.matchMedia('(max-width: 600px)');
doctorGrid.setAttribute('role', 'region');
doctorGrid.setAttribute('aria-label', 'Врачи — прокрутка по горизонтали');
function syncDoctorKeyboardAccess() {
  if (mobileDoctors.matches) doctorGrid.tabIndex = 0;
  else doctorGrid.removeAttribute('tabindex');
}
syncDoctorKeyboardAccess();
mobileDoctors.addEventListener('change', syncDoctorKeyboardAccess);

let doctorDragStartX = 0;
let doctorDragStartScroll = 0;
let doctorDragging = false;
let suppressDoctorClick = false;
doctorGrid.addEventListener('wheel', event => {
  if (!mobileDoctors.matches) return;
  const movement = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
  if ((movement < 0 && doctorGrid.scrollLeft <= 0) ||
      (movement > 0 && doctorGrid.scrollLeft >= doctorGrid.scrollWidth - doctorGrid.clientWidth - 1)) return;
  event.preventDefault();
  doctorGrid.scrollLeft += movement;
}, { passive: false });
doctorGrid.addEventListener('pointerdown', event => {
  if (!mobileDoctors.matches || event.pointerType !== 'mouse' || event.button !== 0) return;
  doctorDragStartX = event.clientX;
  doctorDragStartScroll = doctorGrid.scrollLeft;
  doctorDragging = true;
  suppressDoctorClick = false;
});
doctorGrid.addEventListener('pointermove', event => {
  if (!doctorDragging) return;
  const distance = event.clientX - doctorDragStartX;
  if (Math.abs(distance) <= 5 && !suppressDoctorClick) return;
  if (!suppressDoctorClick) {
    suppressDoctorClick = true;
    doctorGrid.classList.add('is-dragging');
    doctorGrid.setPointerCapture(event.pointerId);
  }
  doctorGrid.scrollLeft = doctorDragStartScroll - distance;
});
function stopDoctorDrag() {
  doctorDragging = false;
  doctorGrid.classList.remove('is-dragging');
}
doctorGrid.addEventListener('pointerup', stopDoctorDrag);
doctorGrid.addEventListener('pointercancel', stopDoctorDrag);
doctorGrid.addEventListener('lostpointercapture', stopDoctorDrag);
doctorGrid.addEventListener('click', event => {
  if (!suppressDoctorClick) return;
  event.preventDefault();
  event.stopPropagation();
  suppressDoctorClick = false;
}, true);
doctorGrid.addEventListener('keydown', event => {
  if (!mobileDoctors.matches || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return;
  event.preventDefault();
  doctorGrid.scrollBy({ left: (event.key === 'ArrowRight' ? 1 : -1) * 232, behavior: 'smooth' });
});

const valueGrid = document.querySelector('.value-grid');
const scrollableValues = window.matchMedia('(max-width: 768px)');
let valueDragStartX = 0;
let valueDragStartScroll = 0;
let valueDragging = false;
let valuePointerId = null;

valueGrid.addEventListener('wheel', event => {
  if (!scrollableValues.matches) return;
  const movement = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
  const next = valueGrid.scrollLeft + movement;
  if ((movement < 0 && valueGrid.scrollLeft <= 0) ||
      (movement > 0 && valueGrid.scrollLeft >= valueGrid.scrollWidth - valueGrid.clientWidth - 1)) return;
  event.preventDefault();
  valueGrid.scrollLeft = next;
}, { passive: false });

valueGrid.addEventListener('pointerdown', event => {
  if (!scrollableValues.matches || event.pointerType !== 'mouse' || event.button !== 0) return;
  valueDragStartX = event.clientX;
  valueDragStartScroll = valueGrid.scrollLeft;
  valueDragging = true;
  valuePointerId = event.pointerId;
  valueGrid.setPointerCapture(event.pointerId);
});
valueGrid.addEventListener('pointermove', event => {
  if (!valueDragging || event.pointerId !== valuePointerId) return;
  const distance = event.clientX - valueDragStartX;
  if (Math.abs(distance) <= 5 && !valueGrid.classList.contains('is-dragging')) return;
  if (!valueGrid.classList.contains('is-dragging')) {
    valueGrid.classList.add('is-dragging');
  }
  valueGrid.scrollLeft = valueDragStartScroll - distance;
});
const stopValueDrag = event => {
  if (event.pointerId !== valuePointerId) return;
  valueDragging = false;
  valuePointerId = null;
  valueGrid.classList.remove('is-dragging');
};
valueGrid.addEventListener('pointerup', stopValueDrag);
valueGrid.addEventListener('pointercancel', stopValueDrag);
valueGrid.addEventListener('lostpointercapture', stopValueDrag);
valueGrid.addEventListener('dragstart', event => event.preventDefault());
valueGrid.addEventListener('keydown', event => {
  if (!scrollableValues.matches || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return;
  event.preventDefault();
  valueGrid.scrollBy({ left: (event.key === 'ArrowRight' ? 1 : -1) * 280, behavior: 'smooth' });
});

const faqs = [
  ['Можно ли смешивать натуральный рацион с промышленным?<br>Как часто можно давать лакомства?', 'Мы не рекомендуем смешивать рационы, так как в готовых кормах уже рассчитана суточная калорийность, количество всех необходимых веществ, минералов и витаминов. Добавляя натуральную еду суточная дозировка вышеперечисленного у вашего питомца меняется. При выборе натурального рациона рекомендуем прием диетолога для составления полноценного рациона с учетом индивидуальных особенностей вашего питомца.'],
  ['Можно ли давать анестезию пожилым животным?', 'Ответ зависит от состояния питомца. Перед процедурой врач проведёт осмотр и подберёт безопасный план.'],
  ['В каком возрасте можно кастрировать/стерилизовать питомца?', 'Подходящий возраст зависит от вида, породы и здоровья питомца. Обсудите это с врачом на приёме.'],
  ['Как часто необходимо обрабатывать питомца от эктопаразитов и эндопаразитов?', 'График обработок зависит от препарата и образа жизни животного.'],
  ['Необходимо ли вакцинировать животных, которые не выходят гулять на улицу?', 'Даже домашним питомцам может потребоваться вакцинация. Врач поможет составить график.'],
  ['Как часто необходимо проводить санацию параанальных желез, чистить уши и стричь когти питомцу?', 'Частоту процедур лучше подобрать индивидуально после осмотра.'],
  ['Как часто необходимо проводить диспансеризацию животному?', 'Профилактический осмотр обычно проводят регулярно с учётом возраста и состояния здоровья.'],
  ['Зачем нужны общий клинический и биохимический анализы крови?', 'Анализы помогают оценить состояние организма и подготовиться к лечению.'],
  ['При каких симптомах рекомендуется УЗИ брюшной полости?', 'Решение об УЗИ принимает врач после осмотра питомца.'],
  ['Можно ли проводить санацию ротовой полости без наркоза?', 'Врач оценит состояние ротовой полости и предложит подходящий способ лечения.']
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
    <p>Не нашли ответ? Мы на связи круглосуточно и поможем разобраться.</p>
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
let faqTouchActive = false;
let faqSettleTimer = 0;
let faqScrollDirection = 0;
let faqLastScrollLeft = faqList.scrollLeft;

function settleFaqScroll() {
  if (!mobileFaq.matches || faqPointerId !== null || faqTouchActive || !faqScrollDirection) return;
  const current = faqList.scrollLeft;
  const maxScroll = faqList.scrollWidth - faqList.clientWidth;
  let target = null;
  let shortestDistance = Infinity;
  faqList.querySelectorAll('.faq-item').forEach(item => {
    const position = Math.min(item.offsetLeft, maxScroll);
    const distance = position - current;
    if (distance * faqScrollDirection <= 1) return;
    const allowedNudge = Math.min(96, item.offsetWidth * .4);
    if (Math.abs(distance) <= allowedNudge && Math.abs(distance) < shortestDistance) {
      target = position;
      shortestDistance = Math.abs(distance);
    }
  });
  if (target !== null) faqList.scrollTo({ left: target, behavior: 'smooth' });
}

function scheduleFaqSettle() {
  clearTimeout(faqSettleTimer);
  faqSettleTimer = window.setTimeout(settleFaqScroll, 140);
}

faqList.addEventListener('scroll', () => {
  const position = faqList.scrollLeft;
  if (Math.abs(position - faqLastScrollLeft) > .5) faqScrollDirection = Math.sign(position - faqLastScrollLeft);
  faqLastScrollLeft = position;
  scheduleFaqSettle();
}, { passive: true });
faqList.addEventListener('wheel', event => {
  if (!mobileFaq.matches) return;
  if (!event.shiftKey && Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
  const movement = event.shiftKey ? event.deltaY : event.deltaX;
  if (!movement) return;
  if ((movement < 0 && faqList.scrollLeft <= 0) ||
      (movement > 0 && faqList.scrollLeft >= faqList.scrollWidth - faqList.clientWidth - 1)) return;
  event.preventDefault();
  faqList.scrollLeft += movement;
}, { passive: false });
faqList.addEventListener('pointerdown', event => {
  if (mobileFaq.matches && event.pointerType === 'touch') {
    faqTouchActive = true;
    return;
  }
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
  if (event.pointerType === 'touch') {
    faqTouchActive = false;
    scheduleFaqSettle();
    return;
  }
  if (event.pointerId !== faqPointerId) return;
  faqPointerId = null;
  faqList.classList.remove('is-dragging');
  window.setTimeout(() => { faqSuppressClick = false; }, 0);
  scheduleFaqSettle();
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
  faqList.scrollBy({ left: (event.key === 'ArrowRight' ? 1 : -1) * (faqList.clientWidth - 56), behavior: 'smooth' });
});

document.querySelectorAll('.accordion-heading').forEach(button => {
  let animation;
  button.addEventListener('click', () => {
    const card = button.closest('.price-card');
    const content = card.querySelector('.accordion-content');
    if (!content) return;
    const open = button.getAttribute('aria-expanded') === 'true';
    const start = content.hidden ? 0 : content.getBoundingClientRect().height;
    animation?.cancel();
    content.hidden = false;
    content.style.height = `${start}px`;
    const end = open ? 0 : content.scrollHeight;
    button.setAttribute('aria-expanded', String(!open));
    card.classList.toggle('collapsed', open);
    button.querySelector('.chevron').src = open ? 'assets/price-chevron-down.svg' : 'assets/price-chevron-up.svg';
    content.style.overflow = 'hidden';
    content.style.height = `${start}px`;
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 360;
    animation = content.animate([{ height: `${start}px`, opacity: open ? 1 : 0 }, { height: `${end}px`, opacity: open ? 0 : 1 }], { duration, easing: 'cubic-bezier(.22, 1, .36, 1)' });
    animation.onfinish = () => {
      content.hidden = open;
      content.style.removeProperty('height');
      content.style.removeProperty('overflow');
      animation = null;
    };
  });
});

const menuToggle = document.querySelector('.menu-toggle');

const hero = document.querySelector('.hero');
const heroSlides = [...hero.querySelectorAll('.hero-slide')];
const heroControls = [...hero.querySelectorAll('.hero-steps button')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const sliderPauses = new Set();
let activeSlide = 0;
let sliderTimer;
let heroGesture = null;
let suppressHeroClick = false;
let heroAnimation = null;
const heroTrack = document.createElement('div');
heroTrack.className = 'hero-track';

function renderHeroTrack() {
  const count = heroSlides.length;
  heroTrack.replaceChildren(...[-1, 0, 1].map(offset => {
    const index = (activeSlide + offset + count) % count;
    const slide = heroSlides[index].cloneNode(true);
    slide.dataset.slideIndex = String(index);
    slide.classList.toggle('is-active', offset === 0);
    slide.setAttribute('aria-hidden', String(offset !== 0));
    slide.querySelectorAll('img').forEach(image => { image.draggable = false; });
    return slide;
  }));
  heroTrack.style.transition = 'none';
  heroTrack.style.transform = 'translate3d(-100%,0,0)';
}

if (heroSlides.length > 1) {
  renderHeroTrack();
  hero.prepend(heroTrack);
  heroSlides.forEach(slide => slide.remove());
  hero.classList.add('has-track');
}

function stopSliderTimer() {
  clearInterval(sliderTimer);
  sliderTimer = undefined;
}

function startSliderTimer() {
  stopSliderTimer();
  if (heroSlides.length < 2 || reducedMotion.matches || sliderPauses.size) return;
  sliderTimer = setInterval(() => showHeroSlide(activeSlide + 1), 5500);
}

function updateHeroControls() {
  heroControls.forEach((control, controlIndex) => {
    const current = controlIndex === activeSlide;
    control.classList.toggle('active', current);
    control.setAttribute('aria-current', String(current));
  });
}

function settleHero(direction) {
  if (heroAnimation) return;
  setSliderPause('animation', true);
  hero.classList.add('is-settling');
  const duration = reducedMotion.matches ? 0 : 340;
  const finish = () => {
    if (!heroAnimation) return;
    clearTimeout(heroAnimation.timer);
    heroTrack.removeEventListener('transitionend', onTransitionEnd);
    heroAnimation = null;
    activeSlide = (activeSlide + direction + heroSlides.length) % heroSlides.length;
    renderHeroTrack();
    updateHeroControls();
    hero.classList.remove('is-settling');
    setSliderPause('animation', false);
  };
  const onTransitionEnd = event => {
    if (event.target === heroTrack && event.propertyName === 'transform') finish();
  };
  heroAnimation = { timer: null };
  if (!duration) {
    finish();
    return;
  }
  heroTrack.addEventListener('transitionend', onTransitionEnd);
  heroTrack.style.transition = `transform ${duration}ms cubic-bezier(.22,1,.36,1)`;
  // Commit the drag position before starting the settling transition.
  void heroTrack.offsetWidth;
  heroTrack.style.transform = `translate3d(${direction < 0 ? '0%' : direction > 0 ? '-200%' : '-100%'},0,0)`;
  heroAnimation.timer = window.setTimeout(finish, duration + 80);
}

function showHeroSlide(index) {
  if (heroAnimation || heroGesture || heroSlides.length < 2) return;
  const target = (index + heroSlides.length) % heroSlides.length;
  if (target === activeSlide) {
    startSliderTimer();
    return;
  }
  // The selected banner is adjacent in the circular track.
  const direction = target === (activeSlide + 1) % heroSlides.length ? 1 : -1;
  settleHero(direction);
}

function setSliderPause(reason, paused) {
  if (paused) sliderPauses.add(reason);
  else sliderPauses.delete(reason);
  startSliderTimer();
}

heroControls.forEach((control, index) => {
  control.addEventListener('click', () => showHeroSlide(index));
  control.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const next = (index + (event.key === 'ArrowRight' ? 1 : -1) + heroControls.length) % heroControls.length;
    heroControls[next].focus();
    showHeroSlide(next);
  });
});

hero.addEventListener('pointerdown', event => {
  if (heroGesture || heroAnimation || heroSlides.length < 2 || event.target.closest('.hero-steps')) return;
  if (event.pointerType === 'mouse' && event.button !== 0) return;
  heroGesture = { id: event.pointerId, x: event.clientX, y: event.clientY, lastX: event.clientX, lastTime: event.timeStamp, velocity: 0, dragging: false, vertical: false };
});
window.addEventListener('pointermove', event => {
  if (!heroGesture || event.pointerId !== heroGesture.id || heroGesture.vertical) return;
  const distanceX = event.clientX - heroGesture.x;
  const distanceY = event.clientY - heroGesture.y;
  if (!heroGesture.dragging) {
    if (Math.max(Math.abs(distanceX), Math.abs(distanceY)) <= 6) return;
    if (Math.abs(distanceY) > Math.abs(distanceX)) {
      heroGesture.vertical = true;
      return;
    }
    heroGesture.dragging = true;
    hero.classList.add('is-dragging');
    setSliderPause('drag', true);
    if (event.pointerType === 'mouse') hero.setPointerCapture(event.pointerId);
  }
  const elapsed = event.timeStamp - heroGesture.lastTime;
  if (elapsed > 0) heroGesture.velocity = (event.clientX - heroGesture.lastX) / elapsed;
  heroGesture.lastX = event.clientX;
  heroGesture.lastTime = event.timeStamp;
  const offset = Math.max(-hero.clientWidth, Math.min(hero.clientWidth, distanceX));
  heroTrack.style.transition = 'none';
  heroTrack.style.transform = `translate3d(calc(-100% + ${offset}px),0,0)`;
});
function finishHeroGesture(event, canceled = false) {
  if (!heroGesture || event.pointerId !== heroGesture.id) return;
  const distanceX = event.clientX - heroGesture.x;
  const dragging = heroGesture.dragging;
  const velocity = heroGesture.velocity;
  if (dragging) {
    suppressHeroClick = true;
    window.setTimeout(() => { suppressHeroClick = false; }, 150);
  }
  heroGesture = null;
  hero.classList.remove('is-dragging');
  if (!dragging) return;
  const threshold = Math.min(hero.clientWidth * .2, 100);
  const move = !canceled && (Math.abs(distanceX) >= threshold || (Math.abs(distanceX) > 24 && Math.abs(velocity) > .55));
  settleHero(move ? (distanceX < 0 ? 1 : -1) : 0);
  setSliderPause('drag', false);
}
window.addEventListener('pointerup', event => finishHeroGesture(event));
window.addEventListener('pointercancel', event => finishHeroGesture(event, true));
hero.addEventListener('lostpointercapture', event => {
  if (event.target === hero) finishHeroGesture(event, true);
});
hero.addEventListener('dragstart', event => event.preventDefault());
hero.addEventListener('click', event => {
  if (!suppressHeroClick) return;
  event.preventDefault();
  event.stopPropagation();
  suppressHeroClick = false;
}, true);
hero.addEventListener('mouseenter', () => setSliderPause('hover', true));
hero.addEventListener('mouseleave', () => setSliderPause('hover', false));
hero.addEventListener('focusin', () => setSliderPause('focus', true));
hero.addEventListener('focusout', event => {
  if (!hero.contains(event.relatedTarget)) setSliderPause('focus', false);
});
document.addEventListener('visibilitychange', () => setSliderPause('tab', document.hidden));
if ('IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => setSliderPause('offscreen', !entry.isIntersecting), { threshold: 0.25 }).observe(hero);
}
startSliderTimer();

const siteHeader = document.querySelector('.site-header');
let previousScrollY = window.scrollY;
let headerScrollFrame = 0;

function updateHeaderOnScroll() {
  headerScrollFrame = 0;
  if (document.body.classList.contains('chat-open') || document.body.classList.contains('faq-sheet-open')) return;
  const currentY = Math.max(0, window.scrollY);
  const movement = currentY - previousScrollY;
  const menuOrSearchOpen = menuToggle.getAttribute('aria-expanded') === 'true' ||
    document.querySelector('.search-box').classList.contains('is-open');

  if (currentY <= 24 || menuOrSearchOpen) {
    siteHeader.classList.remove('is-hidden');
    siteHeader.classList.toggle('is-visible', currentY > 24);
  } else if (Math.abs(movement) >= 6) {
    siteHeader.classList.toggle('is-hidden', movement > 0 && currentY > 60);
    siteHeader.classList.toggle('is-visible', movement < 0);
  }
  if (Math.abs(movement) >= 6 || currentY <= 24) previousScrollY = currentY;
}

window.addEventListener('scroll', () => {
  if (!headerScrollFrame) headerScrollFrame = requestAnimationFrame(updateHeaderOnScroll);
}, { passive: true });


const doctorTabs = [...document.querySelectorAll('.doctor-tabs [role="tab"]')];
const doctorPanels = [...document.querySelectorAll('.doctor-tab-panel')];

function enableHorizontalDrag(scroller) {
  let pointerId = null;
  let startX = 0;
  let startScroll = 0;
  let dragging = false;
  let suppressClick = false;

  scroller.addEventListener('dragstart', event => event.preventDefault());

  scroller.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch' || event.button !== 0) return;
    pointerId = event.pointerId;
    startX = event.clientX;
    startScroll = scroller.scrollLeft;
    dragging = false;
  });
  scroller.addEventListener('pointermove', event => {
    if (event.pointerId !== pointerId) return;
    const distance = event.clientX - startX;
    if (!dragging && Math.abs(distance) > 6) {
      dragging = true;
      scroller.setPointerCapture(pointerId);
      scroller.classList.add('is-dragging');
    }
    if (dragging) {
      event.preventDefault();
      scroller.scrollLeft = startScroll - distance;
    }
  });
  function endDrag(event) {
    if (event.pointerId !== pointerId) return;
    if (dragging) {
      suppressClick = true;
      setTimeout(() => { suppressClick = false; }, 0);
    }
    scroller.classList.remove('is-dragging');
    if (scroller.hasPointerCapture(pointerId)) scroller.releasePointerCapture(pointerId);
    pointerId = null;
    dragging = false;
  }
  scroller.addEventListener('pointerup', endDrag);
  scroller.addEventListener('pointercancel', endDrag);
  scroller.addEventListener('click', event => {
    if (!suppressClick) return;
    event.preventDefault();
    event.stopPropagation();
  }, true);
  scroller.addEventListener('wheel', event => {
    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    if (maxScroll <= 0) return;
    const amount = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    const next = Math.max(0, Math.min(maxScroll, scroller.scrollLeft + amount));
    if (next === scroller.scrollLeft) return;
    event.preventDefault();
    scroller.scrollLeft = next;
  }, { passive: false });
}

document.querySelectorAll('.doctor-story-strip,.doctor-tabs,.education-tabs').forEach(enableHorizontalDrag);

function selectDoctorTab(tab, focus = false) {
  doctorTabs.forEach(button => {
    const selected = button === tab;
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  doctorPanels.forEach(panel => { panel.hidden = panel.id !== `panel-${tab.dataset.tab}`; });
  if (focus) tab.focus();
}

doctorTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectDoctorTab(tab));
  tab.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? doctorTabs.length - 1 :
      (index + (event.key === 'ArrowRight' ? 1 : -1) + doctorTabs.length) % doctorTabs.length;
    selectDoctorTab(doctorTabs[next], true);
  });
});

const workToggle = document.querySelector('#work-toggle');
const workMore = document.querySelector('#doctor-work-more');
workToggle.addEventListener('click', () => {
  workMore.hidden = !workMore.hidden;
  const expanded = !workMore.hidden;
  workToggle.setAttribute('aria-expanded', String(expanded));
  workToggle.firstChild.textContent = expanded ? 'Скрыть ' : 'Показать ещё ';
});

const educationDialog = document.querySelector('#education-dialog');
const educationTabs = [...educationDialog.querySelectorAll('[data-education]')];
const educationEntries = [...educationDialog.querySelectorAll('[data-education-kind]')];
const educationSheetMedia = window.matchMedia('(max-width:600px)');
const educationReducedMotion = window.matchMedia('(prefers-reduced-motion:reduce)');
let educationCloseTimer = 0;
function finishEducationClose() {
  clearTimeout(educationCloseTimer);
  educationCloseTimer = 0;
  if (educationDialog.open) educationDialog.close();
}
function closeEducationDialog() {
  if (!educationDialog.open || educationCloseTimer) return;
  educationDialog.classList.remove('is-open');
  if (educationSheetMedia.matches && !educationReducedMotion.matches) {
    educationCloseTimer = window.setTimeout(finishEducationClose, 340);
  } else finishEducationClose();
}
document.querySelector('#education-open').addEventListener('click', () => {
  educationDialog.showModal();
  if (educationSheetMedia.matches) {
    void educationDialog.offsetWidth;
    requestAnimationFrame(() => {
      if (educationDialog.open && !educationCloseTimer) educationDialog.classList.add('is-open');
    });
  }
});
educationDialog.addEventListener('cancel', event => {
  event.preventDefault();
  closeEducationDialog();
});
educationDialog.addEventListener('close', () => {
  clearTimeout(educationCloseTimer);
  educationCloseTimer = 0;
  educationDialog.classList.remove('is-open');
});
let educationSwipe = null;
educationDialog.addEventListener('pointerdown', event => {
  if (!matchMedia('(max-width: 600px)').matches || event.pointerType !== 'touch' || event.clientY > educationDialog.getBoundingClientRect().top + 72) return;
  educationSwipe = { id: event.pointerId, y: event.clientY };
});
educationDialog.addEventListener('pointerup', event => {
  if (!educationSwipe || educationSwipe.id !== event.pointerId) return;
  if (event.clientY - educationSwipe.y > 70) closeEducationDialog();
  educationSwipe = null;
});
educationDialog.addEventListener('pointercancel', () => { educationSwipe = null; });
educationTabs.forEach(tab => tab.addEventListener('click', () => {
  educationTabs.forEach(button => button.setAttribute('aria-selected', String(button === tab)));
  educationEntries.forEach(entry => { entry.hidden = tab.dataset.education !== 'all' && entry.dataset.educationKind !== tab.dataset.education; });
}));

const storyDialog = document.querySelector('#story-dialog');
const storyButtons = [...document.querySelectorAll('.doctor-story')];
const storyImage = document.querySelector('#story-image');
const storyCaption = document.querySelector('#story-caption');
const storyProgress = document.querySelector('#story-progress');
const storyPause = document.querySelector('#story-pause');
const storyPauseIcon = storyPause.querySelector('img');
const storyPreviewPrev = document.querySelector('#story-preview-prev');
const storyPreviewNext = document.querySelector('#story-preview-next');
const stories = [
  { image: 'assets/doctor-story.png', caption: 'Знакомьтесь: наши пациенты' },
  { image: 'assets/doctor-post-photo.png', caption: 'Забота о каждом питомце' },
  { image: 'assets/doctor-cover.png', caption: 'Один день в клинике Dr.Hug' },
  { image: 'assets/doctor-story.png', caption: 'Советы по здоровью питомца' },
  { image: 'assets/doctor-post-photo.png', caption: 'До встречи на приёме!' }
];
// The demo starts with a mix of viewed and new stories on every page load.
const seenStories = new Set([1, 3]);
const profileAvatar = document.querySelector('.doctor-profile-avatar');
function syncStoryRings() {
  storyButtons.forEach((button, index) => button.classList.toggle('is-unseen', !seenStories.has(index)));
  profileAvatar.classList.toggle('has-story', seenStories.size < stories.length);
}
syncStoryRings();
let storyIndex = 0;
let storyElapsed = 0;
let storyLastFrame = 0;
let storyFrame = 0;
let storyPaused = false;
const storyDuration = 6000;

function renderStory() {
  const story = stories[storyIndex];
  storyImage.src = story.image;
  storyImage.alt = story.caption;
  storyCaption.textContent = story.caption;
  [[storyPreviewPrev, storyIndex - 1], [storyPreviewNext, storyIndex + 1]].forEach(([preview, index]) => {
    preview.hidden = index < 0 || index >= stories.length;
    if (preview.hidden) return;
    preview.querySelector('img').src = stories[index].image;
    preview.querySelector('span').textContent = stories[index].caption;
  });
  seenStories.add(storyIndex);
  syncStoryRings();
  storyProgress.replaceChildren(...stories.map((_, index) => {
    const bar = document.createElement('span');
    bar.style.setProperty('--fill', index < storyIndex ? '100%' : '0%');
    return bar;
  }));
  storyElapsed = 0;
  storyLastFrame = 0;
}

function storyTick(timestamp) {
  if (!storyDialog.open) return;
  if (storyLastFrame && !storyPaused && !document.hidden) storyElapsed += timestamp - storyLastFrame;
  storyLastFrame = timestamp;
  const bar = storyProgress.children[storyIndex];
  if (bar) bar.style.setProperty('--fill', `${Math.min(100, storyElapsed / storyDuration * 100)}%`);
  if (storyElapsed >= storyDuration) moveStory(1);
  storyFrame = requestAnimationFrame(storyTick);
}

function openStory(index) {
  storyIndex = index;
  storyPaused = false;
  storyPauseIcon.src = 'assets/doctor-control-pause.svg';
  storyPause.setAttribute('aria-label', 'Пауза');
  renderStory();
  storyDialog.showModal();
  cancelAnimationFrame(storyFrame);
  storyFrame = requestAnimationFrame(storyTick);
}

function moveStory(direction) {
  const next = storyIndex + direction;
  if (next < 0 || next >= stories.length) { storyDialog.close(); return; }
  storyIndex = next;
  renderStory();
}

storyButtons.forEach((button, index) => button.addEventListener('click', () => openStory(index)));
profileAvatar.addEventListener('click', () => openStory(0));
document.querySelector('#story-prev').addEventListener('click', () => moveStory(-1));
document.querySelector('#story-next').addEventListener('click', () => moveStory(1));
storyPreviewPrev.addEventListener('click', () => moveStory(-1));
storyPreviewNext.addEventListener('click', () => moveStory(1));
storyPause.addEventListener('click', () => {
  storyPaused = !storyPaused;
  storyPauseIcon.src = storyPaused ? 'assets/doctor-control-play.svg' : 'assets/doctor-control-pause.svg';
  storyPause.setAttribute('aria-label', storyPaused ? 'Продолжить' : 'Пауза');
});
storyDialog.addEventListener('close', () => { cancelAnimationFrame(storyFrame); storyLastFrame = 0; });
storyDialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault();
    moveStory(event.key === 'ArrowRight' ? 1 : -1);
  } else if (event.key === ' ' && event.target.tagName !== 'BUTTON') {
    event.preventDefault();
    storyPause.click();
  }
});
let storyStartX = null;
storyDialog.addEventListener('pointerdown', event => { storyStartX = event.clientX; });
storyDialog.addEventListener('pointerup', event => {
  if (storyStartX === null) return;
  const delta = event.clientX - storyStartX;
  if (Math.abs(delta) > 50) moveStory(delta < 0 ? 1 : -1);
  storyStartX = null;
});
let lastStoryWheel = 0;
storyDialog.addEventListener('wheel', event => {
  const movement = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
  if (Math.abs(movement) < 40) return;
  event.preventDefault();
  if (performance.now() - lastStoryWheel < 550) return;
  lastStoryWheel = performance.now();
  moveStory(movement > 0 ? 1 : -1);
}, { passive: false });

const publicationDialog = document.querySelector('#publication-dialog');
const publicationGrid = document.querySelector('#doctor-publication-grid');
const publicationMedia = publicationDialog.querySelector('.publication-viewer-media');
const publicationImage = document.querySelector('#publication-viewer-image');
const publicationVideo = document.querySelector('#publication-viewer-video');
const publicationTitle = document.querySelector('#publication-dialog-title');
const publicationCaption = document.querySelector('#publication-caption-text');
const publicationDots = document.querySelector('#publication-dots');
const publicationPosts = [
  {
    slug: 'bruno-na-prieme', title: 'Бруно на приёме', date: '12 сентября 2026',
    media: ['assets/doctor-post-photo.png', 'assets/doctor-cover.png'],
    caption: 'Бруно сначала немного волновался, а через несколько минут уже с интересом осматривал кабинет. Я всегда даю питомцу время привыкнуть к новой обстановке.\n\nНа приёме мы обсудили с владельцем привычный рацион, аппетит и то, что изменилось за последние дни.'
  },
  {
    slug: 'utro-v-klinike', title: 'Утро в клинике', date: '8 сентября 2026',
    media: ['assets/doctor-cover.png'],
    caption: 'Пара тихих минут перед первым пациентом. Проверяем кабинет, готовим всё для осмотра и ещё раз просматриваем записи на день.\n\nКогда всё под рукой, можно полностью сосредоточиться на питомце и разговоре с его владельцем.'
  },
  {
    slug: 'charli-posle-osmotra', title: 'Чарли после осмотра', date: '3 сентября 2026',
    media: ['assets/doctor-story.png', 'assets/doctor-post-photo.png'],
    caption: 'Знакомьтесь, Чарли. Он пришёл с нарядным платком и сразу стал главным героем дня.\n\nДаже короткая пауза, чтобы познакомиться и понюхать всё вокруг, помогает сделать осмотр спокойнее.'
  },
  {
    slug: 'pervyi-priem', title: 'О чём говорим на первом приёме', date: '29 августа 2026',
    media: ['assets/values-main.png'],
    caption: 'Первый приём начинается с разговора. Мне важно понять, что питомец ест обычно, когда появились изменения и как он чувствует себя дома.\n\nЕсли у вас есть записи о питании и самочувствии, захватите их с собой. Так легче восстановить последовательность событий.'
  },
  {
    slug: 'dnevnik-samochuvstviya', title: 'Зачем вести дневник самочувствия', date: '23 августа 2026',
    media: ['assets/rating-425-dog.jpg'],
    caption: 'Перед визитом полезно записать три вещи: что изменилось в аппетите, как часто питомец ест и какие новые привычки вы заметили.\n\nЭто не заменяет осмотр, зато помогает рассказать врачу о самом важном и ничего не забыть.'
  },
  {
    slug: 'voprosy-gastroenterologu', title: 'Три вопроса гастроэнтерологу', date: '17 августа 2026',
    media: ['assets/doctor-post.png', 'assets/doctor-cover.png'],
    caption: '«Можно ли принести прошлые анализы?» — да, возьмите всё, что сохранилось.\n\n«Нужно ли заранее менять корм?» — лучше сначала обсудить изменения с врачом.\n\n«Можно ли записать вопросы?» — конечно. На приёме легко забыть то, о чём хотелось спросить.'
  },
  {
    slug: 'koshka-i-appetit', title: 'Если кошка стала хуже есть', date: '10 августа 2026',
    media: ['assets/useful-cat.png'], illustration: true,
    caption: 'Изменение аппетита бывает заметным не сразу. Иногда питомец подходит к миске, но съедает меньше обычного.\n\nПеред консультацией можно отметить, когда вы это заметили и как менялось поведение. Если перемены выражены или вас что-то тревожит, свяжитесь с клиникой.'
  },
  {
    slug: 'komandnaya-rabota', title: 'За кадром: работа команды', date: '4 августа 2026',
    media: ['assets/doctor-article-1.png'], illustration: true,
    caption: 'Хороший приём — это работа всей команды. Администратор помогает выбрать время, ассистент готовит кабинет, а врач спокойно объясняет владельцу каждый следующий шаг.\n\nНам важно, чтобы и человек, и питомец чувствовали себя уверенно.'
  }
];
const illustratedMedia = new Set(['assets/useful-cat.png', 'assets/doctor-article-1.png']);
function getPublicationMedia(item) {
  return typeof item === 'string' ? { src: item, type: /\.(mp4|webm|ogv)(?:[?#]|$)/i.test(item) ? 'video' : 'image' } : item;
}
publicationPosts.forEach((post, index) => {
  const card = document.createElement('button');
  card.className = 'publication-card';
  card.type = 'button';
  card.setAttribute('aria-label', `Открыть публикацию: ${post.title}`);
  const cover = document.createElement('span');
  cover.className = `publication-cover${post.illustration ? ' is-illustration' : ''}`;
  const firstMedia = getPublicationMedia(post.media[0]);
  const preview = document.createElement(firstMedia.type === 'video' ? 'video' : 'img');
  if (firstMedia.type === 'video') {
    preview.src = firstMedia.src;
    preview.poster = firstMedia.poster || '';
    preview.preload = 'metadata';
    preview.muted = true;
    preview.playsInline = true;
  } else {
    preview.src = firstMedia.src;
    preview.loading = 'lazy';
  }
  preview.setAttribute('aria-hidden', 'true');
  cover.append(preview);
  const kind = document.createElement('span');
  kind.className = 'publication-kind';
  kind.setAttribute('aria-label', firstMedia.type === 'video' ? 'Видео' : post.media.length > 1 ? 'Несколько фото' : 'Фото');
  const icon = document.createElement('img');
  icon.src = firstMedia.type === 'video' ? 'assets/doctor-post-video.svg' : 'assets/doctor-post-gallery.svg';
  icon.alt = '';
  kind.append(icon);
  cover.append(kind);
  const title = document.createElement('span');
  title.className = 'publication-title';
  title.textContent = post.title;
  card.append(cover, title);
  card.addEventListener('click', () => openPublication(index));
  publicationGrid.append(card);
});
let publicationIndex = 0;
let publicationSlide = 0;

function renderPublicationSlide() {
  const post = publicationPosts[publicationIndex];
  const media = getPublicationMedia(post.media[publicationSlide]);
  const isVideo = media.type === 'video';
  publicationVideo.pause();
  publicationVideo.hidden = !isVideo;
  publicationImage.hidden = isVideo;
  if (isVideo) {
    publicationVideo.src = media.src;
    publicationVideo.poster = media.poster || '';
    publicationImage.removeAttribute('src');
  } else {
    publicationVideo.removeAttribute('src');
    publicationVideo.load();
    publicationImage.src = media.src;
    publicationImage.alt = `${post.title}, фото ${publicationSlide + 1} из ${post.media.length}`;
  }
  publicationMedia.classList.toggle('is-illustration', illustratedMedia.has(media.src));
  document.querySelector('#publication-prev').hidden = publicationSlide === 0;
  document.querySelector('#publication-next').hidden = publicationSlide === post.media.length - 1;
  publicationDots.replaceChildren(...post.media.map((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = index === publicationSlide ? 'is-current' : '';
    dot.setAttribute('aria-label', `Медиа ${index + 1} из ${post.media.length}`);
    dot.setAttribute('aria-current', String(index === publicationSlide));
    dot.addEventListener('click', () => { publicationSlide = index; renderPublicationSlide(); });
    return dot;
  }));
  publicationDots.hidden = post.media.length < 2;
}

function renderPublication() {
  const post = publicationPosts[publicationIndex];
  publicationTitle.textContent = post.title;
  publicationCaption.textContent = post.caption;
  document.querySelector('#publication-caption-date').textContent = post.date;
  document.querySelector('.publication-thread').scrollTop = 0;
  renderPublicationSlide();
}

function openPublication(index) {
  publicationIndex = index;
  publicationSlide = 0;
  renderPublication();
  if (!publicationDialog.open) publicationDialog.showModal();
}

function movePublicationSlide(direction) {
  const next = publicationSlide + direction;
  if (next < 0 || next >= publicationPosts[publicationIndex].media.length) return;
  publicationSlide = next;
  renderPublicationSlide();
}

document.querySelector('#publication-prev').addEventListener('click', () => movePublicationSlide(-1));
document.querySelector('#publication-next').addEventListener('click', () => movePublicationSlide(1));
publicationDialog.addEventListener('keydown', event => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  if (event.target.matches('video')) return;
  event.preventDefault();
  movePublicationSlide(event.key === 'ArrowRight' ? 1 : -1);
});
let publicationStartX = null;
publicationMedia.addEventListener('pointerdown', event => {
  publicationStartX = event.target === publicationVideo ? null : event.clientX;
});
publicationMedia.addEventListener('pointerup', event => {
  if (publicationStartX === null) return;
  const delta = event.clientX - publicationStartX;
  if (Math.abs(delta) > 50) movePublicationSlide(delta < 0 ? 1 : -1);
  publicationStartX = null;
});
publicationDialog.addEventListener('close', () => publicationVideo.pause());
const sharedPost = new URLSearchParams(window.location.search).get('post');
const sharedPostIndex = publicationPosts.findIndex(post => post.slug === sharedPost);
if (sharedPostIndex >= 0) {
  selectDoctorTab(document.querySelector('#tab-publications'));
  openPublication(sharedPostIndex);
}

document.querySelectorAll('dialog [data-close]').forEach(button => button.addEventListener('click', () => {
  const dialog = button.closest('dialog');
  if (dialog === educationDialog) closeEducationDialog();
  else dialog.close();
}));
document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', event => {
  if (event.target !== dialog || dialog === storyDialog) return;
  if (dialog === educationDialog) closeEducationDialog();
  else dialog.close();
}));

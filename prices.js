const bannerVariants = {
  vaccine: { image: 'banner-f965c.png', title: 'Вакцинация', description: 'Наличие вакцины уточняйте по телефону.', call: true },
  hospital: { image: 'banner-ba15b.png', title: 'Стационар', description: 'Уважаемые друзья, обращаем ваше внимание, что агрессивные пациенты не размещаются в стационаре и при необходимости осмотра им может понадобиться седация, стоимость которой рассчитывается исходя из веса пациента.' },
  includedCare: { image: 'banner-44ffb.png', title: 'В стоимость включено', description: 'Медикаменты (кроме дорогостоящих), расходные материалы, корма, мониторинг и лечение в условиях стационара, проведение реанимационных мероприятий, проведение краткосрочной седации.' },
  separate: { image: 'banner-afe2e.png', title: 'Оплачивается отдельно', description: 'Прием онколога, анализы крови, УЗИ, рентген, препараты.' },
  medicines: { image: 'banner-44ffb.png', title: 'Стоимость препаратов', description: 'Уважаемые друзья, обращаем ваше внимание, что стоимость препаратов рассчитывается согласно веса пациента.' },
  includedProcedure: { image: 'banner-44ffb.png', title: 'В стоимость включено', description: 'Взятие крови и постановка катетера, расходные материалы, введение препарата, мониторинг пациента.' },
  hours: { image: 'banner-1caba.png', title: 'Пн - Пт с 11:00 до 16:00', description: 'Пройти программу по акционной цене можно с понедельника по пятницу с 11:00 до 16:00. Необходима предварительная запись.', call: true },
  healthy: { image: 'banner-40c28.png', title: 'Только для клинических здоровых питомцев', description: 'Чекапы проводятся только для клинически здоровых питомцев, у которых отсутствуют симптомы заболеваний.' }
};

const bannersByPanel = {
  2: ['hospital', 'includedCare'],
  4: ['includedProcedure', 'separate', 'medicines'],
  5: ['includedProcedure', 'medicines'],
  6: ['hospital', 'separate'],
  7: ['hospital', 'includedCare', 'medicines'],
  8: ['includedProcedure', 'separate'],
  9: ['separate', 'medicines'],
  10: ['healthy'],
  11: ['hours', 'healthy', 'includedCare'],
  12: ['vaccine', 'healthy']
};

const sampleTable = document.querySelector('#catalog-panel-1 .catalog-table-wrap');
for (const [number, variants] of Object.entries(bannersByPanel)) {
  const panel = document.querySelector(`#catalog-panel-${number}`);
  panel.replaceChildren();
  const list = document.createElement('div');
  list.className = 'catalog-banners';
  for (const key of variants) {
    const variant = bannerVariants[key];
    const banner = document.createElement('div');
    banner.className = 'catalog-banner';
    if (key === 'hours') banner.classList.add('price-banner-hours');
    if (key === 'healthy') banner.classList.add('price-banner-healthy');
    const image = document.createElement('img');
    image.src = `assets/${variant.image}`;
    image.alt = '';
    const copy = document.createElement('div');
    const title = document.createElement('strong');
    title.textContent = variant.title;
    const description = document.createElement('p');
    description.textContent = variant.description;
    copy.append(title, description);
    banner.append(image, copy);
    if (variant.call) {
      const call = document.createElement('button');
      call.className = 'button button-outline';
      call.type = 'button';
      call.dataset.chatOpen = '';
      call.textContent = 'Связаться с нами';
      banner.append(call);
    }
    list.append(banner);
  }
  panel.append(list, sampleTable.cloneNode(true));
}

const catalogCards = [...document.querySelectorAll('.catalog-card')];
const searchInput = document.querySelector('#service-search');
const departmentSelect = document.querySelector('#department-filter');
const emptyMessage = document.querySelector('#catalog-empty');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function setCardOpen(card, shouldOpen, animate = true) {
  const button = card.querySelector('.catalog-heading');
  const panel = card.querySelector('.catalog-panel');
  const currentOpen = button.getAttribute('aria-expanded') === 'true';
  if (currentOpen === shouldOpen) return;

  const start = panel.hidden ? 0 : panel.getBoundingClientRect().height;
  panel.getAnimations().forEach(animation => animation.cancel());
  panel.hidden = false;
  button.setAttribute('aria-expanded', String(shouldOpen));
  button.querySelector('img').src = shouldOpen ? 'assets/price-chevron-up.svg' : 'assets/price-chevron-down.svg';
  const end = shouldOpen ? panel.scrollHeight : 0;

  if (!animate || reduceMotion.matches) {
    panel.hidden = !shouldOpen;
    panel.style.removeProperty('height');
    panel.style.removeProperty('overflow');
    return;
  }
  panel.style.height = `${start}px`;
  panel.style.overflow = 'hidden';
  const animation = panel.animate(
    [{ height: `${start}px`, opacity: shouldOpen ? 0 : 1 }, { height: `${end}px`, opacity: shouldOpen ? 1 : 0 }],
    { duration: 360, easing: 'cubic-bezier(.22, 1, .36, 1)' }
  );
  animation.onfinish = () => {
    panel.hidden = !shouldOpen;
    panel.style.removeProperty('height');
    panel.style.removeProperty('overflow');
  };
}

catalogCards.forEach(card => {
  const button = card.querySelector('.catalog-heading');
  button.addEventListener('click', () => setCardOpen(card, button.getAttribute('aria-expanded') !== 'true'));
});

function applyFilters() {
  const query = searchInput.value.trim().toLocaleLowerCase('ru');
  const department = departmentSelect.value;
  departmentSelect.classList.toggle('has-value', Boolean(department));
  let visibleCount = 0;

  catalogCards.forEach(card => {
    const name = card.dataset.department;
    const inDepartment = !department || name === department;
    const titleMatch = name.toLocaleLowerCase('ru').includes(query);
    const rows = [...card.querySelectorAll('[data-service]')];
    const matchingRows = rows.filter(row => row.textContent.toLocaleLowerCase('ru').includes(query));
    const match = !query || titleMatch || matchingRows.length > 0;
    card.hidden = !(inDepartment && match);
    if (!card.hidden) visibleCount++;

    if (rows.length) {
      rows.forEach(row => { row.hidden = Boolean(query) && !titleMatch && !row.textContent.toLocaleLowerCase('ru').includes(query); });
      const group = card.querySelector('.catalog-group');
      if (group) group.hidden = Boolean(query) && !titleMatch && !query.includes('питани') &&
        ![...group.parentElement.children].slice([...group.parentElement.children].indexOf(group) + 1)
          .some(row => row.hasAttribute('data-service') && !row.hidden);
    }
    if (query && matchingRows.length && !card.hidden) setCardOpen(card, true, false);
  });

  emptyMessage.hidden = visibleCount > 0;
}

searchInput.addEventListener('input', applyFilters);
departmentSelect.addEventListener('change', applyFilters);

const menuToggle = document.querySelector('.menu-toggle');
const headerSearch = document.querySelector('.search-box');

const siteHeader = document.querySelector('.site-header');
let previousScrollY = window.scrollY;
let headerFrame = 0;
function updateHeader() {
  headerFrame = 0;
  if (document.body.classList.contains('chat-open')) return;
  const currentY = Math.max(0, window.scrollY);
  const movement = currentY - previousScrollY;
  const heldOpen = menuToggle.getAttribute('aria-expanded') === 'true' || headerSearch.classList.contains('is-open');
  if (currentY <= 24 || heldOpen) {
    siteHeader.classList.remove('is-hidden');
    siteHeader.classList.toggle('is-visible', currentY > 24);
  } else if (Math.abs(movement) >= 6) {
    siteHeader.classList.toggle('is-hidden', movement > 0 && currentY > 60);
    siteHeader.classList.toggle('is-visible', movement < 0);
  }
  if (Math.abs(movement) >= 6 || currentY <= 24) previousScrollY = currentY;
}
window.addEventListener('scroll', () => { if (!headerFrame) headerFrame = requestAnimationFrame(updateHeader); }, { passive: true });


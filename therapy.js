const doctorGrid = document.querySelector('#doctor-grid');
doctorGrid.innerHTML = Array.from({length: 6}, () => `
  <article class="doctor-card"><div class="doctor-photo"><a class="doctor-profile-link" href="doctor.html" aria-label="Подробнее о враче Кулешове Алексее"></a><img src="assets/doctor.png" alt="Кулешов Алексей"></div><div class="doctor-details"><div class="doctor-person"><h3><a href="doctor.html">Кулешов Алексей</a></h3><p>Вед. гастроэнтеролог,<br>научный руководитель</p></div><div class="doctor-booking"><strong>Прием 2 200 ₽</strong><a class="button button-outline" href="tel:+74994600294">Записаться</a></div></div></article>
`).join('');

const firstPriceContent = document.querySelector('#price-content');
[...document.querySelectorAll('.price-card.collapsed')].filter(card => !card.querySelector('.accordion-content')).forEach((card, index) => {
  const content = document.createElement('div');
  content.className = 'accordion-content';
  content.id = `therapy-price-content-${index + 1}`;
  content.hidden = true;
  content.innerHTML = firstPriceContent.innerHTML;
  card.append(content);
  card.querySelector('.accordion-heading').setAttribute('aria-controls', content.id);
});
document.querySelectorAll('.accordion-heading').forEach(button => {
  let animation;
  button.addEventListener('click', () => {
    const card = button.closest('.price-card');
    const content = card.querySelector('.accordion-content');
    const closing = button.getAttribute('aria-expanded') === 'true';
    const start = content.hidden ? 0 : content.getBoundingClientRect().height;
    animation?.cancel();
    content.hidden = false;
    content.style.height = `${start}px`;
    content.style.overflow = 'hidden';
    const end = closing ? 0 : content.scrollHeight;
    button.setAttribute('aria-expanded', String(!closing));
    card.classList.toggle('collapsed', closing);
    button.querySelector('.chevron').src = closing ? 'assets/price-chevron-down.svg' : 'assets/price-chevron-up.svg';
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 360;
    animation = content.animate([{height: `${start}px`, opacity: closing ? 1 : 0}, {height: `${end}px`, opacity: closing ? 0 : 1}], {duration, easing: 'cubic-bezier(.22, 1, .36, 1)'});
    animation.onfinish = () => {
      content.hidden = closing;
      content.style.removeProperty('height');
      content.style.removeProperty('overflow');
      animation = null;
    };
  });
});

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
window.addEventListener('scroll', () => {if (!headerFrame) headerFrame = requestAnimationFrame(updateHeader);}, {passive: true});

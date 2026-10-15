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


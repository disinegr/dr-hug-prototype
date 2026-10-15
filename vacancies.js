const vacancyQuery = document.querySelector('#vacancy-query');
const vacancyCards = [...document.querySelectorAll('.vacancy-card')];
const vacancyEmpty = document.querySelector('#vacancies-empty');

if (vacancyQuery && vacancyEmpty) {
  vacancyQuery.addEventListener('input', () => {
    const query = vacancyQuery.value.trim().toLocaleLowerCase('ru');
    let visibleCount = 0;
    vacancyCards.forEach(card => {
      const title = card.querySelector('h2')?.textContent.toLocaleLowerCase('ru') || '';
      const visible = title.includes(query);
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });
    vacancyEmpty.hidden = visibleCount > 0;
  });
}

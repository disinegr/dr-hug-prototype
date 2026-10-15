const specialistSearch = document.querySelector('#specialist-query');
const specialistSelect = document.querySelector('#specialist-specialty');
const specialistCards = [...document.querySelectorAll('.specialists-grid .doctor-card')];
const specialistEmpty = document.querySelector('#specialists-empty');

function filterSpecialists() {
  const query = specialistSearch.value.trim().toLocaleLowerCase('ru');
  const specialty = specialistSelect.value;
  let visible = 0;
  for (const card of specialistCards) {
    const matches = card.dataset.name.toLocaleLowerCase('ru').includes(query) && (!specialty || card.dataset.specialty === specialty);
    card.hidden = !matches;
    if (matches) visible++;
  }
  specialistEmpty.hidden = visible > 0;
}

specialistSearch.addEventListener('input', filterSpecialists);
specialistSelect.addEventListener('change', filterSpecialists);

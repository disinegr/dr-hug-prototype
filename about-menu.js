(() => {
  const about = document.querySelector('.nav-about');
  if (!about) return;

  const trigger = about.querySelector('.nav-about-trigger');
  const mobile = window.matchMedia('(max-width:1100px)');

  function syncForViewport() {
    about.classList.remove('is-open', 'is-closed');
    trigger.setAttribute('aria-expanded', String(mobile.matches));
  }

  trigger.addEventListener('click', () => {
    if (mobile.matches) {
      const closed = about.classList.toggle('is-closed');
      trigger.setAttribute('aria-expanded', String(!closed));
      return;
    }
    const open = about.classList.toggle('is-open');
    trigger.setAttribute('aria-expanded', String(open));
  });

  document.addEventListener('click', event => {
    if (mobile.matches || about.contains(event.target)) return;
    about.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !about.classList.contains('is-open')) return;
    about.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.focus();
  });

  mobile.addEventListener('change', syncForViewport);
  syncForViewport();
})();

(() => {
  const header = document.querySelector('.site-header');
  const contacts = header?.querySelector('.header-top');
  const main = header?.querySelector('.header-main');
  const navigation = header?.querySelector('#main-navigation');
  if (!contacts || !main || !navigation) return;

  const compact = window.matchMedia('(max-width:1024px)');
  const syncContacts = () => {
    if (compact.matches) navigation.append(contacts);
    else header.insertBefore(contacts, main);
  };

  compact.addEventListener('change', syncContacts);
  syncContacts();
})();

(() => {
  const header = document.querySelector('.site-header');
  const navigation = header?.querySelector('#main-navigation');
  const menuToggle = header?.querySelector('.menu-toggle');
  const searchToggle = header?.querySelector('.search-toggle');
  const searchBox = header?.querySelector('.search-box');
  const desktopInput = searchBox?.querySelector('input');
  if (!header || !navigation || !menuToggle || !searchToggle || !desktopInput) return;

  const menuGroups = [
    { title: 'Клиника', links: [
      ['О компании', 'about.html'], ['Наши ценности', 'index.html#values'],
      ['Отделения клиники', 'departments.html'], ['Терапия', 'therapy.html'],
      ['Наши специалисты', 'specialists.html']
    ] },
    { title: 'Услуги и запись', links: [
      ['Цены', 'prices.html'], ['Записаться на приём', 'tel:+74997282888'],
      ['Врачи', 'specialists.html'], ['Контакты', 'index.html#contacts'],
      ['Вакансии', 'vacancies.html']
    ] },
    { title: 'Полезное', links: [
      ['Полезное', 'useful.html'], ['Статьи', 'articles.html'],
      ['Коллапс трахеи у собак', 'article-trachea.html'],
      ['Школа Dr.Hug', '404.html'], ['Лечение питомцев', 'therapy.html']
    ] }
  ];

  const menuGrid = document.createElement('div');
  menuGrid.className = 'header-menu-columns';
  const bookingButton = document.createElement('button');
  bookingButton.className = 'button button-primary header-menu-booking';
  bookingButton.type = 'button';
  bookingButton.dataset.chatOpen = '';
  bookingButton.dataset.chatTopic = 'booking';
  bookingButton.textContent = 'Записаться на приём';
  menuGrid.append(bookingButton);
  menuGroups.forEach(group => {
    const column = document.createElement('div');
    column.className = 'header-menu-column';
    const title = document.createElement('span');
    title.className = 'header-menu-column-title';
    title.textContent = group.title;
    column.append(title);
    group.links.forEach(([label, href]) => {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = label;
      column.append(link);
    });
    menuGrid.append(column);
  });
  navigation.insertBefore(menuGrid, navigation.querySelector('.header-top'));

  const searchItems = [
    { title: 'Терапия', href: 'therapy.html', keywords: 'лечение прием врач', popular: true },
    { title: 'Цены на услуги', href: 'prices.html', keywords: 'стоимость прайс', popular: true },
    { title: 'Наши специалисты', href: 'specialists.html', keywords: 'врачи доктор кулешов', popular: true },
    { title: 'Статьи', href: 'articles.html', keywords: 'полезное материалы', popular: true },
    { title: 'Адреса клиники', href: 'index.html#contacts', keywords: 'контакты москва филевская хорошевское', popular: true },
    { title: 'О компании', href: 'about.html', keywords: 'о нас клиника' },
    { title: 'Отделения клиники', href: 'departments.html', keywords: 'услуги' },
    { title: 'Как понять и лечить коллапс трахеи у собак', href: 'article-trachea.html', keywords: 'кашель дыхание собака статья' },
    { title: 'Публикации врача', href: 'doctor.html', keywords: 'кулешов алексей гастроэнтеролог' },
    { title: 'Вакансии', href: 'vacancies.html', keywords: 'работа карьера' }
  ];

  const searchPanel = document.createElement('div');
  searchPanel.className = 'header-search-panel';
  searchPanel.id = 'header-search-panel';
  searchPanel.setAttribute('role', 'dialog');
  searchPanel.setAttribute('aria-modal', 'true');
  searchPanel.setAttribute('aria-label', 'Поиск по сайту');
  searchPanel.hidden = true;
  const mobileField = document.createElement('label');
  mobileField.className = 'header-search-field';
  const mobileIcon = document.createElement('img');
  mobileIcon.src = 'assets/field-search.svg';
  mobileIcon.alt = '';
  const mobileInput = document.createElement('input');
  mobileInput.type = 'search';
  mobileInput.placeholder = 'Что вас интересует?';
  mobileInput.setAttribute('aria-label', 'Поиск по сайту');
  mobileField.append(mobileInput, mobileIcon);
  const searchTitle = document.createElement('p');
  searchTitle.className = 'header-search-title';
  const searchResults = document.createElement('div');
  searchResults.className = 'header-search-results';
  searchPanel.append(mobileField, searchTitle, searchResults);
  document.body.append(searchPanel);

  const backdrop = document.createElement('div');
  backdrop.className = 'header-overlay-backdrop';
  backdrop.hidden = true;
  document.body.append(backdrop);
  const smallSearch = window.matchMedia('(max-width:800px)');
  const pageShell = document.querySelector('.site-shell');
  menuToggle.setAttribute('aria-controls', 'main-navigation');
  searchToggle.setAttribute('aria-controls', searchPanel.id);
  searchToggle.setAttribute('aria-expanded', 'false');

  const normalize = value => value.toLocaleLowerCase('ru').replaceAll('ё', 'е').trim();
  const renderSearch = () => {
    const query = normalize(mobileInput.value);
    const matches = query
      ? searchItems.filter(item => normalize(`${item.title} ${item.keywords}`).includes(query)).slice(0, 6)
      : searchItems.filter(item => item.popular);
    searchTitle.textContent = query ? 'Результаты поиска' : 'Популярные запросы';
    searchResults.replaceChildren();
    if (!matches.length) {
      const empty = document.createElement('p');
      empty.className = 'header-search-empty';
      empty.textContent = 'Ничего не найдено';
      searchResults.append(empty);
      return;
    }
    matches.forEach(item => {
      const link = document.createElement('a');
      link.href = item.href;
      link.textContent = item.title;
      searchResults.append(link);
    });
  };

  const syncBackdrop = () => {
    const open = navigation.classList.contains('is-open') || !searchPanel.hidden;
    backdrop.hidden = !open;
    document.body.classList.toggle('header-overlay-open', open);
    document.body.classList.toggle('header-search-open', !searchPanel.hidden);
    if (open) header.classList.remove('is-hidden');
  };
  const closeMenu = () => {
    navigation.classList.remove('is-open');
    header.classList.remove('has-open-menu');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Открыть меню');
    syncBackdrop();
  };
  const closeSearch = () => {
    searchPanel.hidden = true;
    if (pageShell) pageShell.inert = false;
    header.classList.remove('has-open-search');
    searchBox.classList.remove('is-open');
    searchToggle.setAttribute('aria-expanded', 'false');
    searchToggle.setAttribute('aria-label', 'Открыть поиск');
    syncBackdrop();
  };
  const openMenu = () => {
    closeSearch();
    navigation.classList.add('is-open');
    header.classList.add('has-open-menu');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Закрыть меню');
    syncBackdrop();
  };
  const openSearch = () => {
    if (!searchPanel.hidden) return;
    closeMenu();
    mobileInput.value = desktopInput.value;
    searchPanel.hidden = false;
    if (pageShell) pageShell.inert = true;
    header.classList.add('has-open-search');
    searchBox.classList.add('is-open');
    searchToggle.setAttribute('aria-expanded', 'true');
    searchToggle.setAttribute('aria-label', 'Закрыть поиск');
    renderSearch();
    syncBackdrop();
    mobileInput.focus();
  };

  menuToggle.addEventListener('click', () => {
    if (navigation.classList.contains('is-open')) closeMenu();
    else openMenu();
  });
  bookingButton.addEventListener('click', () => {
    closeMenu();
    menuToggle.focus({ preventScroll: true });
  });
  searchToggle.addEventListener('click', () => {
    if (searchPanel.hidden) openSearch();
    else closeSearch();
  });
  let suppressNextSearchFocus = false;
  const restoreSearchFocus = () => {
    if (smallSearch.matches) searchToggle.focus();
    else if (document.activeElement !== desktopInput) {
      suppressNextSearchFocus = true;
      desktopInput.focus();
    }
  };
  desktopInput.addEventListener('focus', () => {
    if (suppressNextSearchFocus) {
      suppressNextSearchFocus = false;
      return;
    }
    openSearch();
  });
  desktopInput.addEventListener('click', openSearch);
  desktopInput.addEventListener('input', () => {
    mobileInput.value = desktopInput.value;
    if (searchPanel.hidden) openSearch();
    else renderSearch();
  });
  mobileInput.addEventListener('input', () => {
    desktopInput.value = mobileInput.value;
    searchBox.classList.toggle('has-value', Boolean(mobileInput.value));
    const clear = searchBox.querySelector('.field-clear');
    if (clear) clear.hidden = !mobileInput.value;
    renderSearch();
  });
  [desktopInput, mobileInput].forEach(input => input.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      const first = searchResults.querySelector('a');
      if (first) window.location.href = first.href;
    } else if (event.key === 'ArrowDown') {
      const first = searchResults.querySelector('a');
      if (first) { event.preventDefault(); first.focus(); }
    }
  }));
  backdrop.addEventListener('click', () => {
    const hadSearchOpen = !searchPanel.hidden;
    closeMenu();
    closeSearch();
    if (hadSearchOpen) restoreSearchFocus();
  });
  header.querySelector('.logo')?.addEventListener('click', () => { closeMenu(); closeSearch(); });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (!searchPanel.hidden) {
      closeSearch();
      restoreSearchFocus();
    }
    else if (navigation.classList.contains('is-open')) { closeMenu(); menuToggle.focus(); }
  });
  smallSearch.addEventListener('change', () => {
    if (searchPanel.hidden) return;
    mobileInput.focus();
  });
  window.matchMedia('(max-width:1024px)').addEventListener('change', () => {
    closeMenu();
    closeSearch();
  });
  renderSearch();
})();

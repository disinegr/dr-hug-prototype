/* Shared input states. A .field-text wrapper uses the same value and clear behavior. */
document.querySelectorAll('.field-search, .field-text').forEach(field => {
  const input = field.querySelector('input');
  const clear = field.querySelector('.field-clear');
  if (!input || !clear) return;

  function sync() {
    const hasValue = input.value.length > 0;
    field.classList.toggle('has-value', hasValue);
    clear.hidden = !hasValue || input.disabled;
    const icon = field.querySelector('.field-leading');
    if (icon) icon.src = input.disabled ? 'assets/field-search-disabled.svg' : 'assets/field-search.svg';
  }

  input.addEventListener('input', sync);
  field.addEventListener('click', event => {
    if (!event.target.closest('.field-clear')) input.focus();
  });
  clear.addEventListener('click', () => {
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.focus();
  });
  sync();
});

document.querySelectorAll('.field-select').forEach(field => {
  const select = field.querySelector('select');
  const clear = field.querySelector('.field-clear');
  const chevron = field.querySelector('.field-chevron');
  if (!select || !clear) return;

  const label = select.getAttribute('aria-label') || field.querySelector('label')?.textContent?.trim() || 'Выберите значение';
  const placeholder = select.options[0]?.textContent?.trim() || label;
  const choices = [...select.options].filter(option => option.value !== '' && !option.disabled);
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.id = `${select.id}-trigger`;
  trigger.className = 'field-select-trigger';
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');
  const menu = document.createElement('div');
  menu.id = `${select.id}-menu`;
  menu.className = 'field-select-menu';
  menu.setAttribute('role', 'listbox');
  menu.setAttribute('aria-label', label);
  menu.hidden = true;
  trigger.setAttribute('aria-controls', menu.id);
  const optionButtons = choices.map(option => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'field-select-option';
    button.setAttribute('role', 'option');
    button.setAttribute('aria-selected', 'false');
    button.tabIndex = -1;
    button.dataset.value = option.value;
    button.textContent = option.textContent;
    button.addEventListener('click', () => {
      select.value = option.value;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      closeMenu();
      trigger.focus();
    });
    menu.append(button);
    return button;
  });

  select.hidden = true;
  select.tabIndex = -1;
  select.setAttribute('aria-hidden', 'true');
  field.insertBefore(trigger, clear);
  field.append(menu);

  function closeMenu() {
    menu.hidden = true;
    field.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    typeahead = '';
    clearTimeout(typeaheadTimer);
  }

  function openMenu(focusIndex) {
    if (select.disabled || !optionButtons.length) return;
    document.querySelectorAll('.field-select.is-open').forEach(other => {
      if (other !== field) other.querySelector('.field-select-trigger')?.click();
    });
    menu.hidden = false;
    field.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    field.classList.remove('opens-up');
    const spaceBelow = window.innerHeight - field.getBoundingClientRect().bottom - 12;
    const spaceAbove = field.getBoundingClientRect().top - 12;
    const opensUp = spaceBelow < Math.min(menu.scrollHeight, 240) && spaceAbove > spaceBelow;
    field.classList.toggle('opens-up', opensUp);
    menu.style.maxHeight = `${Math.max(96, Math.min(320, (opensUp ? spaceAbove : spaceBelow) - 8))}px`;
    if (focusIndex !== undefined) optionButtons[focusIndex]?.focus();
  }

  let typeahead = '';
  let typeaheadTimer;
  function focusMatchingOption(character) {
    clearTimeout(typeaheadTimer);
    typeahead += character.toLocaleLowerCase('ru');
    typeaheadTimer = setTimeout(() => { typeahead = ''; }, 600);
    const index = choices.findIndex(option => option.textContent.trim().toLocaleLowerCase('ru').startsWith(typeahead));
    if (index >= 0) optionButtons[index].focus();
  }

  trigger.addEventListener('click', () => {
    if (menu.hidden) openMenu();
    else closeMenu();
  });
  trigger.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const current = choices.findIndex(option => option.value === select.value);
      openMenu(current < 0 ? 0 : current);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      openMenu(event.key === 'Home' ? 0 : optionButtons.length - 1);
    } else if (event.key === 'Escape') closeMenu();
    else if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey && event.key.trim()) {
      openMenu();
      focusMatchingOption(event.key);
    }
  });
  menu.addEventListener('keydown', event => {
    const current = optionButtons.indexOf(document.activeElement);
    let next = current;
    if (event.key === 'ArrowDown') next = (current + 1) % optionButtons.length;
    else if (event.key === 'ArrowUp') next = (current - 1 + optionButtons.length) % optionButtons.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = optionButtons.length - 1;
    else if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
      trigger.focus();
      return;
    } else if (event.key === 'Tab') {
      closeMenu();
      return;
    } else if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey && event.key.trim()) {
      focusMatchingOption(event.key);
      return;
    } else return;
    event.preventDefault();
    optionButtons[next].focus();
  });
  document.addEventListener('pointerdown', event => {
    if (!field.contains(event.target)) closeMenu();
  });
  field.addEventListener('focusout', () => {
    requestAnimationFrame(() => {
      if (!field.contains(document.activeElement)) closeMenu();
    });
  });

  function sync() {
    const hasValue = select.value !== '';
    field.classList.toggle('has-value', hasValue);
    clear.hidden = !hasValue || select.disabled;
    if (chevron) chevron.src = select.disabled ? 'assets/field-chevron-disabled.svg' : 'assets/field-chevron.svg';
    trigger.disabled = select.disabled;
    const selected = select.selectedOptions[0]?.textContent?.trim() || placeholder;
    trigger.textContent = hasValue ? selected : placeholder;
    trigger.setAttribute('aria-label', `${label}: ${trigger.textContent}`);
    optionButtons.forEach(button => button.setAttribute('aria-selected', String(button.dataset.value === select.value)));
    if (select.disabled) closeMenu();
  }

  select.addEventListener('change', sync);
  clear.addEventListener('click', () => {
    select.value = '';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    closeMenu();
    trigger.focus();
  });
  sync();
});

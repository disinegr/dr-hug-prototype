(() => {
  const anchor = document.querySelector('.quick-actions');
  const launcher = anchor?.querySelector('.chat-launcher');
  if (!launcher) return;

  const headerPhone = document.querySelector('.site-header .phone-action');
  if (headerPhone) {
    const chatPhone = document.createElement('button');
    chatPhone.className = 'header-icon header-chat-phone';
    chatPhone.type = 'button';
    chatPhone.dataset.chatOpen = '';
    chatPhone.setAttribute('aria-label', 'Открыть чат Dr.Hug');
    chatPhone.setAttribute('aria-controls', 'dr-hug-chat');
    const icon = document.createElement('img');
    icon.src = 'assets/tabler-phone.svg';
    icon.alt = '';
    chatPhone.append(icon);
    headerPhone.replaceWith(chatPhone);
  }

  const phone = 'tel:+74997282888';
  anchor.classList.add('chat-widget-anchor');
  const overlay = document.createElement('div');
  overlay.className = 'chat-overlay';
  overlay.hidden = true;
  overlay.innerHTML = `
    <section class="chat-panel" id="dr-hug-chat" role="dialog" aria-modal="true" aria-labelledby="chat-title" aria-describedby="chat-subtitle">
      <header class="chat-header">
        <button class="chat-mobile-back" type="button" aria-label="Закрыть чат и вернуться на страницу">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 5-7 7 7 7M7 12h13"/></svg>
        </button>
        <div class="chat-brand" id="chat-title" tabindex="-1">
          <span class="chat-brand-logo"><img src="assets/logo-mark.png" alt=""></span>
          <span class="chat-brand-text"><strong>Dr.Hug</strong><span id="chat-subtitle">Цифровой помощник на связи</span></span>
        </div>
        <button class="chat-expand" type="button" aria-label="Развернуть чат" aria-pressed="false">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 4l4 0l0 4"/><path d="M14 10l6 -6"/><path d="M8 20l-4 0l0 -4"/><path d="M4 20l6 -6"/><path d="M16 20l4 0l0 -4"/><path d="M14 14l6 6"/><path d="M8 4l-4 0l0 4"/><path d="M4 4l6 6"/></svg>
        </button>
      </header>
      <div class="chat-welcome">
        <img class="chat-welcome-illustration" src="assets/chat-welcome.png" alt="">
        <h2>Добро пожаловать в чат!</h2>
        <p>Задайте вопрос здесь или свяжитесь<br class="chat-desktop-break"> с нами прямо по телефону</p>
        <a class="chat-call-cta" href="${phone}">Позвонить по телефону</a>
      </div>
      <div class="chat-conversation" hidden>
        <div class="chat-call-hint"><span>Удобнее поговорить?<br>Позвоните нам, мы на связи 24/7.</span><a href="${phone}">Позвонить</a></div>
        <div class="chat-feed" role="log" aria-label="Сообщения чата" aria-live="polite" aria-relevant="additions"></div>
      </div>
      <form class="chat-composer">
        <div class="chat-message-field field">
          <textarea class="chat-message-input" aria-label="Сообщение для помощника Dr.Hug" rows="1" maxlength="1000" placeholder="Напишите сообщение"></textarea>
          <button class="chat-send" type="submit" aria-label="Отправить сообщение" hidden><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 12 16-8-4 16-4-6-8-2ZM12 14l8-10"/></svg></button>
        </div>
      </form>
    </section>`;
  document.body.append(overlay);

  const panel = overlay.querySelector('.chat-panel');
  const brand = overlay.querySelector('.chat-brand');
  const backButton = overlay.querySelector('.chat-mobile-back');
  const expandButton = overlay.querySelector('.chat-expand');
  const launcherIcon = launcher.querySelector('img');
  const welcome = overlay.querySelector('.chat-welcome');
  const conversation = overlay.querySelector('.chat-conversation');
  const feed = overlay.querySelector('.chat-feed');
  const form = overlay.querySelector('.chat-composer');
  const input = overlay.querySelector('.chat-message-input');
  const sendButton = overlay.querySelector('.chat-send');
  const topics = document.createElement('div');
  topics.className = 'chat-topics';
  topics.setAttribute('aria-label', 'Быстрые вопросы');
  const topicLabels = { booking: 'Записаться на приём', prices: 'Узнать стоимость', addresses: 'Адреса клиник', other: 'Другой вопрос' };
  let returnFocus = launcher;
  let conversationMode = null;
  let closeTimer = 0;
  let openFrame = 0;
  let revealFrame = 0;
  const expandIcon = expandButton.innerHTML;
  const collapseIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9l4 0l0 -4"/><path d="M3 3l6 6"/><path d="M5 15l4 0l0 4"/><path d="M3 21l6 -6"/><path d="M19 9l-4 0l0 -4"/><path d="M15 9l6 -6"/><path d="M19 15l-4 0l0 4"/><path d="M15 15l6 6"/></svg>';

  function setLauncherOpen(open) {
    launcher.setAttribute('aria-expanded', String(open));
    launcher.setAttribute('aria-label', open ? 'Закрыть чат Dr.Hug' : 'Открыть чат Dr.Hug');
    launcher.title = open ? 'Закрыть чат Dr.Hug' : 'Чат Dr.Hug';
    if (launcherIcon) launcherIcon.src = open ? 'assets/chat-collapse.svg' : 'assets/chat-assistant.svg';
  }

  function syncFocusedViewport() {
    if (overlay.hidden || window.innerWidth > 767 || document.activeElement !== input || !window.visualViewport) {
      overlay.style.removeProperty('top');
      overlay.style.removeProperty('bottom');
      overlay.style.removeProperty('height');
      return;
    }
    overlay.style.top = `${window.visualViewport.offsetTop}px`;
    overlay.style.bottom = 'auto';
    overlay.style.height = `${window.visualViewport.height}px`;
  }

  function lockPage() {
    const scrollbarGap = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
    document.body.style.setProperty('--chat-scrollbar-gap', `${scrollbarGap}px`);
    document.documentElement.classList.add('chat-open');
    document.body.classList.add('chat-open');
  }

  function unlockPage() {
    document.documentElement.classList.remove('chat-open');
    document.body.classList.remove('chat-open');
    document.body.style.removeProperty('--chat-scrollbar-gap');
  }

  function addMessage(kind, message, links = []) {
    const row = document.createElement('div');
    row.className = `chat-message is-${kind}`;
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.textContent = message;
    if (kind === 'assistant') {
      const bubbleLine = document.createElement('div');
      bubbleLine.className = 'chat-bubble-line';
      const avatar = document.createElement('span');
      avatar.className = 'chat-bot-avatar';
      avatar.setAttribute('aria-hidden', 'true');
      const avatarImage = document.createElement('img');
      avatarImage.src = 'assets/logo-mark.png';
      avatarImage.alt = '';
      avatar.append(avatarImage);
      bubbleLine.append(avatar, bubble);
      row.append(bubbleLine);
    } else row.append(bubble);
    const meta = document.createElement('div');
    meta.className = 'chat-message-meta';
    if (kind === 'assistant') {
      const speaker = document.createElement('span');
      speaker.className = 'chat-speaker';
      speaker.textContent = 'Цифровой помощник Dr.Hug';
      meta.append(speaker);
    }
    const sentAt = new Date();
    const time = document.createElement('time');
    time.dateTime = sentAt.toISOString();
    time.textContent = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' }).format(sentAt);
    meta.append(time);
    row.append(meta);
    if (links.length) {
      const actions = document.createElement('div');
      actions.className = 'chat-reply-links';
      links.forEach(({ label, href, external }) => {
        const link = document.createElement('a');
        link.className = 'chat-reply-link';
        link.href = href;
        link.textContent = label;
        if (external) {
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        }
        actions.append(link);
      });
      row.append(actions);
    }
    feed.append(row);
    feed.scrollTop = feed.scrollHeight;
  }

  function showTopics() {
    topics.replaceChildren();
    Object.entries(topicLabels).forEach(([topic, label]) => {
      const button = document.createElement('button');
      button.className = 'chat-topic';
      button.type = 'button';
      button.dataset.chatTopic = topic;
      button.textContent = label;
      topics.append(button);
    });
    feed.append(topics);
    feed.scrollTop = feed.scrollHeight;
  }

  function startConversation(mode = 'general') {
    if (conversationMode) return;
    conversationMode = mode;
    welcome.hidden = true;
    conversation.hidden = false;
    feed.replaceChildren();
    if (mode === 'booking') {
      addMessage('assistant', 'Здравствуйте! Я цифровой помощник Dr.Hug. Помогу с записью на приём — выберите вопрос или напишите, что нужно вашему питомцу.');
      showTopics();
    }
  }

  function answerTopic(topic) {
    if (!topicLabels[topic]) return;
    topics.remove();
    addMessage('user', topicLabels[topic]);
    if (topic === 'booking') {
      addMessage('assistant', 'Запись через чат пока не подключена. Администратор поможет подобрать время по телефону.');
    } else if (topic === 'prices') {
      addMessage('assistant', 'Актуальную стоимость можно посмотреть на странице цен.', [{ label: 'Посмотреть цены', href: 'prices.html' }]);
    } else if (topic === 'addresses') {
      addMessage('assistant', 'У нас две клиники в Москве. Выберите адрес, чтобы открыть его на Яндекс Картах.', [
        { label: 'Хорошёвское шоссе, 38Д стр. 3', href: 'https://yandex.ru/profile/-/CXBbeXLl', external: true },
        { label: 'Малая Филёвская, 12 корп. 1', href: 'https://yandex.ru/maps/-/CXBbmQYQ', external: true }
      ]);
    } else {
      addMessage('assistant', 'Напишите ваш вопрос в поле ниже. Сейчас чат работает в демонстрационном режиме; для ответа сотрудника позвоните нам.');
      input.focus();
    }
    showTopics();
  }

  function answerMessage(message) {
    const normalized = message.toLocaleLowerCase('ru');
    if (/запис|при[её]м|врач/.test(normalized)) {
      addMessage('assistant', 'Помогу с записью. Пока онлайн-запись через чат не подключена, позвоните в клинику — администратор подберёт время.');
    } else if (/цен|стоим|сколько/.test(normalized)) {
      addMessage('assistant', 'Цены на услуги собраны на отдельной странице.', [{ label: 'Посмотреть цены', href: 'prices.html' }]);
    } else if (/адрес|где|карт|доехать/.test(normalized)) {
      addMessage('assistant', 'Наши адреса в Москве можно открыть на Яндекс Картах.', [
        { label: 'Хорошёвское шоссе', href: 'https://yandex.ru/profile/-/CXBbeXLl', external: true },
        { label: 'Малая Филёвская', href: 'https://yandex.ru/maps/-/CXBbmQYQ', external: true }
      ]);
    } else {
      addMessage('assistant', 'Пока я могу подсказать по записи, ценам и адресам. Чат работает в демонстрационном режиме: сообщение не передаётся в клинику. Для ответа сотрудника позвоните нам.');
    }
    showTopics();
  }

  function updateComposer() {
    sendButton.hidden = !input.value.trim();
    input.closest('.chat-message-field').classList.toggle('has-value', Boolean(input.value));
    input.style.height = 'auto';
    const maxHeight = Math.max(44, Math.floor((panel.clientHeight || window.innerHeight) * .42));
    input.style.height = `${Math.max(44, Math.min(input.scrollHeight, maxHeight))}px`;
  }

  function resetChat() {
    conversationMode = null;
    panel.classList.remove('is-expanded');
    expandButton.setAttribute('aria-pressed', 'false');
    expandButton.setAttribute('aria-label', 'Развернуть чат');
    expandButton.innerHTML = expandIcon;
    welcome.hidden = false;
    conversation.hidden = true;
    feed.replaceChildren();
    input.value = '';
    updateComposer();
  }

  function openChat(mode) {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = 0;
    }
    if (overlay.hidden) {
      returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : launcher;
      resetChat();
      lockPage();
      overlay.hidden = false;
      void overlay.offsetWidth;
      openFrame = requestAnimationFrame(() => {
        openFrame = 0;
        revealFrame = requestAnimationFrame(() => {
          revealFrame = 0;
          overlay.classList.add('is-open');
        });
      });
      brand.focus({ preventScroll: true });
    } else overlay.classList.add('is-open');
    setLauncherOpen(true);
    if (mode === 'booking') startConversation('booking');
  }

  function closeChat() {
    if (overlay.hidden || closeTimer) return;
    cancelAnimationFrame(openFrame);
    cancelAnimationFrame(revealFrame);
    openFrame = 0;
    revealFrame = 0;
    overlay.classList.remove('is-open');
    setLauncherOpen(false);
    const finish = () => {
      overlay.hidden = true;
      closeTimer = 0;
      syncFocusedViewport();
      unlockPage();
      (returnFocus?.isConnected ? returnFocus : launcher).focus({ preventScroll: true });
    };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) finish();
    else closeTimer = window.setTimeout(finish, 420);
  }

  launcher.addEventListener('click', () => overlay.hidden || closeTimer ? openChat() : closeChat());
  backButton.addEventListener('click', closeChat);
  expandButton.addEventListener('click', () => {
    const expanded = panel.classList.toggle('is-expanded');
    expandButton.setAttribute('aria-pressed', String(expanded));
    expandButton.setAttribute('aria-label', expanded ? 'Свернуть чат' : 'Развернуть чат');
    expandButton.innerHTML = expanded ? collapseIcon : expandIcon;
    updateComposer();
  });
  overlay.addEventListener('click', event => {
    if (event.target === overlay) closeChat();
    const topicButton = event.target.closest?.('[data-chat-topic]');
    if (topicButton) answerTopic(topicButton.dataset.chatTopic);
  });
  input.addEventListener('input', updateComposer);
  input.addEventListener('focus', syncFocusedViewport);
  input.addEventListener('blur', () => requestAnimationFrame(syncFocusedViewport));
  window.addEventListener('resize', () => { syncFocusedViewport(); updateComposer(); });
  window.visualViewport?.addEventListener('resize', () => { syncFocusedViewport(); updateComposer(); });
  window.visualViewport?.addEventListener('scroll', syncFocusedViewport);
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      form.requestSubmit();
    }
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const message = input.value.trim();
    if (!message) return;
    if (!conversationMode) startConversation();
    topics.remove();
    addMessage('user', message);
    input.value = '';
    updateComposer();
    answerMessage(message);
  });
  document.addEventListener('keydown', event => {
    if (overlay.hidden) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeChat();
    } else if (event.key === 'Tab') {
      const focusable = [...overlay.querySelectorAll('a[href], button:not([disabled]):not([hidden]), textarea')]
        .filter(element => element.getClientRects().length > 0 && !element.closest('[hidden]') && getComputedStyle(element).visibility !== 'hidden');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!event.shiftKey && document.activeElement === brand) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && (document.activeElement === first || document.activeElement === brand)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  document.addEventListener('click', event => {
    const chatTrigger = event.target.closest?.('[data-chat-open]');
    if (chatTrigger) {
      openChat(chatTrigger.dataset.chatTopic === 'booking' ? 'booking' : undefined);
      return;
    }
    const link = event.target.closest?.('a[href^="tel:"]');
    if (!link || link.closest('.chat-panel')) return;
    const label = `${link.textContent || ''} ${link.getAttribute('aria-label') || ''}`.trim();
    if (!/запис|связаться с нами/i.test(label)) return;
    event.preventDefault();
    openChat(/запис/i.test(label) ? 'booking' : undefined);
  });
})();

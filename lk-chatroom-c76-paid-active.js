(() => {
  const page = document.querySelector('.c76-paid');
  if (!page) return;

  const live = page.querySelector('[data-c76-live-status]');
  const composer = page.querySelector('[data-composer-input]');
  const send = page.querySelector('[data-semantic-control="send-message"]');
  const overlays = new Map(Array.from(page.querySelectorAll('[data-overlay]')).map((element) => [element.dataset.overlay, element]));
  const openOrder = [];
  const triggerForOverlay = new Map();

  const announce = (message) => {
    if (!live) return;
    live.textContent = '';
    window.requestAnimationFrame(() => { live.textContent = message; });
  };

  const triggersFor = (name) => Array.from(page.querySelectorAll(`[data-overlay-trigger="${name}"]`));
  const setExpanded = (name, trigger, expanded) => {
    triggersFor(name).forEach((candidate) => candidate.setAttribute('aria-expanded', candidate === trigger && expanded ? 'true' : 'false'));
  };

  const closeOverlay = (name, { restoreFocus = true } = {}) => {
    const overlay = overlays.get(name);
    if (!overlay || overlay.hidden) return false;
    overlay.hidden = true;
    const trigger = triggerForOverlay.get(name);
    setExpanded(name, trigger, false);
    triggerForOverlay.delete(name);
    const index = openOrder.lastIndexOf(name);
    if (index >= 0) openOrder.splice(index, 1);
    if (restoreFocus && trigger instanceof HTMLElement) trigger.focus({ preventScroll: true });
    return true;
  };

  const closeAll = () => {
    const names = [...openOrder].reverse();
    names.forEach((name, index) => closeOverlay(name, { restoreFocus: index === 0 }));
  };

  const openOverlay = (name, trigger, { focusFirst = true } = {}) => {
    const overlay = overlays.get(name);
    if (!overlay) return;
    overlay.hidden = false;
    triggerForOverlay.set(name, trigger);
    const existing = openOrder.indexOf(name);
    if (existing >= 0) openOrder.splice(existing, 1);
    openOrder.push(name);
    setExpanded(name, trigger, true);
    if (focusFirst) {
      const first = overlay.querySelector('button:not([disabled])');
      if (first instanceof HTMLElement) first.focus({ preventScroll: true });
    }
  };

  const toggleOverlay = (name, trigger) => {
    const overlay = overlays.get(name);
    if (!overlay) return;
    if (!overlay.hidden) {
      triggerForOverlay.set(name, trigger);
      closeOverlay(name);
      announce(`${name} closed.`);
      return;
    }
    openOverlay(name, trigger, { focusFirst: name !== 'emoji-picker' });
    announce(`${name} opened.`);
  };

  page.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-overlay-trigger]');
    if (trigger && page.contains(trigger)) {
      event.preventDefault();
      toggleOverlay(trigger.dataset.overlayTrigger, trigger);
      return;
    }

    const reaction = event.target.closest('[data-reaction]');
    if (reaction && page.contains(reaction)) {
      event.preventDefault();
      announce(`Reaction ${reaction.dataset.reaction} selected locally. No message data was changed.`);
      closeOverlay('emoji-picker');
      return;
    }

    const safeIntent = event.target.closest('[data-safe-intent]');
    if (safeIntent && page.contains(safeIntent)) {
      event.preventDefault();
      announce(`${safeIntent.dataset.safeIntent} is a frontend-only intent in this source fixture.`);
      const containingOverlay = safeIntent.closest('[data-overlay]');
      if (containingOverlay) closeOverlay(containingOverlay.dataset.overlay);
      return;
    }

    const endChat = event.target.closest('[data-action="end-chat-intent"]');
    if (endChat && page.contains(endChat)) {
      event.preventDefault();
      composer?.focus({ preventScroll: true });
      announce('End chat is a frontend-only intent. No paid session or timer was changed.');
      return;
    }

    const conversation = event.target.closest('[data-conversation-row]');
    if (conversation && page.contains(conversation)) {
      if (conversation.getAttribute('aria-disabled') === 'true') {
        event.preventDefault();
        announce('This conversation is disabled.');
        return;
      }
      closeAll();
      announce(`Conversation navigation intent for ${conversation.dataset.conversationName}. Paid-active source remains bound to Miss Shaya.`);
      return;
    }

    if (openOrder.length && !event.target.closest('[data-overlay]')) closeOverlay(openOrder[openOrder.length - 1]);
  });

  page.addEventListener('keydown', (event) => {
    const conversation = event.target.closest('[data-conversation-row]');
    if (conversation && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      conversation.click();
      return;
    }
    if (event.key === 'Escape' && openOrder.length) {
      event.preventDefault();
      closeOverlay(openOrder[openOrder.length - 1]);
      announce('Overlay closed.');
    }
  });

  const createSendIntent = () => {
    if (!composer) return;
    if (!composer.value.trim()) {
      announce('Message is empty.');
      composer.focus({ preventScroll: true });
      return;
    }
    announce('Local send intent recorded. No message was sent or persisted.');
    composer.focus({ preventScroll: true });
  };

  send?.addEventListener('click', (event) => {
    event.preventDefault();
    createSendIntent();
  });
  composer?.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' || event.isComposing || event.shiftKey) return;
    event.preventDefault();
    createSendIntent();
  });

  page.querySelectorAll('[data-control="favorite"], [data-control="search"]').forEach((control) => {
    control.addEventListener('click', () => {
      if (control.hasAttribute('aria-pressed')) {
        const pressed = control.getAttribute('aria-pressed') === 'true';
        control.setAttribute('aria-pressed', String(!pressed));
      }
      announce(`${control.dataset.control} is a local visual control.`);
    });
  });

  overlays.forEach((overlay, name) => {
    if (overlay.hidden) return;
    const trigger = page.querySelector(`[data-overlay-trigger="${name}"][aria-expanded="true"]`) || page.querySelector(`[data-overlay-trigger="${name}"]`);
    if (trigger) triggerForOverlay.set(name, trigger);
    openOrder.push(name);
  });

  const requested = new URLSearchParams(window.location.search).get('overlay');
  if (requested === 'menu') {
    const trigger = page.querySelector('[data-overlay-trigger="thread-menu"]');
    if (trigger) openOverlay('thread-menu', trigger);
  } else if (requested === 'message_menu') {
    const trigger = page.querySelector('[data-overlay-trigger="message-menu"]');
    if (trigger) openOverlay('message-menu', trigger);
  } else if (requested === 'emoji') {
    const trigger = page.querySelector('[data-overlay-trigger="emoji-picker"]');
    if (trigger) openOverlay('emoji-picker', trigger, { focusFirst: false });
  }
})();

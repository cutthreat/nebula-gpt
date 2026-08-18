(() => {
  const page = document.querySelector(".c76-page");
  const workspace = document.querySelector(".c76-workspace");
  const rows = Array.from(document.querySelectorAll("[data-conversation-row]"));
  const title = document.querySelector(".c76-chat-identity h1");
  const favoriteAction = document.querySelector('[data-control="favorite"]');
  const backButton = document.querySelector('[data-action="back-to-list"]');
  const input = document.querySelector("[data-composer-input]");
  const inputbar = document.querySelector(".c76-inputbar");
  const iconStrip = document.querySelector(".c76-inputbar__icons");
  const send = document.querySelector('[data-semantic-control="send-message"]');
  const live = document.querySelector("[data-c76-live-status]");
  const frame = document.querySelector(".c76-frame");
  const presence = document.querySelector("[data-chat-presence]");
  const rate = document.querySelector("[data-chat-rate]");
  const endChat = document.querySelector('[data-paid-action="end-chat"]');
  const readyCard = document.querySelector(".c76-ready-card");
  const overlays = Array.from(document.querySelectorAll("[data-paid-overlay]"));
  const chips = Array.from(document.querySelectorAll(".c76-suggestion-chip"));
  const navButtons = Array.from(document.querySelectorAll("[data-suggestion-nav]"));
  const placeholderControls = Array.from(document.querySelectorAll("[data-control]"));
  let selectedRow = document.querySelector("[data-conversation-row].is-active") || rows[0];
  const responsiveQuery = window.matchMedia("(min-width: 320px) and (max-width: 991.98px)");
  const requestedState = new URLSearchParams(window.location.search).get("state");
  const initialState = requestedState === "paid_active" ? "paid_active" : "selected_empty";
  let lastOverlayTrigger = null;

  function announce(text) {
    if (live) live.textContent = text;
  }

  function closePaidOverlays(options = {}) {
    overlays.forEach((overlay) => {
      overlay.hidden = true;
      overlay.setAttribute("aria-hidden", "true");
    });
    page?.removeAttribute("data-paid-overlay");
    if (options.restoreFocus && lastOverlayTrigger && typeof lastOverlayTrigger.focus === "function") lastOverlayTrigger.focus();
    lastOverlayTrigger = null;
  }

  function openPaidOverlay(name, trigger = null) {
    if (page?.dataset.c76State !== "paid_active") return;
    lastOverlayTrigger = trigger;
    overlays.forEach((overlay) => {
      const active = overlay.dataset.paidOverlay === name;
      overlay.hidden = !active;
      overlay.setAttribute("aria-hidden", active ? "false" : "true");
    });
    page?.setAttribute("data-paid-overlay", name);
    const target = overlays.find((overlay) => overlay.dataset.paidOverlay === name)?.querySelector("[data-paid-overlay-item]");
    if (target && typeof target.focus === "function") target.focus();
  }

  function setC76State(nextState) {
    const paidActive = nextState === "paid_active";
    page?.setAttribute("data-c76-state", paidActive ? "paid_active" : "selected_empty");
    frame?.setAttribute("data-c76-state", paidActive ? "paid_active" : "selected_empty");
    if (page) page.setAttribute("aria-label", paidActive ? "LK Chatroom C76 paid active state" : "LK Chatroom C76 default state");
    if (frame) frame.setAttribute("aria-label", paidActive ? "Chatroom workspace paid active state" : "Chatroom workspace default state");
    if (presence) presence.textContent = paidActive ? "Online" : "Offline";
    if (rate) rate.dataset.state = paidActive ? "paid_active" : "selected_empty";
    if (endChat) {
      endChat.hidden = !paidActive;
      endChat.setAttribute("aria-hidden", paidActive ? "false" : "true");
      endChat.tabIndex = paidActive ? 0 : -1;
    }
    if (readyCard) {
      readyCard.hidden = paidActive;
      if (paidActive) readyCard.setAttribute("aria-hidden", "true");
      else readyCard.removeAttribute("aria-hidden");
    }
    closePaidOverlays();
    updateComposer();
  }

  function setSelectedRow(row) {
    if (!row || row.getAttribute("aria-disabled") === "true") return;
    closePaidOverlays();
    rows.forEach((item) => {
      const active = item === row;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", active ? "true" : "false");
    });
    selectedRow = row;
    const name = row.dataset.conversationName || row.querySelector("b")?.textContent?.trim() || "Conversation";
    if (title) title.textContent = name;
    if (favoriteAction) favoriteAction.setAttribute("aria-label", `Favorite ${name}`);
    if (workspace?.classList.contains("is-list-view") && responsiveQuery.matches) {
      setResponsiveView("thread", { focusThread: true });
    }
    announce(`${name} selected`);
  }

  function setResponsiveView(view, options = {}) {
    if (!workspace || !backButton) return;
    const listView = view === "list";
    workspace.classList.toggle("is-list-view", listView);
    page?.setAttribute("data-responsive-view", listView ? "conversation_list" : "thread");
    backButton.hidden = !responsiveQuery.matches || listView;
    backButton.tabIndex = responsiveQuery.matches && !listView ? 0 : -1;
    if (listView) {
      selectedRow?.focus();
      announce("Conversation list shown");
    } else if (options.focusThread) {
      backButton.focus();
      announce(`${selectedRow?.dataset.conversationName || "Conversation"} opened`);
    }
  }

  function syncResponsiveBack() {
    if (!responsiveQuery.matches) {
      workspace?.classList.remove("is-list-view");
      page?.removeAttribute("data-responsive-view");
    }
    setResponsiveView(workspace?.classList.contains("is-list-view") ? "list" : "thread");
  }

  backButton?.addEventListener("click", () => setResponsiveView("list"));
  responsiveQuery.addEventListener?.("change", syncResponsiveBack);
  syncResponsiveBack();

  rows.forEach((row) => {
    row.addEventListener("click", () => setSelectedRow(row));
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setSelectedRow(row);
      }
    });
  });

  function updateComposer() {
    if (!input || !send || !iconStrip || !inputbar) return;
    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight, 88)}px`;
    const hasText = input.value.trim().length > 0;
    const multiline = input.value.includes("\n") || input.scrollHeight > 43;
    send.disabled = !hasText;
    const emptyState = page?.dataset.c76State === "paid_active" ? "empty_active" : "empty_unactive";
    iconStrip.dataset.composerState = hasText ? (multiline ? "multiline" : "text_ready") : emptyState;
    inputbar.classList.toggle("is-multiline", multiline);
    page?.setAttribute("data-composer-state", iconStrip.dataset.composerState);
  }

  function markSendIntent() {
    if (!input || send.disabled) return;
    page?.setAttribute("data-last-action", "send-intent-backend-blocked");
    announce("Send action is ready, but backend delivery is outside this static layout.");
    input.focus();
  }

  input?.addEventListener("input", updateComposer);
  input?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      markSendIntent();
    }
  });
  send?.addEventListener("click", markSendIntent);
  updateComposer();

  function fillComposerFromSuggestion(chip) {
    if (!input || !chip) return;
    input.value = chip.textContent.trim();
    updateComposer();
    input.focus();
    page?.setAttribute("data-last-action", "suggestion-filled-composer");
    announce("Suggestion copied to composer for editing.");
  }

  function selectSuggestion(index, activate = false) {
    const next = ((index % chips.length) + chips.length) % chips.length;
    chips.forEach((chip, i) => {
      const selected = i === next;
      chip.classList.toggle("is-selected", selected);
      chip.setAttribute("aria-selected", selected ? "true" : "false");
      chip.tabIndex = selected ? 0 : -1;
    });
    if (activate) {
      fillComposerFromSuggestion(chips[next]);
    } else {
      chips[next]?.focus();
      announce(`Suggestion ${next + 1} selected`);
    }
  }

  chips.forEach((chip, index) => {
    chip.tabIndex = index === 0 ? 0 : -1;
    chip.addEventListener("click", () => selectSuggestion(index, true));
    chip.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        selectSuggestion(index + 1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        selectSuggestion(index - 1);
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectSuggestion(index, true);
      }
    });
  });
  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const current = chips.findIndex((chip) => chip.classList.contains("is-selected"));
      selectSuggestion(current + (button.dataset.suggestionNav === "next" ? 1 : -1));
    });
  });

  placeholderControls.forEach((control) => {
    control.addEventListener("click", () => {
      if (page?.dataset.c76State === "paid_active" && control.dataset.control === "menu") {
        openPaidOverlay("message-menu", control);
        page?.setAttribute("data-last-control", "paid-message-menu");
        announce("Message actions opened locally.");
        return;
      }
      if (page?.dataset.c76State === "paid_active" && control.dataset.control === "emoji") {
        openPaidOverlay("emoji-picker", control);
        page?.setAttribute("data-last-control", "paid-emoji-picker");
        announce("Emoji picker opened locally.");
        return;
      }
      if (control.getAttribute("aria-disabled") === "true") {
        announce(`${control.getAttribute("aria-label")} is not available in this static layout.`);
        return;
      }
      const pressed = control.getAttribute("aria-pressed");
      if (pressed !== null) {
        control.setAttribute("aria-pressed", pressed === "true" ? "false" : "true");
      }
      page?.setAttribute("data-last-control", control.dataset.control || "unknown");
      announce(`${control.getAttribute("aria-label")} control activated locally.`);
    });
  });

  endChat?.addEventListener("click", () => {
    page?.setAttribute("data-last-action", "end-chat-intent-backend-blocked");
    announce("End chat intent is ready, but session closure is outside this static layout.");
  });

  overlays.forEach((overlay) => {
    overlay.querySelectorAll("[data-paid-overlay-item]").forEach((item) => {
      item.addEventListener("click", () => {
        page?.setAttribute("data-last-overlay-action", item.dataset.paidOverlayItem || "unknown");
        announce(`${item.textContent.trim() || "Overlay"} intent activated locally.`);
        closePaidOverlays({ restoreFocus: true });
      });
    });
  });

  document.addEventListener("click", (event) => {
    if (!page || !page.dataset.paidOverlay) return;
    const target = event.target;
    if (target instanceof Element && !target.closest("[data-paid-overlay], [data-control=menu], [data-control=emoji]")) {
      closePaidOverlays({ restoreFocus: true });
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const overlayWasOpen = Boolean(page?.dataset.paidOverlay);
      closePaidOverlays({ restoreFocus: true });
      page?.removeAttribute("data-last-control");
      page?.removeAttribute("data-last-action");
      announce("Transient local controls cleared.");
      if (!overlayWasOpen) selectedRow?.focus();
    }
  });

  setC76State(initialState);

  window.__lkChatroomC76State = {
    get selectedConversation() { return selectedRow?.dataset.conversationName || ""; },
    get composerState() { return iconStrip?.dataset.composerState || ""; },
     get responsiveView() { return page?.getAttribute("data-responsive-view") || "desktop"; },
     get c76State() { return page?.dataset.c76State || "selected_empty"; },
    graph: {
       supported: ["select_conversation", "enter_message_text", "shift_enter_multiline", "suggestion_fill_composer", "responsive_back_to_list_320_576_768", "non_destructive_placeholder_controls", "paid_active_local_state", "paid_end_chat_intent", "paid_overlay_open_close"],
      decisionIds: ["pmq-chat-row-select-20260713", "pmq-chat-suggestions-20260713", "pmq-chat-responsive-back-20260713", "pmq-chat-composer-send-20260713", "pmq-chat-deactivated-row-20260713", "pmq-chat-message-pin-20260713"],
      debt: ["backend_send", "delivery_receipts", "payment", "persistence", "archive_tab_content", "availability_policy_matrix"]
    }
  };
})();

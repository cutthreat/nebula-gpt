(() => {
  const icon = (open) => {
    const primitive = document.createElement("span");
    primitive.className = open ? "faq-section__icon-cross" : "faq-section__icon-plus";
    return primitive;
  };

  const bindAccordion = (list) => {
    const items = Array.from(list.querySelectorAll(":scope > .faq-section__item"));
    const seo = list.id === "loveSeoAccordion";
    const setState = (item, open) => {
      const button = item.querySelector(".faq-section__toggle");
      const panel = item.querySelector(".faq-section__panel");
      const holder = item.querySelector(".faq-section__icon");
      if (!button || !panel || !holder) return;
      item.classList.toggle("is-open", open);
      button.setAttribute("aria-expanded", String(open));
      panel.hidden = seo ? false : !open;
      panel.setAttribute("aria-hidden", String(seo ? false : !open));
      holder.replaceChildren(icon(open));
    };

    items.forEach((item) => {
      const button = item.querySelector(".faq-section__toggle");
      if (!button) return;
      setState(item, item.classList.contains("is-open") || button.getAttribute("aria-expanded") === "true");
      button.addEventListener("click", () => {
        const willOpen = !item.classList.contains("is-open");
        items.forEach((candidate) => setState(candidate, candidate === item && willOpen));
      });
    });
  };

  const bindMenu = () => {
    const menu = document.querySelector(".navbar-toggler");
    const close = document.querySelector(".site-header__offcanvas-close");
    const panel = document.querySelector("#navbarOffcanvasLove");
    if (!menu || !close || !panel) return;
    const setMenu = (open) => {
      panel.classList.toggle("show", open);
      menu.setAttribute("aria-expanded", String(open));
      close.setAttribute("aria-expanded", String(open));
    };
    menu.addEventListener("click", () => setMenu(!panel.classList.contains("show")));
    close.addEventListener("click", () => setMenu(false));
    panel.addEventListener("click", (event) => {
      if (event.target.closest("a")) setMenu(false);
    });
  };

  document.querySelectorAll('[data-accordion="single"]').forEach(bindAccordion);
  bindMenu();
})();

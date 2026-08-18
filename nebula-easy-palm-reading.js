(() => {
  document.documentElement.dataset.nebulaEasyCandidate = "palm-reading-source-rebase";
  // Source-backed legacy links are rebound to existing local host routes.
  const routes = {
    "psychic-reading-new.html": "/psychic-reading",
    "all-psychic-new.html": "/all-psychics",
    "zodiac-compatibility-new.html": "/zodiac-compatibility",
    "blog-new.html": "/blog",
    "signup-step-1.html": "/signup-step-1",
    "login.html": "/login",
    "faq-new.html": "/faq",
    "privacy-policy-new.html": "/privacy-policy"
  };
  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    if (href && Object.prototype.hasOwnProperty.call(routes, href)) {
      link.setAttribute('href', routes[href]);
    }
  });
})();

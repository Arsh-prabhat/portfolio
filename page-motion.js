(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  const revealTargets = document.querySelectorAll(
    '.desk-section__title, .project-card, .experience-card, .contact-copy, .parting-gift, .footer-name'
  );
  if (!revealTargets.length) return;

  revealTargets.forEach((element, index) => {
    element.classList.add('scroll-reveal', 'is-pending');
    element.style.setProperty('--reveal-delay', `${(index % 4) * 70}ms`);
  });

  if (!('IntersectionObserver' in window)) {
    revealTargets.forEach((element) => element.classList.add('is-in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in-view');
      entry.target.classList.remove('is-pending');
      currentObserver.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -7% 0px', threshold: 0.08 });

  revealTargets.forEach((element) => observer.observe(element));
})();

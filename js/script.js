/* =========================================================
   Kopi Senja — script.js
   Modules: mobile menu, smooth scrolling, header state,
   active section highlighting. No dependencies.
   ========================================================= */

(function () {
  'use strict';

  var header = document.getElementById('site-header');
  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('primary-nav');
  var DESKTOP = window.matchMedia('(min-width: 900px)');
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Mobile menu ---------- */
  function setMenu(open) {
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Tutup menu navigasi' : 'Buka menu navigasi');
  }

  function closeMenu() { setMenu(false); }

  if (toggle && nav && header) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });

    // Close after tapping a link.
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeMenu();
    });

    // Close on Escape, returning focus to the button.
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && header.classList.contains('is-open')) {
        closeMenu();
        toggle.focus();
      }
    });

    // Close on outside click.
    document.addEventListener('click', function (event) {
      if (!header.classList.contains('is-open')) return;
      if (!event.target.closest('#primary-nav') && !event.target.closest('#nav-toggle')) {
        closeMenu();
      }
    });

    // Reset state when crossing into desktop layout.
    DESKTOP.addEventListener('change', function (event) {
      if (event.matches) closeMenu();
    });
  }

  /* ---------- Smooth scrolling ---------- */
  var internalLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

  Array.prototype.forEach.call(internalLinks, function (link) {
    link.addEventListener('click', function (event) {
      var target = document.querySelector(link.getAttribute('href'));
      if (!target) return;

      event.preventDefault();
      closeMenu();

      target.scrollIntoView({
        behavior: REDUCED.matches ? 'auto' : 'smooth',
        block: 'start'
      });

      // Keep keyboard focus in step with the scroll position.
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });

      if (history.replaceState) {
        history.replaceState(null, '', link.getAttribute('href'));
      }
    });
  });

  /* ---------- Header shadow on scroll ---------- */
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    });
  }

  if (header) {
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Active link highlighting ---------- */
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('.primary-nav__list a');

  function markActive(id) {
    Array.prototype.forEach.call(navLinks, function (link) {
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
    });
  }

  if ('IntersectionObserver' in window && sections.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) markActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    Array.prototype.forEach.call(sections, function (section) {
      observer.observe(section);
    });
  }
})();

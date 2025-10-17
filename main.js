// main.js - shared for all pages
(() => {
  const STORAGE_KEY = 'vh_cartCount';

  // helpers
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from((ctx || document).querySelectorAll(sel));

  /* ---------- Cart Count (localStorage) ---------- */
  function getCartCount() {
    return Number(localStorage.getItem(STORAGE_KEY) || 0);
  }
  function setCartCount(n) {
    n = Math.max(0, Math.floor(n));
    localStorage.setItem(STORAGE_KEY, String(n));
    updateCartBadges(n);
  }
  function incCartCount(delta = 1) {
    setCartCount(getCartCount() + delta);
  }
  function updateCartBadges(n) {
    $$('.cart-badge').forEach(el => {
      el.textContent = String(n);
      // small pulse
      el.style.transform = 'scale(1.08)';
      el.style.transition = 'transform 160ms ease';
      setTimeout(() => el.style.transform = '', 160);
    });
  }

  /* ---------- Mobile Nav Toggle (show under 900px) ---------- */
  function initMobileToggle() {
    const toggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.nav');

    if (!toggle || !nav) return;

    toggle.addEventListener('click', (e) => {
      nav.classList.toggle('show');
      const expanded = nav.classList.contains('show');
      toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });

    // close when clicking nav links (mobile)
    $$('.nav a').forEach(a => {
      a.addEventListener('click', () => {
        if (nav.classList.contains('show')) nav.classList.remove('show');
      });
    });

    // close on outside click when open
    document.addEventListener('click', (e) => {
      if (!nav.classList.contains('show')) return;
      const isInside = nav.contains(e.target) || (toggle && toggle.contains(e.target));
      if (!isInside) nav.classList.remove('show');
    });
  }

  /* ---------- Add to Cart handlers ---------- */
  function initAddToCart() {
    const buttons = $$('.add-to-cart').concat($$('.add-to-cart-btn'));
    if (!buttons.length) return;
    // unify unique array
    const unique = Array.from(new Set(buttons));
    unique.forEach(btn => {
      btn.addEventListener('click', (e) => {
        // tiny lift animation
        try {
          btn.animate(
            [{ transform: 'translateY(0)'}, { transform: 'translateY(-6px)'}, { transform: 'translateY(0)'}],
            { duration: 260, easing: 'cubic-bezier(.2,.9,.2,1)' }
          );
        } catch (err) { /* ignore animation errors on older browsers */ }

        incCartCount(1);

        // feedback text if button not a link
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Added ✓';
        btn.disabled = true;
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.disabled = false;
        }, 900);
      });
    });
  }

  /* ---------- Fade-in on scroll ---------- */
  function initFadeInObserver() {
    const items = $$('.fade-in');
    if (!items.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('visible');
        }
      });
    }, { threshold: 0.2 });
    items.forEach(i => obs.observe(i));
  }

  /* ---------- Header scrolled state ---------- */
  function initHeaderScroll() {
    const header = $('.header');
    if (!header) return;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    });
  }

  /* ---------- Init ---------- */
  function init() {
    // set initial cart badges
    updateCartBadges(getCartCount());
    initMobileToggle();
    initAddToCart();
    initFadeInObserver();
    initHeaderScroll();

    // expose for quick console testing
    window.vh = {
      getCartCount,
      setCartCount,
      incCartCount
    };

    // accessibility: if JS enabled, ensure mobile-toggle exists on small screens
    const mt = document.querySelector('.mobile-toggle');
    if (mt) mt.style.display = window.innerWidth <= 900 ? '' : 'none';
    window.addEventListener('resize', () => {
      if (mt) mt.style.display = window.innerWidth <= 900 ? '' : 'none';
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
    // Mobile Nav Toggle
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav');

  hamburger.addEventListener('click', () => {
    nav.classList.toggle('nav-active');
    hamburger.classList.toggle('open');
  });

  // Fade-in on scroll
  const fadeEls = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });

  fadeEls.forEach(el => observer.observe(el));

  // Temporary "Added to Cart" message
  const cartButtons = document.querySelectorAll('.add-to-cart');
  const cartMsg = document.getElementById('cart-message');

  cartButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      cartMsg.classList.add('show');
      setTimeout(() => cartMsg.classList.remove('show'), 1500);
    });
  });

})();

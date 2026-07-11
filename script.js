(function(){
  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');
  const menuClose = document.getElementById('menuClose');
  const scrim = document.getElementById('scrim');
  const menuLinks = document.querySelectorAll('[data-menu-link]');

  function openMenu(){
    menu.classList.add('is-open');
    scrim.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu(){
    menu.classList.remove('is-open');
    scrim.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', openMenu);
  menuClose.addEventListener('click', closeMenu);
  scrim.addEventListener('click', closeMenu);
  menuLinks.forEach(function(link){
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape') closeMenu();
  });

  // Subtle nav shrink after scrolling past hero
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', function(){
    if (window.scrollY > 40) nav.style.height = '72px';
    else nav.style.height = '';
  }, { passive: true });

  // ===================== PAGE ROUTER =====================
  const pages = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('.nav__links a, .drawer__links a');
  const validPages = new Set(Array.from(pages).map(p => p.dataset.page));

  function showPage(name){
    if (!validPages.has(name)) name = 'home';

    pages.forEach(function(page){
      page.classList.toggle('is-active', page.dataset.page === name);
    });

    navLinks.forEach(function(link){
      const linkPage = (link.getAttribute('href') || '').replace('#', '') || 'home';
      link.classList.toggle('is-active', linkPage === name);
    });

    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }

  function currentPageFromHash(){
    const hash = window.location.hash.replace('#', '');
    return hash || 'home';
  }

  window.addEventListener('hashchange', function(){
    showPage(currentPageFromHash());
  });

  // Initial load
  showPage(currentPageFromHash());
})();

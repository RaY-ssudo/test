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
  // Desktop (>=1024px): only one .page shown at a time, nav swaps it.
  // Mobile/tablet (<1024px): every .page stays visible and stacked —
  // nav links smooth-scroll to the target section instead.
  const DESKTOP_BREAKPOINT = 1024;
  const pages = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('.nav__links a, .drawer__links a');
  const validPages = new Set(Array.from(pages).map(p => p.dataset.page));
  let isNavigating = false; // suppresses scrollspy while a click-triggered scroll is in flight

  function isDesktop(){
    return window.innerWidth >= DESKTOP_BREAKPOINT;
  }

  function pageNameFromHref(href){
    return (href || '').replace('#', '') || 'home';
  }

  function setActiveState(name){
    pages.forEach(function(page){
      page.classList.toggle('is-active', page.dataset.page === name);
    });
    navLinks.forEach(function(link){
      link.classList.toggle('is-active', pageNameFromHref(link.getAttribute('href')) === name);
    });
  }

  function goToPage(name, { updateHash = true } = {}){
    if (!validPages.has(name)) name = 'home';

    setActiveState(name);

    if (updateHash){
      history.replaceState(null, '', '#' + name);
    }

    if (isDesktop()){
      window.scrollTo({ top: 0, behavior: 'auto' });
    } else {
      const target = document.getElementById('page-' + name);
      if (target){
        isNavigating = true;
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // release the scrollspy lock once the smooth scroll has settled
        window.clearTimeout(goToPage._t);
        goToPage._t = window.setTimeout(function(){ isNavigating = false; }, 700);
      }
    }
  }

  function currentPageFromHash(){
    return pageNameFromHref(window.location.hash);
  }

  navLinks.forEach(function(link){
    link.addEventListener('click', function(e){
      e.preventDefault();
      goToPage(pageNameFromHref(link.getAttribute('href')));
    });
  });

  window.addEventListener('hashchange', function(){
    goToPage(currentPageFromHash(), { updateHash: false });
  });

  // ===================== SCROLLSPY (mobile/tablet only) =====================
  // Highlights the nav link for whichever section is currently in view
  // while the person scrolls, since there's no "active page" concept
  // once everything is stacked and scrollable.
  const spy = new IntersectionObserver(function(entries){
    if (isDesktop() || isNavigating) return;
    entries.forEach(function(entry){
      if (entry.isIntersecting){
        setActiveState(entry.target.dataset.page);
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  pages.forEach(function(page){ spy.observe(page); });

  // Keep active state sane when crossing the breakpoint (resize/rotate)
  window.addEventListener('resize', function(){
    if (isDesktop()){
      const current = document.querySelector('.nav__links a.is-active, .drawer__links a.is-active');
      setActiveState(current ? pageNameFromHref(current.getAttribute('href')) : 'home');
    }
  });

  // Initial load
  goToPage(currentPageFromHash(), { updateHash: false });
})();

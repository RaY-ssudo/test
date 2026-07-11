(function(){
  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');
  const menuClose = document.getElementById('menuClose');
  const menuLinks = document.querySelectorAll('[data-menu-link]');

  function openMenu(){
    menu.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu(){
    menu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', openMenu);
  menuClose.addEventListener('click', closeMenu);
  menuLinks.forEach(function(link){
    link.addEventListener('click', closeMenu);
  });

  // Close menu with Escape key
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape') closeMenu();
  });

  // Subtle nav shrink after scrolling past hero
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', function(){
    if (window.scrollY > 40) nav.style.height = '72px';
    else nav.style.height = '';
  }, { passive: true });
})();

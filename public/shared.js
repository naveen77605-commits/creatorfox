
(function(){
  var header=document.getElementById('site-header');
  var toggle=document.getElementById('cfMenuToggle');
  var mobileNav=document.getElementById('cfMobileNav');
  function closeMenu(){
    if(!header || !toggle || !mobileNav) return;
    header.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','Open navigation');
    mobileNav.hidden=true;
  }
  if(header && toggle && mobileNav){
    toggle.addEventListener('click',function(){
      var open=toggle.getAttribute('aria-expanded')==='true';
      if(open) closeMenu();
      else { header.classList.add('menu-open'); toggle.setAttribute('aria-expanded','true'); toggle.setAttribute('aria-label','Close navigation'); mobileNav.hidden=false; }
    });
    mobileNav.querySelectorAll('a').forEach(function(link){ link.addEventListener('click',closeMenu); });
    document.addEventListener('click',function(event){ if(!header.contains(event.target)) closeMenu(); });
  }
})();

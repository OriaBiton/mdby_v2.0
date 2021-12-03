setNavToggle();

function setNavToggle(){
  const hamburger = {
    navToggle: document.querySelector('.nav-toggle'),
    nav: document.querySelector('.nav'),
    doToggle: function() {
      this.navToggle.classList.toggle('expanded');
      this.nav.classList.toggle('expanded');
    }
  };
  hamburger.navToggle.addEventListener('click', () => hamburger.doToggle());
  hamburger.nav.addEventListener('click', () => hamburger.doToggle());
}

setNav();
function setNav(){
  const nav = document.querySelector('nav');
  const topNav = document.querySelector('.top-nav');
  sideNav();
  sticky();  

  function sideNav(){
    view();
    dropdowns();

    function dropdowns(){
      const dds = document.querySelectorAll('.side-nav .dropdown');
      dds.forEach(dd => dd.addEventListener('click', setActive));

      function setActive(e){
        const clickedDD = e.currentTarget;
        const cList = clickedDD.classList;
        const hadActive = cList.contains('active');
        dds.forEach(dd => dd.classList.remove('active'));
        if (hadActive) cList.remove('active');
        else cList.add('active');
      }
    }
    function view(){
      const openBtn = nav.querySelector('.nav-toggle');
      const darkener = nav.querySelector('.screen-darkener');
      const closeBtn = nav.querySelector('.close');
  
      openBtn.addEventListener('click', show);
      darkener.addEventListener('click', hide);
      closeBtn.addEventListener('click', hide);    
  
      function show(){ nav.classList.add('expanded'); }
      function hide(){ nav.classList.remove('expanded'); }
      function toggle(){ nav.classList.toggle('expanded'); }    
    }
  
  }
  function sticky(){
    const sticyPoint = nav.offsetTop;
    window.addEventListener('scroll', () => {
      if (window.scrollY > sticyPoint) topNav.classList.add('sticky');
      else topNav.classList.remove('sticky');
    });
  }
}
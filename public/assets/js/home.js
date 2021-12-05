var isOpen;

setReveal();
setServices();
markAsOpenOrClosed();
setBot();
setInterval(markAsOpenOrClosed, 60000);
window.addEventListener('load', loaded);

function loaded(){
  tippy('[data-tippy-content]', {
    theme: 'light', allowHTML: true, animation: 'perspective-subtle'
  });
}


function markAsOpenOrClosed() {
  const h3 = document.getElementById('is-open');
  if (checkIsOpen()) open();
  else close();

  function open() {
    if (isOpen) return;
    h3.innerHTML = 'המועצה <span class="good">פתוחה</span> כעת';
    isOpen = true;
  }
  function close() {
    if (!isOpen) return;
    h3.innerHTML = 'המועצה <span class="danger">סגורה</span> כעת';
    isOpen = false;
  }
  function checkIsOpen() {
    const date = new Date();
    const day = date.getDay();
    const hour = date.getHours();
    const mins = date.getMinutes();
    if (day == 0 || day == 2 || day == 4) {
      if (hour >= 8 && hour < 12) {
        if (hour == 8 && mins < 30) return false;
        else return true;
      }
    }
    if (day == 1 || day == 3) {
      if (hour >= 8 && hour < 12) {
        if (hour == 8 && mins < 30) return true;
        else return true;
      }
    }
  }
}
function setBot(){
  const wrapper = document.querySelector('.communication-channels');
  const hand = document.querySelector('.bot-hand');
  const head = document.querySelector('.bot-head');
  wrapper.addEventListener('mousemove', move);

  function move(e){
    rotate(hand, e);
    rotate(head, e);
  }
  function rotate(organ, e){    
    const {left, top} = organ.getBoundingClientRect();
    const center_x = left + organ.clientWidth;
    const center_y = top + organ.clientHeight;
    const mouse_x = e.clientX - left;
    const mouse_y = e.clientY - top;
    const radians = Math.atan2(mouse_x - center_x, mouse_y - center_y);
    const degree = (radians * (180 / Math.PI) * -1) + 90;
    const {bias} = organ.dataset;
    organ.style.transform = `rotate(${degree - bias}deg)`;
  }
}
function setServices(){
  const cards = document.querySelectorAll('.card');
  const wrapper = document.querySelector('.cards');
  cards.forEach(c => c.addEventListener('mouseenter', activate));
  cards.forEach(c => c.addEventListener('mouseleave', deactivate));

  function deactivate(){
    wrapper.classList.remove('hover');
  }
  function activate(){
    wrapper.classList.add('hover');    
  }
}
function setReveal(){
  const observer = new IntersectionObserver(reveal);
  const revealables = document.querySelectorAll('.reveal');
  for (const revealable of revealables) observer.observe(revealable);
  
  function reveal(entries, observer){
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.remove('reveal');
        observer.unobserve(entry.target);
      }
    });
  }
}


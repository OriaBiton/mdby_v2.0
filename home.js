var isOpen;

setReveal();
setServices();
markAsOpenOrClosed();
setBot();
setInterval(markAsOpenOrClosed, 60000);


function markAsOpenOrClosed() {
  const h3 = document.getElementById('is-open');
  if (checkIsOpen()) open();
  else close();

  function open() {
    if (isOpen) return;
    h3.classList.remove('danger');
    h3.classList.add('good');
    h3.innerHTML = 'המועצה <span class="good">פתוחה</span> כעת';
    isOpen = true;
  }
  function close() {
    if (!isOpen) return;
    h3.classList.remove('good');
    h3.classList.add('danger');
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
  wrapper.addEventListener('mousemove', setHand);

  function setHand(e){
    const {left, top} = hand.getBoundingClientRect();
    const center_x = left + hand.clientWidth;
    const center_y = top + hand.clientHeight;
    const mouse_x = e.clientX - left;
    const mouse_y = e.clientY - top;
    const radians = Math.atan2(mouse_x - center_x, mouse_y - center_y);
    const degree = (radians * (180 / Math.PI) * -1) + 90;
    hand.style.transform = `rotate(${degree - 150}deg)`;
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


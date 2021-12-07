setNav();
FillHebDate();
FillShabbatInfo();

async function FillHebDate(){
  const date = new Date();
  const y = date.getFullYear(),
  m = date.getMonth() + 1,
  d = date.getDate(),
  wkd = date.getDay();
  const url = `https://www.hebcal.com/converter/?cfg=json&gy=${y}&gm=${m}&gd=${d}&g2h=1`;
  const data = await (await fetch(url)).json();  
  const dayNames = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  const dateStr = data.hebrew.replace(/[\u0591-\u05C7]/g, '');
  byId('day-of-week').innerText = `יום ${dayNames[wkd]}`;
  byId('heb-date').innerText = dateStr;  
}
async function FillShabbatInfo(){
  const url = 'https://www.hebcal.com/shabbat/?cfg=json&geonameid=295548&m=50';
  const {items} = await (await fetch(url)).json();
  let hadlaka, havdala;
  for (const item of items){
    if (item.category == 'parashat'){
      const parasha = item.hebrew;
      byId('parasha').innerText = parasha;
    }
    else {
      const time = ConvertToHour(item?.date);
      if (item.category == 'candles'){
        hadlaka = time;
        byId('hadlaka').innerText = time;
      }
      else if (item.category == 'havdalah'){
        havdala = time;    
        byId('havdala').innerText = time;
      }
    }
  }
  byId('top-nav-shabbat').dataset.tippyContent = `
    <strong>כניסת שבת: </strong>${hadlaka}
    <br>
    <strong>יציאת שבת: </strong>${havdala}
    <br> (בת ים)
  `;

  function ConvertToHour(date){
    const dt = new Date(date);
    let mins = dt.getMinutes();
    let hours = dt.getHours();
    mins = addZero(mins);
    hours = addZero(hours);
    return  hours + ':' + mins;

    function addZero(n){
      if (n < 10) return '0' + n;
      else return n;
    }
  }
}




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
      window.addEventListener('load', hide);
  
      function show(){ nav.classList.add('expanded'); }
      function hide(){ nav.classList.remove('expanded'); }      
    }
  
  }
  function sticky(){
    if (isMobile()) return;
    const sticyPoint = nav.offsetTop;
    window.addEventListener('scroll', () => {
      if (window.scrollY > sticyPoint) topNav.classList.add('sticky');
      else topNav.classList.remove('sticky');
    });
  }
}

function isMobile(){return document.body.offsetWidth < 750;}
function byId(id){return document.getElementById(id);}
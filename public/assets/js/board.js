var news;
var isOpen = true;
var gotNewsAt = 0;
var marriageImages = {
  el: document.getElementById('marriage-img'),
  index: 0,
  paths: [
    "/images/board/marriage/13537727_526134650920663_6306086127358354563_n.jpg",
    "/images/board/marriage/13590292_526134734253988_382886580627578567_n.jpg",
    "/images/board/marriage/13592798_526134477587347_2295181503229464205_n.jpg",
    "/images/board/marriage/13600086_526134840920644_701194386221536685_n.jpg",
    "/images/board/marriage/13612110_526134214254040_3860243739942939054_n.jpg",
    "/images/board/marriage/13615108_526134687587326_8835839716255862886_n.jpg",
    "/images/board/marriage/13615492_526134164254045_3062430909764128168_n.jpg",
    "/images/board/marriage/13620089_526134780920650_7192896117979651861_n.jpg"
  ]
};
var botImages = {
  el: document.getElementById('bot-img'),
  frame: 1,
  paths: ['/images/bot1.png', '/images/bot2.png']
};
const currentEvent = getCurrentEvent();
if (currentEvent) setAsEvent();
else setAsRegular();

h1Background();
setInterval(markAsOpenOrClosed, 60000);
setInterval(fillHebDate, 3600000);
setInterval(fillShabbatInfo, 43200000);
setInterval(setCurrentHour, 60000);
setTimeout(setRefreshTrigger, 5000);
markAsOpenOrClosed();
setCurrentHour();
fillShabbatInfo();
fillHebDate();
setMinHeight();

function setMinHeight() {
  const headerH = document.querySelector('header').offsetHeight;
  const footerH = document.querySelector('footer').offsetHeight;
  const container = document.querySelector('.container');
  const sumH = document.body.offsetHeight - (headerH + footerH);
  container.style.minHeight = sumH + 'px';
}
function setAsEvent() {
  const regulars = document.querySelectorAll('.default-layout section');
  regulars.forEach(el => el.hidden = true);
}
function setAsRegular() {
  setInterval(scrollNews, 10000);
  setInterval(changeMarriageImage, 3000);
  setInterval(changeBotImage, 2000);
  hideEvents();
  runNews();
}
function hideEvents() {
  const events = document.querySelectorAll('[data-event]');
  events.forEach(el => el.hidden = true);
  if (currentEvent) currentEvent.hidden = false;
}
function getCurrentEvent() {
  const events = document.querySelectorAll('[data-event]');
  let current = null;
  for (const el of events) {
    const range = el.dataset.event.split('-');
    const from = new Date(range[0] + ' 17:00');
    const until = new Date(range[1] + ' 20:00');
    const today = new Date();
    if (today > from && today < until) {
      current = el;
      break;
    }
  }
  return current;
}
function setCurrentHour() {
  const span = document.getElementById('current-hour');
  const date = new Date();
  const mins = date.getMinutes();
  span.innerText = `${date.getHours()}:${mins > 9 ? mins : '0' + mins}`;
}
function setRefreshTrigger() {
  const ref = firebase.database().ref('board/refresh');
  ref.on('value', async snap => {
    if (!snap.val()) return;
    const unset = firebase.functions().httpsCallable('unsetRefreshBoard');
    await unset();
    location.reload();
  });
}
async function runNews() {
  const p = document.querySelector('#news p');
  if (new Date() - gotNewsAt > 1728000) {
    const key = '482711ae77f1e46e93e3bf5db8f0934d';
    const url = `https://gnews.io/api/v4/top-headlines?token=${key}&country=il&lang=he`;
    const news = await (await fetch(url)).json();
    if (news.articles) {
      gotNewsAt = new Date().getTime();
      p.innerText = null;
      for (const article of news.articles) {
        if (!article.description) continue;
        p.innerText += ' ' + article.description + ' 📰';
      }
    }
  }
  const width = getTextWidth(p.innerText, '22px Rubik');
  const duration = width * 8;
  p.animate([
    { transform: `translateX(${width}px)` }
  ], { duration });
  setTimeout(runNews, duration);

  function getTextWidth(text, font) {
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
  }
}
function fillShabbatInfo() {
  let myDiv = document.querySelector('#shabbat-info');
  fetch('https://www.hebcal.com/shabbat/?cfg=json&geonameid=295548&m=50')
    .then(res => { return res.json() }).then(data => {
      const items = data.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].category == 'parashat') {
          const parasha = data.items[i].hebrew;
          myDiv.querySelector('#parasha').textContent = '📜 ' + parasha + ' 📜';
        }
        else if (items[i].category == 'candles') {
          const time = ConvertToHour(items[i].date);
          myDiv.querySelector('#hadlaka').textContent = time + ' 🕯️';
        }
        else if (items[i].category == 'havdalah') {
          const time = ConvertToHour(items[i].date);
          myDiv.querySelector('#havdala').textContent = time + ' ✨';
        }
      }
      function ConvertToHour(date) {
        dt = new Date(date);
        let mins = dt.getMinutes();
        let hours = dt.getHours();
        mins = addZero(mins);
        hours = addZero(hours);
        return hours + ':' + mins;

        function addZero(n) {
          if (n < 10) return '0' + n;
          else return n;
        }
      }
    });
}
function changeBotImage() {
  if (botImages.frame == 1) {
    botImages.el.src = botImages.paths[0];
    botImages.frame = 2;
  }
  else if (botImages.frame == 2) {
    botImages.el.src = botImages.paths[1];
    botImages.frame = 1;
  }
}
function changeMarriageImage() {
  marriageImages.el.src = marriageImages.paths[marriageImages.index];
  if (marriageImages.index == marriageImages.paths.length - 1) {
    return marriageImages.index = 0;
  }
  marriageImages.index++;
}
async function getHebDateString(date) {
  const y = date.getFullYear(),
    m = date.getMonth() + 1,
    d = date.getDate(),
    wkd = date.getDay();
  const url = `https://www.hebcal.com/converter/?cfg=json&gy=${y}&gm=${m}&gd=${d}&g2h=1`;
  const hebrew = (await (await fetch(url)).json()).hebrew;
  const dayNames = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  return txt = "יום " + dayNames[wkd] + ', ' + hebrew;
}
async function fillHebDate() {
  const date = new Date();
  const txt = await getHebDateString(date);
  document.getElementById('heb-date').innerText = txt;
}
function markAsOpenOrClosed() {
  const bubbles = document.querySelectorAll('.ball.bubble');
  const h2 = document.querySelector('.is-open');

  if (checkIsOpen()) open();
  else close();

  function open() {
    if (isOpen) return;
    h2.classList.remove('danger');
    h2.classList.add('good');
    h2.querySelector('#is-open-word').innerText = 'פתוחה';
    for (const b of bubbles) {
      b.classList.remove('danger');
      b.classList.add('good');
    }
    isOpen = true;
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
  function close() {
    if (!isOpen) return;
    h2.classList.remove('good');
    h2.classList.add('danger');
    h2.querySelector('#is-open-word').innerText = 'סגורה';
    for (const b of bubbles) {
      b.classList.remove('good');
      b.classList.add('danger');
    }
    isOpen = false;
  }
}
async function scrollNews() {
  if (!news) news = await getUpdates();
  const updatesDiv = document.getElementById('updates');
  const updateNodes = document.querySelectorAll('.update');
  const updates = updateNodes.length ? updateNodes : await setUpdates();
  animate();

  async function setUpdates() {
    const arr = [];
    for (const key in news) {
      const n = news[key];
      const div = document.createElement('div');
      const he = await getHebDateString(new Date(n.time));
      div.classList.add('update');
      div.innerHTML = `
        <h2>${n.title}</h2>
        <p class="bold">${he}</p>
        <p>
          ${n.desc}
        </p>
        <hr>
      `;
      arr.push(div);
      updatesDiv.appendChild(div);
    }
    return arr;
  }
  function animate() {
    updatesDiv.appendChild(updates[0].cloneNode(true));
    updatesDiv.style.transition = 'transform 1s ease-in-out';
    updatesDiv.style.transform = `translateY(-${updates[0].offsetHeight}px)`;
    setTimeout(() => {
      updatesDiv.style.transition = 'transform 0s';
      updatesDiv.style.transform = `translateY(0)`;
      updates[0].remove();
    }, 1000);
  }

  async function getUpdates() {
    return (await firebase.database().ref('updates')
      .limitToLast(5).once('value')).val();
  }
}

async function h1Background() {
  const h1s = document.querySelectorAll('h1');
  const svg = await (await fetch('/images/board/h1bg.svg')).text();
  const svgWide = await (await fetch('/images/board/h1bg-wide.svg')).text();
  for (const h1 of h1s) {
    const isWide = h1.closest('section.wide');
    const div = document.createElement('div');
    div.classList.add('h1-wave');
    div.innerHTML = isWide ? svgWide : svg;
    h1.after(div);
  }
}

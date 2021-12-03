import Swiper from 'https://unpkg.com/swiper@7/swiper-bundle.esm.browser.min.js';

setContent().then(setSwiper);

async function setContent(){
  const wrapper = document.querySelector('.blog-slider__wrp');
  const updates = await (await fetch('/assets/partials/updates.json')).json();
  for (const update of updates){
    const {title, content, date, img, link, linkText} = update;    
    wrapper.innerHTML += `
    <div class="blog-slider__item swiper-slide">
      <div class="blog-slider__img">
        <img src="${img}" alt="${title}">
      </div>
      <div class="blog-slider__content">
        <div class="spacer"></div>
        <div>
          <span class="blog-slider__code">${date}</span>
          <div class="blog-slider__title">${title}</div>
        </div>
        <div class="blog-slider__text">${content}</div>
        <a href="${link}" class="blog-slider__button">${linkText}</a>
      </div>
    </div>
    `;
  }
}

function setSwiper(){
  new Swiper('.blog-slider', {
    spaceBetween: 30,
    effect: 'fade',
    loop: true,
    mousewheel: {invert: false},
    // autoHeight: true,
    pagination: {
      el: '.blog-slider__pagination',
      clickable: true,
    }
  });
}
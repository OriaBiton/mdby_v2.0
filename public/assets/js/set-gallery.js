$('.gallery').magnificPopup({
  delegate: 'a',
  type: 'image',
  gallery: {
    enabled: true,
    tCounter: '<span class="mfp-counter">%curr% מתוך %total%</span>'
  },
  mainClass: 'mfp-with-zoom',
  zoom: {
    enabled: true,
    duration: 250,
    easing: 'ease-in-out'
  },
  image: {titleSrc: 'title'}
});

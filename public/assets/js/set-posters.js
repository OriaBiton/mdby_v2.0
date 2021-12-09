addEventListener('load', setPosters, {once: true});

function setPosters() {
  const postersDiv = document.getElementById('posters');
  firebase.database().ref('posters').once('value', snap => {
    const posters = snap.val();
    for (const key in posters) {
      const poster = posters[key];
      const div = document.createElement('div');
      const template = `
        <figure class="post">
          <a href="${poster.url}" target="_blank" title="${poster.desc}">
            <img src="${poster.url}">
          </a>
          <figcaption>${poster.desc}</figcaption>
        </figure>
      `;
      div.innerHTML = template;
      postersDiv.prepend(div);
    }
    appendScript('/assets/js/set-gallery.js');
  });
}
async function appendScript(src) {
  const script = document.createElement('script');
  script.async = true;
  script.src = src;
  document.body.appendChild(script);
}

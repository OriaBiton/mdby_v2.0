addEventListener('firebaseLoaded', setPictures);

function setPictures() {
  const picturesDiv = document.getElementById('pictures');
  firebase.database().ref('pictures').once('value', snap => {
    const pictures = snap.val();
    for (const key in pictures) {
      const pic = pictures[key];
      const div = document.createElement('div');
      const template = `
        <figure class="post">
          <a href="${pic.url}" target="_blank" title="${pic.desc}">
            <img src="${pic.url}">
          </a>
          <figcaption>${pic.desc}</figcaption>
        </figure>
      `;
      div.innerHTML = template;
      picturesDiv.prepend(div);
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

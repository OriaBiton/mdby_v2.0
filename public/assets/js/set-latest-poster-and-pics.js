addEventListener('load', () => {
  setLatestPoster();
  setLatestPictures();
});

async function setLatestPictures() {
  const div = document.getElementById('pictures');
  firebase.database().ref('pictures').limitToLast(1).once('value', snap => {
    const val = snap.val();
    const latest = val[Object.keys(val)[0]];
    const template = `
    <figure class="post">
      <a href="${latest.url}" target="_blank">
        <img src="${latest.url}" title="הקול הקורא האחרון שיצא">
      </a>
      <figcaption>${latest.desc}</figcaption>
    </figure>
    `;
    div.innerHTML = template;
  });
}
async function setLatestPoster() {
  const div = document.getElementById('poster');
  firebase.database().ref('posters').limitToLast(1).once('value', snap => {
    const val = snap.val();
    const latest = val[Object.keys(val)[0]];
    const template = `
    <figure class="post">
      <a href="${latest.url}" target="_blank">
        <img src="${latest.url}" title="הקול הקורא האחרון שיצא">
      </a>
      <figcaption>${latest.desc}</figcaption>
    </figure>
    `;
    div.innerHTML = template;
  });
}

addEventListener('load', setLatestVideo, {once: true});

async function setLatestVideo() {
  const div = document.getElementById('vid');
  firebase.database().ref('videos/rabbi').limitToLast(1).once('value', snap => {
    const val = snap.val();
    const latest = val[Object.keys(val)[0]];
    const template = `
      <h4>${latest.name}</h4>
      <p>${latest.desc}</p>
      <div class="middle">
        <iframe class="yt-embed post"
        src="https://www.youtube.com/embed/${latest.vid}"
        frameborder="0" allow="accelerometer; autoplay;
        encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen></iframe>
      </div>
    `;
    div.innerHTML = template;
  });
}

addEventListener('firebaseLoaded', setVideos);

function setVideos() {
  const videosDiv = document.getElementById('videos');
  firebase.database().ref('videos/parasha').once('value', snap => {
    const videos = snap.val();
    for (const key in videos) {
      const vid = videos[key];
      const div = document.createElement('div');
      const template = `
        <h4 class="m-0">${vid.name}</h4>
        <p>${vid.desc}</p>
        <iframe class="yt-embed post"
        src="https://www.youtube.com/embed/${vid.vid}"
        frameborder="0" allow="accelerometer; autoplay;
        encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen></iframe>
      `;
      div.innerHTML = template;
      videosDiv.prepend(div);
    }
  });
}

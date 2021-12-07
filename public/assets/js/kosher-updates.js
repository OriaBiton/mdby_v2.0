addEventListener('firebaseLoaded', setUpdates);

function setUpdates() {
  const updatesDiv = document.getElementById('updates');
  firebase.database().ref('updates').once('value', snap => {
    const updates = snap.val();
    for (const key in updates) {
      const update = updates[key];
      if (update.category != 'kashrut') continue;
      const date = new Date(update.time).toLocaleDateString('he-IL');
      const div = document.createElement('div');
      const template = `
        <section class="middle container mb-2">
          <h3 class="heading">📅 ${date}</h3>
          <figure class="post">
            <a href="${update.url}" target="_blank" title="${update.desc}">
              <img src="${update.url}">
            </a>
            <figcaption>${update.desc}</figcaption>
          </figure>
        </section>
      `;
      div.innerHTML = template;
      updatesDiv.prepend(div);
    }
  });
}

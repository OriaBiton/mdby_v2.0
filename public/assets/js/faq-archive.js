addEventListener('load', setQuestions, {once: true});

function setQuestions() {
  const questionsDiv = document.getElementById('questions');
  firebase.database().ref('oldFaq').once('value', snap => {
    const questions = snap.val();
    for (const key in questions) {
      const q = questions[key];
      const div = document.createElement('div');
      const template = `
        <a href="${q.url}" target="_blank" class="menu">${q.desc}</a>
      `;
      div.innerHTML = template;
      questionsDiv.prepend(div);
    }
  });
}

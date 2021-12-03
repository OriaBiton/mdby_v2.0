addEventListener('load', () => {
  const h2 = document.querySelector('#upload h2');
  document.querySelector('#login form').addEventListener('submit', logUserIn);
  document.querySelector('#upload button').addEventListener('click', add);
});

async function add(e) {
  e.preventDefault();
  const file = document.getElementById('file').files[0];
  const ref = firebase.storage().ref(`images/pictures/${file.name}`);
  h2.innerText = null;
  const uploadTask = ref.put(file);

  uploadTask.on('state_changed', null, e => console.error(e),
    async () => {
      const url = await uploadTask.snapshot.ref.getDownloadURL();
      const desc = document.getElementById('desc').value;
      const pass = document.getElementById('password').value;
      const add = firebase.functions().httpsCallable('addPicture');
      await add({ url, desc, pass }).catch(e => {
        ref.delete();
        throw e;
      });
      h2.innerText = 'הועלה בהצלחה!';
    });
}

async function logUserIn(e) {
  e.preventDefault();
  const form = this;
  const email = getVal('email');
  const pass = getVal('pass');
  await firebase.auth().signInWithEmailAndPassword(email, pass)
    .catch(err => { throw err });
  window.location.reload();

  function getVal(id) {
    return form.querySelector('#' + id).value;
  }
}
firebase.auth().onAuthStateChanged(user => {
  if (user) console.log('Welcome, ' + user.displayName);
  else {
    document.querySelector('#login').hidden = false;
    console.log('No user is signed in.');
  }
});

addEventListener('load', () => {

  const h2 = document.querySelector('h2');
  document.querySelector('button').addEventListener('click', add);
});
async function add(e) {
  e.preventDefault();
  const type = document.querySelector('[name="type"]:checked').value;
  const name = document.getElementById('name').value;
  const desc = document.getElementById('desc').value;
  const vid = document.getElementById('vid').value;
  const pass = document.getElementById('pass').value;
  const add = firebase.functions().httpsCallable('addVideo');
  h2.innerText = null;
  await add({ type, name, desc, vid, pass }).catch(e => { throw e });
  h2.innerText = 'הועלה בהצלחה!';
}

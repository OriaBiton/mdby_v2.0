document.querySelector('form').addEventListener('submit', handleSubmit);
function handleSubmit(e) {
  e.preventDefault();
  let msg = this.querySelector('textarea').value;
  const num = '972548181024';
  msg = encodeURIComponent(msg);
  const url = `https://wa.me/${num}?text=${msg}`;
  window.open(url, '_blank');
}


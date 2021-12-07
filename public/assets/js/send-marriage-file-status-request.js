document.querySelector('form').addEventListener('submit', handleSubmit);
function handleSubmit(e) {
  e.preventDefault();
  const id = this.querySelector('input').value;
  const num = '972525550125';
  let msg = 'היי, אבקש לברר מה הסטטוס של תיק הנישואין שלי.  מספר: ' + id;
  msg = encodeURIComponent(msg);
  const url = `https://wa.me/${num}?text=${msg}`;
  window.open(url, '_blank');
}



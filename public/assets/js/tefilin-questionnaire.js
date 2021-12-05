const end = document.getElementById('end');
end.addEventListener('click', handleSubmitClick);
document.querySelectorAll('button.small')
  .forEach(b => b.addEventListener('click', handleClick));
document.getElementById('start').addEventListener('click', view);

function view(e){
  e.preventDefault();
  hide(this);
  unhide(document.getElementById('form'));
}
function handleClick(e){
  e.preventDefault();
  if (isActive(this)) deactivate(this);
  else {
    handleIfSecondFilter(this);
    activate(this);
  }
  if (areAllActive()) enableSubmit();
  else disableSubmit();
}

function disableSubmit(){
  end.classList.add('disabled');
}
function enableSubmit(){
  end.classList.remove('disabled');
}
function areAllActive(){
  const fields = document.querySelectorAll('.field');
  for (const field of fields) {
    const btns = field.getElementsByTagName('button');
    let activeField = false;
    for (const btn of btns) {
      if (btn.classList.contains('active')) {
        activeField = true;
        break;
      }
    }
    if (!activeField) return false;
  }
  return true;
}
function handleSubmitClick(e){
  e.preventDefault();
  if (this.classList.contains('disabled'))
    return notyf.error('לא סיימת לענות על כל השאלות');
  const wrongActive = document.querySelector('.wrong.active');
  const goCheck = document.getElementById('go-check');
  const noCheck = document.getElementById('no-check');
  if (wrongActive) {
    hide(noCheck)
    unhide(goCheck);
  }
  else {
    unhide(noCheck);
    hide(goCheck);
  }
}
function handleIfSecondFilter(btn){
  const btns = btn.closest('div').querySelectorAll('button');
  for (const b of btns) {
    if (isActive(b)) b.click();
  }
}
function hide(e){
  e.classList.add('hidden');
}
function unhide(e){
  e.classList.remove('hidden');
}
function activate(e){
  e.classList.add('active');
}
function deactivate(e){
  e.classList.remove('active');
}
function isActive(e){
  return e.classList.contains('active');
}

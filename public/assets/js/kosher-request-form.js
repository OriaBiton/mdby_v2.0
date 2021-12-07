addEventListener('firebaseLoaded', () => {
  const criteriaDiv = document.getElementById('criteria');
  document.querySelectorAll('[name="type"]')
    .forEach(box => box.addEventListener('change', toggleCriterion));
  document.querySelector('form').addEventListener('submit', sendMail);

  function sendMail(e) {
    e.preventDefault();
    const form = this;
    disable();
    const name = getVal('name');
    const id = getVal('id');
    const phone = getVal('phone');
    const bizName = getVal('biz-name');
    const bizNum = getVal('biz-num');
    const bizType = getVal('biz-type');
    const kitchen = document.querySelector('[name="kitchen"]:checked').value;
    let workdays = [];
    document.querySelectorAll('[name="workdays"]:checked')
      .forEach(i => workdays.push(i.value));
    workdays = workdays.map(i => i += ', ');
    const openHours = getVal('open-hours');
    const closeHours = getVal('close-hours');
    const kosher = document.querySelector('[name="kosher"]:checked').value;
    const activity = getVal('activity');
    let type = [];
    document.querySelectorAll('[name="type"]:checked')
      .forEach(b => type.push(b.value));
    type = type.map(i => i += ', ');
    let criteria = [];
    criteriaDiv.querySelectorAll('input').forEach(i => {
      if (!i.classList.contains('hidden') && i.value)
        if ((i.type == 'radio' && i.checked) || i.type != 'radio')
          criteria.push(i.dataset.pre + i.value);
    });
    criteria = criteria.map(i => i += ', ');
    const info = getVal('info');
    const agree = document.getElementById('agree').checked;
    const sign = getVal('sign');
    if (!agree) return enable();

    const sendMail = firebase.functions().httpsCallable('sendKosherRequest');
    const obj = {
      name, phone, id, bizName, bizNum, bizType, kitchen,
      workdays, openHours, closeHours, kosher, activity,
      type, criteria, info, sign
    };
    sendMail(obj)
      .then(() => {
        notyf.success('הבקשה נשלחה בהצלחה!');
        form.reset();
        enable();
      })
      .catch(e => { throw e });

    function enable() {
      form.querySelector('button').disabled = false;
    }
    function disable() {
      form.querySelector('button').disabled = true;
    }
    function getVal(q) {
      return form.querySelector('#' + q).value;
    }
  }

  function toggleCriterion() {
    const criterion = this.dataset.show;
    if (!criterion) return;
    const field = criteriaDiv.querySelector(`#${criterion}-field`);
    if (this.checked) unhide(field);
    else hide(field);

  }
  function hide(e) {
    e.classList.add('hidden');
  }
  function unhide(e) {
    e.classList.remove('hidden');
  }

})

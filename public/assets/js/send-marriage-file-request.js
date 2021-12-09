addEventListener('load', () => {
  document.querySelector('form').addEventListener('submit', sendMail);
  function sendMail(e) {
    e.preventDefault();
    this.querySelector('button').disabled = true;
    const form = this;
    const name = getVal('name');
    const date = new Date().toLocaleDateString();
    const phone = getVal('phone');
    const doc = document.querySelector('input[name="doc"]:checked').value;
    const husbandLastName = getVal('husband-last-name');
    const husbandFirstName = getVal('husband-first-name');
    const husbandId = getVal('husband-id');
    const wifeLastName = getVal('wife-last-name');
    const wifeFirstName = getVal('wife-first-name');
    const wifeId = getVal('wife-id');
    const wedDate = getVal('wed-date');
    const email = getVal('email');
    const sendMail = firebase.functions().httpsCallable('sendDocRequest');
    const obj = {
      name, date, phone, doc, husbandLastName, husbandFirstName,
      husbandId, wifeLastName, wifeFirstName, wifeId, wedDate, email
    };
    sendMail(obj)
      .then(() => {
        notyf.success('הבקשה נשלחה בהצלחה!');
        form.reset();
        form.querySelector('button').disabled = false;
      })
      .catch(e => { throw e });

    function getVal(q) {
      return form.querySelector('#' + q).value;
    }
  }
});

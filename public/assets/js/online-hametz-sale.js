addEventListener('load', () => {
  const form = document.querySelector('form');

  document.getElementById('represent').addEventListener('change', enableRepresented);

  async function handleSubmit(token) {
    const name = `${val('first-name')} ${val('last-name')}`;
    const address = `${val('street')} ${val('house')}`;
    const city = val('city');
    const phone = val('phone');
    const contract = document.getElementById('contract').innerText;
    const forSelf = isChecked('self');
    const represented = isChecked('represent') ? val('represented') : '';
    const accept = isChecked('accept');
    const btn = form.querySelector('button[type="submit"]');
    const subject = 'שטר מכירת חמץ - ' + name;
    const body = `
      <h2>שטר מקוון - הרשאה למכירת חמץ</h2>
      <p>
        אני
        <b>${name}</b>,
        הגר ברחוב
        <b>${address}</b>
        בעיר
        <b>${city},</b>
        מס' טלפון
        <b>${phone},</b>
        <br>
        ${contract}
      </p>
      <p>
        ${forSelf ? 'אני עושה מכירת חמץ עבור עצמי.' : ''}
      </p>
      <p>
        ${represented ? 'אני שליח למכור חמץ של:<br>' + represented : ''}
      </p>
      <p>
        ${accept ? 'אני מאשר את כל דברי הטופס הזה, בצורה גמורה ובלתי הפיכה.' : ''}
      </p>
    `;
    if (!accept) return;
    btn.disabled = true;
    const mail = firebase.functions().httpsCallable('sendMail');
    await mail({ subject, body, token });
    btn.disabled = false;
    notyf.success('השטר המקוון נשלח בהצלחה');
    form.reset();

    function val(id) {
      return document.getElementById(id).value;
    }
    function isChecked(id) {
      return document.getElementById(id).checked;
    }
  }
  function enableRepresented(e) {
    const represented = document.getElementById('represented');
    represented.disabled = !e.target.checked;
  }

}, {once: true});

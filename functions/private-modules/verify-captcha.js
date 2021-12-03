const fetch = require('node-fetch');
module.exports = async function(token){
  const secret = '6LfZo4caAAAAAJV9ZXRfEvlJ5TWA9a0vK8IEwC9z';
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`;
  const response = (await (await fetch(url, {method: 'POST'})).json());
  if (!response.success) throw new Error('Bad captcha');
}

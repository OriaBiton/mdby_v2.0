class LoadingScreen extends HTMLElement {
  constructor(){
    super();
    const shadow = this.attachShadow({mode: 'open'});
    shadow.innerHTML = `
      <link rel="stylesheet" href="components/loading-screen.css">
      <img src="images/logo-white.png" loading="eager">
      <span class="loader">
        <span class="loader-inner"></span>
      </span>
    `;
    window.addEventListener('load', hide);

    function hide(e){
      document.body.classList.remove('loading');
      shadow.host.classList.add('ready', 'hide');
    }
  }
}
customElements.define('loading-screen', LoadingScreen);

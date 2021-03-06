class LoadingScreen extends HTMLElement {
  constructor(){
    super();
    const shadow = this.attachShadow({mode: 'open'});
    shadow.innerHTML = `
      <link rel="stylesheet" href="/assets/components/loading-screen.css">
      <img src="/images/logo-white.png" loading="eager">
      <div class="loader">
        <div class="shadow"></div>
        <div class="box"></div>
      </div>
    `;
    window.addEventListener('load', hide);    

    function hide(e){
      document.body.classList.remove('loading');
      shadow.host.classList.add('transition-fade');
    }
  }  
}
customElements.define('loading-screen', LoadingScreen);

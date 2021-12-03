class StickerDiv extends HTMLElement {
  constructor(){
    super();
    const shadow = this.attachShadow({mode: 'open'});
    shadow.host.hidden = true;
  }
  connectedCallback(){
    const self = this;
    const html = this.innerHTML;
    setTimeout(show, 3000);
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="/components/sticker-div.css">
      <span class="close">✕</span>
      <div>${html}</div>
    `;
    this.shadowRoot.querySelector('.close').addEventListener('click', hide);

    function show(){self.hidden = false}
    function hide(){self.hidden = true}
  }
}
customElements.define('sticker-div', StickerDiv);

import Loader from '/assets/js/loader.js';
class XSection extends HTMLElement {
  constructor(){
    super();
    Loader.loadCss('/assets/components/x-section.css');
  }
  connectedCallback(){
    this.setHTML();
  }
  setHTML(){
    const html = this.innerHTML;
    const header = this.dataset.name || document.title;
    this.innerHTML = `
      <h2>${header}</h2>
      <div>${html}</div>
    `;
    this.style();
  }

  style(){
    const wrapper = this.querySelector('div');
    wrapper.classList = this.classList;
    wrapper.classList.add('wrapper');
    this.className = '';
  }
}

customElements.define('x-section', XSection);
import Loader from '/assets/js/loader.js';
class Section extends HTMLElement {
  constructor(){
    super();
    this.isMain = this instanceof MainSection;
    Loader.loadCss('/assets/components/sections.css');
  }

  setHTML(){
    const html = this.innerHTML;
    const header = document.createElement(this.isMain ? 'h2' : 'h3');
    header.innerText = this.dataset.name || document.title;
    this.innerHTML = `
      ${header.outerHTML}
      <div>${html}</div>
    `;
    this.style();
  }

  style(){
    const pSide = this.dataset.pSide || this.isMain ? 3 : 1;
    const container = this.querySelector('div');
    container.classList = this.classList;
    container.classList.add('middle', `p-side-${pSide || 3}`);
    this.className = '';
  }
}

class MainSection extends Section{
  constructor(){ super(); }
  
  connectedCallback(){
    this.setHTML();
  }
}

class SmallSection extends Section{
  constructor(){ super(); }

  connectedCallback(){
    this.setHTML();
  }
}

customElements.define('main-section', MainSection);
customElements.define('small-section', SmallSection);
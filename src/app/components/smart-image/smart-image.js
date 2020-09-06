import '../spinner/spinner.js';
import commonStyles from '../../styles/common.js';

const template = document.createElement('template');

template.innerHTML = `
  <style>
    .container {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2px;
    }

    .container .loader {
      top: 0;
      left: 0;
      position: absolute;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);

      display: flex;
      justify-content: center;
      align-items: center;
    }

    .container img {
      width: 100% !important;
      height: auto !important;
    }
  </style>
  <div class="container">
    <div class="loader">
      <app-spinner></app-spinner>
    </div>
    <img />
  </div>
`;

class AppSmartImage extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [commonStyles];
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // loader block
    this.loader = this.shadowRoot.querySelector('.loader');

    // img
    this.img = this.shadowRoot.querySelector('img');

    // bind event handlers
    this.hideLoader = this.hideLoader.bind(this);
  }

  static get observedAttributes() {
    return ['src'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'src' && newValue !== oldValue) {
      this.loader.classList.remove('hide');
      this.img.setAttribute('src', newValue);
    }
  }

  get src() {
    return this.getAttribute('src');
  }

  set src(value) {
    this.setAttribute('src', value);
  }

  hideLoader() {
    this.loader.classList.add('hide');
  }

  connectedCallback() {
    this.img.addEventListener('load', this.hideLoader);
  }

  disconnectedCallback() {
    this.img.removeEventListener('load', this.hideLoader);
  }
}

customElements.define('app-smart-image', AppSmartImage);

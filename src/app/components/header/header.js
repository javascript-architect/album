import imageService from '../../services/image.service.js';

const template = document.createElement('template');

template.innerHTML = `
  <style>
    .app-header {
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      background-color: #e9e9e9;
      padding: 1rem;
    }

    .app-header > .search-form {
      width: 100%;

      display: flex;
      justify-content: center;
      align-items: center;
    }

    .app-header > .search-form > input[type="text"] {
      width: 100%;
      padding: 12px 20px;
      margin: 8px 0;
      display: inline-block;
      border: 1px solid #ccc;
      box-sizing: border-box;
    }

    .app-header > .search-form > button {
      background-color: #4CAF50;
      color: white;
      padding: 14px 20px;
      margin: 8px 0;
      border: none;
      cursor: pointer;
    }
  </style>
  <div class="app-header">
    <form class="search-form">
      <input type="text" placeholder="Search ..." />
      <button type="submit">Submit</button>
    </form>
  </div>
`;

class AppHeader extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    // input element
    this.input = this.shadowRoot.querySelector('input');
    // Setup event listener on form submit
    this.form = this.shadowRoot.querySelector('form');

    // bind event handlers
    this.submit = this.submit.bind(this);
    this.changeSearchText = this.changeSearchText.bind(this);
  }

  submit(event) {
    // disable form from actually getting submitted
    event.preventDefault();
    imageService.searchImages().then((response) => {
      if (response) {
        this.dispatchEvent(
          new CustomEvent('search', {
            detail: response,
          })
        );
      }
    });
  }

  changeSearchText(event) {
    imageService.setSearchText(event.target.value);
  }

  connectedCallback() {
    this.form.addEventListener('submit', this.submit);
    this.input.addEventListener('input', this.changeSearchText);
  }

  disconnectedCallback() {
    this.form.removeEventListener('submit', this.submit);
    this.input.removeEventListener('input', this.changeSearchText);
  }
}

customElements.define('app-header', AppHeader);

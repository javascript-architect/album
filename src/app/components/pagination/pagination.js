import materialIcons from '../../styles/material-icons.js';
import imageService from '../../services/image.service.js';

const template = document.createElement('template');

template.innerHTML = `
  <style>
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      margin: 16px 0;
    }

    .pagination a {
      color: black;
      float: left;
      padding: 8px 16px;
      text-decoration: none;
    }

    .pagination a.active {
      background-color: #4CAF50;
      color: white;
      border-radius: 5px;
    }

    .pagination a:hover:not(.active) {
      background-color: #ddd;
      border-radius: 5px;
    }

    .pagination button {
      background: transparent;
      border: none;
    }

    .pagination button:disabled .material-icons {
      color: #ddd;
      cursor: not-allowed;
    }

    .left-arrow {
      transform: rotate(180deg);
    }

    .material-icons {
      color: #4CAF50;
    }
  </style>
  <div class="pagination">
    <button type="button" class="previous">
      <span class="material-icons md-36 left-arrow">play_circle_filled</span>
    </button>
    <button type="button" class="next">
      <span class="material-icons md-36">play_circle_filled</span>
    </button>
  </div>
`;

class AppPagination extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [materialIcons];
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // previous button
    this.previous = this.shadowRoot.querySelector('.previous');
    // next button
    this.next = this.shadowRoot.querySelector('.next');

    // bind event handlers
    this.goBack = this.goBack.bind(this);
    this.goToNextPage = this.goToNextPage.bind(this);
  }

  static get observedAttributes() {
    return ['config'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'config' && newValue !== oldValue) {
      this.onConfigChange(JSON.parse(newValue));
    }
  }

  get config() {
    return JSON.parse(this.getAttribute('config'));
  }

  set config(value) {
    this.setAttribute('config', JSON.stringify(value));
  }

  async goBack() {
    const page = this.config.page - 1;
    const response = await imageService.searchImages(page);
    if (response) {
      this.paginate(response);
    }
  }

  async goToNextPage() {
    const page = this.config.page + 1;
    const response = await imageService.searchImages(page);
    if (response) {
      this.paginate(response);
    }
  }

  paginate(detail) {
    this.dispatchEvent(
      new CustomEvent('paginate', {
        detail,
      })
    );
  }

  onConfigChange(config) {
    if (config.page === 1) {
      this.previous.setAttribute('disabled', true);
    } else if (config.totalPages === config.page) {
      this.next.setAttribute('disabled', true);
    } else {
      this.next.removeAttribute('disabled');
      this.previous.removeAttribute('disabled');
    }
  }

  connectedCallback() {
    this.previous.addEventListener('click', this.goBack);
    this.next.addEventListener('click', this.goToNextPage);
  }

  disconnectedCallback() {
    this.previous.removeEventListener('click', this.goBack);
    this.next.removeEventListener('click', this.goToNextPage);
  }
}

customElements.define('app-pagination', AppPagination);

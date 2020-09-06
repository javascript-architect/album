import materialIcons from '../../styles/material-icons.js';
import commonStyles from '../../styles/common.js';

const template = document.createElement('template');

template.innerHTML = `
  <style>
    .image {
      position: relative;
      transition: transform 1.5s;
      padding: 2px;
    }

    .image img {
      width: 100% !important;
      height: auto !important;
    }

    .image .like-icon {
      position: absolute;

      font-size: 2.5rem;
      top: 2rem;
      right: 2rem;
      z-index: 999;

      cursor: pointer;
    }

    .image .like-icon.filled {
      font-size: 3.5rem;
      color: orangered
    }

    :host.active .image {
      -ms-transform: scale(2);
      -webkit-transform: scale(2);
      transform: scale(2);
      z-index: 1000;
    }
  </style>
  <div class="image">
    <img />
    <span class="like-icon">
      <span class="material-icons md-36">favorite_border</span>
    </span>
    <span class="like-icon filled">
      <span class="material-icons md-36">favorite</span>
    </span>
  </div>
`;

class AppImageCard extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [materialIcons, commonStyles];
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // image
    this.img = this.shadowRoot.querySelector('img');
    // like-icon
    this.likeIcon = this.shadowRoot.querySelector('.like-icon');
    // like-icon
    this.likedIcon = this.shadowRoot.querySelector('.like-icon.filled');

    // bind event handlers
    this.toggleLike = this.toggleLike.bind(this);
  }

  static get observedAttributes() {
    return ['image'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'image' && newValue !== oldValue) {
      this.image = JSON.parse(newValue);
    }
  }

  get image() {
    return JSON.parse(this.getAttribute('image'));
  }

  set image(value) {
    this.setAttribute('image', JSON.stringify(value));
  }

  toggleLike(event) {
    this.toggleIcons();

    this.dispatchEvent(
      new CustomEvent('toggleLike', {
        detail: { image: { ...this.image, like: !this.image.like } },
        bubbles: false,
      })
    );
  }

  toggleIcons() {
    this.likeIcon.classList.toggle('hide');
    this.likedIcon.classList.toggle('hide');
  }

  connectedCallback() {
    this.img.setAttribute('src', this.image.small);

    this.likeIcon.addEventListener('click', this.toggleLike);
    this.likedIcon.addEventListener('click', this.toggleLike);

    if (this.image.like) {
      this.likeIcon.classList.add('hide');
    } else {
      this.likedIcon.classList.add('hide');
    }
  }

  disconnectedCallback() {
    this.likeIcon.removeEventListener('click', this.toggleLike);
    this.likedIcon.removeEventListener('click', this.toggleLike);
  }
}

customElements.define('app-image-card', AppImageCard);

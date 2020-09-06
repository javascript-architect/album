import '../image-card/image-card.js';
import commonStyles from '../../styles/common.js';

const template = document.createElement('template');

template.innerHTML = `
  <style>
    #gallery-container {
      line-height: 0;

      -webkit-column-count: 5;
      -webkit-column-gap: 0px;
      -moz-column-count: 5;
      -moz-column-gap: 0px;
      column-count: 5;
      column-gap: 0px;
    }

    @media (max-width: 1200px) {
      #gallery-container {
        -moz-column-count: 4;
        -webkit-column-count: 4;
        column-count: 4;
      }
    }
    @media (max-width: 1000px) {
      #gallery-container {
        -moz-column-count: 3;
        -webkit-column-count: 3;
        column-count: 3;
      }
    }

    @media (max-width: 800px) {
      #gallery-container {
        -moz-column-count: 2;
        -webkit-column-count: 2;
        column-count: 2;
      }
    }

    @media (max-width: 400px) {
      #gallery-container {
        -moz-column-count: 1;
        -webkit-column-count: 1;
        column-count: 1;
      }
    }
  </style>
  <div id="gallery-container"></div>
`;

class AppImageGallery extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [commonStyles];
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.appImageCards = [];
    this.imageToZoom = null;

    // image gallery container
    this.gallery = this.shadowRoot.querySelector('#gallery-container');

    // bind event handlers
    this.toggleLike = this.toggleLike.bind(this);
  }

  static get observedAttributes() {
    return ['data'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'data' && newValue !== oldValue) {
      const data = JSON.parse(newValue);
      // add new images
      if (!Boolean(oldValue)) {
        this.data.images.forEach(this.processImage.bind(this));
      } else if (!data.isUpdate) {
        this.shadowRoot.querySelectorAll('app-image-card').forEach((card) => {
          card.remove();
        });

        this.data.images.forEach(this.processImage.bind(this));
      } else {
        // remove existing images
        this.shadowRoot.querySelectorAll('app-image-card').forEach((card) => {
          for (const image of data.images) {
            if (image.id === JSON.parse(card.getAttribute('image'))) {
              card.remove();
              this.processImage(image);
              break;
            }
          }
        });
      }
    }
  }

  toggleLike(event) {
    this.data.images = this.data.images.map((image) => {
      if (image.id === event.detail.image.id) {
        return event.detail.image;
      }

      return image;
    });
  }

  get data() {
    return JSON.parse(this.getAttribute('data'));
  }

  set data(value) {
    this.setAttribute(
      'data',
      JSON.stringify({ images: value, isUpdate: true })
    );
  }

  processImage(image) {
    const appImageCard = document.createElement('app-image-card');

    appImageCard.setAttribute('image', JSON.stringify(image));
    appImageCard.addEventListener('toggleLike', this.toggleLike);
    appImageCard.addEventListener('click', this.activateImage);
    this.gallery.appendChild(appImageCard);

    this.appImageCards.push(appImageCard);
  }

  disconnectedCallback() {
    this.appImageCards.forEach((card) => {
      card.removeEventListener('toggleLike', this.toggleLike);
    });
  }
}

customElements.define('app-image-gallery', AppImageGallery);

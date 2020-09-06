import '../image-gallery/image-gallery.js';
import imageService from '../../services/image.service.js';

const template = document.createElement('template');

template.innerHTML = `
  <style>
    main {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
  </style>
  <main>
    <app-image-gallery></app-image-gallery>
  </main>
`;

class AppRoot extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // image-gallery
    this.imageGallery = this.shadowRoot.querySelector('app-image-gallery');

    this.images = [];

    // bind event handlers
    this.updateGallery = this.updateGallery.bind(this);
  }

  updateGallery(event) {
    this.setImages(event.detail.images);
  }

  setImages(images) {
    this.transformResponse(images);
    this.imageGallery.setAttribute(
      'data',
      JSON.stringify({ images: this.images, isUpdate: false })
    );
  }

  transformResponse(response) {
    this.images.length = 0;
    response.forEach((image) => {
      this.images.push({
        id: image.id,
        thumb: image.urls.thumb,
        small: image.urls.small,
        regular: image.urls.regular,
        full: image.urls.full,
        like: image.liked_by_user,
      });
    });
  }

  connectedCallback() {
    imageService.getImages().then((response) => {
      this.updateGallery({ detail: response });
    });
  }
}

customElements.define('app-root', AppRoot);

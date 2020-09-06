import '../header/header.js';
import '../image-gallery/image-gallery.js';
import '../pagination/pagination.js';
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
    <app-header></app-header>
    <app-image-gallery></app-image-gallery>
    <app-pagination></app-pagination>
  </main>
`;

class AppRoot extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // header
    this.header = this.shadowRoot.querySelector('app-header');
    // image-gallery
    this.imageGallery = this.shadowRoot.querySelector('app-image-gallery');
    // pagination
    this.pagination = this.shadowRoot.querySelector('app-pagination');

    this.images = [];

    // bind event handlers
    this.updateGallery = this.updateGallery.bind(this);
  }

  updateGallery(event) {
    this.setImages(event.detail.images);
    this.updatePagination(event.detail);
  }

  updatePagination(detail) {
    this.pagination.setAttribute('config', JSON.stringify(detail));
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

    // handle image search
    this.header.addEventListener('search', this.updateGallery);
    // handle pagination
    this.pagination.addEventListener('paginate', this.updateGallery);
  }

  disconnectedCallback() {
    this.header.removeEventListener('search', this.updateGallery);
    this.pagination.removeEventListener('paginate', this.updateGallery);
  }
}

customElements.define('app-root', AppRoot);

import '../image-card/image-card.js';
import '../smart-image/smart-image.js';
import imageService from '../../services/image.service.js';
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

    .zoom-in {
      cursor: zoom-in;
    }

    .zoom-out {
      cursor: zoom-out;
    }

    .zoomed-image-container {
      position: absolute;
      background-color: rgba(0, 0, 0, 0.8);
      z-index: 100000;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      width: 100%;
      min-height: 100%;

      top: 0;
      left: 0;
    }

    .zoomed-image-container img {
      z-index: 999999;
    }

    .zoomed-image-container .close-zoom-container {
      color: white;
      position: absolute;
      top: 1rem;
      right: 1rem;
      font-size: 2rem;

      cursor: pointer;
    }
  </style>
  <div id="gallery-container"></div>
  <div
    class="zoomed-image-container hide"
  >
    <span class="close-zoom-container"
      >X</span
    >
    <app-smart-image></app-smart-image>
  </div>
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
    // zoomed image container
    this.zoomContainer = this.shadowRoot.querySelector(
      '.zoomed-image-container'
    );
    // close zoom container
    this.closeZoomContainer = this.shadowRoot.querySelector(
      '.close-zoom-container'
    );
    // smart image container
    this.smartImage = this.shadowRoot.querySelector('app-smart-image');

    // bind event handlers
    this.toggleLike = this.toggleLike.bind(this);
    this.activateImage = this.activateImage.bind(this);
    this.closeZoomImageContainer = this.closeZoomImageContainer.bind(this);
    this.zoom = this.zoom.bind(this);
    this.keyDown = this.keyDown.bind(this);
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

  activateImage(event) {
    if (!event.path.find((value) => value.nodeName === 'SPAN')) {
      const image = JSON.parse(event.target.getAttribute('image'));
      this.imageToZoom = {
        image,
        activeImage: image.small,
        activeIndex: 0,
        action: 'zoom-in',
      };
      imageService.setImageToZoom(this.imageToZoom);
      this.zoomContainer.classList.add('zoom-in');
    }
  }

  removeZoomCursor() {
    this.zoomContainer.classList.remove('zoom-in');
    this.zoomContainer.classList.remove('zoom-out');
  }

  closeZoomImageContainer(event) {
    event.stopImmediatePropagation();
    imageService.setImageToZoom(null);
    this.removeZoomCursor();
  }

  processImage(image) {
    const appImageCard = document.createElement('app-image-card');

    appImageCard.setAttribute('image', JSON.stringify(image));
    appImageCard.addEventListener('toggleLike', this.toggleLike);
    appImageCard.addEventListener('click', this.activateImage);
    this.gallery.appendChild(appImageCard);

    this.appImageCards.push(appImageCard);
  }

  zoomImage(imageToZoom) {
    if (imageToZoom.action === 'zoom-in' && imageToZoom.activeIndex <= 2) {
      this.zoomInImage(imageToZoom);
    } else if (
      imageToZoom.action === 'zoom-out' &&
      imageToZoom.activeIndex >= 1
    ) {
      this.zoomOutImage(imageToZoom);
    }

    imageService.setImageToZoom(imageToZoom);
  }

  zoomInImage(imageToZoom) {
    imageToZoom.activeIndex += 1;
    switch (imageToZoom.activeIndex) {
      case 1:
        imageToZoom.activeImage = imageToZoom.image.regular;
        break;
      case 2:
        imageToZoom.activeImage = imageToZoom.image.full;
        imageToZoom.action = 'zoom-out';
        this.zoomContainer.classList.remove('zoom-in');
        this.zoomContainer.classList.add('zoom-out');
        break;
    }
  }

  zoomOutImage(imageToZoom) {
    imageToZoom.activeIndex -= 1;
    switch (imageToZoom.activeIndex) {
      case 0:
        imageToZoom.activeImage = imageToZoom.image.small;
        imageToZoom.action = 'zoom-in';
        this.zoomContainer.classList.remove('zoom-out');
        this.zoomContainer.classList.add('zoom-in');
        break;
      case 1:
        imageToZoom.activeImage = imageToZoom.image.regular;
        break;
    }
  }

  zoom() {
    this.zoomImage(this.imageToZoom);
  }

  keyDown(event) {
    const key = event.key;
    if (key === 'Escape') {
      imageService.setImageToZoom(null);
      this.removeZoomCursor();
    }
  }

  connectedCallback() {
    imageService.imageToZoom$.subscribe((value) => {
      this.imageToZoom = value;

      if (value) {
        this.zoomContainer.classList.remove('hide');
        this.smartImage.setAttribute('src', value.activeImage);
      } else {
        this.smartImage.setAttribute('src', '');
        this.zoomContainer.classList.add('hide');
      }
    });

    // add event handler to close zoom container
    this.closeZoomContainer.addEventListener(
      'click',
      this.closeZoomImageContainer
    );

    // handle click on zoom container
    this.zoomContainer.addEventListener('click', this.zoom);

    // close zoom container on escape
    document.addEventListener('keydown', this.keyDown);
  }

  disconnectedCallback() {
    this.appImageCards.forEach((card) => {
      card.removeEventListener('toggleLike', this.toggleLike);
    });

    this.closeZoomContainer.removeEventListener(
      'click',
      this.closeZoomImageContainer
    );

    this.zoomContainer.removeEventListener('click', this.zoom);

    document.removeEventListener('keydown', this.keyDown);
  }
}

customElements.define('app-image-gallery', AppImageGallery);

const template = document.createElement('template');

template.innerHTML = `
  <style>
    .app-spinner {
      display: inline-block;
      position: relative;
      width: 80px;
      height: 80px;
    }

    .app-spinner div {
      position: absolute;
      top: 33px;
      width: 13px;
      height: 13px;
      border-radius: 50%;
      background: #fff;
      animation-timing-function: cubic-bezier(0, 1, 1, 0);
    }

    .app-spinner div:nth-child(1) {
      left: 8px;
      animation: app-spinner1 0.6s infinite;
    }

    .app-spinner div:nth-child(2) {
      left: 8px;
      animation: app-spinner2 0.6s infinite;
    }

    .app-spinner div:nth-child(3) {
      left: 32px;
      animation: app-spinner2 0.6s infinite;
    }
    .app-spinner div:nth-child(4) {
      left: 56px;
      animation: app-spinner3 0.6s infinite;
    }

    @keyframes app-spinner1 {
      0% {
        transform: scale(0);
      }
      100% {
        transform: scale(1);
      }
    }

    @keyframes app-spinner3 {
      0% {
        transform: scale(1);
      }
      100% {
        transform: scale(0);
      }
    }

    @keyframes app-spinner2 {
      0% {
        transform: translate(0, 0);
      }
      100% {
        transform: translate(24px, 0);
      }
    }
  </style>

  <div class="app-spinner">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
  </div>
`;

export class AppSpinner extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('app-spinner', AppSpinner);

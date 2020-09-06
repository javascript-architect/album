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
  </main>
`;

class AppRoot extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('app-root', AppRoot);

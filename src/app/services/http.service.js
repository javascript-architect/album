import config from '../../config/app.config.js';

class Http {
  constructor() {
    this.options = {
      headers: {
        Authorization: `Client-ID ${config.UNSPLASH_ACCESS_KEY}`,
      },
    };
  }

  async get(url, options) {
    return fetch(url, (options = this.options))
      .then((response) => {
        if (response.ok) {
          return response.json();
        }

        throw Error(response.statusText);
      })
      .catch((error) => {
        throw Error(error.message);
      });
  }
}

export default new Http();

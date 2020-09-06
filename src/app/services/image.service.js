import { Subject, BehaviorSubject } from 'rxjs';

import http from './http.service.js';
import config from '../../config/app.config.js';

class ImageService {
  constructor(http) {
    this.http = http;
    this.imageToZoom = new Subject();
    this.searchText = new BehaviorSubject('');
  }

  get imageToZoom$() {
    return this.imageToZoom.asObservable();
  }

  setImageToZoom(imageToZoom) {
    this.imageToZoom.next(imageToZoom);
  }

  get searchText$() {
    return this.searchText.asObservable();
  }

  setSearchText(searchText) {
    this.searchText.next(searchText);
  }

  async getImages(page = 1) {
    const images = await this.http.get(
      `${config.UNSPLASH_API}/photos?page=${page}`
    );
    return {
      page,
      images,
      totalPages: Infinity,
    };
  }

  async searchImages(page = 1) {
    if (this.searchText.value) {
      const response = await this.http.get(
        `${config.UNSPLASH_API}/search/photos?query=${encodeURIComponent(
          this.searchText.value
        )}&page=${page}`
      );

      return {
        page,
        totalPages: response.total_pages,
        images: response.results,
      };
    }

    return this.getImages(page);
  }
}

export default new ImageService(http);

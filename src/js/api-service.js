import axios from 'axios';

const API_KEY = '40638542-671402e9a996bdf1173ac4708';

const BASE_URL = `https://pixabay.com/api/?key=${API_KEY}`;

export class PixabayService {
  constructor(searchQuery) {
    this.searchQuery = searchQuery;
    this.page = 1;
    this.perPage = 40;
  }

  async fetchPixabay() {
    try {
      const { data } = await axios.get(
        `${BASE_URL}&q=${this.searchQuery}&page=${this.page}&per_page=${this.perPage}&image_type=photo&orientation=horizontal&safesearch=true`
      );
      return data;
    } catch (error) {}
  }

  nextPage() {
    this.page += 1;
  }

  getQuery() {
    return this.searchQuery;
  }

  setQuery(value) {
    this.searchQuery = value;
  }
}

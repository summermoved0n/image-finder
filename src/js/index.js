import { PixabayService } from './api-service';

const apiService = new PixabayService();

const formEl = document.querySelector('.search-form');
const inputEl = document.querySelector('.form-input');
const listEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

inputEl.addEventListener('input', e => {
  const { value } = e.target;
  apiService.setQuery(value);
});

formEl.addEventListener('submit', async e => {
  e.preventDefault();
  const { hits } = await apiService.fetchPixabay();
  markupPixabay(hits);
  loadMoreBtn.style.display = 'block';
});

loadMoreBtn.addEventListener('click', async e => {
  apiService.nextPage();
  const data = await apiService.fetchPixabay();
  markupPixabay(data.hits);
});

function markupPixabay(data) {
  const markup = data
    .map(
      ({ webformatURL, tags, likes, views, comments, downloads }) => `
  <div class="photo-card">
  <img src=${webformatURL} alt="${tags} loading="lazy" width=320/>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <b>${likes}</b>
    </p>
    <p class="info-item">
      <b>Views</b>
      <b>${views}</b>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <b>${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <b>${downloads}</b>
    </p>
  </div>
</div>`
    )
    .join('');
  listEl.insertAdjacentHTML('beforeend', markup);
}

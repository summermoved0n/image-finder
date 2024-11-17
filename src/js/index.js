import { PixabayService } from './api-service';
import Notiflix from 'notiflix';

const apiService = new PixabayService();

const formEl = document.querySelector('.search-form');
const inputEl = document.querySelector('.form-input');
const listEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const textEndEl = document.querySelector('.text-reach-end');

inputEl.addEventListener('input', e => {
  const { value } = e.target;
  apiService.setQuery(value);
});

formEl.addEventListener('submit', async e => {
  e.preventDefault();
  textEndEl.style.display = 'none';
  loadMoreBtn.style.display = 'none';
  listEl.innerHTML = '';
  apiService.resetPage();
  const data = await apiService.fetchPixabay();
  const currentPage = apiService.currentPage();
  const currentPerPage = apiService.getPerpage();
  const { hits, totalHits } = data;

  if (hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  markupPixabay(hits);
  Notiflix.Notify.success(`"Hooray! We found ${totalHits} images`);

  if (totalHits / currentPage <= currentPerPage) {
    textEndEl.style.display = 'block';
    loadMoreBtn.style.display = 'none';

    return;
  }

  loadMoreBtn.style.display = 'block';
});

loadMoreBtn.addEventListener('click', async e => {
  apiService.nextPage();
  const data = await apiService.fetchPixabay();
  const currentPage = apiService.currentPage();
  const currentPerPage = apiService.getPerpage();

  console.log(currentPage);
  const { hits, totalHits } = data;
  console.log(totalHits);

  if (totalHits / currentPage <= currentPerPage) {
    textEndEl.style.display = 'block';
    loadMoreBtn.style.display = 'none';
  }

  markupPixabay(hits);

  const { height: cardHeight } =
    listEl.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
});

function markupPixabay(data) {
  const markup = data
    .map(
      ({
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
        largeImageURL,
      }) => `
  <div class="photo-card">
  <a class="gallery__link" href=${largeImageURL}>
  <img src=${webformatURL} alt="${tags}" loading="lazy" width=320/>
  </a>
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

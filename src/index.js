import './css/styles.css';
import fetchCountries from './JS/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputData: document.querySelector('input#search-box'),
  list: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

const { inputData, list, countryInfo } = refs;

inputData.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));


function onSearch(e) {
  const inputForSearch = e.target.value.trim();
  if (inputForSearch === '') {
    list.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  } else {
    return fetchCountries(inputForSearch)
      .then(countries => renderCountries(countries))
      .catch(error => {
        console.log(error);
        Notify.failure('Oops, there is no country with that name');
      });
  }
}


function renderCountries(countries) {
  if (countries.length > 10) {
    list.innerHTML = '';
    countryInfo.innerHTML = '';
    return Notify.info('Too many matches found. Please enter a more specific name.');
  }
  if (countries.length > 1) {
    const markup = countries
      .map(({ name, flags }) => {
        return `<li><img src="${flags.svg}" width="50" /> ${name}</li>`;
      })
      .join('');
    list.innerHTML = markup;
    countryInfo.innerHTML = '';
  }
  if (countries.length === 1) {
    const markupList = countries
      .map(({ name, flags }) => {
        return `<li><img src="${flags.svg}" width="60" /> ${name}</li>
        `;
      })
      .join('');
    const markupDivInfo = countries
      .map(({ capital, population, languages }) => {
        return `<p> Capital: <span>${capital}</span></p>
        <p> Population: <span>${population}</span></p>
        <p> Languages: <span>${languages[0].name}</span></p>`;
      })
      .join('');
    list.innerHTML = markupList;
    countryInfo.innerHTML = markupDivInfo;
  }
}
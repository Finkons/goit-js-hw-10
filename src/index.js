import './css/styles.css';
import fetchCountries from './JS/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputData: document.querySelector('input#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

const { inputData, countryList, countryInfo } = refs;

inputData.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  const onSearchInput = e.target.value.trim()
  if (onSearchInput === '') {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  } else {
    return fetchCountries(onSearchInput)
      .then(countries => renderCountries(countries))
      .catch(error => {
        console.log(error);
        Notify.failure('Oops, there is no country with that name');
      });
  }
}

function renderCountries(countries) {
  if (countries.length > 10) {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    return Notify.info('Too many matches found. Please enter a more specific name.')
  }
  if (countries.length > 1) {
    const markup = countries.map(({ name, flags }) => {
      return `<li><img src="${flags.svg}" width="50" /> ${name}</li>`;
    }).join('')
    countryList.innerHTML = markup;
    countryInfo.innerHTML = '';
  }
  if (countries.length === 1) {
    const markupInfo = countries
      .map(({ name, flags, capital, population, languages }) => {
        return `<li><img src="${flags.svg}" width="60" /> ${name}</li>
        <p> Capital: <span>${capital}</span></p>
        <p> Population: <span>${population}</span></p>
        <p> Languages: <span>${languages[0].name}</span></p>`;
      })
      .join('');
    countryList.innerHTML = '';
    countryInfo.innerHTML = markupInfo;
  }
}

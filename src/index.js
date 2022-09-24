import './css/styles.css';

import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputEl: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.inputEl.addEventListener(
  'input',
  debounce(onInputCityName, DEBOUNCE_DELAY)
);

function onInputCityName(evt) {
  evt.preventDefault();

  let input = evt.target.value.trim();
  clearDOMBeforeFetch();
  if (input) {
    fetchCountries(input)
      .then(data => {
        let counter = 0;
        for (let elem of data) {
          if (elem) {
            counter += 1;
          }
        }
        if (counter > 10) {
          return Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        }
        if (1 < counter && counter < 10) {
          makeListOfCountries(data);
          return;
        }
        makeInfoOfCountries(data);
      })
      .catch(error => {
        Notify.failure('Oops, there is no country with that name');
      });
  }
}

function makeListOfCountries(data) {
  const containerListArr = [];

  for (const el of data) {
    const listElement = `<li class="country-list-item"><img src="${el.flags.svg}" alt="flag ${el.name.common}" width="20"/><span class="country-list-name">${el.name.official}</span></li>`;
    containerListArr.push(listElement);
  }

  refs.countryList.insertAdjacentHTML('beforeend', containerListArr.join(''));
  //   Notify.warning('Please enter specific name.');
}
function makeInfoOfCountries(data) {
  const languagesArr = Object.values(data[0].languages);
  const countryElInfo = `<div class="country-info-name">
      <img src="${data[0].flags.svg}" alt="flag ${
    data[0].name.common
  }" width="30" /><span class="country-name">${data[0].name.official}</span>
      </div>
      <p class="country-info-item">Capital: <span>${
        data[0].capital[0]
      }</span></p>
      <p class="country-info-item">Population: <span>${
        data[0].population
      }</span></p>
      <p class="country-info-item">Languages: <span>${languagesArr.join(
        ', '
      )}</span></p>`;

  refs.countryInfo.insertAdjacentHTML('beforeend', countryElInfo);
}
function clearDOMBeforeFetch() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}

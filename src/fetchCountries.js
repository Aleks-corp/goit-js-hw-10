export function fetchCountries(input) {
  return new Promise((resolve, reject) => {
    fetch(
      `https://restcountries.com/v3.1/name/${input}?fields=name,capital,population,flags,languages`
    ).then(response => {
      if (!response.ok) {
        reject(new Error(response.status));
      }
      resolve(response.json());
    });
  });
}

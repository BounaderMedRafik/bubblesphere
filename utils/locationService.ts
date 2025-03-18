export const fetchCountries = async (continent: string) => {
  const response = await fetch(
    `https://restcountries.com/v3.1/region/${continent}`
  );
  const data = await response.json();
  return data.map((country: any) => country.name.common);
};

export const fetchStates = async (country: string) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?country=${country}&format=json`
  );
  const data = await response.json();
  return [...new Set(data.map((item: any) => item.address.state))].filter(
    Boolean
  );
};

export const CONTINENTS = [
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "Oceania",
  "South America",
];

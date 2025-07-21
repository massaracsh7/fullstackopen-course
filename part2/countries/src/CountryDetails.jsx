
export const CountryDetails = ({ country }) => (
  <div>
    <h2>{country.name.common}</h2>
    <div>Capital: {country.capital?.[0]}</div>
    <div>Area: {country.area}</div>
    <h4>Languages:</h4>
    <ul>
      {Object.values(country.languages || {}).map(lang => (
        <li key={lang}>{lang}</li>
      ))}
    </ul>
    <img src={country.flags.svg} alt="flag" width="150" />
  </div>
)
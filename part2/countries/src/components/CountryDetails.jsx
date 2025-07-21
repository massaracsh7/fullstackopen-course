import Weather from './Weather'

const CountryDetails = ({ country }) => {
  const capital = country.capital?.[0]

  return (
    <div>
      <h2>{country.name.common}</h2>
      <div>Capital: {capital}</div>
      <div>Area: {country.area}</div>

      <h4>Languages:</h4>
      <ul>
        {Object.values(country.languages || {}).map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>

      <img src={country.flags.svg} alt="flag" width="150" />

      {capital && <Weather capital={capital} />}
    </div>
  )
}

export default CountryDetails

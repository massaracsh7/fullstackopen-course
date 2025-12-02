import { useState } from 'react'
import { useCountry } from './hooks/useCountry'

const CountryInfo = () => {
  const [name, setName] = useState('')
  const country = useCountry(name)

  const handleSubmit = (e) => {
    e.preventDefault()
    setName(e.target.country.value)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input name="country" />
        <button>find</button>
      </form>

      {country ? (
        <div>
          <h2>{country.name.common}</h2>
          <div>capital {country.capital}</div>
          <div>population {country.population}</div>
          <img src={country.flags.png} alt={`flag of ${country.name.common}`} width="100" />
        </div>
      ) : (
        name && <p>not found...</p>
      )}
    </div>
  )
}

export default CountryInfo

import { useState, useEffect } from 'react'
import CountryDetails from './components/CountryDetails'
import getCountries from './services/countries'

function App() {
  const [countries, setCountries] = useState([])
  const [query, setQuery] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    getCountries().then(setCountries)
  }, [])

  const filtered = countries.filter(c =>
    c.name.common.toLowerCase().includes(query.toLowerCase())
  )

  const handleShow = (country) => {
    setSelectedCountry(country)
  }

  const showList = () => {
    if (query === '') return null
    if (filtered.length > 10) {
      return <p>Too many matches, specify another filter</p>
    }
    if (filtered.length > 1) {
      return (
        <ul>
          {filtered.map(c => (
            <li key={c.cca3}>
              {c.name.common}
              <button onClick={() => handleShow(c)}>Show</button>
            </li>
          ))}
        </ul>
      )
    }
    if (filtered.length === 1) {
      return <CountryDetails country={filtered[0]} />
    }
    return <p>No matches</p>
  }

  return (
    <div>
      <div>
        find countries: <input value={query} onChange={e => {
          setQuery(e.target.value)
          setSelectedCountry(null)
        }} />
      </div>
      {selectedCountry
        ? <CountryDetails country={selectedCountry} />
        : showList()}
    </div>
  )
}

export default App

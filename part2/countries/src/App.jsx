import { useState, useEffect } from 'react'
import axios from 'axios'
import CountryDetails from './CountryDetails'

function App() {
  const [countries, setCountries] = useState([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(res => setCountries(res.data))
  }, [])

  const filtered = countries.filter(c =>
    c.name.common.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div>
      <div>
        find countries: <input value={query} onChange={e => setQuery(e.target.value)} />
      </div>

      {filtered.length > 10 && <p>Too many matches, specify another filter</p>}

      {filtered.length <= 10 && filtered.length > 1 && (
        <ul>
          {filtered.map(c => <li key={c.cca3}>{c.name.common}</li>)}
        </ul>
      )}

      {filtered.length === 1 && <CountryDetails country={filtered[0]} />}
    </div>
  )
}

export default App

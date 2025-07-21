import { useEffect, useState } from 'react'
import getCity from '../services/weather'

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    getCity(capital).then(setWeather)
  }, [capital])

  if (!weather) return <p>Loading weather...</p>

  const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`

  return (
    <div>
      <h4>Weather in {capital}</h4>
      <div>Temperature: {weather.main.temp} °C</div>
      <img src={iconUrl} alt={weather.weather[0].description} />
      <div>Wind: {weather.wind.speed} m/s</div>
    </div>
  )
}

export default Weather

import axios from 'axios'
const apiKey = import.meta.env.VITE_WEATHER_KEY

const getCity = async (city) => {
  const url = 'https://api.openweathermap.org/data/2.5/weather'
  const res = await axios.get(url, {
    params: {
      q: city,
      appid: apiKey,
      units: 'metric',
    }
  })
  return res.data
}

export default getCity;

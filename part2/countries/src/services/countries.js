import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'

const getCountries = async () => {
  const res = await axios.get(baseUrl);
  return res.data;
}

export default getCountries;

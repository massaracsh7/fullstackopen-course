import axios from 'axios'
const baseUrl = '/api/blogs'

const isLogin = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { isLogin }
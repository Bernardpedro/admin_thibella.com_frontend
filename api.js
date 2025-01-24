import Apidog from 'apidog'

const apidog = new Apidog({
  baseURL: 'https://your-api-base-url.com',
  // Optional configuration
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Example API method
export const fetchUsers = () => {
  return apidog.get('/users')
}

export default apidog
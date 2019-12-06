import axios from 'axios'

// App Login
export const loginaxios = axios.create({
  baseURL: 'http://localhost:3000/api/',
  timeout: 3000,
  headers: { 'content-type': 'application/json' }
})

// App Cluster
export const clusteraxios = axios.create({
  baseURL: 'http://localhost:3000/api/',
  timeout: 3000,
  headers: { 'content-type': 'application/json' }
})

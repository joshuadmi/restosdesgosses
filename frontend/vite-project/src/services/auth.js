import api from './api'

export function login({ email, motDePasse }) {
  return api.post('/auth/login', { email, motDePasse })
}

export function register({ nom, email, motDePasse, captcha }) {
  return api.post('/auth/register', { nom, email, motDePasse, captcha })
}

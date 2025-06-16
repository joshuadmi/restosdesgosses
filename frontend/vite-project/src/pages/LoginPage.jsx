import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login({ email, motDePasse })
      navigate('/') // redirige vers la homepage
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ maxWidth: 400, margin: '2rem auto', padding: '1rem' }}>
      <h1>Connexion</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email<br />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
        </label>

        <label style={{ marginTop: '1rem' }}>
          Mot de passe<br />
          <input
            type="password"
            value={motDePasse}
            onChange={e => setMotDePasse(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>

        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

        <button type="submit" disabled={loading} style={{ marginTop: '1rem' }}>
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </main>
  )
}

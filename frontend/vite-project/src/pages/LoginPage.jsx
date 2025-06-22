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
    <main>
      <h1 className='colored-title'>
          <span className="titre-red">Co</span>{""}
          <span className="titre-yellow">nn</span>{""}
          <span className="titre-blue">ex</span>{""}
          <span className="titre-green">ion</span>
        </h1>
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

        <label >
          Mot de passe<br />
          <input
            type="password"
            value={motDePasse}
            onChange={e => setMotDePasse(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>

        {error && <p className='error'>{error}</p>}

        <button type="submit" disabled={loading} >
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </main>
  )
}

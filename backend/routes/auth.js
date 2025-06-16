// routes/auth.js
import { Router } from 'express'
import { register, login } from '../controllers/authController.js'

const router = Router()

// Inscription
router.post('/register', register)

// Connexion
router.post('/login', login)


// juste pour tester qu’il monte correctement
router.get('/', (req, res) => {
  res.json({ message: 'Auth route OK' })
})

export default router

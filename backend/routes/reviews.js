
import { Router } from 'express'
import { addReview, getReviews, updateReview, deleteReview } from '../controllers/reviewController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = Router()

router.post('/:restaurantId', protect, addReview)
router.get('/:restaurantId', getReviews)
router.put('/edit/:reviewId', protect, updateReview);
router.delete('/delete/:reviewId', protect, deleteReview);


export default router

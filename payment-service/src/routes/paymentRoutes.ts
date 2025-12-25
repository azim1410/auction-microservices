import { Router } from 'express';
import { processPayment } from '../controllers/paymentController';

const router = Router();
router.post('/payments', processPayment);

export default router;
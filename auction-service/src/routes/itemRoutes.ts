import { Router } from 'express';
import { addItem } from '../controllers/itemController';

const router = Router();

router.post('/:auctionId/items', addItem);

export default router;
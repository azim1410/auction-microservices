import { Request, Response } from 'express';

import { publishEvent } from '../utils/rabbitmq';

export const processPayment = async (req: Request, res: Response) => {
  try {
    const { auctionId, userId, amount } = req.body;
    // Simulate payment
    await publishEvent('payment.completed', {
      auctionId,
      userId,
      status: 'success'
    });
    res.json({ status: 'success' });
  } catch (err: any) {
    await publishEvent('payment.completed', {
      auctionId: req.body.auctionId,
      userId: req.body.userId,
      status: 'failed'
    });
    res.status(500).json({ status: 'failed', error: err.message });
  }
};
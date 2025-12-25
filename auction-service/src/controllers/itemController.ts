import { Request, Response } from 'express';
import { addItemToAuction } from '../services/itemService';

export const addItem = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const auctionId = Number(req.params.auctionId);
    const item = await addItemToAuction(auctionId, { name, description });
    res.status(201).json(item);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to add item', error: err.message });
  }
};
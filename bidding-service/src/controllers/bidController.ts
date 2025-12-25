import { Request, Response } from "express";
import { getAuctionWinner, getBidsForAuction, placeBid } from "../services/bidService";

export const placeBidController = async (req: Request, res: Response) => {
  try {
    const { auctionId, amount } = req.body;
    const userId = (req as any).user?.id || req.body.userId; // fallback for testing
    if (!auctionId || !userId || !amount) {
      return res
        .status(400)
        .json({ message: "auctionId, userId, and amount are required" });
    }
    const bid = await placeBid({ auctionId, userId, amount });
    res.status(201).json(bid);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Failed to place bid", error: err.message });
  }
};

export const getAuctionBidsController = async (req: Request, res: Response) => {
  try {
    const auctionId = Number(req.params.auctionId);
    const page = parseInt(req.params.page as string) || 1;
    const limit = parseInt(req.params.limit as string) || 10;
    const bids = await getBidsForAuction(auctionId, page, limit);
    res.json(bids);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Failed to fetch bids", error: err.message });
  }
};

export const getAuctionWinnerController = async (req: Request, res: Response) => {
  try {
    const auctionId = Number(req.params.auctionId);
    const winner = await getAuctionWinner(auctionId);
    res.json({ winner });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to get winner', error: err.message });
  }
};
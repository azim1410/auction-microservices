import { Request, Response } from "express";
import {
  createAuction,
  endAuction,
  listAuctions,
} from "../services/auctionService";

export const create = async (req: Request, res: Response) => {
  try {
    const auction = await createAuction(req.body);
    res.status(201).json(auction);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Failed to create auction", error: err.message });
  }
};

export const list = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string | undefined;
    const auctions = await listAuctions(page, limit, status);
    res.json(auctions);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Failed to list auctions", error: err.message });
  }
};

export const endAuctionController = async (_req: Request, res: Response) => {
  try {
    const auctionId = Number(_req.params.id);
    const auction = await endAuction(auctionId);
    res.json({ message: "Auction ended", auction });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

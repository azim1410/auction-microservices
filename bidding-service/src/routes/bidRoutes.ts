import { Router } from "express";
import {
  placeBidController,
  getAuctionBidsController,
  getAuctionWinnerController,
} from "../controllers/bidController";
import { leakyBucketRateLimiter } from "../middlewares/leakyBucketRateLimiter";

const router = Router();

// Place a bid
router.post("/", leakyBucketRateLimiter, placeBidController);

// Get all bids for an auction
// GET /api/auctions/:id?page=2&limit=5&status=active
router.get("/auction/:auctionId", getAuctionBidsController);

// Get the winer
router.get("/auction/:auctionId/winner", getAuctionWinnerController);

export default router;

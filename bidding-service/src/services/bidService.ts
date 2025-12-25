import Bid from "../models/Bid";
import { publishEvent } from "../utils/rabbitmq";

export const placeBid = async (data: {
  auctionId: number;
  userId: number;
  amount: number;
}) => {
  return Bid.create(data);
};

export const getBidsForAuction = async (
  auctionId: number,
  page: number,
  limit: number
) => {
  // return Bid.findAll({ where: { auctionId }, order: [["amount", "DESC"]] });
  const offset = (page - 1) * limit;
  const { rows: bids, count: total } = await Bid.findAndCountAll({
    where: { auctionId },
    limit,
    offset,
    order: [["amount", "DESC"]],
  });

  const data = {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    bids,
  };

  return data;
};

export const determineWinner = async (auctionId: number) => {
  // Get all bids for the auction, highest first
  const bids = await Bid.findAll({
    where: { auctionId },
    order: [["amount", "DESC"]],
  });

  if (bids.length === 0) {
    // No bids placed
    await publishEvent("auction.winner-determined", {
      auctionId,
      winner: null,
    });
    return null;
  }

  const winnerBid = bids[0];
  const winner = { userId: winnerBid.userId, amount: winnerBid.amount };

  // Publish winner event
  await publishEvent("auction.winner-determined", { auctionId, winner });

  return winner;
};

export const getAuctionWinner = async (auctionId: number) => {
  const bids = await Bid.findAll({
    where: { auctionId },
    order: [["amount", "DESC"]],
    limit: 1,
  });
  if (bids.length === 0) return null;
  const winnerBid = bids[0];
  return { userId: winnerBid.userId, amount: winnerBid.amount };
};

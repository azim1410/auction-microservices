import Auction from "../models/Auction";
import Item from "../models/Item";
import { publishEvent } from "../utils/rabbitmq";

export const createAuction = async (data: {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  items: { name: string; description: string }[];
}) => {
  const auction = await Auction.create(
    {
      title: data.title,
      description: data.description,
      startTime: data.startTime,
      endTime: data.endTime,
      // @ts-expect-error
      items: data.items,
    },
    { include: [{ model: Item, as: "items" }] }
  );
  return auction;
};

export const listAuctions = async (
  page: number,
  limit: number,
  status?: string
) => {
  // return Auction.findAll({ include: [{ model: Item, as: "items" }] });

  const where: any = {};
  if (status) where.status = status;

  const offset = (page - 1) * limit;

  const { rows: auctions, count: total } = await Auction.findAndCountAll({
    where,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  const data = {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    auctions,
  };

  return data;
};

export const endAuction = async (auctionId: number) => {
  // 1. Find the auction
  const auction = await Auction.findByPk(auctionId);
  if (!auction) {
    throw new Error("Auction not found");
  }

  // 2. Check if already ended
  if (auction.status === "ended") {
    throw new Error("Auction is already ended");
  }

  // 3. Update status to 'ended'
  auction.status = "ended";
  await auction.save();

  // 4. Emit event to RabbitMQ
  await publishEvent("auction.ended", { auctionId: auction.id });

  // 5. Return updated auction
  return auction;
};

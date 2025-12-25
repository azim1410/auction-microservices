import Item from "../models/Item";

export const addItemToAuction = (
  auctionId: number,
  data: { name: string; description: string }
) => {
  return Item.create({ ...data, auctionId });
};

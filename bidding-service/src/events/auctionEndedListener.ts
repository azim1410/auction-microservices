import { consumeEvent } from '../utils/rabbitmq';
import { determineWinner } from '../services/bidService';

export const listenForAuctionEnded = async () => {
  await consumeEvent('auction.ended', async (data) => {
    const { auctionId } = data;
    console.log(`Received auction.ended for auctionId: ${auctionId}`);
    await determineWinner(auctionId);
  },'bidding-auction-ended');
};
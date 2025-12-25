import { consumeEvent } from '../utils/rabbitmq';
import { handleAuctionEnded } from '../workflows/auctionSaga';

export const listenForAuctionEnded = async () => {
    console.log("Orchestrator: Listening for auction.ended events...");
    await consumeEvent('auction.ended', async (data) => {
    const { auctionId } = data;
    console.log("i am here in the listen for auction Ended function", auctionId);
    console.log(`Orchestrator: Received auction.ended for auctionId: ${auctionId}`);
    await handleAuctionEnded(auctionId);
  }, 'orchestrator-auction-ended');
};
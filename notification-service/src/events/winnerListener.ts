import { Server } from 'socket.io';
import { consumeEvent } from '../utils/rabbitmq';

interface auctionData { 
    auctionId: number,
    winner: any,
}

export const listenForWinnerEvent = async (io: Server) => {
  await consumeEvent(
    'auction.winner-determined',
    async (data: auctionData) => {
      const { auctionId, winner } = data;
      console.log('Received winner event:', data);
  
      if (winner && winner.userId) {
        io.to(String(winner.userId)).emit('auction-won', {
          auctionId,
          amount: winner.amount,
          message: `Congratulations!, ${winner.userId} You won the auction.`
        });
      }
    },
    'notification-winner-determined' // <-- unique queue name for this service
  );
};
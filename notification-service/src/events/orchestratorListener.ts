import { Server } from "socket.io";
import { consumeEvent, publishEvent } from "../utils/rabbitmq";

export const listenForOrchestratorNotifyWinner = async (io: Server) => {
  await consumeEvent(
    "orchestrator.notify-winner",
    async (data) => {
      const { auctionId, userId, amount } = data;
      io.to(String(userId)).emit("auction-won", {
        auctionId,
        amount,
        message: "Congratulations! You won the auction (Saga Orchestrator).",
      });
      // Emit confirmation
      await publishEvent("notification.sent", {
        auctionId,
        userId,
        status: "sent",
      });
    },
    "notification-orchestrator-notify-winner"
  );
};

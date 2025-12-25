import { consumeEvent, publishEvent } from "../utils/rabbitmq";

export const listenForPaymentRequested = async () => {
  await consumeEvent(
    "payment.requested",
    async (data) => {
      const { auctionId, userId, amount } = data;
      console.log(
        `[Payment] Received payment.requested for auctionId: ${auctionId}, userId: ${userId}, amount: ${amount}`
      );
      // Simulate payment processing
      await publishEvent("payment.completed", {
        auctionId,
        userId,
        status: "success",
      });
      console.log(
        `[Payment] Published payment.completed for auctionId: ${auctionId}, userId: ${userId}`
      );
    },
    "payment-service-payment-requested" // unique queue name
  );
};

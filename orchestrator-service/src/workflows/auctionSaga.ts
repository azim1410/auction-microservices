import axios from "axios";
import { publishEvent } from "../utils/rabbitmq";
import { waitForEvent } from "../utils/waitForEvent";

const MAX_RETRIES = 3;

export const handleAuctionEnded = async (auctionId: number) => {
  console.log(
    "Orchestrator: handleAuctionEnded called for auctionId",
    auctionId
  );
  console.log("here in handleAuctionEnded ", auctionId);
  try {
    // 1. Get winner from Bidding Service
    const winnerRes = await axios.get(
      `${process.env.BIDDING_SERVICE_URL}/api/bids/auction/${auctionId}/winner`
    );
    const winner = winnerRes.data?.winner;
    console.log("winner", winner);
    if (!winner) {
      console.log("orchestrator.no-winner");
      await publishEvent("orchestrator.no-winner", { auctionId });
      return;
    }

    // 2. Payment Phase with Retry
    let paymentConfirmed = false;
    let retries = 0;
    while (!paymentConfirmed && retries < MAX_RETRIES) {
      console.log(
        `Orchestrator: Payment attempt ${retries + 1} for auction ${auctionId}`
      );
      await publishEvent("payment.requested", {
        auctionId,
        userId: winner.userId,
        amount: winner.amount,
      });

      const paymentResult = await waitForEvent(
        'payment.completed',
        (msg) => msg.auctionId === auctionId && msg.userId === winner.userId,
        10000,
        'orchestrator-payment-completed',
        `payment-consumer-${auctionId}-${Date.now()}`
      );

      if (paymentResult && paymentResult.status === "success") {
        paymentConfirmed = true;
        console.log(`Orchestrator: Payment confirmed for auction ${auctionId}`);
      } else {
        retries++;
        console.log(`Orchestrator: Payment not confirmed, retrying...`);
        if (retries >= MAX_RETRIES) {
          await publishEvent("orchestrator.compensation", {
            auctionId,
            userId: winner.userId,
            reason: "Payment not confirmed after retries",
          });
          console.log(
            `Orchestrator: Payment failed after ${MAX_RETRIES} retries, compensation triggered.`
          );
          return;
        }
      }
    }

    // 3. Notification Phase with Retry
    let notificationConfirmed = false;
    retries = 0;
    while (!notificationConfirmed && retries < MAX_RETRIES) {
      await publishEvent("notification.requested", {
        auctionId,
        userId: winner.userId,
        amount: winner.amount,
      });

      const notificationResult = await waitForEvent(
        'notification.sent',
        (msg) => msg.auctionId === auctionId && msg.userId === winner.userId,
        10000,
        'orchestrator-notification-sent',
        `notification-consumer-${auctionId}-${Date.now()}`
      );

      if (notificationResult && notificationResult.status === "sent") {
        notificationConfirmed = true;
      } else {
        retries++;
        if (retries >= MAX_RETRIES) {
          // Compensation: Notification failed after retries
          await publishEvent("orchestrator.compensation", {
            auctionId,
            userId: winner.userId,
            reason: "Notification not confirmed after retries",
          });
          return;
        }
      }
    }

    // 4. Finalize
    await publishEvent("orchestrator.completed", {
      auctionId,
      userId: winner.userId,
      amount: winner.amount,
    });
  } catch (err: any) {
    await publishEvent("orchestrator.error", { auctionId, error: err.message });
  }
};

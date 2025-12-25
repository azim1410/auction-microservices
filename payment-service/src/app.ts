import express from "express";
import dotenv from "dotenv";
import paymentRoutes from "./routes/paymentRoutes";
import { listenForPaymentRequested } from "./events/paymentRequestedListener";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/api", paymentRoutes);

app.get("/", (_req, res) => res.send("Payment Service Running"));

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`Payment Service running on port ${PORT}`);
  listenForPaymentRequested();
});

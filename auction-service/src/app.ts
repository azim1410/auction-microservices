import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/database";
import auctionRoutes from "./routes/auctionRoutes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/auctions", auctionRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/", (_req, res) => res.send("Auction Service Running"));

const PORT = process.env.PORT || 3002;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Auction Service running on port ${PORT}`);
  });
});

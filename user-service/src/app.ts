import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import sequelize from "./config/database";
import { rateLimiter } from "./middlewares/rateLimiter";
dotenv.config();

const app = express();

app.use(express.json());
app.use(rateLimiter);
app.use("/api/user", userRoutes);

app.get("/", (_req, res) => res.send("User Service Running"));

const PORT = process.env.PORT;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log("User Server running on PORT: ", PORT);
  });
});

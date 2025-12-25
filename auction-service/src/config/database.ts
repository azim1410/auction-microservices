import dotenv from "dotenv";
import types = require("sequelize");

dotenv.config();

const sequelize = new types.Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASS as string,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "postgres",
    logging: false,
  }
);

export default sequelize;

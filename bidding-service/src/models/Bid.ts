import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
interface BidAttributes {
  id: number;
  auctionId: number;
  userId: number;
  amount: number;
}

interface BidCreationAttributes extends Optional<BidAttributes, "id"> {}

class Bid
  extends Model<BidAttributes, BidCreationAttributes>
  implements BidAttributes
{
  public id!: number;
  public auctionId!: number;
  public userId!: number;
  public amount!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Bid.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    auctionId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    amount: { type: DataTypes.FLOAT, allowNull: false },
  },
  {
    sequelize,
    tableName: "bids",
    timestamps: true,
  }
);

export default Bid;

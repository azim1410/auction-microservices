import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface AuctionAttributes {
  id: number;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  status: 'scheduled' | 'active' | 'ended';
}

interface AuctionCreationAttributes extends Optional<AuctionAttributes, 'id' | 'status'> {}

class Auction extends Model<AuctionAttributes, AuctionCreationAttributes> implements AuctionAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public startTime!: Date;
  public endTime!: Date;
  public status!: 'scheduled' | 'active' | 'ended';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Auction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'active', 'ended'),
      defaultValue: 'scheduled',
    },
  },
  {
    sequelize,
    tableName: 'auctions',
    timestamps: true,
  }
);

export default Auction;
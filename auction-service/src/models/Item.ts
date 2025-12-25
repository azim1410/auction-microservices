import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Auction from './Auction';

interface ItemAttributes {
  id: number;
  name: string;
  description: string;
  auctionId: number;
}

interface ItemCreationAttributes extends Optional<ItemAttributes, 'id'> {}

class Item extends Model<ItemAttributes, ItemCreationAttributes> implements ItemAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public auctionId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Item.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    auctionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Auction,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    tableName: 'items',
    timestamps: true,
  }
);

Auction.hasMany(Item, { foreignKey: 'auctionId', as: 'items' });
Item.belongsTo(Auction, { foreignKey: 'auctionId', as: 'auction' });

export default Item;
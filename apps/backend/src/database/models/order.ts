import { Model, DataTypes } from 'sequelize';
import connection from '../connection';
import User from './user';
import Status from './status';
import Item from './item';

class Order extends Model {
  
  public id!: number;
  public total!: number;
  public status!: Status;
  public statusId!: number;
  public user!: User;
  public items! : Item[];

  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;
  public readonly deletedAt!: Date;
}

Order.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.NUMBER,
    }, 
    total: {
      allowNull: false,
      type: DataTypes.NUMBER,
    },
    statusId: {
      allowNull: false,
      type: DataTypes.NUMBER,
    },
    userId: {
      allowNull: false,
      type: DataTypes.NUMBER,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
  },
  {
    sequelize: connection,
    modelName: 'Order',
  }
);

// associates
Order.belongsTo(User, {
  as: "user",
  foreignKey: "userId",
});

Order.belongsTo(Status, {
  as: "status",
  foreignKey: "statusId",
});

Order.hasMany(Item, {
  as: "items",
  foreignKey: "orderId",
});

export default Order;
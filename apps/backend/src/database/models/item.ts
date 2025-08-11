import { Model, DataTypes } from 'sequelize';
import connection from '../connection';
import Product from './product';

class Item extends Model {
  
  public id!: number;
  public quantity!: number;
  public product!: Product;
  public productId!: number;
  public orderId!: number;

  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;
  public readonly deletedAt!: Date;
}

Item.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.NUMBER,
    }, 
    quantity: {
      allowNull: false,
      type: DataTypes.NUMBER,
    },
    productId: {
      allowNull: false,
      type: DataTypes.NUMBER,
    },
    orderId: {
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
    modelName: 'Item',
  }
);

// associates

Item.belongsTo(Product,{
  as: 'product',
  foreignKey: 'productId'
});

export default Item;
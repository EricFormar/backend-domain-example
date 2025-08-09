import { Model, DataTypes } from 'sequelize';
import connection from '../connection';
import Brand from './brand';
import Category from './category';

class Product extends Model {
  
  public id!: number;
  public name!: string;
  public price!: number;
  public image! : string;
  public discount!: number;
  public description!: string;
  public stock! : number;
  public brand!: Brand;
  public category!: Category;

  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;
  public readonly deletedAt!: Date;
}

Product.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.NUMBER,
    }, 
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    price: {
      allowNull: false,
      type: DataTypes.NUMBER,
    },
    discount: {
      allowNull: true,
      defaultValue: 0,
      type: DataTypes.NUMBER,
    },
    description: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
     image: {
      type: DataTypes.TEXT,
    },
    stock : {
      type : DataTypes.NUMBER,
      allowNull : false,
      defaultValue : 0
    },
    brandId: {
      type: DataTypes.NUMBER,
    },
    categoryId: {
      type: DataTypes.NUMBER,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    deletedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    },
  },
  {
    sequelize: connection,
    modelName: 'Product',
  }
);

// associates

Product.belongsTo(Brand, {
  foreignKey:'brandId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  as: "brand",
});

Product.belongsTo(Category, {
  foreignKey:'categoryId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  as: "category",
});


export default Product;
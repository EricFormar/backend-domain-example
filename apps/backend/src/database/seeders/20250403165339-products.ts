'use strict';

import { QueryInterface, Sequelize } from "sequelize";
import productsJSON from '../../data/products.json';
import Category from "../models/category";
import Brand from "../models/brand";

/** @type {import('sequelize-cli').Migration} */
export = {
  async up(queryInterface: QueryInterface, Sequelize: Sequelize) {
    // Get all categories, subcategories and brands from the database

    const [categories] = await queryInterface.sequelize.query(
      'SELECT id, name FROM Categories',
    ) as unknown as [Category[], []];

    const [brands] = await queryInterface.sequelize.query(
      'SELECT id, name FROM Brands',
    ) as unknown as [Brand[], []];

    const products = productsJSON.map(product => {
      const category = categories.find(cat => cat.name === product.category);
      const brand = brands.find(b => product.name.includes(b.name));
      
      return {
        name: product.name,
        price: product.price,
        discount: product.discount || 0,
        description: product.description,
        image: product.image,
        categoryId: category?.id,
        brandId: brand?.id,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    await queryInterface.bulkInsert('Products', products, {});
  },

  async down(queryInterface : QueryInterface, Sequelize : Sequelize) {
    await queryInterface.bulkDelete('Products', [], {});
  }
};

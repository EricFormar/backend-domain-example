import { Product } from "@domain/src/entities/Product";
import { default as ProductModel } from "../database/models/product";

import {
  createNotFoundError,
} from "@domain/src/errors/error";
import { ProductRepository } from "@domain/src/repositories/product-repository";
import { ProductResponseDto } from "../dtos/product-response.dto";


export function productService(): ProductRepository {
  const _mapToProductResponseDto = (product: ProductModel): ProductResponseDto => {
    return {
      id: product.id,
      name: product.name,
      image: product.image,
      price : product.price,
      discount : product.discount,
      description : product.description,
      brand : {
         id : product.brand.id,
         name : product.brand.name
      },
      category : {
         id : product.category.id,
         name : product.category.name
      }
    };
  };
  return {
    // Get all product
    findAll: async function () {
      try {
        const products = await ProductModel.findAll();
        const mappedProducts: Product[] = products.map((product: ProductModel) =>
          _mapToProductResponseDto(product)
        );
        return mappedProducts;
      } catch (error) {
        return error as Error;
      }
    },
    // Get product by id
    findById: async function (productId: string) {
      try {
        const product = await ProductModel.findByPk(productId);
        if (!product)
          throw createNotFoundError("No existe una marca con el ID " + productId);
        return _mapToProductResponseDto(product);
      } catch (error) {
        return error as Error;
      }
    },
    // Create product
    create: async function (product: Omit<Product, "id">) {
      try {
        const newProduct = await ProductModel.create(product);
        return _mapToProductResponseDto(newProduct);
      } catch (error) {
        return error as Error;
      }
    },
    // Update product
    update: async function (product: Product) {
      try {
        const productToUpdate = await ProductModel.findByPk(product.id);
        if (!productToUpdate)
          throw createNotFoundError(
            "No existe una marca con el ID " + product.id
          );
        productToUpdate.update(product);
        const productUpdated = await productToUpdate.save();
        return _mapToProductResponseDto(productUpdated);
      } catch (error) {
        return error as Error;
      }
    },
    // Delete product
    delete: async function (id: string) {
      try {
        const productToDelete = await ProductModel.findByPk(id);
        if (!productToDelete) {
           throw createNotFoundError(
            "No existe una marca con el ID " + id
          );
        }
        await productToDelete.destroy();
        return;
      } catch (error) {
        return error as Error;
      }
    },
    // Search products
    search: async function (product:Partial<Product>) {
       try {
         const products = await ProductModel.findAll({
            where : {
               ...product
            }
         });
        const mappedProducts: Product[] = products.map((product: ProductModel) =>
          _mapToProductResponseDto(product)
        );
        return mappedProducts;
      } catch (error) {
        return error as Error;
      }
    },
      // Count products
    count: async function () {
      try {
        const result = await ProductModel.count()
        return result;
      } catch (error) {
        return error as Error;
      }
    },
  };
}

import { ProductRepository } from "@project-example/domain/repositories/product-repository";
import { default as ProductModel } from "../database/models/product";

import { ProductResponseDto } from "../dtos/product-response.dto";
import { Product } from "@project-example/domain/entities/Product";
import { createNotFoundError } from "@project-example/domain/errors/error";

export function productService(): ProductRepository {
  const _mapToProductResponseDto = (
    product: ProductModel
  ): ProductResponseDto => {
    return {
      id: product.id.toString(),
      name: product.name,
      image: product.image,
      price: product.price,
      discount: product.discount,
      description: product.description,
      brand: product.brand ? {
        id: product.brand.id.toString(),
        name: product.brand.name,
      } : undefined,
      category: product.category ? {
        id: product.category.id.toString(),
        name: product.category.name,
      } : undefined,
    };
  };
  return {
    // Get all product
    findAll: async function () {
      const products = await ProductModel.findAll({
        include: ["category", "brand"],
      });

      const mappedProducts: ProductResponseDto[] = products.map(
        (product: ProductModel) => _mapToProductResponseDto(product)
      );
      return mappedProducts;
    },
    // Get product by id
    findById: async function (productId: string) {
      const product = await ProductModel.findByPk(productId,{
        include : ["category", "brand"]
      });
      if (!product)
        throw createNotFoundError("No existe una marca con el ID " + productId);
      return _mapToProductResponseDto(product);
    },
    // Create product
    create: async function (product: Omit<Product, "id">) {
      console.log(product);
      const newProduct = await ProductModel.create({
        ...product,
        brandId: product.brand?.id,
        categoryId: product.category?.id,
      });
      const productCreated = await this.findById(newProduct.id.toString());
      return _mapToProductResponseDto(productCreated as unknown as ProductModel);
    },
    // Update product
    update: async function (product: Product) {
      const productToUpdate = await ProductModel.findByPk(product.id);
      if (!productToUpdate)
        throw createNotFoundError(
          "No existe una marca con el ID " + product.id
        );
      productToUpdate.update(product);
      const productUpdated = await productToUpdate.save();
      return _mapToProductResponseDto(productUpdated);
    },
    // Delete product
    delete: async function (id: string) {
      const productToDelete = await ProductModel.findByPk(id);
      if (!productToDelete) {
        throw createNotFoundError("No existe una marca con el ID " + id);
      }
      await productToDelete.destroy();
      return;
    },
    // Search products
    search: async function (product: Partial<Product>) {
      const products = await ProductModel.findAll({
        where: {
          ...product,
        },
      });
      const mappedProducts: Product[] = products.map((product: ProductModel) =>
        _mapToProductResponseDto(product)
      );
      return mappedProducts;
    },
    // Count products
    count: async function () {
      const result = await ProductModel.count();
      return result;
    },
  };
}

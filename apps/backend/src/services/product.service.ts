import { ProductRepository } from "@domain/repositories/product-repository";
import ProductModel from "../database/models/product";

import { ProductResponseDto } from "../dtos/product-response.dto";
import { Product } from "@domain/entities/Product";

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
      stock: product.stock,
      brand: product.brand
        ? {
            id: product.brand.id.toString(),
            name: product.brand.name,
          }
        : undefined,
      category: product.category
        ? {
            id: product.category.id.toString(),
            name: product.category.name,
          }
        : undefined,
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
      const product = await ProductModel.findByPk(productId, {
        include: ["category", "brand"],
      });
      if (!product) return null;
      return _mapToProductResponseDto(product);
    },
    // Create product
    create: async function (product: Omit<Product, "id">) {
      const newProduct = await ProductModel.create({
        ...product,
        brandId: product.brand?.id,
        categoryId: product.category?.id,
      });
      const productCreated = await this.findById(newProduct.id.toString());
      return _mapToProductResponseDto(
        productCreated as unknown as ProductModel
      );
    },
    // Update product
    update: async function (product: Product) {
      const productToUpdate = await ProductModel.findByPk(product.id);
      if (productToUpdate) {
        productToUpdate.update({
          name: product.name,
          image: product.image,
          price: product.price,
          discount: product.discount,
          description: product.description,
          brandId: product.brand?.id,
          categoryId: product.category?.id,
        });
        const productUpdated = await productToUpdate.save();
        return _mapToProductResponseDto(productUpdated);
      }
      return product;
    },
    // Delete product
    delete: async function (id: string) {
      const productToDelete = await ProductModel.findByPk(id);
      if (!productToDelete) return
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
    verifyStock: async function (id) {
      const product = await ProductModel.findByPk(id);
      if (!product) return false
      return product.stock > 0;
    },
  };
}

import { ProductRepository } from "@project-example/domain/repositories/product-repository";
import { default as ProductModel } from "../database/models/product";


import { ProductResponseDto } from "../dtos/product-response.dto";
import { Product } from "@project-example/domain/entities/Product";
import { createNotFoundError } from "@project-example/domain/errors/error";


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
        const products = await ProductModel.findAll({
          include : ["category", "brand"]
        });
        console.log(products);
        
        const mappedProducts: Product[] = products.map((product: ProductModel) =>
          _mapToProductResponseDto(product)
        );
        return mappedProducts;
    },
    // Get product by id
    findById: async function (productId: number) {
        const product = await ProductModel.findByPk(productId);
        return product ? _mapToProductResponseDto(product) : null;
    },
    // Create product
    create: async function (product: Omit<Product, "id">) {
        const newProduct = await ProductModel.create(product);
        return _mapToProductResponseDto(newProduct);
    },
    // Update product
    update: async function (product: Product) {
        const productToUpdate = await ProductModel.findByPk(product.id);
        if(productToUpdate){
        productToUpdate.update(product);
        const productUpdated = await productToUpdate.save();
        return _mapToProductResponseDto(productUpdated);
        }else {
          return product
        }
    },
    // Delete product
    delete: async function (id: number) {
        const productToDelete = await ProductModel.findByPk(id);
        productToDelete && await productToDelete.destroy();
        return;
    },
    // Search products
    search: async function (product:Partial<Product>) {

         const products = await ProductModel.findAll({
            where : {
               ...product
            }
         });
        const mappedProducts: Product[] = products.map((product: ProductModel) =>
          _mapToProductResponseDto(product)
        );
        return mappedProducts;
    },
      // Count products
    count: async function () {
        const result = await ProductModel.count()
        return result;
    },
  };
}

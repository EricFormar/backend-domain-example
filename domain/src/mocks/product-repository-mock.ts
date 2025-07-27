import { Product } from "../entities/Product";
import { ProductRepository } from "../repositories/product-repository";

export interface MockedProductRepository extends ProductRepository {
  products: Product[];
}
export function createProductRepositoryMock(
  products: Product[] = []
): MockedProductRepository {
  return {
    products,
    findAll: async function () {
      return this.products;
    },
    findById: async function (id: string): Promise<Product | null> {
      return this.products.find((product) => product.id === id) || null;
    },
    create: async function (product: Product) {
      this.products.push(product);
      return product;
    },
    update: async function (product: Product) {
      const index = this.products.findIndex((p) => p.id === product.id);
      if (index !== -1) {
        this.products[index] = product;
      }
      return this.products[index]
    },
    delete: async function (id: string) {
      const index = this.products.findIndex((product) => product.id === id);
      if (index !== -1) {
        this.products.splice(index, 1);
        return true;
      }
      return false;
    },
    search: async function (data: Partial<Product>) {
      let productsFiltered = [...this.products];

      if (data.name) {
        productsFiltered = productsFiltered.filter((product) =>
          product.name.toLowerCase().includes(data.name!.toLowerCase())
        );
      }
      if (data.description) {
        productsFiltered = productsFiltered.filter((product) =>
          product.description
            .toLowerCase()
            .includes(data.description!.toLowerCase())
        );
      }

      if (data.brandId) {
        productsFiltered = productsFiltered.filter(
          (product) => product.brandId === data.brandId
        );
      }
      if (data.categoryId) {
        productsFiltered = productsFiltered.filter(
          (product) => product.categoryId === data.categoryId
        );
      }

      return productsFiltered;
    },
    count : async function () {
        return this.products.length
    }
  };
}

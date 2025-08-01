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
    findById: async function (id: number): Promise<Product | null> {
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
    delete: async function (id: number) {
      const index = this.products.findIndex((product) => product.id === id);
      if (index !== -1) {
        this.products.splice(index, 1);
      }
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

      if (data.brand?.id) {
        productsFiltered = productsFiltered.filter(
          (product) => product.brand?.id === data.brand?.id
        );
      }
      if (data.category?.id) {
        productsFiltered = productsFiltered.filter(
          (product) => product.category?.id === data.category?.id
        );
      }

      return productsFiltered;
    },
    count : async function () {
        return this.products.length
    }
  };
}

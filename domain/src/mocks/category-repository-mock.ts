import { Category } from "../entities/Category";
import { CategoryRepository } from "../repositories/category-repository";

export interface MockedCategoryRepository extends CategoryRepository {
  categories: Category[];
}

export function createCategoryRepositoryMock(
  categories: Category[] = []
): MockedCategoryRepository {
  return {
    categories,
    findAll: async function () {
      return this.categories;
    },
    findById: async function (id: string) {
      return this.categories.find((category) => category.id === id) || null;
    },
    create: async function (category: Category) {
      this.categories.push(category);
      return category;
    },
    update: async function (category: Category) {
      const index = this.categories.findIndex((c) => c.id === category.id);
      if (index !== -1) {
        this.categories[index] = category;
      }
      return category;
    },
    delete: async function (id: String) {
      const index = this.categories.findIndex((product) => product.id === id);
      this.categories.splice(index, 1);
      return true;
    },
     findByName: async function (name: string): Promise<Category | null> {
      const category = this.categories.find((c) => c.name === name);
      return category || null;
    },
  };
}

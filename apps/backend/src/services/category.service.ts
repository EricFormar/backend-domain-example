import { Category } from "@project-example/domain/entities/Category";
import { default as CategoryModel } from "../database/models/category";

import { CategoryResponseDto } from "../dtos/category-response.dto";
import { CategoryRepository } from "@project-example/domain/repositories/category-repository";
import { createNotFoundError } from "@project-example/domain/errors/error";

export function categoryService(): CategoryRepository {
  const _mapToCategoryResponseDto = (
    category: CategoryModel
  ): CategoryResponseDto => {
    return {
      id: category.id.toString(),
      name: category.name,
      image: category.image,
    };
  };
  return {
    // Get all category
    findAll: async function () {
      const categories = await CategoryModel.findAll();
      const mappedCategory: Category[] = categories.map(
        (category: CategoryModel) => _mapToCategoryResponseDto(category)
      );
      return mappedCategory;
    },
    // Get category by id
    findById: async function (categoryId: string) {
      const category = await CategoryModel.findByPk(categoryId);
      if (!category)
        throw createNotFoundError(
          "No existe una categoría con el ID " + categoryId
        );
      return _mapToCategoryResponseDto(category);
    },
    // Create category
    create: async function (category: Omit<Category, "id">) {
      const newCategory = await CategoryModel.create(category);
      return _mapToCategoryResponseDto(newCategory);
    },
    // Update category
    update: async function (category: Category) {
      const categoryToUpdate = await CategoryModel.findByPk(category.id);
      if (!categoryToUpdate)
        throw createNotFoundError(
          "No existe una categoría con el ID " + category.id
        );
      categoryToUpdate.update(category);
      const categoryUpdated = await categoryToUpdate.save();
      return _mapToCategoryResponseDto(categoryUpdated);
    },
    // Delete category
    delete: async function (id: string) {
      const categoryToDelete = await CategoryModel.findByPk(id);
      if (!categoryToDelete)
        throw createNotFoundError(
          "No existe una categoría con el ID " + id
        );
      categoryToDelete && (await categoryToDelete.destroy());
      return;
    },
    // Find category by name
    findByName: async function (name: string) {
      const category = await CategoryModel.findOne({
        where: { name },
      });
      return category ? _mapToCategoryResponseDto(category) : null;
    },
  };
}

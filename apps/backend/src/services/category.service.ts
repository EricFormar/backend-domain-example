import { Category } from "@domain/src/entities/Category";
import { default as CategoryModel } from "../database/models/category";

import {
  createNotFoundError,
} from "@domain/src/errors/error";
import { CategoryRepository } from "@domain/src/repositories/category-repository";
import { CategoryResponseDto } from "../dtos/category-response.dto";


export function categoryService(): CategoryRepository {
  const _mapToCategoryResponseDto = (category: CategoryModel): CategoryResponseDto => {
    return {
      id: category.id,
      name: category.name,
      image: category.image,
    };
  };
  return {
    // Get all category
    findAll: async function () {
      try {
        const categories = await CategoryModel.findAll();
        const mappedCategory: Category[] = categories.map((category: CategoryModel) =>
          _mapToCategoryResponseDto(category)
        );
        return mappedCategory;
      } catch (error) {
        return error as Error;
      }
    },
    // Get category by id
    findById: async function (categoryId: string) {
      try {
        const category = await CategoryModel.findByPk(categoryId);
        if (!category)
          throw createNotFoundError("No existe una categoría con el ID " + categoryId);
        return _mapToCategoryResponseDto(category);
      } catch (error) {
        return error as Error;
      }
    },
    // Create category
    create: async function (category: Omit<Category, "id">) {
      try {
        const newCategory = await CategoryModel.create(category);
        return _mapToCategoryResponseDto(newCategory);
      } catch (error) {
        return error as Error;
      }
    },
    // Update category
    update: async function (category: Category) {
      try {
        const categoryToUpdate = await CategoryModel.findByPk(category.id);
        if (!categoryToUpdate)
          throw createNotFoundError(
            "No existe una categoría con el ID " + category.id
          );
        categoryToUpdate.update(category);
        const categoryUpdated = await categoryToUpdate.save();
        return _mapToCategoryResponseDto(categoryUpdated);
      } catch (error) {
        return error as Error;
      }
    },
    // Delete category
    delete: async function (id: string) {
      try {
        const categoryToDelete = await CategoryModel.findByPk(id);
        if (!categoryToDelete) {
          throw createNotFoundError("Category not found");
        }
        await categoryToDelete.destroy();
        return;
      } catch (error) {
        return error as Error;
      }
    },
    // Find category by name
    findByName: async function (name:string) {
       try {
        const category = await CategoryModel.findOne({
          where : {name}
        });
        if (!category)
          throw createNotFoundError("No existe una categoría con el nombre " + name);
        return _mapToCategoryResponseDto(category);
      } catch (error) {
        return error as Error;
      }
    }
  };
}

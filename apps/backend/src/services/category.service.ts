import { Category } from "@project-example/domain/entities/Category";
import { default as CategoryModel } from "../database/models/category";

import { CategoryResponseDto } from "../dtos/category-response.dto";
import { CategoryRepository } from "@project-example/domain/repositories/category-repository";


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
        const categories = await CategoryModel.findAll();
        const mappedCategory: Category[] = categories.map((category: CategoryModel) =>
          _mapToCategoryResponseDto(category)
        );
        return mappedCategory;
   
    },
    // Get category by id
    findById: async function (categoryId: number) {
        const category = await CategoryModel.findByPk(categoryId);
        return category ? _mapToCategoryResponseDto(category) : null;
    },
    // Create category
    create: async function (category: Omit<Category, "id">) {
        const newCategory = await CategoryModel.create(category);
        return _mapToCategoryResponseDto(newCategory);
    },
    // Update category
    update: async function (category: Category) {
     
        const categoryToUpdate = await CategoryModel.findByPk(category.id);
        if(categoryToUpdate){
        categoryToUpdate.update(category);
        const categoryUpdated = await categoryToUpdate.save();
        return _mapToCategoryResponseDto(categoryUpdated);
        }else {
          return category
        }
    },
    // Delete category
    delete: async function (id: number) {
        const categoryToDelete = await CategoryModel.findByPk(id);
        categoryToDelete && await categoryToDelete.destroy();
        return;
    },
    // Find category by name
    findByName: async function (name:string) {

        const category = await CategoryModel.findOne({
          where : {name}
        });
       
        return category ?  _mapToCategoryResponseDto(category) : null;
    }
  };
}

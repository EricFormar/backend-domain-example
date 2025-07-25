import { Category } from "../entities/Category";
import { CategoryRepository } from "../repositories/category-repository";

export interface CategoryRepositoryMock extends CategoryRepository {
    categories : Category []
}

export function createCategoryRepositoryMock(categories : Category[] = []) : CategoryRepositoryMock {
    return {
        categories,
        getAll : async function(){
            return this.categories
        },
        getById : async function(id : string){            
            return this.categories.find((category) => category.id === id) || null
        },
        create : async function(category : Category){
            this.categories.push(category)
            return category
        },
        update : async function(category : Category){
            const index = this.categories.findIndex((c) => c.id === category.id);
            if (index !== -1) {
                this.categories[index] = category;
                return category;
            }
            return null;
        }
    }
}
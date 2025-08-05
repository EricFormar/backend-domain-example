import { Request, Response } from "express";
import { categoryService } from "../services/category.service";
import { AppError, createBadRequestError, createInternalServerError } from "@project-example/domain/errors/error";
import { Category } from "@project-example/domain/entities/Category";
import { listCategory } from "@project-example/domain/use-cases/category/category-list";
import { findCategoryById } from "@project-example/domain/use-cases/category/category-find-by-id";
import { categoryCreate } from "@project-example/domain/use-cases/category/create-category";
import { updateCategory } from "@project-example/domain/use-cases/category/update-category";
import { deleteCategory } from "@project-example/domain/use-cases/category/delete-category";

export function categoryController() {
  return {
    // Get all categorys
    getAllCategories: async (req: Request, res: Response) => {
      try {
        const categories = await listCategory({
          categoryRepository: categoryService()
        })
        return res.status(200).json({
          ok: true,
          meta: {
            total: categories.length,
            url: `${req.protocol}://${req.get('host')}/api/categories`
          },
          data: categories,
        });
      } catch (e) {
      const error =
          e instanceof AppError
            ? e
            : createInternalServerError(
            "Ups, hubo un error al obtener las categorías"
          );
        return res.status(error.httpStatus).json({
          ok: false,
          message: error.message,
        });
      }
    },
    // Get category by id
    getCategoryById: async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const category = await findCategoryById({
          categoryRepository: categoryService()
        }, {
          id
        })
        return res.status(200).json({
          ok: true,
          meta: {
            url: `${req.protocol}://${req.get('host')}/api/categories/${id}`
          },
          data: category,
          message: "Categoría encontrada"
        });
      } catch (e) {
        const error =
          e instanceof AppError
            ? e
            : createInternalServerError(
            "Ups, hubo un error al obtener la categoría"
          );
        return res.status(error.httpStatus).json({
          ok: false,
          message: error.message,
        });
      }
    },
    // Create category
    createNewCategory: async (req: Request, res: Response) => {
      try {
        const { name, image } = req.body;
        if (!name || name === "") {
          throw createBadRequestError("Error en los datos ingresados");
        }
        const newCategory = await categoryCreate({
          categoryRepository: categoryService()
        }, {
          name,
          image
        })
        return res.status(200).json({
          ok: true,
          meta: {
            url: `${req.protocol}://${req.get('host')}/api/categories/${('id' in newCategory) ? newCategory.id : ''}`
          },
          data: newCategory,
          message: "Categoría creada con éxito"
        });
      } catch (e) {
        const error =
          e instanceof AppError
            ? e
            : createInternalServerError(
            "Ups, hubo un error al crear una nueva categoría"
          );
        return res.status(error.httpStatus).json({
          ok: false,
          message: error.message,
        });
      }
    },
    // Update category
    updateCategory: async (req: Request, res: Response) => {
      try {
        const categoryToUpdate: Category = { ...req.body, id: req.params.id };
        const updatedCategory = await updateCategory({
          categoryRepository: categoryService()
        },
          {
            categoryToUpdate
          }
        )
        return res.status(200).json({
          ok: true,
          meta: {
            url: `${req.protocol}://${req.get('host')}/api/categories/${categoryToUpdate.id}`
          },
          data: updatedCategory,
          message: "Categoría actualizada con éxito"
        });
      } catch (e) {
        const error =
          e instanceof AppError
            ? e
            : createInternalServerError(
            "Ups, hubo un error al actualizar una nueva categoría"
          );
        return res.status(error.httpStatus).json({
          ok: false,
          message: error.message,
        });
      }
    },
    // Delete category
    deleteCategory: async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        await deleteCategory({
          categoryRepository: categoryService()
        }, {
          id
        })
        return res.status(200).json({
          ok: true,
          message : "Categoría eliminada con éxito"
        });
      } catch (e) {
         const error =
          e instanceof AppError
            ? e
            : createInternalServerError(
            "Ups, hubo un error al eliminar la categoría"
          );
        return res.status(error.httpStatus).json({
          ok: false,
          message: error.message,
        });
      }
    },
  };
}



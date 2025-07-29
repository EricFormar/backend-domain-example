import { Request, Response } from "express";
import { createBadRequestError, createInternalServerError } from "@domain/src/errors/error";
import { categoryService } from "../services/category.service";
import { Category } from "@domain/src/entities/Category";

export function categoryController() {
const service = categoryService();
  return {
    // Get all categorys
    getAllCategories: async (req: Request, res: Response) => {
      try {
        const categorys = await service.findAll()
        return res.status(200).json({
          ok: true,
          data: categorys,
        });
      } catch (e) {
        const error =
          createInternalServerError(
            "Upss, hubo un error al obtener las categorías"
          ) || e;
        return res.status(error.httpStatus).json({
          ok: false,
          message: error.message,
        });
      }
    },
    // Get category by id
    getCategoryById: async (req: Request, res: Response) => {
      try {
        const category = await  service.findById(req.params.id);
        return res.status(200).json({
          ok: true,
          data: category,
        });
      } catch (e) {
        const error =
          createInternalServerError(
            "Upss, hubo un error al obtener la categoría"
          ) || e;
        return res.status(error.httpStatus).json({
          ok: false,
          message: error.message,
        });
      }
    },
    // Create category
     createNewCategory: async (req: Request, res: Response) => {
      try {
        const {name, image} = req.body;
          if (!name || name === "") {
          throw createBadRequestError("Error en los datos ingresados");
        }
        const newCategory = await service.create({
            name,
            image
        })
        return res.status(200).json({
          ok: true,
          data: newCategory,
        });
      } catch (e) {
        const error =
          createInternalServerError(
            "Upss, hubo un error al crear una nueva categoría"
          ) || e;
        return res.status(error.httpStatus).json({
          ok: false,
          message: error.message,
        });
      }
    },
    // Update category
    updateCategory : async (req: Request, res : Response) => {
      try {
        const category : Partial<Category> = {...req.body}
        const updatedCategory = await service.update(category)
        return res.status(200).json({
          ok: true,
          data: updatedCategory,
        });
      } catch (e) {
           const error =
          createInternalServerError(
            "Upss, hubo un error al actualizar una nueva categoría"
          ) || e;
        return res.status(error.httpStatus).json({
          ok: false,
          message: error.message,
        });
      }
    },
    // Delete category
     deleteCategory : async (req: Request, res : Response) => {
      try {
        const {categoryId} = req.params;
        await service.delete(categoryId)
        return res.status(200).json({
          ok: true,
        });
      } catch (e) {
           const error =
          createInternalServerError(
            "Upss, hubo un error al eliminar la categoría"
          ) || e;
        return res.status(error.httpStatus).json({
          ok: false,
          message: error.message,
        });
      }
    },
  };
}

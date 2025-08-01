import { Request, Response } from "express";
import {
  AppError,
  createBadRequestError,
  createInternalServerError,
} from "@project-example/domain/errors/error";
import { brandService } from "../services/brand.service";
import { Brand } from "@project-example/domain/entities/Brand";
import { listBrands } from "@project-example/domain/use-cases/brand/brand-list";
import { findBrandById } from "@project-example/domain/use-cases/brand/brand-find-by-id";
import { brandCreate } from "@project-example/domain/use-cases/brand/create-brand";
import { updateBrand } from "@project-example/domain/use-cases/brand/update-brand";
import { deleteBrand } from "@project-example/domain/use-cases/brand/delete-brand";

export function brandController() {
  return {
    // Get all brands
    getAllBrands: async (req: Request, res: Response) => {
      try {
        const brands = await listBrands({
          brandRepository: brandService(),
        });
        return res.status(200).json({
          ok: true,
          data: brands,
        });
      } catch (e) {
        const error =
          e instanceof AppError
            ? e
            : createInternalServerError(
                "Upss, hubo un error al obtener las marcas"
              );
        return res.status(error.httpStatus).json({
          ok: false,
          message: error.message,
        });
      }
    },
    // Get brand by id
    getBrandById: async (req: Request, res: Response) => {
      try {
        const { brandId } = req.params;
        const brand = await findBrandById(
          {
            brandRepository: brandService(),
          },
          {
            id: brandId,
          }
        );

        return res.status(200).json({
          ok: true,
          data: brand,
        });
      } catch (e) {
        const error =
          e instanceof AppError
            ? e
            : createInternalServerError(
                "Upss, hubo un error al crear una nueva marca"
              );
        return res.status(error.httpStatus).json({
          ok: false,
          message: error.message,
        });
      }
    },
    // Create brand
    createNewBrand: async (req: Request, res: Response) => {
      try {
        const { name, image } = req.body;
        if (!name || name === "") {
          throw createBadRequestError("Error en los datos ingresados");
        }

        const newBrand = await brandCreate(
          {
            brandRepository: brandService(),
          },
          {
            name,
            image,
          }
        );

        return res.status(200).json({
          ok: true,
          data: newBrand,
        });
      } catch (e) {
        const error =
          e instanceof AppError
            ? e
            : createInternalServerError(
                "Upss, hubo un error al crear una nueva marca"
              );
        return res.status(error.httpStatus).json({
          ok: false,
          message: error.message,
        });
      }
    },
    // Update brand
    updateBrand: async (req: Request, res: Response) => {
      try {
        const brand: Brand = { ...req.body, id: req.params.brandId };
        const updatedBrand = await updateBrand(
          {
            brandRepository: brandService(),
          },
          {
            brandToUpdate: brand,
          }
        );
        return res.status(200).json({
          ok: true,
          data: updatedBrand,
        });
      } catch (e) {
        const error =
          e instanceof AppError
            ? e
            : createInternalServerError(
                "Upss, hubo un error al actualizar una nueva marca"
              );
        return res.status(error.httpStatus).json({
          ok: false,
          message: error.message,
        });
      }
    },
    // Delete brand
    deleteBrand: async (req: Request, res: Response) => {
      try {
        const { brandId } = req.params;
        await deleteBrand(
          {
            brandRepository: brandService(),
          },
          {
            id: brandId,
          }
        );
        return res.status(200).json({
          ok: true,
        });
      } catch (e) {
        const error =
          e instanceof AppError
            ? e
            : createInternalServerError(
                "Upss, hubo un error al eliminar la marca"
              );
        return res.status(error.httpStatus).json({
          ok: false,
          message: error.message,
        });
      }
    },
  };
}

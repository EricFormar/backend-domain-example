import { Request, Response } from "express";
import {
  AppError,
  createBadRequestError,
  createInternalServerError,
} from "@domain/errors/error";
import { brandService } from "../services/brand.service";
import { Brand } from "@domain/entities/Brand";
import { listBrands } from "@domain/use-cases/brand/brand-list";
import { findBrandById } from "@domain/use-cases/brand/brand-find-by-id";
import { brandCreate } from "@domain/use-cases/brand/create-brand";
import { updateBrand } from "@domain/use-cases/brand/update-brand";
import { deleteBrand } from "@domain/use-cases/brand/delete-brand";

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
          meta: {
            total: brands.length,
            url: `${req.protocol}://${req.get('host')}/api/brands`
          },
          data: brands,
          message: "Todos las marcas",

        });
      } catch (e) {
        const error =
          e instanceof AppError
            ? e
            : createInternalServerError(
              "Ups, hubo un error al obtener las marcas"
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
        const { id } = req.params;
        const brand = await findBrandById(
          {
            brandRepository: brandService(),
          },
          {
            id: id,
          }
        );

        return res.status(200).json({
          ok: true,
          meta: {
            url: `${req.protocol}://${req.get('host')}/api/brand/${id}`
          },
          data: brand,
          message: "Marca encontrada con éxito",
      
        });
      } catch (e) {
        const error =
          e instanceof AppError
            ? e
            : createInternalServerError(
              "Ups, hubo un error al crear una nueva marca"
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
          meta: {
            url: `${req.protocol}://${req.get('host')}/api/brands/${('id' in newBrand) ? newBrand.id : ''}`
          },
          data: newBrand,
          message: "Marca creada con éxito",
        });
      } catch (e) {
        const error =
          e instanceof AppError
            ? e
            : createInternalServerError(
              "Ups, hubo un error al crear una nueva marca"
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
        const brandToUpdate: Brand = { ...req.body, id: req.params.id };
        const updatedBrand = await updateBrand(
          {
            brandRepository: brandService(),
          },
          {
            brandToUpdate: brandToUpdate,
          }
        );
        return res.status(200).json({
          ok: true,
          meta: {
            url: `${req.protocol}://${req.get('host')}/api/brands/${brandToUpdate.id}`
          },
          data: updatedBrand,
          message: "Marca actualizada con éxito",
        });
      } catch (e) {
        const error =
          e instanceof AppError
            ? e
            : createInternalServerError(
              "Ups, hubo un error al actualizar una nueva marca"
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
        const { id } = req.params;
        await deleteBrand(
          {
            brandRepository: brandService(),
          },
          {
            id,
          }
        );
        return res.status(200).json({
          ok: true,
          message : "Marca eliminada con éxito",
        });
      } catch (e) {
        const error =
          e instanceof AppError
            ? e
            : createInternalServerError(
              "Ups, hubo un error al eliminar la marca"
            );
        return res.status(error.httpStatus).json({
          ok: false,
          message: error.message,
        });
      }
    },
  };
}

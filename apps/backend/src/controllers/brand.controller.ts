import { Request, Response } from "express";
import { brandService } from "../services/brand.service";
import { createBadRequestError, createInternalServerError } from "@project-example/domain/errors/error";
import { Brand } from "@project-example/domain/entities/Brand";

export function brandController() {
const service = brandService();
  return {
    // Get all brands
    getAllBrands: async (req: Request, res: Response) => {
      try {
        const brands = await service.findAll()
        return res.status(200).json({
          ok: true,
          data: brands,
        });
      } catch (e) {
        const error =
          createInternalServerError(
            "Upss, hubo un error al obtener las marcas"
          ) || e;
        return res.status(error.httpStatus).json({
          ok: false,
          message: error.message,
        });
      }
    },
    // Get brand by id
    getBrandById: async (req: Request, res: Response) => {
      try {
        const brand = await  service.findById(req.params.brandId);
        return res.status(200).json({
          ok: true,
          data: brand,
        });
      } catch (e) {
        const error =
          createInternalServerError(
            "Upss, hubo un error al obtener la marca"
          ) || e;
        return res.status(error.httpStatus).json({
          ok: false,
          message: error.message,
        });
      }
    },
    // Create brand
     createNewBrand: async (req: Request, res: Response) => {
      try {
        const {name, image} = req.body;
          if (!name || name === "") {
          throw createBadRequestError("Error en los datos ingresados");
        }
        const newBrand = await service.create({
            name,
            image
        })
        return res.status(200).json({
          ok: true,
          data: newBrand,
        });
      } catch (e) {
        const error =
          createInternalServerError(
            "Upss, hubo un error al crear una nueva marca"
          ) || e;
        return res.status(error.httpStatus).json({
          ok: false,
          message: error.message,
        });
      }
    },
    // Update brand
    updateBrand : async (req: Request, res : Response) => {
      try {
        const brand : Partial<Brand> = {...req.body, id : req.params.brandId}
        const updatedBrand = await service.update(brand)
        return res.status(200).json({
          ok: true,
          data: updatedBrand,
        });
      } catch (e) {
           const error =
          createInternalServerError(
            "Upss, hubo un error al actualizar una nueva marca"
          ) || e;
        return res.status(error.httpStatus).json({
          ok: false,
          message: error.message,
        });
      }
    },
    // Delete brand
     deleteBrand : async (req: Request, res : Response) => {
      try {
        const {brandId} = req.params;
        await service.delete(brandId)
        return res.status(200).json({
          ok: true,
        });
      } catch (e) {
           const error =
          createInternalServerError(
            "Upss, hubo un error al eliminar la marca"
          ) || e;
        return res.status(error.httpStatus).json({
          ok: false,
          message: error.message,
        });
      }
    },
  };
}

import { Request, Response } from "express";
import { productService } from "../services/product.service";
import { createInternalServerError } from "@project-example/domain/errors/error";
import { Product } from "@project-example/domain/entities/Product";
import { listProducts } from "@project-example/domain/use-cases/product/product-list";
import { findProductById } from "@project-example/domain/use-cases/product/product-find-by-id";
import { productCreate } from "@project-example/domain/use-cases/product/create-product";
import { productUpdate } from "@project-example/domain/use-cases/product/update-product";
import { productDelete } from "@project-example/domain/use-cases/product/delete-product";

export function productController() {
  return {
    // Get all products
    getAllProducts: async (req: Request, res: Response) => {
      try {
        const products = await listProducts({
          productRepository: productService(),
        })
        return res.status(200).json({
          ok: true,
          data: products,
        });
      } catch (e) {
        const error =
          createInternalServerError(
            "Upss, hubo un error al obtener las productos"
          ) || e;
        return res.status(error.httpStatus).json({
          ok: false,
          message: error.message,
        });
      }
    },
    // Get product by id
    getProductById: async (req: Request, res: Response) => {
      try {
        const { productId } = req.params;
        const product = await findProductById({
          productRepository: productService()
        }, {
          id: Number(productId),
        })
        return res.status(200).json({
          ok: true,
          data: product,
        });
      } catch (e) {
        const error =
          createInternalServerError(
            "Upss, hubo un error al obtener la producto"
          ) || e;
        return res.status(error.httpStatus).json({
          ok: false,
          message: error.message,
        });
      }
    },
    // Create product
    createNewProduct: async (req: Request, res: Response) => {
      try {
        //TODO VALIDAR!!
        const { name, description, price, discount, image } = req.body;
        const newProduct = await productCreate({
          productRepository: productService(),
        }, {
          name,
          description,
          price,
          discount,
          image
        })
        return res.status(200).json({
          ok: true,
          data: newProduct,
        });
      } catch (e) {
        const error =
          createInternalServerError(
            "Upss, hubo un error al crear una nueva producto"
          ) || e;
        return res.status(error.httpStatus).json({
          ok: false,
          message: error.message,
        });
      }
    },
    // Update product
    updateProduct: async (req: Request, res: Response) => {
      try {
        const product: Product = { ...req.body, id: req.params.productId }
        const updatedProduct = await productUpdate({
          productRepository: productService(),
        }, {
          productToUpdate: product
        })
        return res.status(200).json({
          ok: true,
          data: updatedProduct,
        });
      } catch (e) {
        const error =
          createInternalServerError(
            "Upss, hubo un error al actualizar una nueva producto"
          ) || e;
        return res.status(error.httpStatus).json({
          ok: false,
          message: error.message,
        });
      }
    },
    // Delete product
    deleteProduct: async (req: Request, res: Response) => {
      try {
        const { productId } = req.params;
        await productDelete({
          productRepository: productService(),
        }, {
          id: Number(productId),
        })
        return res.status(200).json({
          ok: true,
        });
      } catch (e) {
        const error =
          createInternalServerError(
            "Upss, hubo un error al eliminar la producto"
          ) || e;
        return res.status(error.httpStatus).json({
          ok: false,
          message: error.message,
        });
      }
    },
  };
}

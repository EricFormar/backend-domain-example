import { AppError, createInternalServerError } from "@domain/errors/error";

export function createErrorResponse(e: any) {
  return e instanceof AppError
    ? e
    : createInternalServerError(
        "Ups, hubo un error interno"
      );
}

interface AppError {
    type: string;
    message: string;
    httpStatus?: number;
}

export interface InvalidDataError extends AppError {
    type: 'InvalidData';
    message: string;
    httpStatus: 400;
}

export interface NotFoundError extends AppError {
    type : "Not Found";
     message: string;
    httpStatus: 404;
};

export interface BadRequestError extends AppError {
      type : "Bad Request";
     message: string;
    httpStatus: 400;
}

export const createInvalidDataError = (_message: string): InvalidDataError => ({
    type: 'InvalidData',
    message: _message,
    httpStatus: 400
});

export const createNotFoundError = (_message: string): NotFoundError => ({
    type: 'Not Found',
    message: _message,
    httpStatus: 404
});

export const createAlreadyRegisteredError = (): AppError => ({
    type: 'AlreadyRegistered',
    message: "409 Conflict",
    httpStatus: 409
});

export const createCredentialsError = (): AppError => ({
    type: 'CredentialsError',
    message: "400 Bad Request",
    httpStatus: 400
});

export const createMissingDataError = (_message: string): BadRequestError => ({
    type: 'Bad Request',
    message: _message,
    httpStatus: 400
});

export const createUnauthorizedError = (): AppError => ({
    type: 'Unauthorized',
    message: "401 Unauthorized",
    httpStatus: 401
});
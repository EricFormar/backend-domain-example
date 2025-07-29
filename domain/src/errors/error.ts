/**
 * Base application error interface. All custom errors should extend this.
 * It extends the native Error interface to ensure compatibility with standard error handling.
 */
export interface AppError extends Error {
    name: string; // The specific name of the error (e.g., 'InvalidDataError')
    message: string; // A human-readable error message
    httpStatus?: number; // Optional HTTP status code associated with the error
}

// --- Specific Error Interfaces ---

/**
 * Interface for errors indicating that provided data is invalid. (HTTP 400)
 */
export interface InvalidDataError extends AppError {
    name: 'InvalidDataError'; // Literal type for precise identification
    httpStatus: 400;
}

/**
 * Interface for errors indicating that a resource was not found. (HTTP 404)
 */
export interface NotFoundError extends AppError {
    name: 'NotFoundError';
    httpStatus: 404;
}

/**
 * Interface for errors indicating a bad request from the client. (HTTP 400)
 */
export interface BadRequestError extends AppError {
    name: 'BadRequestError';
    httpStatus: 400;
}

/**
 * Interface for errors indicating that the request requires user authentication. (HTTP 401)
 */
export interface UnauthorizedError extends AppError {
    name: 'UnauthorizedError';
    httpStatus: 401;
}

/**
 * Interface for errors indicating that the client does not have permission to access the resource. (HTTP 403)
 */
export interface ForbiddenError extends AppError {
    name: 'ForbiddenError';
    httpStatus: 403;
}

/**
 * Interface for errors indicating that a resource already exists and conflicts with a new creation attempt. (HTTP 409)
 */
export interface ConflictError extends AppError {
    name: 'ConflictError';
    httpStatus: 409;
}

/**
 * Interface for errors indicating an unexpected condition on the server. (HTTP 500)
 * Corrected from your original 403 to the standard 500 for Internal Server Error.
 */
export interface InternalServerError extends AppError {
    name: 'InternalServerError';
    httpStatus: 500;
}

// --- Error Creation Functions (Factory Functions) ---

/**
 * Creates an InvalidDataError.
 * @param message An optional custom message for the error. Defaults to 'Invalid data provided.'
 */
export const createInvalidDataError = (message: string = 'Invalid data provided.'): InvalidDataError => ({
    name: 'InvalidDataError',
    message,
    httpStatus: 400,
});

/**
 * Creates a NotFoundError.
 * @param message An optional custom message for the error. Defaults to 'Resource not found.'
 */
export const createNotFoundError = (message: string = 'Resource not found.'): NotFoundError => ({
    name: 'NotFoundError',
    message,
    httpStatus: 404,
});

/**
 * Creates a BadRequestError.
 * @param message An optional custom message for the error. Defaults to 'Bad request.'
 */
export const createBadRequestError = (message: string = 'Bad request.'): BadRequestError => ({
    name: 'BadRequestError',
    message,
    httpStatus: 400,
});

/**
 * Creates an UnauthorizedError.
 * @param message An optional custom message for the error. Defaults to 'Unauthorized access.'
 */
export const createUnauthorizedError = (message: string = 'Unauthorized access.'): UnauthorizedError => ({
    name: 'UnauthorizedError',
    message,
    httpStatus: 401,
});

/**
 * Creates a ForbiddenError.
 * @param message An optional custom message for the error. Defaults to 'Access forbidden.'
 */
export const createForbiddenError = (message: string = 'Access forbidden.'): ForbiddenError => ({
    name: 'ForbiddenError',
    message,
    httpStatus: 403,
});

/**
 * Creates a ConflictError (e.g., resource already exists).
 * @param message An optional custom message for the error. Defaults to 'Resource already exists.'
 */
export const createConflictError = (message: string = 'Resource already exists.'): ConflictError => ({
    name: 'ConflictError',
    message,
    httpStatus: 409,
});

/**
 * Creates an InternalServerError.
 * @param message An optional custom message for the error. Defaults to 'An unexpected internal server error occurred.'
 */
export const createInternalServerError = (message: string = 'An unexpected internal server error occurred.'): InternalServerError => ({
    name: 'InternalServerError',
    message,
    httpStatus: 500,
});

// --- Specific Use-Case Error (Using existing factory functions) ---

/**
 * Creates an error for invalid credentials.
 * This is effectively a BadRequestError or UnauthorizedError depending on context.
 * We'll use BadRequestError here for its 400 status.
 */
export const createCredentialsError = (message: string = 'Invalid credentials.'): AppError => {
    // You can call createBadRequestError and then override the name if needed,
    // or just construct the object directly.
    return {
        ...createBadRequestError(message), // Inherit properties from BadRequestError
        name: 'CredentialsError', // Override the name to be more specific
    };
};
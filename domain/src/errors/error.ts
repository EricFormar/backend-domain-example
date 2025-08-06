/**
 * Base application error interface. All custom errors should extend this.
 * It extends the native Error interface to ensure compatibility with standard error handling.
 */
export class AppError extends Error {
    public name: string; // El nombre específico del error (ej. 'InvalidDataError')
    public message: string; // Un mensaje de error legible para humanos
    public httpStatus: number; // Código de estado HTTP opcional asociado con el error

    constructor(message: string, name: string = 'AppError', httpStatus: number = 500) {
        super(message); // Llama al constructor de la clase Error padre

        // Establece el prototipo explícitamente para asegurar que instanceof funcione correctamente
        // Esto es una buena práctica al extender clases nativas como Error
        Object.setPrototypeOf(this, AppError.prototype);

        this.name = name;
        this.message = message; // Aunque Error ya tiene 'message', es bueno ser explícito
        this.httpStatus = httpStatus;
    }
}

// --- Specific Error Interfaces ---

/**
 * Class for errors indicating that provided data is invalid. (HTTP 400)
 */
export class InvalidDataError extends AppError {
    public readonly name: 'InvalidDataError' = 'InvalidDataError';
    public readonly httpStatus: 400 = 400;
    constructor(message: string = 'Invalid data provided') {
        super(message);
        Object.setPrototypeOf(this, InvalidDataError.prototype);
    }
}

/**
 * Class for errors indicating that a resource was not found. (HTTP 404)
 */
export class NotFoundError extends AppError {
    public readonly name: 'NotFoundError' = 'NotFoundError';
    public readonly httpStatus: 404 = 404;

    constructor(message: string = 'Resource not found') {
        super(message);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

/**
 * Class for errors indicating a bad request from the client. (HTTP 400)
 */
export class BadRequestError extends AppError {
    public readonly name: 'BadRequestError' = 'BadRequestError';
    public readonly httpStatus: 400 = 400;
    constructor(message: string = 'Bad request') {
        super(message);
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}

/**
 * Class for errors indicating that the request requires user authentication. (HTTP 401)
 */
export class UnauthorizedError extends AppError {
    public readonly name: 'UnauthorizedError' = 'UnauthorizedError';
    public readonly httpStatus: 401 = 401;
    constructor(message: string = 'Unauthorized access') {
        super(message);
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
}

/**
 * Class for errors indicating that the client does not have permission to access the resource. (HTTP 403)
 */
export class ForbiddenError extends AppError {
    public readonly name: 'ForbiddenError' = 'ForbiddenError';
    public readonly httpStatus: 403 = 403;
    constructor(message: string = 'Access forbidden') {
        super(message);
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
}

/**
 * Class for errors indicating that a resource already exists and conflicts with a new creation attempt. (HTTP 409) 
 */
export class ConflictError extends AppError {
    public readonly name: 'ConflictError' = 'ConflictError';
    public readonly httpStatus: 409 = 409;
    constructor(message: string = 'Resource already exists') {
        super(message);
        Object.setPrototypeOf(this, ConflictError.prototype);
    }
}

/**
 * Class for errors indicating an unexpected condition on the server. (HTTP 500)
 */
export class InternalServerError extends AppError {
    public readonly name: 'InternalServerError' = 'InternalServerError';
    public readonly httpStatus: 500 = 500;
    constructor(message: string = 'An unexpected internal server error occurred') {
        super(message);
        Object.setPrototypeOf(this, InternalServerError.prototype)
    }
}

// --- Error Creation Functions (Factory Functions) ---

/**
 * Creates an InvalidDataError.
 * @param message An optional custom message for the error. Defaults to 'Invalid data provided.'
 */
export const createInvalidDataError = (message: string = 'Invalid data provided.'): InvalidDataError => {
   return new InvalidDataError(message);
};

/**
 * Creates a NotFoundError.
 * @param message An optional custom message for the error. Defaults to 'Resource not found.'
 */
export const createNotFoundError = (message: string = "Resource not found"): NotFoundError => {
    return new NotFoundError(message);
};

/**
 * Creates a BadRequestError.
 * @param message An optional custom message for the error. Defaults to 'Bad request.'
 */
export const createBadRequestError = (message: string = 'Bad request.'): BadRequestError => {
    return new BadRequestError(message);
};

/**
 * Creates an UnauthorizedError.
 * @param message An optional custom message for the error. Defaults to 'Unauthorized access.'
 */
export const createUnauthorizedError = (message: string = 'Unauthorized access.'): UnauthorizedError => {
    return new UnauthorizedError(message);
};

/**
 * Creates a ForbiddenError.
 * @param message An optional custom message for the error. Defaults to 'Access forbidden.'
 */
export const createForbiddenError = (message: string = 'Access forbidden.'): ForbiddenError => {
    return new ForbiddenError(message);
};

/**
 * Creates a ConflictError.
 * @param message An optional custom message for the error. Defaults to 'Resource already exists.'
 */
export const createConflictError = (message: string = 'Resource already exists.'): ConflictError => {
    return new ConflictError(message);
};

/**
 * Creates an InternalServerError.
 * @param message An optional custom message for the error. Defaults to 'An unexpected internal server error occurred.'
 */
export const createInternalServerError = (message: string = 'An unexpected internal server error occurred.'): InternalServerError => {
    return new InternalServerError(message);
};

/**
 * Creates an InternalServerError.
 * @param message An optional custom message for the error. Defaults to 'Email sending failed.'
 */
export const createEmailSendingError = (message: string = 'Email sending failed.'): InternalServerError => {
    return new InternalServerError(message);
};

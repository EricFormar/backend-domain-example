import { describe, it, expect } from 'vitest';
import { BadRequestError, ConflictError, InternalServerError, InvalidDataError, NotFoundError, createBadRequestError, createConflictError, createInternalServerError, createInvalidDataError, createNotFoundError } from './error';

describe('createInternalServerError', () => {
    it('should create an instance of InternalServerError with the default message', () => {
        const error = createInternalServerError();
        expect(error).toBeInstanceOf(InternalServerError);
        expect(error.message).toBe('An unexpected internal server error occurred.');
    });

    it('should create an instance of InternalServerError with a custom message', () => {
        const customMessage = 'Something went terribly wrong!';
        const error = createInternalServerError(customMessage);
        expect(error).toBeInstanceOf(InternalServerError);
        expect(error.message).toBe(customMessage);
    });
});

describe('createNotFoundError', () => {
    it('should create an instance of NotFoundError with the default message', () => {
        const error = createNotFoundError();
        expect(error).toBeInstanceOf(NotFoundError);
        expect(error.message).toBe('Resource not found');
    });

    it('should create an instance of NotFoundError with a custom message', () => {
        const customMessage = '404 Not Found';
        const error = createNotFoundError(customMessage);
        expect(error).toBeInstanceOf(NotFoundError);
        expect(error.message).toBe(customMessage);
    });
});

describe('createBadRequestError', () => {
    it('should create an instance of BadRequestError with the default message', () => {
        const error = createBadRequestError();
        expect(error).toBeInstanceOf(BadRequestError);
        expect(error.message).toBe('Bad request.');
    });

    it('should create an instance of BadRequestError with a custom message', () => {
        const customMessage = '400 Bad Request';
        const error = createBadRequestError(customMessage);
        expect(error).toBeInstanceOf(BadRequestError);
        expect(error.message).toBe(customMessage);
    });
});

describe('createConflictError', () => {
    it('should create an instance of ConflictError with the default message', () => {
        const error = createConflictError();
        expect(error).toBeInstanceOf(ConflictError);
        expect(error.message).toBe('Resource already exists.');
    });

    it('should create an instance of ConflictError with a custom message', () => {
        const customMessage = '409 Conflict';
        const error = createConflictError(customMessage);
        expect(error).toBeInstanceOf(ConflictError);
        expect(error.message).toBe(customMessage);
    });
});

describe('createInvalidDataError', () => {
    it('should create an instance of InvalidDataError with the default message', () => {
        const error = createInvalidDataError();
        expect(error).toBeInstanceOf(InvalidDataError);
        expect(error.message).toBe('Invalid data provided.');
    });

    it('should create an instance of InvalidDataError with a custom message', () => {
        const customMessage = '400 Invalid Data';
        const error = createInvalidDataError(customMessage);
        expect(error).toBeInstanceOf(InvalidDataError); 
        expect(error.message).toBe(customMessage);
    });
});
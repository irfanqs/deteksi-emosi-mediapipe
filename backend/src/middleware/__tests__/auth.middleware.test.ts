import { Request, Response, NextFunction } from 'express';
import { authenticate, verifyOwnership } from '../auth.middleware';

/**
 * Unit tests for authentication middleware
 * Requirements: 8.1, 8.5
 */

describe('Authentication Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
      params: {},
      body: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
  });

  describe('authenticate', () => {
    it('should call next() when valid user ID is provided', () => {
      mockRequest.headers = { 'x-user-id': 'test-user-id' };

      authenticate(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
      expect(mockRequest.userId).toBe('test-user-id');
    });

    it('should return 401 when no user ID is provided', () => {
      authenticate(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Authentication required',
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });

  describe('verifyOwnership', () => {
    it('should call next() when user owns the resource', () => {
      mockRequest.userId = 'test-user-id';
      mockRequest.params = { userId: 'test-user-id' };

      const middleware = verifyOwnership('userId');
      middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
    });

    it('should return 403 when user does not own the resource', () => {
      mockRequest.userId = 'test-user-id';
      mockRequest.params = { userId: 'different-user-id' };

      const middleware = verifyOwnership('userId');
      middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Access denied',
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should return 401 when user is not authenticated', () => {
      mockRequest.params = { userId: 'test-user-id' };

      const middleware = verifyOwnership('userId');
      middleware(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Authentication required',
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });
});

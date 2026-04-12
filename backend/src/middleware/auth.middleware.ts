import { Request, Response, NextFunction } from 'express';

/**
 * Authentication middleware
 * Verifies that the request contains a valid user ID
 * Requirements: 8.1, 8.5
 * 
 * In a production environment, this would verify JWT tokens or session cookies.
 * For this application, we use a simplified approach where the frontend sends
 * the user ID in the x-user-id header after NextAuth authentication.
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Get user ID from header (set by NextAuth on frontend)
    const userId = req.headers['x-user-id'] as string;

    if (!userId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // Attach user ID to request for use in controllers
    req.userId = userId;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid authentication' });
  }
};

/**
 * Optional authentication middleware
 * Attaches user ID if present but doesn't require it
 */
export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const userId = req.headers['x-user-id'] as string;
    if (userId) {
      req.userId = userId;
    }
    next();
  } catch (error) {
    next();
  }
};

/**
 * Verify user ownership middleware
 * Ensures the authenticated user owns the requested resource
 * Requirements: 8.5
 */
export const verifyOwnership = (userIdParam: string = 'userId') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const authenticatedUserId = req.userId;
      const resourceUserId = req.params[userIdParam] || req.body[userIdParam];

      if (!authenticatedUserId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      if (authenticatedUserId !== resourceUserId) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      next();
    } catch (error) {
      console.error('Ownership verification error:', error);
      res.status(403).json({ error: 'Access denied' });
    }
  };
};

// Extend Express Request type to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

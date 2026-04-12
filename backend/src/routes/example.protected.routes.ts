import { Router, Request, Response } from 'express';
import { authenticate, verifyOwnership } from '../middleware/auth.middleware';

/**
 * Example protected routes demonstrating middleware usage
 * Requirements: 8.1 (Authentication required), 8.5 (User ID verification)
 * 
 * This file serves as a reference implementation for protecting routes
 * and verifying user ownership of resources.
 */

const router = Router();

/**
 * Example 1: Simple protected route
 * Requires authentication but doesn't verify specific resource ownership
 */
router.get('/protected/data', authenticate, (req: Request, res: Response) => {
  // req.userId is available here, set by authenticate middleware
  res.json({
    message: 'This is protected data',
    userId: req.userId,
  });
});

/**
 * Example 2: Protected route with ownership verification via URL parameter
 * Verifies that the authenticated user matches the userId in the URL
 */
router.get(
  '/protected/users/:userId/data',
  authenticate,
  verifyOwnership('userId'),
  (req: Request, res: Response) => {
    // This code only runs if req.userId === req.params.userId
    res.json({
      message: 'This is user-specific data',
      userId: req.userId,
      data: 'User can only access their own data',
    });
  }
);

/**
 * Example 3: Protected POST route with ownership verification via body
 * Verifies that the authenticated user matches the userId in the request body
 */
router.post(
  '/protected/resources',
  authenticate,
  verifyOwnership('userId'),
  (req: Request, res: Response) => {
    // This code only runs if req.userId === req.body.userId
    res.json({
      message: 'Resource created',
      userId: req.userId,
      resource: req.body,
    });
  }
);

/**
 * Example 4: Protected route with manual ownership verification
 * For cases where ownership needs to be verified against database records
 */
router.delete(
  '/protected/resources/:resourceId',
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const userId = req.userId!;
      const resourceId = req.params.resourceId;

      // In a real implementation, you would:
      // 1. Fetch the resource from database
      // 2. Verify resource.userId === userId
      // 3. Delete if ownership is confirmed
      
      // Example pseudo-code:
      // const resource = await prisma.resource.findUnique({ where: { id: resourceId } });
      // if (!resource) return res.status(404).json({ error: 'Not found' });
      // if (resource.userId !== userId) return res.status(403).json({ error: 'Access denied' });
      // await prisma.resource.delete({ where: { id: resourceId } });

      res.json({
        message: 'Resource deleted (example)',
        userId,
        resourceId,
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;

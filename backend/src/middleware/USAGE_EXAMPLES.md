# Protected Route Middleware - Usage Examples

## Overview

This document provides examples of how to use the authentication middleware to protect backend routes and verify user ownership of resources.

**Requirements Addressed**: 8.1 (Authentication required for protected routes), 8.5 (User ID verification for data access)

## Available Middleware

### 1. `authenticate`
Requires a valid user ID in the `x-user-id` header. Use this for any route that requires authentication.

### 2. `optionalAuth`
Attaches user ID if present but doesn't require it. Use for routes that can work with or without authentication.

### 3. `verifyOwnership(paramName)`
Ensures the authenticated user owns the requested resource. Use after `authenticate` to verify ownership.

## Usage Examples

### Example 1: Basic Protected Route

```typescript
import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getEmotions, createEmotion } from '../controllers/emotion.controller';

const router = Router();

// All emotion routes require authentication
router.get('/emotions', authenticate, getEmotions);
router.post('/emotions', authenticate, createEmotion);

export default router;
```

### Example 2: Protected Route with Ownership Verification

```typescript
import { Router } from 'express';
import { authenticate, verifyOwnership } from '../middleware/auth.middleware';
import { 
  getEmotionById, 
  updateEmotion, 
  deleteEmotion 
} from '../controllers/emotion.controller';

const router = Router();

// Get specific emotion - verify user owns it
router.get('/emotions/:id', authenticate, getEmotionById);

// Update emotion - verify user owns it
router.put('/emotions/:id', authenticate, updateEmotion);

// Delete emotion - verify user owns it
router.delete('/emotions/:id', authenticate, deleteEmotion);

export default router;
```

### Example 3: User-Specific Resource Routes

```typescript
import { Router } from 'express';
import { authenticate, verifyOwnership } from '../middleware/auth.middleware';
import { 
  getUserGoals, 
  createGoal, 
  updateGoal, 
  deleteGoal 
} from '../controllers/goal.controller';

const router = Router();

// Get all goals for a user - verify authenticated user matches userId param
router.get('/users/:userId/goals', authenticate, verifyOwnership('userId'), getUserGoals);

// Create goal for a user - verify authenticated user matches userId in body
router.post('/goals', authenticate, createGoal);

// Update goal - verify in controller that goal belongs to authenticated user
router.put('/goals/:goalId', authenticate, updateGoal);

// Delete goal - verify in controller that goal belongs to authenticated user
router.delete('/goals/:goalId', authenticate, deleteGoal);

export default router;
```

### Example 4: Optional Authentication

```typescript
import { Router } from 'express';
import { optionalAuth } from '../middleware/auth.middleware';
import { getPublicRecommendations } from '../controllers/recommendation.controller';

const router = Router();

// Public route that can personalize if user is authenticated
router.get('/recommendations/public', optionalAuth, getPublicRecommendations);

export default router;
```

## Controller Implementation Examples

### Example 1: Using req.userId in Controller

```typescript
import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getEmotions = async (req: Request, res: Response): Promise<void> => {
  try {
    // userId is set by authenticate middleware
    const userId = req.userId!;

    const emotions = await prisma.emotionEntry.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 10,
    });

    res.status(200).json(emotions);
  } catch (error) {
    console.error('Get emotions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
```

### Example 2: Verifying Ownership in Controller

```typescript
import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const deleteEmotion = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const emotionId = req.params.id;

    // First, verify the emotion belongs to the user
    const emotion = await prisma.emotionEntry.findUnique({
      where: { id: emotionId },
      select: { userId: true },
    });

    if (!emotion) {
      res.status(404).json({ error: 'Emotion entry not found' });
      return;
    }

    if (emotion.userId !== userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Delete the emotion entry
    await prisma.emotionEntry.delete({
      where: { id: emotionId },
    });

    res.status(200).json({ message: 'Emotion entry deleted successfully' });
  } catch (error) {
    console.error('Delete emotion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
```

### Example 3: Creating Resource with User Association

```typescript
import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const createGoal = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { targetEmotion, targetFrequency, startDate, endDate } = req.body;

    // Create goal associated with authenticated user
    const goal = await prisma.goal.create({
      data: {
        userId,
        targetEmotion,
        targetFrequency,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

    res.status(201).json(goal);
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
```

## Testing Protected Routes

### Using curl

```bash
# Without authentication (should fail with 401)
curl -X GET http://localhost:3001/api/emotions

# With authentication (should succeed)
curl -X GET http://localhost:3001/api/emotions \
  -H "x-user-id: 123e4567-e89b-12d3-a456-426614174000"

# Accessing another user's resource (should fail with 403)
curl -X GET http://localhost:3001/api/users/different-user-id/goals \
  -H "x-user-id: 123e4567-e89b-12d3-a456-426614174000"
```

### Using Frontend API Client

```typescript
// frontend/lib/api-client.ts automatically includes x-user-id header
import apiClient from '@/lib/api-client';

// This will include authentication automatically
const emotions = await apiClient.get('/api/emotions');
```

## Security Best Practices

1. **Always use `authenticate` middleware** for routes that access user data
2. **Verify ownership** either using `verifyOwnership` middleware or in the controller
3. **Never trust client-provided user IDs** - always use `req.userId` from middleware
4. **Validate all input data** using express-validator or similar
5. **Use HTTPS in production** to protect the x-user-id header
6. **Consider using JWT tokens** instead of plain user IDs for production

## Common Patterns

### Pattern 1: List Resources for Authenticated User
```typescript
router.get('/resources', authenticate, listResources);
// Controller uses req.userId to filter resources
```

### Pattern 2: Get Specific Resource with Ownership Check
```typescript
router.get('/resources/:id', authenticate, getResource);
// Controller verifies resource.userId === req.userId
```

### Pattern 3: Create Resource for Authenticated User
```typescript
router.post('/resources', authenticate, createResource);
// Controller sets resource.userId = req.userId
```

### Pattern 4: Update/Delete with Ownership Check
```typescript
router.put('/resources/:id', authenticate, updateResource);
router.delete('/resources/:id', authenticate, deleteResource);
// Controller verifies resource.userId === req.userId before operation
```

## Error Responses

### 401 Unauthorized
Returned when no valid authentication is provided:
```json
{
  "error": "Authentication required"
}
```

### 403 Forbidden
Returned when user doesn't own the requested resource:
```json
{
  "error": "Access denied"
}
```

### 404 Not Found
Returned when resource doesn't exist:
```json
{
  "error": "Resource not found"
}
```

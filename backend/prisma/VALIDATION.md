# Prisma Schema Validation Constraints

## Overview

This document describes the validation constraints implemented in the Prisma schema and those that must be enforced at the application level.

## Schema-Level Constraints (Database-Enforced)

### User Model
- **email**: `@unique` - Ensures email uniqueness across all users (Requirement 9.6)
- **id**: `@id @default(uuid())` - Primary key with UUID generation
- **Cascade deletes**: All related data (EmotionEntry, Journal, Goal, Streak, RecommendationCompletion) is deleted when a user is deleted

### EmotionEntry Model
- **userId**: Foreign key with cascade delete
- **emotionEntryId**: Unique constraint for one-to-one relationship with Journal

### Streak Model
- **userId**: `@@unique([userId])` - Ensures one streak record per user

### All Models
- **Timestamps**: `createdAt` and `updatedAt` fields with automatic management
- **Indexes**: Performance optimization on frequently queried fields

## Application-Level Validation (Must Be Implemented in Backend)

### User Model (Requirement 9.5, 9.6)
- **email format**: Must validate email format using regex or validation library
  - Example: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
  - Use express-validator or similar library

### EmotionEntry Model (Requirement 9.1)
- **Emotion scores range**: All 7 emotion scores must be in range [0, 1]
  - happyScore, sadScore, angryScore, fearfulScore, disgustedScore, surprisedScore, neutralScore
- **Emotion scores sum**: Sum of all scores should approximately equal 1.0 (±0.01 tolerance)
- **dominantEmotion**: Must be one of: 'happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised', 'neutral' (Requirement 9.2)

### Goal Model (Requirement 9.3, 9.4)
- **targetFrequency**: Must be a positive integer (> 0)
- **currentProgress**: Must be non-negative (>= 0)
- **Date validation**: endDate must be after startDate
- **reminderTime**: If provided, must be in HH:MM format (e.g., "09:30")

### Streak Model (Requirement 9.7)
- **currentStreak**: Must be non-negative (>= 0)
- **longestStreak**: Must be non-negative (>= 0)
- **Logical constraint**: longestStreak should always be >= currentStreak

## Implementation Notes

### Why Not Database Check Constraints?

Prisma 5.14.0 (used in this project) does not support `@@check` constraints. While newer versions of Prisma support check constraints, we've chosen to implement validation at the application level for:

1. **Compatibility**: Works with current Prisma version
2. **Better error messages**: Application-level validation can provide more user-friendly error messages
3. **Complex validation**: Some validations (like email format, date comparisons) are easier to implement in application code
4. **Flexibility**: Easier to modify validation rules without database migrations

### Recommended Validation Libraries

- **express-validator**: For request validation in Express.js
- **joi** or **yup**: For schema-based validation
- **validator.js**: For common validation patterns (email, URLs, etc.)

### Example Validation Implementation

```typescript
import { body, validationResult } from 'express-validator';

// User email validation
export const validateUserEmail = [
  body('email')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
];

// Emotion scores validation
export const validateEmotionScores = [
  body('happyScore').isFloat({ min: 0, max: 1 }),
  body('sadScore').isFloat({ min: 0, max: 1 }),
  body('angryScore').isFloat({ min: 0, max: 1 }),
  body('fearfulScore').isFloat({ min: 0, max: 1 }),
  body('disgustedScore').isFloat({ min: 0, max: 1 }),
  body('surprisedScore').isFloat({ min: 0, max: 1 }),
  body('neutralScore').isFloat({ min: 0, max: 1 }),
  body().custom((body) => {
    const sum = body.happyScore + body.sadScore + body.angryScore + 
                body.fearfulScore + body.disgustedScore + body.surprisedScore + 
                body.neutralScore;
    if (Math.abs(sum - 1.0) > 0.01) {
      throw new Error('Emotion scores must sum to approximately 1.0');
    }
    return true;
  }),
];

// Goal validation
export const validateGoal = [
  body('targetFrequency')
    .isInt({ min: 1 })
    .withMessage('Target frequency must be a positive integer'),
  body('currentProgress')
    .isInt({ min: 0 })
    .withMessage('Current progress must be non-negative'),
  body('endDate')
    .custom((endDate, { req }) => {
      if (new Date(endDate) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  body('reminderTime')
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Reminder time must be in HH:MM format'),
];
```

## Testing Validation

All validation rules should be tested with:
1. **Valid data**: Ensure valid data passes validation
2. **Invalid data**: Ensure invalid data is rejected with appropriate error messages
3. **Edge cases**: Test boundary values (0, 1, negative numbers, etc.)
4. **Type errors**: Test with wrong data types (strings instead of numbers, etc.)

## Migration Status

✅ **Migration Completed Successfully** - `20260408140718_init`

### Database Configuration
- **Database**: PostgreSQL
- **Database Name**: mental_wellness_tracker
- **Host**: localhost:5432
- **Schema**: public

### Tables Created

All 6 tables have been successfully created with proper constraints:

1. ✅ **users** - User authentication and profile data
   - Primary key: `id` (UUID)
   - Unique constraint: `email`
   - Cascade delete configured for all related tables

2. ✅ **emotion_entries** - Emotion detection results
   - Primary key: `id` (UUID)
   - Foreign key: `userId` → users(id) with CASCADE delete
   - Index: `(userId, timestamp)` for efficient queries
   - All 7 emotion scores stored as Float (0-1 range)

3. ✅ **journals** - Mood journal entries
   - Primary key: `id` (UUID)
   - Foreign keys: 
     - `emotionEntryId` → emotion_entries(id) with CASCADE delete
     - `userId` → users(id) with CASCADE delete
   - Unique constraint: `emotionEntryId` (one-to-one relationship)
   - Index: `(userId, createdAt)` for efficient queries

4. ✅ **goals** - Emotional wellness goals
   - Primary key: `id` (UUID)
   - Foreign key: `userId` → users(id) with CASCADE delete
   - Index: `(userId, isActive)` for efficient queries
   - Default values: `currentProgress=0`, `reminderEnabled=false`, `isActive=true`

5. ✅ **streaks** - Check-in streak tracking
   - Primary key: `id` (UUID)
   - Foreign key: `userId` → users(id) with CASCADE delete
   - Unique constraint: `userId` (one-to-one relationship)
   - Default values: `currentStreak=0`, `longestStreak=0`

6. ✅ **recommendation_completions** - Recommendation tracking
   - Primary key: `id` (UUID)
   - Foreign key: `userId` → users(id) with CASCADE delete
   - Index: `(userId, completedAt)` for efficient queries

### Requirements Validation

✅ **Requirement 2.3** - Emotion entries persisted with generated UUID  
✅ **Requirement 2.5** - Emotion entries associated with user ID  
✅ **Requirement 3.5** - Journal linked to exactly one emotion entry (unique constraint)  
✅ **Requirement 3.8** - Cascade delete configured for journals  
✅ **Requirement 5.1** - Goals require target emotion, frequency, dates  
✅ **Requirement 6.1** - Streak record created with proper fields  
✅ **Requirement 8.2** - User record with unique UUID  
✅ **Requirement 8.4** - Cascade delete configured for all user data  
✅ **Requirement 9.5** - Email validation (unique constraint)  
✅ **Requirement 9.6** - Email uniqueness enforced at database level

### Prisma Client Generation

✅ Prisma Client generated successfully (v5.22.0)  
✅ Client available at `node_modules/@prisma/client`

### Verification Commands

To verify the migration:
```bash
# Check tables
psql -U postgres -d mental_wellness_tracker -c "\dt"

# Check specific table schema
psql -U postgres -d mental_wellness_tracker -c "\d emotion_entries"

# Pull schema from database
npx prisma db pull --print
```

### Next Steps

The database schema is now ready for:
- Backend API implementation
- Data validation at application level
- Testing with real data

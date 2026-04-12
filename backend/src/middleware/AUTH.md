# Authentication Middleware Documentation

## Overview

The authentication system for Mental Wellness Tracker uses NextAuth.js on the frontend and custom middleware on the backend. This provides a secure, session-based authentication flow.

## Requirements Addressed

- **8.1**: Protected routes require authentication
- **8.2**: User creation and retrieval with unique UUID
- **8.5**: User ID verification for data access

## Architecture

### Frontend (NextAuth.js)
- **Session Management**: JWT-based sessions with 30-day expiration
- **Provider**: Credentials provider with email-only authentication
- **Session Provider**: Wraps the entire app to provide auth context
- **Protected Routes**: Middleware protects dashboard, scan, journal, goals routes

### Backend (Express Middleware)
- **authenticate**: Requires valid user ID in `x-user-id` header
- **optionalAuth**: Attaches user ID if present, doesn't require it
- **verifyOwnership**: Ensures authenticated user owns the requested resource

## Authentication Flow

1. User enters email on sign-in page
2. NextAuth calls backend `/api/auth/login` endpoint
3. Backend finds or creates user with that email
4. NextAuth creates JWT session with user data
5. Frontend stores session and includes user ID in API requests
6. Backend middleware validates user ID on protected endpoints

## Usage Examples

### Backend - Protecting Routes

```typescript
import { authenticate, verifyOwnership } from '../middleware/auth.middleware';

// Require authentication
router.get('/api/emotions', authenticate, getEmotions);

// Require authentication + verify ownership
router.delete('/api/emotions/:id', authenticate, verifyOwnership('userId'), deleteEmotion);
```

### Frontend - Using Authentication

```typescript
import { useAuth } from '@/lib/hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, userId } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please sign in</div>;
  }
  
  return <div>Welcome, {user.email}!</div>;
}
```

### Frontend - Making Authenticated API Calls

```typescript
import apiClient from '@/lib/api-client';

// apiClient automatically includes user ID in headers
const response = await apiClient.get('/api/emotions');
```

## Security Considerations

1. **User ID in Headers**: The `x-user-id` header is set by the frontend after NextAuth authentication. In production, consider using signed tokens.

2. **Session Security**: JWT sessions are signed with `NEXTAUTH_SECRET`. Keep this secret secure.

3. **HTTPS**: Always use HTTPS in production to protect session data.

4. **CORS**: Backend CORS is configured to allow requests from the frontend origin.

## Environment Variables

### Backend (.env)
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production
```

## Testing Authentication

### Test Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Test Protected Endpoint
```bash
curl -X GET http://localhost:3001/api/auth/profile \
  -H "x-user-id: <user-id-from-login>"
```

## Extending Authentication

To add additional authentication providers (Google, GitHub, etc.):

1. Install the provider package
2. Add provider to `authOptions` in `frontend/app/api/auth/[...nextauth]/route.ts`
3. Configure provider credentials in environment variables
4. Update sign-in page to show provider buttons

## Troubleshooting

### "Authentication required" error
- Ensure user is signed in via NextAuth
- Check that `x-user-id` header is being sent
- Verify session is valid (not expired)

### "Access denied" error
- User is authenticated but doesn't own the resource
- Check that the user ID matches the resource owner

### Session not persisting
- Verify `NEXTAUTH_SECRET` is set and consistent
- Check browser cookies are enabled
- Ensure `NEXTAUTH_URL` matches your frontend URL

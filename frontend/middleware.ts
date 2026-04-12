import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/**
 * Authentication middleware for protected routes
 * Requirements: 8.1
 * 
 * This middleware protects routes that require authentication.
 * Users will be redirected to the sign-in page if not authenticated.
 */
export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
);

/**
 * Configure which routes require authentication
 * All routes under /dashboard, /scan, /journal, /goals require auth
 */
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/scan/:path*",
    "/journal/:path*",
    "/goals/:path*",
    "/recommendations/:path*",
  ],
};

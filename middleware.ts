import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes
        if (req.nextUrl.pathname.startsWith("/login") || 
            req.nextUrl.pathname.startsWith("/register") ||
            req.nextUrl.pathname.startsWith("/api/auth")) {
          return true
        }

        // Require authentication for protected routes
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return token?.role === "ADMIN"
        }

        // Require authentication for other protected routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    "/feed/:path*",
    "/confess/:path*",
    "/confession/:path*",
    "/admin/:path*",
    "/api/confession/:path*",
    "/api/admin/:path*",
  ],
}


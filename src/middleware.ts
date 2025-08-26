import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // if (req.nextUrl.pathname.startsWith("/admin")) {
        //   return token !== null
        // }
        return true
      }
    }
  }
)

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth/.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
  ]
}
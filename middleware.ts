import { NextRequest, NextResponse } from "next/server";
import { withAuthToken } from "./app/middlewares/withAuthToken";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/signup",
  ],
};

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
let response:any;
  if (pathname.startsWith('/_next') || pathname.startsWith('/icon.ico')) {
    return NextResponse.next();
  }

  // Check if user is authenticated and trying to access /login or /signup
  // response  = await redirectAuthenticated(request);
  // if (response) {
  //   return response;
  // }

  // Apply withAuthToken for protected routes
  //  response = await withAuthToken(request);
  // if (response) return response;
  return NextResponse.next();
}

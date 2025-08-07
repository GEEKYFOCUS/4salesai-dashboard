import { NextRequest, NextResponse } from "next/server";
import {getUser} from "@/app/_lib/data-service"; // Adjust path to where getUser is defined

// Middleware to redirect authenticated users from /login or /signup to /dashboard/agents
async function redirectAuthenticated(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply to /login and /signup routes
  if (pathname === "/login" || pathname === "/signup") {
    try {
      const { data } = await getUser();
      
      const { user } = data;
console.log(user, "middlwaredata")
      // If user is authenticated, redirect to /dashboard/agents
      if (user) {
        return NextResponse.redirect(new URL("/dashboard/agents", request.url));
      }

      // If not authenticated, allow access to /login or /signup
      return undefined;
    } catch (error) {
      console.error("[redirectAuthenticated] Error:", error);
      // If getUser fails (e.g., no session), allow access to /login or /signup
      return undefined;
    }
  }

  // For other routes, pass through
  return undefined;
}
import { NextRequest, NextResponse } from 'next/server';
import {getUser} from "@/app/_lib/data-service";
export async function withAuthToken(request: NextRequest) {
  const { pathname } = request.nextUrl;

  try {
    const { data } = await getUser();
    const { user } = data;
    console.log(data, "user-data");

    if (!user) {
      // Redirect to login if no user exists
      return undefined;
    }

    // Uncomment and implement role-based permissions if needed
    /*
    const userRole = user.role;
    const roleRestrictions = rolePermissions[userRole] || [];

    for (const restriction of roleRestrictions) {
      if (restriction.paths.some(path => pathname.startsWith(path))) {
        return NextResponse.redirect(new URL(restriction.redirect, request.url));
      }
    }
    */

    // Uncomment and implement API token check if needed
    /*
    if (pathname.startsWith('/api')) {
      const token = user.api_token;
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }
    */

    // Allow the request to proceed
    return undefined;
  } catch (error) {
    console.error('[withAuthToken] Error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

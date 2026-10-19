import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Keep these roots in sync with the workspace routes in app/(app).
const protectedRoots = [
  "/dashboard", "/reports", "/billing", "/time-tracking", "/my-profile",
  "/my-reports", "/my-workspace", "/my-messages", "/team", "/my-schedule",
  "/my-office", "/schedules", "/my-time", "/office", "/company-settings",
  "/messages", "/settings", "/attendance", "/setup-company",
];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          const previousResponse = supabaseResponse;
          supabaseResponse = NextResponse.next({ request });
          previousResponse.cookies.getAll().forEach((cookie) => {
            supabaseResponse.cookies.set(cookie);
          });
          for (const name of ["cache-control", "expires", "pragma"]) {
            const value = previousResponse.headers.get(name);
            if (value) supabaseResponse.headers.set(name, value);
          }
          Object.entries(headers).forEach(([name, value]) => {
            supabaseResponse.headers.set(name, value);
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const protectedRoute = protectedRoots.some(
    (root) => request.nextUrl.pathname === root || request.nextUrl.pathname.startsWith(`${root}/`),
  );

  if (protectedRoute) {
    // Ask Auth to validate the user, including sessions that have been revoked.
    let authenticated = false;
    try {
      const { data, error } = await supabase.auth.getUser();
      authenticated = !error && !!data.user;
    } catch {
      // Fail closed when the session cannot be verified.
    }

    supabaseResponse.headers.set("Cache-Control", "private, no-store");
    if (!authenticated) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      supabaseResponse.cookies.getAll().forEach((cookie) => response.cookies.set(cookie));
      for (const name of ["cache-control", "expires", "pragma"]) {
        const value = supabaseResponse.headers.get(name);
        if (value) response.headers.set(name, value);
      }
      return response;
    }
  } else {
    await supabase.auth.getClaims();
  }

  return supabaseResponse;
}

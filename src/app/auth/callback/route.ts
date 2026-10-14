import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const destination = request.nextUrl.searchParams.get("flow") === "signup"
    ? "/setup-company"
    : "/dashboard";
  const response = NextResponse.redirect(new URL(destination, request.url));
  response.headers.set("Cache-Control", "private, no-store");

  if (code && !request.nextUrl.searchParams.has("error")) {
    try {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
          cookies: {
            getAll: () => request.cookies.getAll(),
            setAll(cookiesToSet, headers) {
              cookiesToSet.forEach(({ name, value, options }) => {
                request.cookies.set(name, value);
                response.cookies.set(name, value, options);
              });
              Object.entries(headers).forEach(([name, value]) => {
                response.headers.set(name, value);
              });
            },
          },
        },
      );
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) return response;
    } catch {
      // Network failures should offer the same retry path as expired codes.
    }
  }

  response.headers.set("Location", new URL("/auth/error", request.url).toString());
  return response;
}

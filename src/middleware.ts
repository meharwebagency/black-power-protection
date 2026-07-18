import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { locales, defaultLocale } from "@/i18n/config";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options: CookieOptions;
          }[]
        ) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Check if the pathname has a locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    const locale = defaultLocale;
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  // Extract locale from pathname
  const locale = pathname.split("/")[1] as string;

  // Validate locale
  if (!locales.includes(locale as typeof locales[number])) {
    request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  // Redirect while preserving any auth cookies that setAll wrote to
  // supabaseResponse — otherwise a refreshed/rotated session is dropped.
  const redirectTo = (url: NextRequest["nextUrl"]) => {
    const response = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((cookie) =>
      response.cookies.set(cookie)
    );
    return response;
  };

  // Protect admin routes — but NOT the login page
  const isAdminRoute = pathname.includes("/admin");
  const isLoginPage = pathname.includes("/login");

  if (isAdminRoute && !isLoginPage && !user) {
    request.nextUrl.pathname = `/${locale}/login`;
    return redirectTo(request.nextUrl);
  }

  // If logged in user visits login page, redirect to admin
  if (isLoginPage && user) {
    request.nextUrl.pathname = `/${locale}/admin`;
    return redirectTo(request.nextUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images/|icons/).*)",
  ],
};

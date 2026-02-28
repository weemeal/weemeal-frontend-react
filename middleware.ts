import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';
import {getToken} from 'next-auth/jwt';

// Paths that require authentication (when auth is enabled)
const protectedPaths = [
    '/recipe/new',
    '/recipe/*/edit',
];

// Check if a path matches any protected pattern
function isProtectedPath(pathname: string): boolean {
    return protectedPaths.some((pattern) => {
        const regex = new RegExp(`^${pattern.replace('*', '[^/]+')}$`);
        return regex.test(pathname);
    });
}

export async function middleware(request: NextRequest) {
    const {pathname} = request.nextUrl;

    // Skip auth check if Keycloak is not configured
    const keycloakConfigured =
        process.env.KEYCLOAK_CLIENT_ID &&
        process.env.KEYCLOAK_CLIENT_SECRET &&
        process.env.KEYCLOAK_ISSUER;

    if (!keycloakConfigured) {
        return NextResponse.next();
    }

    // Check if path requires authentication
    if (isProtectedPath(pathname)) {
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET,
        });

        if (!token) {
            // Redirect to login page with callback URL
            const signInUrl = new URL('/api/auth/signin', request.url);
            signInUrl.searchParams.set('callbackUrl', request.url);
            return NextResponse.redirect(signInUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};

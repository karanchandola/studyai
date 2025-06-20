import { NextResponse } from "next/server";

export { default } from 'next-auth/middleware';
import { getToken } from "next-auth/jwt";

export async function middleware(request) {

    const token = await getToken({ req: request })
    const url = request.nexturl

    if ( token && (url.pathname.startwith('/AuthForm')) ) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    if ( !token && (url.pathname.startwith('/dashboard')) ) {
        return NextResponse.redirect(new URL('/AuthForm', request.url))
    }

    return NextResponse.redirect(new URL('/', request.url))
}

export const config = {
    matcher: [
        '/AuthForm',
        '/dashboard',
        '/'
    ]
}
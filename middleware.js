import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  //generating a nonce for inline script and style elements
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  //constructing the CSP string with the generated nonce
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval'; 
    style-src 'self' 'unsafe-inline';  
    img-src 'self' blob: data: https://res.cloudinary.com; 
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, " ")
    .trim(); //replacing newline characters and extra spaces

  //creating the response object to modify
  const response = NextResponse.next();

  //auth-related checks
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  //redirection based on authentication and user role
  if (!token || !token.user) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }
  if (req.nextUrl.pathname.startsWith("/sell") && !token.user.isSeller) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  //setting the CSP header on the response
  response.headers.set("Content-Security-Policy", cspHeader);

  //returning the modified response
  //console log is for the testing purposes
  console.log("response.headers", response.headers);
  return response;
}

export const config = {
  matcher: ["/messages", "/orders/:path*", "/cart", "/profile/:path*", "/sell/:path*", "/checkout", "/watch"]
};

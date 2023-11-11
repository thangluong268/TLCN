// import type { NextRequest } from "next/server";
// import { NextResponse } from "next/server";

// export function middleware(request: NextRequest) {
//   const requestHeaders = new Headers(request.headers);
//   const response = NextResponse.next({
//     request: {
//       headers: requestHeaders,
//     },
//   });

//   const access_token = response.headers.get("Authorization");
//   if (request.nextUrl.pathname === "/login" && !access_token) {
//     return;
//   }

//   // call api auth to check access_token
//   //...

//   if (!access_token) {
//     // return NextResponse.redirect('/login')
//   }
//   return response;
// }

// export const config = {
//   matcher: "/:path*",
// };

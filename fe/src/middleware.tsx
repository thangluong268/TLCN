import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {

}

export const config = {
    matcher: '/:path*',
}

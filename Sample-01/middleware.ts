import { NextRequest, NextResponse } from 'next/server';
import { getTreatment } from '@lib/split-node'
import { SPLITS } from '@lib/split'

export const config = {
    matcher: '/api/auth/login',
};

export default function middleware(req: NextRequest) {

  const split = SPLITS.universal_login;
  const cookieKey = `flag-${split}`
  // Get the cookie from the request or a default value from split
  const cookieValue =
    req.cookies.get(cookieKey)?.value ||
    (getTreatment('anonymous', SPLITS[split]) === 'on' ? '1' : '0')

  // Set the pathname based on the split and cookie value
  if (cookieValue === '1') {
    req.nextUrl.pathname = `/api/auth/portal-1-login`;
  }

  const res = NextResponse.rewrite(req.nextUrl)

  // Add the cookie if it's not there
  if (!req.cookies[cookieKey]) {
    res.cookies.set(cookieKey, cookieValue)
  }

  return res;
}
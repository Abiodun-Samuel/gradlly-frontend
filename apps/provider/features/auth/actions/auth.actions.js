"use server";

import { redirect } from "next/navigation";

import { AUTH_ERROR_CODES } from "../constants";
import { authErrorToPlain, normalizeAuthError } from "../errors";
import { signupSchema, loginSchema, toSignupPayload } from "../schemas";

import * as authService from "@/features/auth/services/auth.service";

/**
 * Server Actions — the * only * mutation surface client components touch.
 *
 * Important: on success, signup / login / logout`redirect()` from the
 * server.That commits the Set - Cookie headers and the navigation in
 * the * same response *, so the browser cannot race ahead to the next
 * page before the cookies are stored.Doing the redirect on the client
 * (router.replace) caused a redirect loop because the navigation
 * sometimes fired before the cookie was committed.
 *
 * On failure, we return a plain `{ ok: false, error }` so the form can
 * surface the error inline.We never throw across the action boundary —
 * thrown errors don't preserve our normalised shape after Next.js
 * serialization.
 *
 * Note on `redirect()`: it works by throwing a special internal error,
 * which means it MUST live outside the try/catch (or it gets swallowed
 * as a normalized auth error). Each action below does the API call in
 * the try block, then calls `redirect()` outside it.
 */

const POST_AUTH_REDIRECT = "/";
const POST_LOGOUT_REDIRECT = "/login";

function failFromZod(zodError) {
  const fieldErrors = {};
  for (const issue of zodError.issues) {
    const key = issue.path.join(".");
    if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return {
    ok: false,
    error: {
      code: AUTH_ERROR_CODES.VALIDATION,
      message: "Some fields need your attention.",
      status: 422,
      fieldErrors,
      requestId: null,
    },
  };
}

function fail(err) {
  return { ok: false, error: authErrorToPlain(normalizeAuthError(err)) };
}

// ---------------------------------------------------------------------------
// signup
// ---------------------------------------------------------------------------

export async function signupAction(values) {
  const parsed = signupSchema.safeParse(values);
  if (!parsed.success) return failFromZod(parsed.error);

  let succeeded = false;
  try {
    await authService.signup(toSignupPayload(parsed.data));
    succeeded = true;
  } catch (err) {
    return fail(err);
  }

  if (succeeded) redirect(POST_AUTH_REDIRECT);
}

// ---------------------------------------------------------------------------
// login
// ---------------------------------------------------------------------------

export async function loginAction(values) {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) return failFromZod(parsed.error);

  let succeeded = false;
  try {
    await authService.login(parsed.data);
    succeeded = true;
  } catch (err) {
    return fail(err);
  }

  if (succeeded) redirect(POST_AUTH_REDIRECT);
}

// ---------------------------------------------------------------------------
// logout — also redirects from the server so the cleared-cookie response
// and the navigation arrive together
// ---------------------------------------------------------------------------

export async function logoutAction() {
  let succeeded = false;
  try {
    await authService.logout();
    succeeded = true;
  } catch (err) {
    return fail(err);
  }

  if (succeeded) redirect(POST_LOGOUT_REDIRECT);
}

// ---------------------------------------------------------------------------
// me — read-only, no redirect
// ---------------------------------------------------------------------------

export async function meAction() {
  try {
    const user = await authService.getMe();
    return { ok: true, user };
  } catch (err) {
    return fail(err);
  }
}

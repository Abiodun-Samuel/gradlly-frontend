import { AUTH_ERROR_CODES } from "../constants";

/**
 * Auth error layer.
 *
 * The backend speaks two shapes:
 *
 *   Standard:
 *     { message, error, statusCode, timestamp, path, requestId }
 *
 *   Validation (422):
 *     { statusCode: 422, message: 'Validation Error',
 *       errors: { field: 'message' }, path, ... }
 *
 * `AuthError` is the canonical shape the UI consumes. Anything thrown by
 * the network layer is run through `normalizeAuthError` before reaching
 * the form.
 */

export class AuthError extends Error {
  constructor({ code, message, status, fieldErrors, requestId, cause }) {
    super(message);
    this.name = "AuthError";
    this.code = code;
    this.status = status ?? 0;
    this.fieldErrors = fieldErrors ?? null;
    this.requestId = requestId ?? null;
    if (cause) this.cause = cause;
  }
}

function codeFromStatus(status) {
  if (status === 0) return AUTH_ERROR_CODES.NETWORK;
  if (status === 401) return AUTH_ERROR_CODES.UNAUTHORIZED;
  if (status === 403) return AUTH_ERROR_CODES.FORBIDDEN;
  if (status === 409) return AUTH_ERROR_CODES.CONFLICT;
  if (status === 422 || status === 400) return AUTH_ERROR_CODES.VALIDATION;
  if (status >= 500) return AUTH_ERROR_CODES.SERVER;
  return AUTH_ERROR_CODES.UNKNOWN;
}

export function normalizeAuthError(error) {
  if (error instanceof AuthError) return error;

  const status = typeof error?.status === "number" ? error.status : 0;
  const data = error?.data ?? {};

  if (
    (status === 422 || data?.statusCode === 422) &&
    data?.errors &&
    typeof data.errors === "object"
  ) {
    return new AuthError({
      code: AUTH_ERROR_CODES.VALIDATION,
      message: data.message || "Some fields need your attention.",
      status: 422,
      fieldErrors: data.errors,
      requestId: data.requestId,
      cause: error,
    });
  }

  return new AuthError({
    code: codeFromStatus(status),
    message:
      data?.message ||
      error?.message ||
      "Something went wrong. Please try again.",
    status,
    fieldErrors: null,
    requestId: data?.requestId,
    cause: error,
  });
}

/**
 * Plain-object representation of an `AuthError`, suitable for crossing
 * the Server Action serialization boundary.
 */
export function authErrorToPlain(authError) {
  return {
    code: authError.code,
    message: authError.message,
    status: authError.status,
    fieldErrors: authError.fieldErrors,
    requestId: authError.requestId,
  };
}

export function plainToAuthError(plain) {
  return new AuthError({
    code: plain?.code ?? AUTH_ERROR_CODES.UNKNOWN,
    message: plain?.message ?? "Something went wrong.",
    status: plain?.status ?? 0,
    fieldErrors: plain?.fieldErrors ?? null,
    requestId: plain?.requestId ?? null,
  });
}

// ---------------------------------------------------------------------------
// react-hook-form bridge
// ---------------------------------------------------------------------------

/**
 * Push an `AuthError` (or anything `normalizeAuthError` can read) into
 * react-hook-form's error state.
 *
 *   - validation → per-field messages + summary in `root.serverError`
 *   - everything else → just `root.serverError`
 */
export function applyServerErrors(
  error,
  setError,
  { fallbackField = "root.serverError" } = {},
) {
  const normalized = normalizeAuthError(error);

  if (
    normalized.code === AUTH_ERROR_CODES.VALIDATION &&
    normalized.fieldErrors
  ) {
    Object.entries(normalized.fieldErrors).forEach(([field, message]) => {
      setError(field, { type: "server", message });
    });
  }

  setError(fallbackField, {
    type: "server",
    message: normalized.message,
  });
}

/**
 * Pull every field message out of an rhf `errors` object as a flat list.
 * Used by `ServerErrorAlert` when it wants to render an itemised summary.
 */
export function collectFieldErrors(errors) {
  const out = [];
  const walk = (node, path = "") => {
    if (!node || typeof node !== "object") return;
    if (typeof node.message === "string" && node.message) {
      out.push({ field: path || "root", message: node.message });
      return;
    }
    for (const [key, value] of Object.entries(node)) {
      walk(value, path ? `${path}.${key}` : key);
    }
  };
  walk(errors);
  return out;
}

// import { ApiError } from '@/lib/api/client';

// export class AuthError extends Error {
//     constructor(code, message, status, details, fieldErrors) {
//         super(message);
//         this.name = 'AuthError';
//         this.code = code;
//         this.status = status ?? 0;
//         this.details = details;
//         this.fieldErrors = fieldErrors ?? null; // { fieldName: 'message' }
//     }
// }

// export const AUTH_ERROR_CODES = Object.freeze({
//     INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
//     EMAIL_TAKEN: 'EMAIL_TAKEN',
//     VALIDATION: 'VALIDATION',
//     UNAUTHORIZED: 'UNAUTHORIZED',
//     FORBIDDEN: 'FORBIDDEN',
//     RATE_LIMITED: 'RATE_LIMITED',
//     NETWORK: 'NETWORK',
//     TIMEOUT: 'TIMEOUT',
//     UNKNOWN: 'UNKNOWN',
// });

// /**
//  * Single mapping from low-level ApiError statuses to friendly auth errors.
//  * Pure function — easy to test.
//  */
// export function toAuthError(error) {
//     if (error instanceof AuthError) return error;

//     if (error instanceof ApiError) {
//         const { status } = error;
//         const data = error.data ?? {};
//         const serverMessage =
//             typeof data === 'object' ? data.message || data.error : null;

//         if (status === 0) {
//             return new AuthError(
//                 AUTH_ERROR_CODES.NETWORK,
//                 'Unable to reach the server. Check your connection and try again.',
//                 status,
//             );
//         }
//         if (status === 408) {
//             return new AuthError(
//                 AUTH_ERROR_CODES.TIMEOUT,
//                 'The request took too long. Please try again.',
//                 status,
//             );
//         }
//         if (status === 400 || status === 422) {
//             return new AuthError(
//                 AUTH_ERROR_CODES.VALIDATION,
//                 serverMessage || 'Please check the details you entered.',
//                 status,
//                 data,
//                 data?.errors ?? null, // pull out the per-field map
//             );
//         }
//         if (status === 401) {
//             return new AuthError(
//                 AUTH_ERROR_CODES.INVALID_CREDENTIALS,
//                 serverMessage || 'Incorrect email or password.',
//                 status,
//             );
//         }
//         if (status === 403) {
//             return new AuthError(
//                 AUTH_ERROR_CODES.FORBIDDEN,
//                 serverMessage || 'You do not have permission to do that.',
//                 status,
//             );
//         }
//         if (status === 409) {
//             return new AuthError(
//                 AUTH_ERROR_CODES.EMAIL_TAKEN,
//                 serverMessage || 'An account with that email already exists.',
//                 status,
//             );
//         }
//         if (status === 429) {
//             return new AuthError(
//                 AUTH_ERROR_CODES.RATE_LIMITED,
//                 'Too many attempts. Please wait a moment and try again.',
//                 status,
//             );
//         }
//         return new AuthError(
//             AUTH_ERROR_CODES.UNKNOWN,
//             serverMessage || 'Something went wrong. Please try again.',
//             status,
//         );
//     }

//     return new AuthError(
//         AUTH_ERROR_CODES.UNKNOWN,
//         error?.message || 'Something went wrong. Please try again.',
//         0,
//     );
// }

// /**
//  * Apply a server-side error onto a react-hook-form via setError.
//  *
//  *   - If the error has a per-field map (422 Validation), each field is set
//  *     individually so the InputForm component renders its inline error.
//  *   - Otherwise the error message is set on a root field (default
//  *     'root.serverError') for display in the ServerErrorSummary component.
//  *
//  * Fields that don't exist in the form are still recorded by RHF and remain
//  * accessible via formState.errors — useful for catching API contract drift.
//  */
// export function applyServerErrors(
//     error,
//     setError,
//     { fallbackField = 'root.serverError' } = {},
// ) {
//     if (error?.code === AUTH_ERROR_CODES.VALIDATION && error?.fieldErrors) {
//         Object.entries(error.fieldErrors).forEach(([field, message]) => {
//             setError(field, { type: 'server', message });
//         });
//         return;
//     }
//     setError(fallbackField, {
//         type: 'server',
//         message: error?.message ?? 'Something went wrong.',
//     });
// }

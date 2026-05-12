"use client";

/**
 * ServerErrorAlert — displays an error message returned by the backend.
 *
 * Not a form-error component. It renders the *server's* response when a
 * request fails: a 409 conflict, a 500, a network error, an aggregated
 * 422 summary, anything that came back over the wire.
 *
 * Props:
 *   - error      either a string, an Error/AuthError, or a plain
 *                `{ message, code, status, fieldErrors }` object
 *   - title      optional heading (default: 'Something went wrong')
 *   - showFieldList  if true and `fieldErrors` is present, render an
 *                itemised list under the headline. Useful as a "summary"
 *                pattern at the top of long forms (GOV.UK style).
 *   - onDismiss  optional dismiss handler — renders a close button.
 *   - className  passthrough
 *
 * Returns `null` when there's nothing to show, so callers can render it
 * unconditionally.
 */
export function ServerErrorAlert({
  error,
  title = "Something went wrong",
  showFieldList = false,
  onDismiss,
  className = "",
}) {
  const normalized = normalize(error);
  if (!normalized) return null;

  const { message, fieldErrors, requestId } = normalized;
  const hasList =
    showFieldList && fieldErrors && Object.keys(fieldErrors).length > 0;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={[
        "rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          {title ? <p className="font-semibold mb-0.5">{title}</p> : null}
          {message ? <p className="text-red-700">{message}</p> : null}

          {hasList ? (
            <ul className="mt-2 list-disc list-inside space-y-1 text-red-700">
              {Object.entries(fieldErrors).map(([field, msg]) => (
                <li key={field}>
                  <span className="font-medium">{prettifyField(field)}:</span>{" "}
                  {msg}
                </li>
              ))}
            </ul>
          ) : null}

          {requestId ? (
            <p className="mt-2 text-[11px] text-red-600/80 font-mono">
              Request ID: {requestId}
            </p>
          ) : null}
        </div>

        {onDismiss ? (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss"
            className="text-red-700 hover:text-red-900 leading-none px-1"
          >
            ×
          </button>
        ) : null}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Normalization — accept anything reasonable, return a stable shape
// ---------------------------------------------------------------------------

function normalize(error) {
  if (!error) return null;

  if (typeof error === "string") {
    return { message: error, fieldErrors: null, requestId: null };
  }

  // AuthError, plain auth error, or anything shaped close enough
  const message = error.message ?? null;
  const fieldErrors = error.fieldErrors ?? null;
  const requestId = error.requestId ?? null;

  if (!message && !fieldErrors) return null;
  return { message, fieldErrors, requestId };
}

function prettifyField(field) {
  const last = field.split(".").pop() ?? field;
  const spaced = last.replace(/([A-Z])/g, " $1").toLowerCase();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

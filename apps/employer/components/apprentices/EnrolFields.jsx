import { T } from "./tokens";

export function Field({ id, label, type = "text", placeholder, hint }) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-xs font-semibold"
        style={{ color: T.subtle }}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl px-3 py-2.5 text-sm border focus:outline-none focus:ring-2 focus:ring-blue-200"
        style={{
          borderColor: T.border,
          backgroundColor: T.surface,
          color: T.ink,
        }}
      />
      {hint && (
        <p className="text-[11px]" style={{ color: T.muted }}>
          {hint}
        </p>
      )}
    </div>
  );
}

export function Select({ label, options }) {
  return (
    <div className="space-y-1.5">
      <label
        className="block text-xs font-semibold"
        style={{ color: T.subtle }}
      >
        {label}
      </label>
      <select
        className="w-full rounded-xl px-3 py-2.5 text-sm border focus:outline-none"
        style={{
          borderColor: T.border,
          backgroundColor: T.surface,
          color: T.ink,
        }}
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

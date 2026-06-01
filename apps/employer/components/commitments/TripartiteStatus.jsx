"use client";
import { T } from "@/components/dashboard/levy/tokens";

function badge(info, isDraft) {
  if (isDraft) return { bg: T.card, color: T.muted, text: "Awaiting" };
  if (info?.signed)
    return {
      bg: T.greenLight,
      color: T.green,
      text: `✓ ${info.name.split(" ")[0]} · ${info.date}`,
    };
  return { bg: T.amberLight, color: T.amber, text: "⏳ Pending" };
}

function SignerCol({ label, info, isDraft }) {
  const { bg, color, text } = badge(info, isDraft);
  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      <p
        className="text-[9px] font-bold tracking-widest uppercase"
        style={{ color: T.muted }}
      >
        {label}
      </p>
      <span
        className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold w-fit max-w-[140px]"
        style={{ backgroundColor: bg, color }}
      >
        <span className="truncate">{text}</span>
      </span>
    </div>
  );
}

export function TripartiteStatus({ statement }) {
  const { employerSigned, providerSigned, apprenticeSigned, status } =
    statement;
  const isDraft = status === "draft";
  return (
    <div className="flex items-start gap-5">
      <SignerCol label="Employer" info={employerSigned} isDraft={isDraft} />
      <SignerCol label="Provider" info={providerSigned} isDraft={isDraft} />
      <SignerCol label="Apprentice" info={apprenticeSigned} isDraft={isDraft} />
    </div>
  );
}

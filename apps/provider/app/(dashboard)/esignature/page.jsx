import { PenTool } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { EsignatureTool } from "@/features/esignature/components/EsignatureTool";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "E-Signature",
  description:
    "Sign a standalone PDF document with an uploaded signature image.",
  path: "/esignature",
  noIndex: true,
});

export default function EsignaturePage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={PenTool}
        eyebrow="Tools"
        title="E-Signature"
        description="Embed a signature into a standalone PDF. Commitment statements and reviews have their own built-in signing."
      />
      <div className="mx-auto max-w-2xl">
        <EsignatureTool />
      </div>
    </div>
  );
}

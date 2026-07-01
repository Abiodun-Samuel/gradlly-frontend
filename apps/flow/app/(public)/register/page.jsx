import { Suspense } from "react";

import { RegistrationWizard } from "@/features/flowportal-registration/components/RegistrationWizard";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "ESFA employer registration",
  description:
    "Start or resume your Digital Apprenticeship Service employer registration.",
  path: "/register",
  noIndex: true,
});

export default function RegisterPage() {
  // useSearchParams (sector/region seed) needs a Suspense boundary.
  return (
    <Suspense fallback={null}>
      <RegistrationWizard />
    </Suspense>
  );
}

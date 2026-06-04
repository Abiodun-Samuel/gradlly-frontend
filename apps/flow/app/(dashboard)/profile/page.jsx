import { UserCog } from "lucide-react";

import { PageSubheader } from "@/components/ui/PageSubheader";
import { ProfileForm } from "@/features/profile/components/ProfileForm";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "My Profile",
  description: "View and update your personal profile and account details.",
  path: "/profile",
  noIndex: true,
});

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <PageSubheader
        icon={UserCog}
        eyebrow="Account"
        title="My Profile"
        description="Update your personal details, professional information, and preferences."
      />
      <div className="mx-auto max-w-3xl">
        <ProfileForm />
      </div>
    </div>
  );
}

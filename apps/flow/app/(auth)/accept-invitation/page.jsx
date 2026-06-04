import { AcceptInviteView } from "@/features/invitations/components/AcceptInviteView";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Accept Invitation",
  description: "Accept your invitation to join an organisation on Gradlly.",
  path: "/accept-invitation",
  noIndex: true,
});

export default function AcceptInvitationPage() {
  return (
    <div className="w-full max-w-md mx-auto px-4 py-10 sm:px-6 sm:py-14">
      <AcceptInviteView />
    </div>
  );
}

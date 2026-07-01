import { CalendarDays } from "lucide-react";

import { GoBackButton } from "@/components/ui/GoBackButton";
import { PageSubheader } from "@/components/ui/PageSubheader";
import { ReviewCalendar } from "@/features/reviews/components/ReviewCalendar";
import { createPageSeo } from "@/utils/metadata";

export const { metadata } = createPageSeo({
  title: "Reviews Calendar",
  description: "Month view of scheduled progress reviews.",
  path: "/reviews/calendar",
  noIndex: true,
});

export default function ReviewsCalendarPage() {
  return (
    <div className="space-y-6">
      <GoBackButton className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-800" />
      <PageSubheader
        icon={CalendarDays}
        eyebrow="Delivery"
        title="Reviews calendar"
        description="A month view of your scheduled progress reviews. Click a review to open it."
      />
      <ReviewCalendar />
    </div>
  );
}

import { createPageMetadata, createViewport } from "@gradlly/utils";

import "@/styles/globals.css";
import { AppProvider } from "@/providers";

export const metadata = createPageMetadata({
  description:
    "Gradlly employer portal for hiring, onboarding, and apprenticeship tracking.",
  portalName: "Employer Portal",
  baseUrl: process.env["NEXT_PUBLIC_APP_URL"] ?? "https://employer.gradlly.com",
});

export const viewport = createViewport({ themeColor: "#8b5cf6" });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}

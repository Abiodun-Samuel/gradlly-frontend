import { createPageMetadata, createViewport } from "@gradlly/utils";

import "@/styles/globals.css";
import { AppProvider } from "@/providers";

export const metadata = createPageMetadata({
  description:
    "Gradlly provider portal for managing courses, learners, and programme delivery.",
  portalName: "Provider Portal",
  baseUrl: process.env["NEXT_PUBLIC_APP_URL"] ?? "https://provider.gradlly.com",
});

export const viewport = createViewport({ themeColor: "#06b6d4" });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}

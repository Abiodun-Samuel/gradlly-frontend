import { createPageMetadata, createViewport } from "@gradlly/utils";

import "@/assets/css/globals.css";
import { AppProvider } from "@/providers";

export const metadata = createPageMetadata({
  description:
    "Gradlly main portal for cross-platform administration and oversight.",
  portalName: "Main Portal",
  baseUrl: process.env["NEXT_PUBLIC_APP_URL"] ?? "https://gradlly.com",
});

export const viewport = createViewport({ themeColor: "#1d4ed8" });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}

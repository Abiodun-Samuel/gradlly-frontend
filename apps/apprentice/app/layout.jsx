import { Inter } from "next/font/google";

import "@/assets/css/globals.css";
import { PORTAL } from "@/config/portal.config";
import { AppProvider } from "@/providers";
import { createPageSeo } from "@/utils/metadata";

export const { metadata, viewport } = createPageSeo();

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export default function RootLayout({ children }) {
  return (
    <html
      lang={PORTAL.locale.replace("_", "-")}
      data-scroll-behavior="smooth"
      className={`h-full antialiased ${inter.variable}`}
    >
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}

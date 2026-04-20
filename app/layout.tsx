import "./globals.css";
import { Providers } from "./providers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LinearThemeLab",
  description: "AI‑powered Shopify & WooCommerce theme generator",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0d0d0f] text-gray-200">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

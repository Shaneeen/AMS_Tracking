import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AMS Tracking",
  description: "Internal ATS and client tracking for Antares Management Services"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

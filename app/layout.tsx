import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PICK — Break the Autopilot",
  description: "Notice the urge. Choose the next move.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="relative min-h-screen bg-bg text-ink">
        <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.035] bg-grain" />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}

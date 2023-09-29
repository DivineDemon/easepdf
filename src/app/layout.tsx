import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EasePDF",
  description: "Chat with your Documents",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased grainy">
        {children}
      </body>
    </html>
  );
}

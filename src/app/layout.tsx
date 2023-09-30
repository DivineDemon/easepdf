import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import "react-loading-skeleton/dist/skeleton.css";

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
      <Providers>
        <body className="min-h-screen font-sans antialiased grainy">
          <Navbar />
          {children}
        </body>
      </Providers>
    </html>
  );
}

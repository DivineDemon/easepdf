import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import "simplebar-react/dist/simplebar.min.css";
import { constructMetadata } from "@/lib/utils";
import "react-loading-skeleton/dist/skeleton.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata = constructMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Providers>
        <body className="min-h-screen font-sans antialiased grainy">
          <Toaster />
          <Navbar />
          {children}
        </body>
      </Providers>
    </html>
  );
}

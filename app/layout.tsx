import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AmbientBackground from "@/components/AmbientBackground";

export const metadata: Metadata = {
  title: "Emilie — Paintings",
  description: "Original oil paintings and exhibitions by Emilie.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AmbientBackground />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Phoneme Activity Builder",
  description: "A phoneme-based classroom activity builder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <Navbar />

        <main>{children}</main>

        <Footer />
      </body>
    </html>
  );
}
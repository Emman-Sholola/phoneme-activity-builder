import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";

import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Phoneme Activity Builder",
  description: "A phoneme based classroom activity builder",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value || "dark";

  return (
    <html lang="en" data-theme={theme}>
      <body>
        <Header />
        <Navbar />

        <main>{children}</main>

        <Footer />
      </body>
    </html>
  );
}
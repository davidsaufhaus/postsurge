import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PostSurge",
  description: "Digitale Nachsorge nach der Operation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#f5f5f7] text-[#1d1d1f]">{children}</body>
    </html>
  );
}

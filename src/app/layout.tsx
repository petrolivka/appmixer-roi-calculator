import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Appmixer ROI Calculator",
  description:
    "Calculate your return on investment with Appmixer integration platform. Compare build vs. buy costs and see your potential savings.",
  keywords: ["ROI calculator", "iPaaS", "integration platform", "Appmixer", "build vs buy"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}

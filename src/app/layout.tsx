import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Appmixer ROI Calculator",
  description:
    "Calculate your return on investment with Appmixer integration platform. Compare build vs. buy costs and see your potential savings.",
  keywords: ["ROI calculator", "iPaaS", "integration platform", "Appmixer", "build vs buy"],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${montserrat.variable} font-sans antialiased`}>
        {children}
        <footer className="py-3 text-center text-xs text-muted-foreground/50">
          v{process.env.APP_VERSION}
        </footer>
      </body>
    </html>
  );
}

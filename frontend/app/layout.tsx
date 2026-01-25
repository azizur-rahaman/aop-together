import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: {
    default: "CG4Academy | Study Together in Real Time",
    template: "%s | CG4Academy"
  },
  description: "Connect with others in virtual study rooms. Learn, share, and collaborate in real time. Join CG4Academy for an interactive peer-to-peer learning experience.",
  keywords: ["study group", "study together", "virtual study room", "collaborate", "real-time learning", "CG4Academy", "peer learning", "student community"],
  authors: [{ name: "CG4Academy team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cg4academy.com",
    title: "CG4Academy | Study Together in Real Time",
    description: "Connect with others in virtual study rooms. Learn, share, and collaborate in real time.",
    siteName: "CG4Academy",
  },
  twitter: {
    card: "summary_large_image",
    title: "CG4Academy | Study Together in Real Time",
    description: "Connect with others in virtual study rooms. Learn, share, and collaborate in real time.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (

    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}

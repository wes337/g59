import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { TopBar } from "@/components/top-bar";
import { Footer } from "@/components/footer";
import "@/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "G59 Records",
  description: "G*59 RECORD$ // SUICIDEBOYS | CHETTA | GERM | NIGHT LOVELL.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TopBar />
        {children}
        <Footer />
      </body>
      <Script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/MotionPathPlugin.min.js" />
    </html>
  );
}

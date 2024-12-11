import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/layout/Navbar/page";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReduxProvider from "@/redux/reduxProvider";
import ReferralRedirect from "./ReferralRedirect/page";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "FASTPOX",
  description:
    "SULMINE is a mining platform built on PolluxChain, designed for seamless staking and earning rewards with Sulaana (SUL) tokens. Tap, stake, and mine to unlock your potential with next-gen blockchain technology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <link rel="icon" href="/Logo.svg" type="image/*" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
         <ToastContainer
            position="top-center"
            autoClose={3000}
            theme="dark"
            newestOnTop={true}
            pauseOnFocusLoss
            toastClassName="custom-toast"
          />
           <ReferralRedirect />
        <Navbar />
        {children}
        </ReduxProvider>
      </body>
    </html>
  );
}

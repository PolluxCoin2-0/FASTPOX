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
  title: "FastPOX - The Power of POX Mining and Rewards",
  description:
  "FastPOX is a dynamic mining and earning platform built on PolluxChain. By staking POX tokens, users unlock mining rewards, Earn up to 300% through mining income, tap into 10 levels of referral income, and accelerate your earnings by building your network. Join the future of decentralized mining today."
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

import type { Metadata } from "next";
import { AuthContextProvider } from "../app/authContext";
import { Roboto, Lora } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "@/components/Loading";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// const lora = Lora({
//   weight: ["400", "500", "600", "700"],
//   style: ["normal", "italic"],
//   subsets: ["latin"],
// });

const lora = Roboto({
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DTExchange",
  description: "This is a website for DTExchange",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${lora.className} bg-[#EFEFEF]`}>
        <AuthContextProvider>
          {/* <Header /> */}
          {children}
          <Footer />
          <ToastContainer />
          <Loading />
        </AuthContextProvider>
      </body>
    </html>
  );
}

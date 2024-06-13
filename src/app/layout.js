import { Inter, Montaga, Righteous } from "next/font/google";
import { Monoton } from "next/font/google";
import "./globals.css";
import SidePanel from "./_components/SidePanel";
// import AuthProvider from "@/providers/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const monton = Monoton({
  subsets: ["latin"],
  weight: '400',
  display: 'swap',
  variable: '--font-monton'

})

export const righteous = Righteous({
  subsets: ["latin"],
  weight: '400',
  display: 'swap',
  variable: '--font-righteous'

})


export const metadata = {
  title: "MPN MAKE",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${monton.variable} ${righteous.variable}`}>
        {/* <AuthProvider> */}

        {/* <SidePanel /> */}


        {children}
        {/* </AuthProvider> */}
      </body>
    </html>
  );
}

import { Inter, Montaga, Righteous } from "next/font/google";
import { Monoton, Open_Sans, Montserrat, Nunito } from "next/font/google";
import "./globals.css";
import SidePanel from "./_components/SidePanel";


const inter = Inter({ subsets: ["latin"] });

export const monton = Monoton({
  subsets: ["latin"],
  weight: '400',
  display: 'swap',
  variable: '--font-monton'

})

export const opensans = Nunito({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-opensans'

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
      <body className={` ${opensans.className}`}>

        {children}

      </body>
    </html>
  );
}

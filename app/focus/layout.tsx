import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/shared/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Inertia Focus",
  description: "Productivity App",
};

export default function FocusLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <body className={inter.className}>
        <Header btnText = 'Todo' showMenu={true}/>
        {children}
      </body>
    </html>
  );
}
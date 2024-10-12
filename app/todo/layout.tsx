
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/shared/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Inertia Todo",
  description: "Productivity App",
};

export default function TodoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header btnText = 'Focus' showMenu = {true}/>
        {children}
      </body>
    </html>
  );
}

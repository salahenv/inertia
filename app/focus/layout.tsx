import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Inertia Focus",
  description: "Productivity App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="font-bold text-2xl sticky top-0 bg-neutral-100 px-4 py-2 border-b border-solid border-gray-400 text-blue-600">Inertia</div>
        {children}
      </body>
    </html>
  );
}
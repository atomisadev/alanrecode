import Navbar from "@/components/dashboard/navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ALAN | Dashboard",
  description:
    "The first, and best way to convert any images into music, to experience music in a whole new way.",
};

export default function DashLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

import type { Metadata } from "next";
import Script from "next/script";
import { Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vyrtual — Virtual Office for Remote Freelancers",
  description:
    "Manage remote employees and freelancers, track working hours, and verify work activity from anywhere.",
  icons: {
    icon: "/vyrtual-icon.svg",
    shortcut: "/vyrtual-icon.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Script id="sidebar-collapse-init" strategy="beforeInteractive">
          {`if (localStorage.getItem("vyrtual-sidebar-collapsed") === "true") {
  document.documentElement.dataset.sidebarCollapsed = "true";
}`}
        </Script>
        {children}
      </body>
    </html>
  );
}

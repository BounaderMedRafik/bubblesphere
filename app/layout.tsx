import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import ClerkToSupa from "@/components/layout/ClerkToSupa";
import SignUpPage from "@/components/layout/SignupSigninPage";
import NavigationBar from "@/components/layout/NavigationBar";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BabbelCode",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head />
        <TooltipProvider delayDuration={1000}>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <SignedIn>
                <ClerkToSupa>
                  <div>
                    <div>
                      <NavigationBar />
                    </div>
                    <div className=" pt-24">{children}</div>

                    <Toaster />
                  </div>
                </ClerkToSupa>
              </SignedIn>
              <SignedOut>
                <SignUpPage />
              </SignedOut>
            </ThemeProvider>
          </body>
        </TooltipProvider>
      </html>
    </ClerkProvider>
  );
}

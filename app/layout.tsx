import type { Metadata } from "next";
import { ClerkProvider, SignedOut } from "@clerk/nextjs";
import { Instrument_Sans } from "next/font/google";

import "./globals.css";
import { IntegrationDotAppProvider } from "@/components/IntegrationAppProvider";
import jwt from "jsonwebtoken";
import { RedirectToSignIn } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Instrument_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sample Integration App",
  description: "Powered by Integration App",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser();

  const tokenData = {
    id: user?.id,
    name: user?.fullName,
    fields: {
      emails: user?.emailAddresses,
    },
  };

  const options = {
    issuer: process.env.WORKSPACE_KEY,
  };

  const token = jwt.sign(
    tokenData,
    process.env.WORKSPACE_SECRET as string,
    options
  );

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.className} antialiased`}>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
          <main>
            <IntegrationDotAppProvider token={token}>
              {children}
            </IntegrationDotAppProvider>
            <Toaster />
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}

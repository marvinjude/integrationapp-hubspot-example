"use client";
import { IntegrationAppProvider } from "@integration-app/react";

export function IntegrationDotAppProvider({
  children,
  token,
}: Readonly<{
  children: React.ReactNode;
  token: string;
}>) {
  return (
    <IntegrationAppProvider token={token}>{children}</IntegrationAppProvider>
  );
}

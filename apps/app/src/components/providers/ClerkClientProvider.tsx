"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";

interface ClerkClientProviderProps {
  children: ReactNode;
  publishableKey: string;
}

export function ClerkClientProvider({ children, publishableKey }: ClerkClientProviderProps) {
  // Only render on client side
  if (typeof window === "undefined") {
    return <>{children}</>;
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      {children}
    </ClerkProvider>
  );
}

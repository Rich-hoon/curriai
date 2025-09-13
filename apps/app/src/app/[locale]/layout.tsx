import { Loader } from "lucide-react";
import { Suspense } from "react";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getMessages, setRequestLocale } from "next-intl/server";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ClerkClientProvider } from "@/components/providers/ClerkClientProvider";
import { AuthGuard } from "@/components/clerk/AuthGuard";
import { UserProvider } from "@/components/providers/user";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "pk_test_Y2xlcmsuZGVtby5jb20k";

  return (
    <html lang={locale} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <Suspense fallback={<Skeleton />}>
              {/* Temporarily disable Clerk completely for deployment testing */}
              <div className="min-h-screen bg-background">
                {children}
              </div>
            </Suspense>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

function Skeleton() {
  return (
    <div className="flex justify-center items-center w-full h-screen">
      <Loader className="animate-spin size-10" />
    </div>
  );
}

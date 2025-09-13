import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./src/i18n/routing";

export default getRequestConfig(async ({ locale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = locale;
  const resolvedLocale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale: resolvedLocale as string,
    messages: (await import(`./messages/${resolvedLocale}.json`)).default,
  };
});

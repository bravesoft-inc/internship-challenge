import { getRequestConfig } from 'next-intl/server';
import type { RequestConfig } from 'next-intl/server';
import { locales, defaultLocale, type Locale } from './config';

export default getRequestConfig(async ({ locale }): Promise<RequestConfig> => {
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`@/locales/${locale}.json`)).default,
    timeZone: 'Asia/Tokyo',
    now: new Date(),
  };
});

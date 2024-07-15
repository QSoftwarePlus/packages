import "@repo/ui/globals.css";
import { cn } from "@repo/ui/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { i18n } from "../i18n.config";
import { Dicc, LanguageProvider, Locale, getDictionary } from "@repo/i18n";
import { Toaster } from "@repo/ui/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FeelGood",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    lang: Locale;
  };
}) {
  let dict: Dicc;

  try {
    dict = await getDictionary(params.lang);
  } catch (error) {
    return (
      <html lang={i18n.defaultLocale}>
        <body
          className={cn(
            inter.className,
            "text-foreground",
            // 'bg-primary',
            "bg-background",
            // "bg-gradient-to-r from-primary to-background",
          )}
        >
          {children}
          <Toaster />
        </body>
      </html>
    );
  }

  return (
    <html lang={i18n.defaultLocale}>
      <LanguageProvider
        ctx={{
          dictionary: dict,
          lang: params.lang,
        }}
      >
        <body
          className={cn(
            inter.className,
            "text-foreground",
            // 'bg-primary',
            "bg-background",
            // "bg-gradient-to-r from-primary to-background",
          )}
        >
          {children}
        </body>
      </LanguageProvider>
    </html>
  );
}

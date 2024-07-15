"use client";

import { usePathname, useRouter } from "next/navigation";
import { Locale, i18n, useLanguage } from "@repo/i18n";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/ui/select";

export const LanguageSwitcher = ({
  lang,
  setLang,
}: {
  lang: Locale;
  setLang: (lang: Locale) => void;
}) => {
  const { dictionary } = useLanguage();

  const [_, targetLanguage, ...path] = usePathname().split("/");

  const router = useRouter();

  return (
    <Select
      defaultValue={lang}
      onValueChange={(e) => router.replace(`/${e}/${path}`)}
    >
      <SelectTrigger className="w-auto">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        {i18n.locales.map((locale) => (
          <SelectItem key={locale} value={locale}>
            {dictionary.languages[locale]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

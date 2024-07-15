'use client'

import Image, { StaticImageData } from "next/image";
import { useLanguage } from "@repo/i18n";
import { cn } from "@ui/lib/utils";
import { LanguageSwitcher } from "./languageSwitcher";
import { CustomText } from "./customText";

export const CustomAuthLayout = ({
  children,
  cover,
}: {
  children: React.ReactNode;
  cover: {
    data: StaticImageData;
    alt: string;
  };
}) => {
  const { dictionary, lang, updateLang } = useLanguage();

  return (
    <div
      className={cn(
        "w-full h-full flex flex-col justify-center",
        "md:flex-row",
      )}
    >
      <div className="hidden md:flex flex-row justify-center md:w-3/5">
        <div>
          <Image
            src={cover.data}
            className="md:max-h-[1000px]"
            alt={cover.alt}
          />
        </div>
      </div>
      <div
        className={cn(
          "py-5",
          "flex flex-col justify-start items-center md:w-3/4",
          "bg-gradient-to-r from-background to-secondary",
          "w-full md:relative px-10 py-10",
        )}
      >
        <div className="w-full flex justify-end md:px-10">
          <LanguageSwitcher lang={lang} setLang={(lang) => updateLang(lang)} />
        </div>

        <div className="md:pt-40 py-10 md:w-auto">
          {children}
          <div className="flex flex-col justify-end items-center h-1/3 w-full">
            <CustomText className="py-6 text-gray-400">
              Powered by Quality Software +
            </CustomText>
          </div>
        </div>
      </div>
    </div>
  );
};

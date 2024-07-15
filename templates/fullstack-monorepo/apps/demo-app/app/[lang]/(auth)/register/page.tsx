import cover from "../../../../public/demo-app-login-cover.jpg";
import { Metadata } from "next";
import { LanguageProvider, Locale } from "@repo/i18n";
import { getDictionary } from "../../../../lib/dictonaries";
import { CustomAuthLayout } from "@ui/custom/AuthLayout";
import { RegisterUser } from "../../../../components/RegisterUser";

export const metadata: Metadata = {
  title: "FeelGood - Signup",
};

export default async function RegisterPage({
  params,
}: {
  params: {
    lang: Locale;
  };
}) {
  const dict = await getDictionary(params.lang);

  return (
    <LanguageProvider
      ctx={{
        dictionary: dict,
        lang: params.lang,
      }}
    >
      <CustomAuthLayout
        cover={{
          alt: "alt",
          data: cover,
        }}
      >
        <RegisterUser />
      </CustomAuthLayout>
    </LanguageProvider>
  );
}

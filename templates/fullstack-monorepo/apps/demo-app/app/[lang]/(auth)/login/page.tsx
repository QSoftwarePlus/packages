import cover from "../../../../public/demo-app-login-cover.jpg";
import { Metadata } from "next";
import { Locale } from "../../../../i18n.config";
import { LanguageProvider } from "@repo/i18n";
import { getDictionary } from "../../../../lib/dictonaries";
import { CustomLogin } from "@repo/ui/custom/Login";
import { CustomAuthLayout } from "@repo/ui/custom/AuthLayout";

export const metadata: Metadata = {
  title: "FeelGood - Login",
};

export default async function LoginPage({
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
        <CustomLogin />
      </CustomAuthLayout>
    </LanguageProvider>
  );
}

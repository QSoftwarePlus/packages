import { Locale } from "@repo/i18n";
import { Metadata } from "next";
import { getDictionary } from "../../../../lib/dictonaries";

export const metadata: Metadata = {
  title: "FeelGood - Login",
};

export default async function DashboardPage({
  params,
}: {
  params: {
    lang: Locale;
  };
}) {
  // const dict = await getDictionary(params.lang);

  return <div>{"this is the Dashboard page"}</div>;
}

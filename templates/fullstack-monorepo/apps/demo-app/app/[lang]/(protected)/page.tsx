import { Metadata } from "next";
import { Locale } from "../../../i18n.config";
import { getDictionary } from "../../../lib/dictonaries";

export const metadata: Metadata = {
  title: "FeelGood - Login",
};

export default async function LoginPage({
  params,
}:{
  params: {
    lang: Locale;
  }
}) {
  const dict = await getDictionary(params.lang);

  return <div>{"this is the private page"}</div>;
}

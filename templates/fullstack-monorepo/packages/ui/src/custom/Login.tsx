"use client";

import Link from "next/link";
import { Separator } from "../components/ui/separator";
import Image, { StaticImageData } from "next/image";
import { cn } from "@ui/lib/utils";
import { LoginWithIdpSchema, LoginWithUserAndPasswordSchema } from "@repo/bff";
import { GoogleBtn } from "./GoogleSignInBtn";
import { LoginForm } from "./LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card";
import { Button } from "@ui/components/ui/button";
import { CustomText } from "./customText";
import { useLanguage } from "@repo/i18n";
import { LanguageSwitcher } from "./languageSwitcher";

export const LoginWithIpd = () => {};

export const LoginWithUserAndPassword = () => {};

export const CustomLogin = ({
  className,
  onSubmitWithIdp,
  onSubmitWithUserAndPassword,
}: {
  className?: string;
  onSubmitWithIdp?: (body: LoginWithIdpSchema) => void;
  onSubmitWithUserAndPassword?: (body: LoginWithUserAndPasswordSchema) => void;
}) => {
  const { dictionary, lang } = useLanguage();

  return (
    <Card className="md:px-5 py-5 w-full">
      <CardHeader>
        <CardTitle>
          <div className="flex flex-row justify-between">
            <div>{dictionary.login.signIn}</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col w-full">
          <LoginForm formId="login-form" />
          <div className="py-4 w-auto">
            <Button className="w-full">
              <div>
                <CustomText>{dictionary.login.signIn}</CustomText>
              </div>
            </Button>
          </div>
          <Separator className="my-4" />
          <div className="flex flex-row py-2">
            <GoogleBtn
              label={dictionary.login.signInWithGoogle}
              onAccept={(token) => {}}
            />
          </div>
          <div className="pt-2 flex flex-col space-y-2">
            <p className="text-gray-400">{dictionary.login.forgotPassword}</p>
            <div className="text-gray-400 text-sm">
              <Link className="hover:text-blue-400" href={`/${lang}/register`}>
                You do not have an account? Sign up
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

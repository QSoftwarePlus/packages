"use client";

import { useLanguage } from "@repo/i18n";
import { Button } from "@ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card";
import { AuthInfoResponseBody, RegisterUserSchema, UserType } from "@repo/bff";
import { useCallback } from "react";
import { useToast } from "@ui/components/ui/use-toast";
import { CustomText } from "@repo/ui/custom/customText";
import { Separator } from "@repo/ui/components/ui/separator";
import { GoogleBtn } from "@repo/ui/custom/GoogleSignInBtn";
import { registerUser } from "../lib/registerUser";
import { RegisterUserForm } from "@repo/ui/custom/RegisterUserForm";
import { useRouter } from 'next/navigation'

export const CustomRegister = ({ userType }: { userType: UserType }) => {
  const { dictionary, lang } = useLanguage();

  const formId = "register-form";

  const { toast } = useToast();

  const router = useRouter()

  const onSubmit = useCallback((data: RegisterUserSchema) => {
    registerUser({
      body: data,
    })
      .then((res) => {
        toast({
          title: "usuario registrado correctamente",
          variant: "default",
        });

        router.replace('/dashboard')
      })
      .catch((err) => {
        toast({
          title: "dictionary.register.error",
          description: "err.message",
          variant: "destructive",
        });
      });
  }, []);

  return (
    <Card className="md:px-5 py-5">
      <CardHeader>
        <CardTitle>
          <div className="flex flex-row justify-between">
            <div>{dictionary.register.register}</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col w-full">
          <RegisterUserForm
            formId={formId}
            defaultValues={{
              user_type: userType,
            }}
            onSubmit={(data) => onSubmit(data)}
          />
          <div className="py-4 w-auto">
            <Button className="w-full" form={formId}>
              <div>
                <CustomText>{dictionary.register.register}</CustomText>
              </div>
            </Button>
          </div>
          <Separator className="my-4" />
          <div className="flex flex-row py-2">
            <GoogleBtn
              label={dictionary.login.signUpWithGoogle}
              onAccept={(token) => {}}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

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
import { CustomText } from "./customText";
import { Separator } from "@ui/components/ui/separator";
import { GoogleBtn } from "./GoogleSignInBtn";
import { RegisterUserForm } from "./RegisterUserForm";
import { AuthInfoResponseBody, RegisterUserSchema, UserType } from "@repo/bff";
import { useCallback } from "react";
import { useToast } from "@ui/components/ui/use-toast";

export const CustomRegisterUser = ({
  userType,
  on,
}: {
  userType: UserType;
  on: (data: RegisterUserSchema) => Promise<AuthInfoResponseBody>;
}) => {
  const { dictionary, lang } = useLanguage();

  const formId = "register-form";

  const { toast } = useToast();

  const onSubmit = useCallback((data: RegisterUserSchema) => {
    on(data)
      .then((res) => {
        toast({
          title: "dictionary.register.success",
          description: "res.message",
          variant: "default",
        });
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

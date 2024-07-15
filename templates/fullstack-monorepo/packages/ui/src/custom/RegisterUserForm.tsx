"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegisterUserSchema,
  registerUserSchema,
} from "@repo/bff/src/schemas/auth.schema";
import { useLanguage } from "@repo/i18n";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/ui/form";
import { Input } from "@ui/components/ui/input";
import { Separator } from "@ui/components/ui/separator";
import { useForm, SubmitHandler } from "react-hook-form";
import { PasswordInput } from "./PasswordInput";
import { useState } from "react";

export const RegisterUserForm = ({
  formId,
  defaultValues,
  onSubmit,
}: {
  formId: string;
  defaultValues: Partial<RegisterUserSchema>;
  onSubmit: (data: RegisterUserSchema) => void;
}) => {
  const { dictionary } = useLanguage();

  const form = useForm<RegisterUserSchema>({
    resolver: zodResolver(registerUserSchema),
    defaultValues,
  });

  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} id={formId}>
          <div className="flex flex-col space-y-4 w-full">
            <div className="flex flex-col md:flex-row w-full md:space-x-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">
                      {dictionary.login.email}
                    </FormLabel>
                    <FormControl>
                      <Input type="email" className="" {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="normal-case">
                      {dictionary.register.username}
                    </FormLabel>
                    <FormControl className="w-full">
                      <Input type="text" className="w-full" {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col md:flex-row md:space-x-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">
                      {dictionary.register.firstName}
                    </FormLabel>
                    <FormControl>
                      <Input type="text" className="" {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">
                      {dictionary.register.lastName}
                    </FormLabel>
                    <FormControl>
                      <Input type="text" className="" {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col md:flex-row md:space-x-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="capitalize">
                      {dictionary.login.password}
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        id="password_confirmation"
                        value={passwordConfirmation}
                        onChange={(e) => {
                          form.setValue("password", e.target.value);
                          return setPasswordConfirmation(e.target.value);
                        }}
                        autoComplete="new-password"
                      />
                      {/* <Input type="password" className="" {...field} /> */}
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

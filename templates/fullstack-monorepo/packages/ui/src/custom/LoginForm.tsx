"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoginWithUserAndPasswordSchema,
  loginWithUserAndPassword,
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
import { useForm, SubmitHandler } from "react-hook-form";

export const LoginForm = ({ formId }: { formId: string }) => {
  const { dictionary } = useLanguage();

  const form = useForm<LoginWithUserAndPasswordSchema>({
    resolver: zodResolver(loginWithUserAndPassword),
    defaultValues: {},
  });

  return (
    <div>
      <Form {...form}>
        <form id={formId}>
          <div className="flex flex-col space-y-4">
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    {dictionary.login.password}
                  </FormLabel>
                  <FormControl>
                    <Input type="password" className="" {...field} />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

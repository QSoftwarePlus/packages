"use client";

import { Router } from "next/router";
import { useEffect } from "react";
import { GoogleIcon } from "./GoogleIcon";
import { useGoogle } from "@ui/hooks/useGoogle";
import { Button } from "@ui/components/ui/button";
import { cn } from "@ui/lib/utils";
import { CustomText } from "./customText";
import { useLanguage } from "@repo/i18n";

export const GoogleBtn = (props: {
  isLoading?: boolean;
  onAccept: (access_token: string) => void;
  small?: boolean;
  label: string;
}) => {
  const { initGoogleClient, googleClient } = useGoogle(props.onAccept);

  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = (e) => initGoogleClient();

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [Router]);

  return (
    <Button
      disabled={props.isLoading}
      variant={"default"}
      className="w-full h-1/2"
      onClick={() => (!!googleClient ? googleClient.requestAccessToken() : {})}
    >
      <div className={cn("flex flex-row md:space-x-4 space-x-2")}>
        <GoogleIcon className="md:min-w-8 min-w-7" />
        <div className="flex items-center">
          <CustomText className="">{props.label}</CustomText>
        </div>
      </div>
    </Button>
  );
};

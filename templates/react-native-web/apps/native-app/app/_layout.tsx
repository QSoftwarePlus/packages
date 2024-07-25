import "../globals.css";
import { Stack } from "expo-router";
import React from "react";
import { AuthProvider } from "@/ui";
import { Text } from "react-native";
import { I18nProvider } from "../context/i18nContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <I18nProvider>
      <AuthProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          {children}
        </Stack>
      </AuthProvider>
    </I18nProvider>
  );
}

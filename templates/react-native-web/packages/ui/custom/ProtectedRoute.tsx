import React from "react";
import { Redirect } from "expo-router";
import { useAuth } from "ui/context/authContext";
import { Text } from "react-native";

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Text>...loading</Text>;
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

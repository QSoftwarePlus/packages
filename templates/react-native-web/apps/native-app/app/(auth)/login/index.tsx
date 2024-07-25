import { Text } from "react-native";
import { CustomActivityIndicator, View } from "@/ui";
import i18n from "../../../i18n";
import { fetchUser } from "../../../lib/fetchUser";

export default function LoginPage() {
  const { error, loading, response } = fetchUser({ body: null, jwt: "" });

  console.log("response", response);
  console.log("error", error);
  console.log("loading", loading);

  return (
    <View className="flex-1 justify-center items-center bg-secondary">
      {loading && <CustomActivityIndicator />}
      {!loading && error && <Text>Error: {error.message}</Text>}
      {!loading && response && (
        <>
          <Text>Welcome to the login page!</Text>
          <Text>{i18n.t("welcome")}</Text>
          <Text>{"response from API:"}</Text>
          <Text>{response.id}</Text>
          <Text>{response.type}</Text>
        </>
      )}
    </View>
  );
}

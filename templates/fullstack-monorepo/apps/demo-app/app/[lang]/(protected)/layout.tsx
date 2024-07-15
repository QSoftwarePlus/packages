import { AuthInfoResponseBody } from "@repo/bff";
import { cookies } from "next/dist/client/components/headers";
import { redirect } from "next/navigation";
import { fetchUser } from "../../../lib/fetchUser";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user: AuthInfoResponseBody;

  try {
    user = await fetchUser(cookies().toString());
  } catch (err) {
    console.log("ERR", err);
    console.log("cookies: ", cookies().toString());
    redirect("/login");
  }

  return <div>{children}</div>;
}

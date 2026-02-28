import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PrivateLayoutClient } from "@/components/private-layout-client";
import { auth } from "@/lib/auth";

export default async function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/signin");
  }

  return <PrivateLayoutClient>{children}</PrivateLayoutClient>;
}

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { QueryProvider } from "@/components/providers/query-provider";
import { auth } from "@/lib/auth";

export default async function PdfLayout({
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

  return <QueryProvider>{children}</QueryProvider>;
}

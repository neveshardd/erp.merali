import { PrivateLayoutClient } from "@/components/private-layout-client";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PrivateLayoutClient>{children}</PrivateLayoutClient>;
}

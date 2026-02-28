"use client";

import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

// Forced SSR bypass for React-PDF to avoid Vercel 50MB limits
const ClientPage = dynamic(() => import("./client-page"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center min-h-screen text-neutral-400 gap-4">
      <Loader2 className="w-8 h-8 animate-spin" />
      <p className="font-bold uppercase tracking-widest text-[10px]">
        Carregando Módulo...
      </p>
    </div>
  ),
});

export default function Page(props: any) {
  return <ClientPage {...props} />;
}

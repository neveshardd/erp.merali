"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signIn.email({
      email,
      password,
      callbackURL: callbackUrl,
    });

    if (error) {
      setError("Email ou senha inválidos. Tente novamente.");
      setLoading(false);
      return;
    }

    router.push(callbackUrl);
  }

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <Card className="overflow-hidden p-0 shadow-2xl border-none rounded-3xl">
        <CardContent className="grid p-0 md:grid-cols-2 min-h-[650px]">
          {/* ── Coluna do formulário ── */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-12 p-10 md:p-16 pt-16"
          >
            {/* Logo e Cabeçalho VIP */}
            <div className="flex flex-col gap-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-neutral-900 dark:bg-white rounded-2xl flex items-center justify-center shadow-2xl">
                  <img
                    src="/logo.png"
                    alt="Merali"
                    className="w-8 h-auto dark:invert"
                  />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-3xl font-black tracking-tighter uppercase text-neutral-900 dark:text-white leading-none">
                    Merali
                  </h1>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">
                    Studio
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <h2 className="text-xl font-bold tracking-tight text-neutral-800 dark:text-neutral-200">
                  Bem-vindo ao Intelligence
                </h2>
                <p className="text-neutral-500 text-xs mt-1 font-medium italic">
                  Insira suas credenciais para acessar o painel de controle.
                </p>
              </div>
            </div>

            {/* Campos com Estilo Refinado */}
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label
                  htmlFor="email"
                  className="text-[10px] font-black uppercase tracking-widest text-neutral-400"
                >
                  Email Corporativo
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu-email@merali.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="h-12 bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-xl focus:ring-blue-600/20"
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-[10px] font-black uppercase tracking-widest text-neutral-400"
                  >
                    Senha de Acesso
                  </Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="h-12 bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-xl focus:ring-blue-600/20"
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 flex items-center gap-2">
                  <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse" />
                  <p className="text-[10px] font-bold text-red-600 uppercase tracking-tight">
                    {error}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-14 bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white font-black uppercase tracking-widest text-[11px] rounded-xl shadow-xl shadow-black/10 active:scale-95 transition-all mt-4"
                disabled={loading}
              >
                {loading ? "Autenticando..." : "Entrar no Gestor"}
              </Button>
            </div>
          </form>

          {/* ── Coluna da imagem ── */}
          <div className="relative hidden md:block">
            <img
              src="/scene.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </CardContent>
      </Card>

      {/* Rodapé com termos */}
      <p className="text-center text-[10px] font-bold uppercase tracking-widest text-neutral-400">
        Ao clicar em &quot;Entrar&quot;, você concorda com os{" "}
        <a href="#" className="underline hover:text-blue-600 transition-colors">
          Termos de Uso
        </a>{" "}
        e{" "}
        <a href="#" className="underline hover:text-blue-600 transition-colors">
          Política de Privacidade
        </a>
        .
      </p>
    </div>
  );
}

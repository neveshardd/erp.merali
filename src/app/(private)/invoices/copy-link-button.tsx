"use client";

import axios from "axios";
import {
  Check,
  CreditCard,
  Landmark,
  Link2,
  Loader2,
  QrCode,
  Receipt,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type PaymentMethod = "pix" | "card_installments" | "card" | "boleto";

interface CopyLinkButtonProps {
  invoiceId: string;
}

const METHODS: {
  key: PaymentMethod;
  label: string;
  sub: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}[] = [
    {
      key: "pix",
      label: "PIX",
      sub: "Pagamento instantâneo",
      icon: QrCode,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      key: "card_installments",
      label: "Cartão Parcelado",
      sub: "Até 12x via Mercado Pago",
      icon: CreditCard,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      key: "card",
      label: "Cartão à Vista",
      sub: "Crédito / Débito via Stripe",
      icon: Landmark,
      color: "text-violet-600",
      bg: "bg-violet-50 dark:bg-violet-900/20",
    },
    {
      key: "boleto",
      label: "Boleto",
      sub: "Vence em 3 dias úteis",
      icon: Receipt,
      color: "text-orange-600",
      bg: "bg-orange-50 dark:bg-orange-900/20",
    },
  ];

export function CopyLinkButton({ invoiceId }: CopyLinkButtonProps) {
  const [loading, setLoading] = React.useState<PaymentMethod | null>(null);
  const [copied, setCopied] = React.useState<PaymentMethod | null>(null);
  const [open, setOpen] = React.useState(false);

  const handleCopy = async (method: PaymentMethod) => {
    setLoading(method);
    try {
      const { data } = await axios.post(`/api/invoices/${invoiceId}/checkout`, {
        method,
      });
      if (data.url) {
        await navigator.clipboard.writeText(data.url);
        setCopied(method);
        toast.success(
          `Link de ${METHODS.find((m) => m.key === method)?.label} copiado!`,
        );
        setTimeout(() => setCopied(null), 2500);
      }
    } catch {
      toast.error("Erro ao gerar link de pagamento!");
    } finally {
      setLoading(null);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 text-neutral-400 hover:text-violet-600 cursor-pointer"
          title="Copiar Links de Pagamento"
        >
          <Link2 className="w-3.5 h-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        side="left"
        className="w-72 p-2 rounded-2xl border-neutral-200 dark:border-neutral-800 shadow-xl bg-white dark:bg-neutral-950"
      >
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400 px-2 py-1.5">
          Copiar Link por Tipo
        </p>
        <div className="flex flex-col gap-1">
          {METHODS.map((m) => {
            const Icon = m.icon;
            const isLoading = loading === m.key;
            const isCopied = copied === m.key;
            return (
              <button
                key={m.key}
                onClick={() => handleCopy(m.key)}
                disabled={!!loading}
                className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all text-left cursor-pointer disabled:opacity-50"
              >
                <div
                  className={`w-8 h-8 rounded-lg ${m.bg} flex items-center justify-center ${m.color} shrink-0`}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isCopied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-black uppercase tracking-tight text-neutral-900 dark:text-white leading-none">
                    {m.label}
                  </span>
                  <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider mt-0.5">
                    {m.sub}
                  </span>
                </div>
                <span
                  className={`ml-auto text-[9px] font-black uppercase tracking-wider shrink-0 transition-all ${isCopied ? "text-emerald-500" : "text-neutral-300 group-hover:text-neutral-500"}`}
                >
                  {isCopied ? "Copiado!" : "Copiar"}
                </span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

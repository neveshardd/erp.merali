"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import {
    Loader2,
    CheckCircle2,
    CreditCard,
    QrCode,
    Landmark,
    Receipt,
    ArrowRight,
    ShieldCheck
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function PublicPaymentPage() {
    const params = useParams();
    const id = params.id as string;

    const [invoice, setInvoice] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

    useEffect(() => {
        async function fetchInvoice() {
            try {
                const response = await axios.get(`/api/invoices/${id}`);
                setInvoice(response.data);
            } catch (err) {
                setError("Fatura não encontrada ou expirada.");
            } finally {
                setLoading(false);
            }
        }
        if (id) fetchInvoice();
    }, [id]);

    const handlePay = async (method: string) => {
        setCheckoutLoading(method);
        try {
            const { data } = await axios.post(`/api/invoices/${id}/checkout`, {
                method,
            });
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (err) {
            alert("Erro ao gerar pagamento. Tente novamente.");
        } finally {
            setCheckoutLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
        );
    }

    if (error || !invoice) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-white text-2xl font-black uppercase tracking-tighter mb-4">Ops!</h1>
                <p className="text-neutral-500 font-bold uppercase text-xs tracking-widest">{error || "Link inválido"}</p>
            </div>
        );
    }

    const isPaid = invoice.status === "PAID";

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
            {/* Header / Logo */}
            <header className="p-8 md:p-12 max-w-4xl mx-auto flex justify-between items-center">
                <img src="/logo.png" alt="Merali Studio" className="w-10 h-10 object-contain invert" />
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    Ambiente Seguro
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-8 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                    {/* Left Side: Invoice Details */}
                    <div className="space-y-12">
                        <div>
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
                                {isPaid ? "Pago" : "Fatura"}
                            </h1>
                            <p className="mt-4 text-neutral-500 font-bold uppercase text-[10px] tracking-[0.3em]">
                                Merali Studio &copy; 2026
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="group border-l-2 border-neutral-800 pl-6 py-2 transition-colors hover:border-white">
                                <span className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Projeto</span>
                                <span className="text-xl font-bold uppercase tracking-tight line-clamp-2">
                                    {invoice.budget?.projectName || "Trabalho Sob Demanda"}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <span className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Valor Total</span>
                                    <span className="text-2xl font-black tracking-tight">{formatCurrency(invoice.amount)}</span>
                                </div>
                                <div>
                                    <span className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Vencimento</span>
                                    <span className="text-2xl font-black tracking-tight">
                                        {format(new Date(invoice.dueDate), "dd/MM", { locale: ptBR })}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-neutral-900">
                                <span className="block text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Cliente</span>
                                <span className="text-sm font-bold uppercase">{invoice.client?.name}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Payment Methods */}
                    <div className="flex flex-col justify-center">
                        {isPaid ? (
                            <div className="p-12 bg-neutral-900 border border-neutral-800 rounded-3xl text-center space-y-6">
                                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20">
                                    <CheckCircle2 className="w-8 h-8 text-black" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black uppercase tracking-tight">Pagamento Confirmado</h3>
                                    <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mt-2">Obrigado pela confiança no Merali Studio.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-6 flex items-center gap-3">
                                    Selecione o Método <ArrowRight className="w-3 h-3" />
                                </p>

                                <PaymentButton
                                    icon={QrCode}
                                    label="PIX Instantâneo"
                                    sub="Confirmação Imediata"
                                    loading={checkoutLoading === "pix"}
                                    onClick={() => handlePay("pix")}
                                />
                                <PaymentButton
                                    icon={CreditCard}
                                    label="Cartão Parcelado"
                                    sub="Até 12x via Mercado Pago"
                                    loading={checkoutLoading === "card_installments"}
                                    onClick={() => handlePay("card_installments")}
                                />
                                <PaymentButton
                                    icon={Landmark}
                                    label="Cartão à Vista"
                                    sub="Crédito / Débito via Stripe"
                                    loading={checkoutLoading === "card"}
                                    onClick={() => handlePay("card")}
                                />
                                <PaymentButton
                                    icon={Receipt}
                                    label="Boleto Bancário"
                                    sub="Compensação em 1-3 dias"
                                    loading={checkoutLoading === "boleto"}
                                    onClick={() => handlePay("boleto")}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Footer / Info */}
            <footer className="fixed bottom-0 left-0 right-0 p-8 text-center pointer-events-none opacity-20">
                <p className="text-[9px] font-black uppercase tracking-[0.5em]">Merali Studio &bull; Design System &bull; Brasília</p>
            </footer>
        </div>
    );
}

function PaymentButton({ icon: Icon, label, sub, onClick, loading }: any) {
    return (
        <button
            onClick={onClick}
            disabled={loading}
            className="w-full flex items-center justify-between p-6 bg-neutral-900 border border-neutral-800 hover:bg-white hover:text-black transition-all rounded-2xl group cursor-pointer active:scale-[0.98]"
        >
            <div className="flex items-center gap-6">
                <div className="w-10 h-10 border border-neutral-800 rounded-xl flex items-center justify-center group-hover:border-neutral-200">
                    <Icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                    <span className="block text-sm font-black uppercase tracking-tight">{label}</span>
                    <span className="block text-[9px] font-bold uppercase tracking-widest opacity-40 group-hover:opacity-60">{sub}</span>
                </div>
            </div>
            {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <ArrowRight className="w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            )}
        </button>
    );
}

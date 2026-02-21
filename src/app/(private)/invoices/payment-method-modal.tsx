"use client"

import * as React from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CreditCard, Landmark, QrCode, Receipt, Loader2, CreditCardIcon } from "lucide-react"

interface PaymentMethodModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSelect: (gateway: 'stripe' | 'mercadopago') => void
    isLoading?: boolean
}

export function PaymentMethodModal({ open, onOpenChange, onSelect, isLoading }: PaymentMethodModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl bg-white dark:bg-neutral-950">
                <DialogHeader className="p-8 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                    <DialogTitle className="text-xl font-black uppercase tracking-tighter">Escolha como pagar</DialogTitle>
                    <DialogDescription className="text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-widest text-[10px] mt-1">
                        Selecione a plataforma de acordo com o método desejado
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 flex flex-col gap-4">
                    {/* Option Stripe */}
                    <button 
                        disabled={isLoading}
                        onClick={() => onSelect('stripe')}
                        className="group relative flex items-center gap-4 p-5 rounded-2xl border-2 border-neutral-100 dark:border-neutral-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-500/5 transition-all text-left cursor-pointer disabled:opacity-50"
                    >
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 group-hover:scale-110 transition-transform">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-black uppercase text-neutral-900 dark:text-white">Stripe</span>
                            <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Cartão à vista • Boleto • Débito</span>
                        </div>
                    </button>

                    {/* Option Mercado Pago */}
                    <button 
                        disabled={isLoading}
                        onClick={() => onSelect('mercadopago')}
                        className="group relative flex items-center gap-4 p-5 rounded-2xl border-2 border-neutral-100 dark:border-neutral-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-500/5 transition-all text-left cursor-pointer disabled:opacity-50"
                    >
                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:scale-110 transition-transform">
                            <QrCode className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-black uppercase text-neutral-900 dark:text-white">Mercado Pago</span>
                            <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">PIX • Cartão Parcelado (até 12x)</span>
                        </div>
                    </button>
                    
                    {isLoading && (
                        <div className="flex items-center justify-center py-2">
                            <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
                        </div>
                    )}
                </div>
                
                <div className="p-4 bg-neutral-50 dark:bg-neutral-900 text-center border-t border-neutral-100 dark:border-neutral-800">
                    <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Pagamento Seguro & Criptografado</p>
                </div>
            </DialogContent>
        </Dialog>
    )
}

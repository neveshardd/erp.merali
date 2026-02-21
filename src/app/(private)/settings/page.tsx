"use client"

import * as React from "react"
import { Save, Building2, CreditCard, Globe, Mail, Phone, Send, MessageSquare, ShieldCheck, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

export default function SettingsPage() {
    return (
        <main className="flex flex-col gap-8 p-8 max-w-6xl mx-auto pb-24">
            <div>
                <h1 className="text-3xl font-black tracking-tighter text-neutral-900 dark:text-neutral-100 uppercase">Configurações da Merali</h1>
                <p className="text-neutral-500 text-sm font-bold uppercase tracking-widest mt-1">Gerencie a identidade, pagamentos e integrações do seu estúdio</p>
            </div>

            {/* GERAL */}
            <section className="space-y-6">
                <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                    <h2 className="text-sm font-black uppercase tracking-tight text-neutral-900 dark:text-neutral-100">Geral</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Nome da Empresa</Label>
                        <Input defaultValue="STUDIO MERALI" className="h-10 bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-lg text-sm" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Logo URL (Ícone lateral)</Label>
                        <Input defaultValue="/logo.png" className="h-10 bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-lg text-sm" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Email de Contato</Label>
                        <Input defaultValue="studio@merali.com.br" className="h-10 bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-lg text-sm" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Telefone/WhatsApp</Label>
                        <Input defaultValue="(61) 9 9998-6567" className="h-10 bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-lg text-sm" />
                    </div>
                    <div className="space-y-2 md:col-span-1">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Website</Label>
                        <Input defaultValue="www.merali.com.br" className="h-10 bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-lg text-sm" />
                    </div>
                </div>
            </section>

            {/* DADOS DE PAGAMENTO */}
            <section className="space-y-6 pt-4">
                <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                    <h2 className="text-sm font-black uppercase tracking-tight text-neutral-900 dark:text-neutral-100">Dados de Pagamento</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Nome do Banco</Label>
                        <Input defaultValue="077 INTER" className="h-10 bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-lg text-sm" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Agência</Label>
                        <Input defaultValue="0001" className="h-10 bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-lg text-sm" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Número da Conta</Label>
                        <Input defaultValue="24914956-7" className="h-10 bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-lg text-sm" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Chave PIX</Label>
                        <Input defaultValue="studio@merali.com.br" className="h-10 bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-lg text-sm" />
                    </div>
                </div>
            </section>

            {/* PAGAMENTOS ONLINE */}
            <section className="space-y-6 pt-4">
                <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                    <h2 className="text-sm font-black uppercase tracking-tight text-neutral-900 dark:text-neutral-100">Pagamentos Online (Mercado Pago PIX)</h2>
                </div>
                <div className="flex items-center gap-3 py-2 px-1">
                    <Checkbox id="mp-active" defaultChecked className="w-4 h-4 border-neutral-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" />
                    <Label htmlFor="mp-active" className="text-[11px] font-bold cursor-pointer text-neutral-600">Ativar Pagamentos via Mercado Pago (PIX)</Label>
                </div>
                <div className="flex gap-4 items-end">
                    <div className="flex-1 space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Mercado Pago Access Token (APP_USR-...)</Label>
                        <Input type="password" defaultValue="****************************************************************" className="h-10 bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-lg text-sm" />
                    </div>
                    <Button variant="outline" className="h-10 gap-2 border-neutral-200 dark:border-neutral-800 text-[9px] font-black uppercase tracking-widest hover:bg-neutral-50 shadow-none px-4">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Testar Conexão
                    </Button>
                </div>
            </section>

            {/* ENVIO DE EMAIL */}
            <section className="space-y-6 pt-4">
                <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                    <h2 className="text-sm font-black uppercase tracking-tight text-neutral-900 dark:text-neutral-100">Envio de Email (Resend)</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Resend API Key (re_...)</Label>
                        <Input defaultValue="re_..." className="h-10 bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-lg text-sm" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Email Remetente (Merali Studio &lt;...&gt;)</Label>
                        <Input defaultValue="Merali Studio <onboarding@resend.dev>" className="h-10 bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-lg text-sm" />
                    </div>
                </div>
            </section>

            {/* NOTIFICAÇÕES TELEGRAM */}
            <section className="space-y-6 pt-4">
                <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                    <h2 className="text-sm font-black uppercase tracking-tight text-neutral-900 dark:text-neutral-100">Notificações Telegram (Grátis)</h2>
                </div>
                <div className="flex items-center gap-3 py-2 px-1">
                    <Checkbox id="tg-active" className="w-4 h-4 border-neutral-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" />
                    <Label htmlFor="tg-active" className="text-[11px] font-bold cursor-pointer text-neutral-600">Ativar Notificações via Telegram</Label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Telegram Bot Token</Label>
                        <Input placeholder="123456:ABC-DEF..." className="h-10 bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-lg text-sm" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Telegram Chat ID</Label>
                        <Input placeholder="987654321" className="h-10 bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-lg text-sm" />
                    </div>
                </div>
            </section>

             {/* NOTIFICAÇÕES DISCORD */}
             <section className="space-y-6 pt-4">
                <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                    <h2 className="text-sm font-black uppercase tracking-tight text-neutral-900 dark:text-neutral-100">Notificações Discord (Grátis)</h2>
                </div>
                <div className="flex items-center gap-3 py-2 px-1">
                    <Checkbox id="dc-active" className="w-4 h-4 border-neutral-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" />
                    <Label htmlFor="dc-active" className="text-[11px] font-bold cursor-pointer text-neutral-600">Ativar Notificações via Discord</Label>
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Webhook URL</Label>
                    <Input placeholder="https://discord.com/api/webhooks/..." className="h-10 bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-lg text-sm" />
                </div>
            </section>

            {/* JURÍDICO */}
            <section className="space-y-6 pt-4">
                <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                    <h2 className="text-sm font-black uppercase tracking-tight text-neutral-900 dark:text-neutral-100">Jurídico</h2>
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Termos e Condições (Rodapé)</Label>
                    <Textarea 
                        defaultValue="Pagamento devido em até 7 dias após a emissão. Valores em atraso poderão sofrer multa de 2% e juros de 1% ao mês. Este orçamento é válido por 7 dias."
                        className="min-h-[100px] bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-lg p-4 text-xs font-medium leading-relaxed"
                    />
                </div>
            </section>

            <div className="flex justify-end pt-8 mt-4">
                <Button className="h-12 px-10 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[10px] rounded-lg shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                    Salvar Alterações
                </Button>
            </div>
        </main>
    )
}

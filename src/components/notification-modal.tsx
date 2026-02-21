"use client"

import * as React from "react"
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle 
} from "@/components/ui/dialog"
import { Bell, Clock, CheckCircle2, AlertCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface NotificationModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const NOTIFICATIONS = [
    {
        id: "1",
        title: "Orçamento Aprovado",
        description: "O cliente JOSE EUGENIO aprovou o orçamento Loft Industrial.",
        time: "Há 10 min",
        type: "success",
        icon: CheckCircle2,
        read: false
    },
    {
        id: "2",
        title: "Fatura Pendente",
        description: "A fatura FAT-2024-001 vence em 2 dias.",
        time: "Há 2 horas",
        type: "warning",
        icon: AlertCircle,
        read: false
    },
    {
        id: "3",
        title: "Novo Briefing Recebido",
        description: "Um novo briefing para o projeto Casa Alpha foi enviado.",
        time: "Há 5 horas",
        type: "info",
        icon: Info,
        read: true
    }
]

export function NotificationModal({ open, onOpenChange }: NotificationModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl sm:fixed sm:top-16 sm:right-6 sm:left-auto sm:translate-x-0 sm:translate-y-0">
                <DialogHeader className="p-6 bg-neutral-900 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                                <Bell className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-black uppercase tracking-tighter">Central de Alertas</DialogTitle>
                                <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-0.5">Merali Studio Intelligence</p>
                            </div>
                        </div>
                        <Badge className="bg-blue-600 hover:bg-blue-600 text-white border-none font-black text-[9px] px-2 py-0.5 rounded-full">
                            2 NOVAS
                        </Badge>
                    </div>
                </DialogHeader>

                <ScrollArea className="max-h-[450px] bg-white dark:bg-neutral-950">
                    <div className="flex flex-col">
                        {NOTIFICATIONS.map((notif) => (
                            <button 
                                key={notif.id}
                                className={cn(
                                    "p-5 flex gap-4 text-left border-b border-neutral-50 dark:border-neutral-900/50 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 transition-all group relative",
                                    !notif.read && "bg-blue-50/30 dark:bg-blue-900/5"
                                )}
                            >
                                {!notif.read && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />
                                )}
                                <div className={cn(
                                    "w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                                    notif.type === 'success' && "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20",
                                    notif.type === 'warning' && "bg-orange-50 text-orange-600 dark:bg-orange-900/20",
                                    notif.type === 'info' && "bg-blue-50 text-blue-600 dark:bg-blue-900/20"
                                )}>
                                    <notif.icon className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h4 className="text-xs font-black uppercase tracking-tight text-neutral-900 dark:text-neutral-100">{notif.title}</h4>
                                    <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 leading-tight">{notif.description}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <Clock className="w-3 h-3 text-neutral-300" />
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-300">{notif.time}</span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </ScrollArea>

                <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-100 dark:border-neutral-800 flex justify-center">
                    <button className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                        Marcar todas como lidas
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

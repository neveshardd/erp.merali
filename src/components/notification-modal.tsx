"use client"

import * as React from "react"
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle 
} from "@/components/ui/dialog"
import { Bell, Clock, CheckCircle2, AlertCircle, Info, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNotifications } from "@/hooks/use-notifications"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"

interface NotificationModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function NotificationModal({ open, onOpenChange }: NotificationModalProps) {
    const { notifications, unreadCount, markAsRead, markAllAsRead, isLoading } = useNotifications()

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return CheckCircle2
            case 'warning': return AlertCircle
            case 'error': return AlertCircle
            case 'info': return Info
            default: return Bell
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl sm:fixed sm:top-16 sm:right-6 sm:left-auto sm:translate-x-0 sm:translate-y-0 bg-white dark:bg-neutral-950">
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
                        {unreadCount > 0 && (
                            <Badge className="bg-blue-600 hover:bg-blue-600 text-white border-none font-black text-[9px] px-2 py-0.5 rounded-full">
                                {unreadCount} NOVAS
                            </Badge>
                        )}
                    </div>
                </DialogHeader>

                <ScrollArea className="max-h-[450px]">
                    <div className="flex flex-col">
                        {isLoading && (
                            <div className="p-10 text-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 animate-pulse">Carregando Inteligência...</span>
                            </div>
                        )}
                        
                        {!isLoading && notifications.length === 0 && (
                            <div className="p-20 text-center flex flex-col items-center gap-3 opacity-30">
                                <CheckCircle2 className="w-8 h-8" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Nada pendente no momento</span>
                            </div>
                        )}

                        {!isLoading && notifications.map((notif) => {
                            const Icon = getIcon(notif.type)
                            return (
                                <div 
                                    key={notif.id}
                                    className={cn(
                                        "p-5 flex gap-4 text-left border-b border-neutral-50 dark:border-neutral-900/50 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 transition-all group relative",
                                        !notif.read && "bg-blue-50/30 dark:bg-blue-900/5"
                                    )}
                                    onClick={() => markAsRead.mutate(notif.id)}
                                >
                                    {!notif.read && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />
                                    )}
                                    <div className={cn(
                                        "w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                                        notif.type === 'success' && "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20",
                                        notif.type === 'warning' && "bg-orange-50 text-orange-600 dark:bg-orange-900/20",
                                        notif.type === 'error' && "bg-rose-50 text-rose-600 dark:bg-rose-900/20",
                                        notif.type === 'info' && "bg-blue-50 text-blue-600 dark:bg-blue-900/20"
                                    )}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col gap-1 flex-1">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-black uppercase tracking-tight text-neutral-900 dark:text-neutral-100">{notif.title}</h4>
                                            {notif.link && (
                                                <Link 
                                                    href={notif.link}
                                                    onClick={() => onOpenChange(false)}
                                                    className="w-5 h-5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 flex items-center justify-center transition-colors"
                                                >
                                                    <ExternalLink className="w-3 h-3 text-neutral-400" />
                                                </Link>
                                            )}
                                        </div>
                                        <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 leading-tight">{notif.description}</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <Clock className="w-3 h-3 text-neutral-300" />
                                            <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-300">
                                                {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: ptBR })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </ScrollArea>

                <div className="p-4 bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-100 dark:border-neutral-800 flex justify-center">
                    <button 
                        onClick={() => markAllAsRead.mutate()}
                        disabled={unreadCount === 0 || markAllAsRead.isPending}
                        className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors disabled:opacity-30"
                    >
                        {markAllAsRead.isPending ? 'Processando...' : 'Marcar todas como lidas'}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

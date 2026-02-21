"use client"

import * as React from "react"
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { 
    FileText, 
    Camera, 
    Layers, 
    MessageSquare, 
    Calendar,
    User,
    Download,
    ExternalLink,
    CheckCircle2,
    Clock
} from "lucide-react"

interface BriefingDetailsModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    briefing: any // In a real app, use a proper type
}

export function BriefingDetailsModal({ open, onOpenChange, briefing }: BriefingDetailsModalProps) {
    if (!briefing) return null

    const isTechnical = briefing.type === "TECHNICAL"

    const details = briefing.content || {}
    
    const displayDetails = isTechnical ? {
        originalFormat: details.originalFormat || "SketchUp / FBX",
        downloadLink: details.downloadLink || "#",
        atmosphere: details.atmosphere || "Conforme Briefing",
        moodNotes: details.moodNotes || "Sem observações adicionais.",
        materials: details.materials || "Padrão do projeto.",
    } : {
        email: briefing.email || "Não informado",
        whatsapp: details.phone || "Não informado",
        message: details.message || "Pedido de contato via landing page.",
        source: details.source || "Landing Page"
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
                <DialogHeader className={`p-8 ${isTechnical ? 'bg-blue-600' : 'bg-purple-600'} text-white`}>
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                {isTechnical ? <FileText className="w-6 h-6" /> : <User className="w-6 h-6" />}
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-black uppercase tracking-tighter">
                                    {isTechnical ? briefing.projectName : briefing.clientName}
                                </DialogTitle>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge className="bg-white/20 text-white border-transparent text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
                                        {isTechnical ? "Técnico" : "Geral (Lead)"}
                                    </Badge>
                                    <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> {new Date(briefing.createdAt).toLocaleDateString("pt-BR")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                            {isTechnical && (
                                <div className="px-3 py-1 bg-white/10 rounded-full border border-white/20 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white">Pronto para Produção</span>
                                </div>
                            )}
                        </div>
                    </div>
                </DialogHeader>

                <div className="p-8 max-h-[70vh] overflow-y-auto bg-white dark:bg-neutral-950 flex flex-col gap-10">
                    {isTechnical ? (
                        <>
                            {/* Technical Sections */}
                            <section className="flex flex-col gap-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 flex items-center gap-2">
                                    <Layers className="w-3 h-3" /> Arquivos Originais
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl flex flex-col gap-1">
                                        <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Software</span>
                                        <span className="text-xs font-black uppercase">{displayDetails.originalFormat}</span>
                                    </div>
                                    <Button 
                                        variant="outline" 
                                        className="h-full rounded-2xl border-dashed border-neutral-200 hover:border-blue-500 hover:text-blue-600 transition-all flex flex-col items-center justify-center gap-1 group py-4"
                                        onClick={() => window.open(displayDetails.downloadLink, "_blank")}
                                    >
                                        <Download className="w-4 h-4" />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Baixar Modelo</span>
                                    </Button>
                                </div>
                            </section>

                            <section className="flex flex-col gap-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 flex items-center gap-2">
                                    <Camera className="w-3 h-3" /> Atmosfera & Mood
                                </h3>
                                <div className="p-6 bg-neutral-900 text-white rounded-3xl flex flex-col gap-4 relative overflow-hidden">
                                     <div className="absolute top-0 right-0 p-8 opacity-5">
                                        <Camera className="w-32 h-32" />
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full w-fit">
                                        <Clock className="w-3 h-3 text-blue-400" />
                                        <span className="text-[9px] font-black uppercase tracking-widest">{displayDetails.atmosphere}</span>
                                    </div>
                                    <p className="text-xs font-medium leading-relaxed text-blue-100 uppercase italic opacity-80 border-l-2 border-blue-500 pl-4">
                                        "{displayDetails.moodNotes}"
                                    </p>
                                </div>
                            </section>

                            <section className="flex flex-col gap-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 flex items-center gap-2">
                                    <MessageSquare className="w-3 h-3" /> Materiais & Observações
                                </h3>
                                <div className="p-6 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl">
                                    <p className="text-xs font-bold text-neutral-600 uppercase leading-relaxed tracking-wide">
                                        {displayDetails.materials}
                                    </p>
                                </div>
                            </section>
                        </>
                    ) : (
                        <>
                            {/* General/Lead Sections */}
                            <section className="flex flex-col gap-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl flex flex-col gap-1">
                                        <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Email</span>
                                        <span className="text-xs font-black lowercase text-purple-600">{displayDetails.email}</span>
                                    </div>
                                    <div className="p-5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl flex flex-col gap-1">
                                        <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">WhatsApp</span>
                                        <span className="text-xs font-black uppercase tabular-nums">{displayDetails.whatsapp}</span>
                                    </div>
                                </div>
                                
                                <Card className="border-none bg-purple-50 dark:bg-purple-900/10 rounded-3xl p-8">
                                    <div className="flex flex-col gap-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-purple-600">Mensagem do Lead</h4>
                                        <p className="text-sm font-bold text-purple-900 dark:text-purple-200 uppercase leading-relaxed tracking-tight">
                                            {displayDetails.message}
                                        </p>
                                    </div>
                                </Card>

                                <div className="flex items-center gap-2 text-neutral-400 px-2">
                                    <ExternalLink className="w-3 h-3" />
                                    <span className="text-[8px] font-black uppercase tracking-widest">Origem: {displayDetails.source}</span>
                                </div>
                            </section>

                        </>
                    )}
                </div>

                <DialogFooter className="p-6 bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-100 dark:border-neutral-800 flex sm:justify-between items-center gap-4">
                    <Button 
                        variant="ghost" 
                        onClick={() => onOpenChange(false)}
                        className="font-bold uppercase tracking-widest text-[10px] text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                    >
                        Fechar Visualização
                    </Button>
                    <div className="flex gap-2">
                        {isTechnical ? (
                             <Button className="gap-2 bg-neutral-900 text-white font-black uppercase tracking-widest text-[10px] h-12 px-8 rounded-xl transition-all active:scale-95 cursor-pointer shadow-xl">
                                <CheckCircle2 className="w-4 h-4" /> Iniciar Produção
                            </Button>
                        ) : (
                            <Button className="gap-2 bg-purple-600 text-white font-black uppercase tracking-widest text-[10px] h-12 px-8 rounded-xl transition-all active:scale-95 cursor-pointer shadow-xl">
                                Responder via WhatsApp
                            </Button>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

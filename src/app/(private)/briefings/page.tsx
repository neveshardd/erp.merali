"use client"

import * as React from "react"
import { 
    Search, 
    Plus, 
    Copy, 
    Trash2, 
    Eye, 
    FileText, 
    User, 
    Calendar,
    CheckCircle2,
    Link as LinkIcon,
    ExternalLink,
    MoreHorizontal,
    Filter
} from "lucide-react"
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BriefingModal } from "./briefing-modal"
import { BriefingDetailsModal } from "./briefing-details-modal"
import { useBriefings, useDeleteBriefing } from "@/hooks/use-briefings"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "sonner"
import { ConfirmModal } from "@/components/confirm-modal"

export default function BriefingsPage() {
    const [searchQuery, setSearchQuery] = React.useState("")
    const [isModalOpen, setIsModalOpen] = React.useState(false)
    const [isDetailsOpen, setIsDetailsOpen] = React.useState(false)
    const [selectedBriefing, setSelectedBriefing] = React.useState<any>(null)
    const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false)
    const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(null)

    const { data: briefings = [], isLoading } = useBriefings()
    const deleteBriefing = useDeleteBriefing()

    const technicalBriefings = briefings.filter((b: any) => b.type === "TECHNICAL")
    const generalBriefings = briefings.filter((b: any) => b.type === "GENERAL")

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success("Link copiado para a área de transferência!")
    }

    const handleDelete = (id: string) => {
        setPendingDeleteId(id)
        setConfirmDeleteOpen(true)
    }

    const executeDelete = async () => {
        if (!pendingDeleteId) return
        try {
            await deleteBriefing.mutateAsync(pendingDeleteId)
            toast.success("Briefing excluído com sucesso!")
            setConfirmDeleteOpen(false)
        } catch (error) {
            toast.error("Erro ao excluir briefing")
        }
    }


    return (
        <main className="flex flex-col gap-8 p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-neutral-900 dark:text-neutral-100 uppercase">Gerenciamento de Briefings</h1>
                    <p className="text-neutral-500 text-sm font-bold uppercase tracking-widest mt-1">Acompanhe leads e especificações técnicas</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2 font-bold uppercase tracking-widest text-[10px] h-10 rounded-xl border-neutral-200 dark:border-neutral-800 cursor-pointer shadow-none">
                         <LinkIcon className="w-3.5 h-3.5" /> Link Landing Page
                    </Button>
                    <Button 
                        onClick={() => setIsModalOpen(true)}
                        className="gap-2 bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl transition-all active:scale-95 cursor-pointer shadow-none"
                    >
                        <Plus className="w-4 h-4" /> Novo Briefing
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="technical" className="w-full">
                <TabsList className="bg-neutral-100 dark:bg-neutral-900 p-1 rounded-xl h-12 w-full md:w-auto mb-6">
                    <TabsTrigger value="technical" className="rounded-lg font-bold uppercase tracking-widest text-[10px] data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-sm px-6">Briefings Técnicos</TabsTrigger>
                    <TabsTrigger value="general" className="rounded-lg font-bold uppercase tracking-widest text-[10px] data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 data-[state=active]:shadow-sm px-6">Briefings Gerais (Leads)</TabsTrigger>
                </TabsList>

                {/* Filters and Search */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <Input 
                            placeholder="Pesquisar por cliente, projeto ou email..." 
                            className="h-12 pl-12 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 rounded-xl shadow-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="h-12 gap-2 font-bold uppercase tracking-widest text-[10px] rounded-xl border-neutral-200 shadow-none px-6">
                        <Filter className="w-4 h-4" /> Filtros
                    </Button>
                </div>

                <TabsContent value="technical">
                    <Card className="border-neutral-200 dark:border-neutral-800 shadow-none rounded-2xl overflow-hidden">
                        <Table>
                            <TableHeader className="bg-neutral-50 dark:bg-neutral-900/50">
                                <TableRow>
                                    <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14">Projeto</TableHead>
                                    <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14">Cliente</TableHead>
                                    <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14">Data de Envio</TableHead>
                                    <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14">Status</TableHead>
                                    <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14 text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {technicalBriefings.map((b: any) => (
                                    <TableRow key={b.id} className="group hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                                        <TableCell className="font-black text-xs uppercase text-neutral-900 dark:text-white py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded flex items-center justify-center text-blue-600">
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                {b.projectName}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs font-bold text-neutral-500 uppercase">{b.clientName}</TableCell>
                                        <TableCell className="text-xs font-bold text-neutral-500 uppercase">{format(new Date(b.createdAt), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                                        <TableCell>
                                            <Badge variant={b.status === "Respondido" ? "default" : "secondary"} className={`text-[9px] font-black uppercase tracking-widest rounded-full px-3 py-1 ${b.status === "Respondido" ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20" : "bg-neutral-100 text-neutral-500"}`}>
                                                {b.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="w-8 h-8 text-neutral-400 hover:text-neutral-900 cursor-pointer"
                                                    onClick={() => copyToClipboard(`https://merali.com/briefing/${b.id}`)}
                                                >
                                                    <Copy className="w-3.5 h-3.5" />
                                                </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="w-8 h-8 text-neutral-400 hover:text-neutral-900 cursor-pointer"
                                                        onClick={() => {
                                                            setSelectedBriefing(b);
                                                            setIsDetailsOpen(true);
                                                        }}
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                    </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="w-8 h-8 text-neutral-400 hover:text-red-600 cursor-pointer"
                                                    onClick={() => handleDelete(b.id)}
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                <TabsContent value="general">
                    <Card className="border-neutral-200 dark:border-neutral-800 shadow-none rounded-2xl overflow-hidden">
                        <Table>
                            <TableHeader className="bg-neutral-50 dark:bg-neutral-900/50">
                                <TableRow>
                                    <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14">Nome do Lead</TableHead>
                                    <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14">Email</TableHead>
                                    <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14">Data de Contato</TableHead>
                                    <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14">Status</TableHead>
                                    <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14 text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {generalBriefings.map((b: any) => (
                                    <TableRow key={b.id} className="group hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                                        <TableCell className="font-black text-xs uppercase text-neutral-900 dark:text-white py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-purple-50 dark:bg-purple-900/20 rounded flex items-center justify-center text-purple-600">
                                                    <User className="w-4 h-4" />
                                                </div>
                                                {b.clientName}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs font-bold text-neutral-500 lowercase">{b.email}</TableCell>
                                        <TableCell className="text-xs font-bold text-neutral-500 uppercase">{format(new Date(b.createdAt), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                                        <TableCell>
                                            <Badge className={`text-[9px] font-black uppercase tracking-widest rounded-full px-3 py-1 ${b.status === "Novo" ? "bg-blue-500/10 text-blue-600" : "bg-emerald-500/10 text-emerald-600"}`}>
                                                {b.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="w-8 h-8 text-neutral-400 hover:text-neutral-900 cursor-pointer"
                                                    onClick={() => {
                                                        setSelectedBriefing(b);
                                                        setIsDetailsOpen(true);
                                                    }}
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="w-8 h-8 text-neutral-400 hover:text-red-600 cursor-pointer"
                                                    onClick={() => handleDelete(b.id)}
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>
            </Tabs>

            <BriefingModal open={isModalOpen} onOpenChange={setIsModalOpen} />
            <BriefingDetailsModal 
                open={isDetailsOpen} 
                onOpenChange={setIsDetailsOpen} 
                briefing={selectedBriefing} 
            />

            <ConfirmModal 
                open={confirmDeleteOpen}
                onOpenChange={setConfirmDeleteOpen}
                onConfirm={executeDelete}
                title="Excluir Briefing?"
                description="Esta ação removerá permanentemente o briefing e todos os dados associados."
            />
        </main>
    )
}

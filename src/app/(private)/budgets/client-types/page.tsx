"use client"

import * as React from "react"
import { 
    Plus, 
    Trash2, 
    Pencil, 
    Users, 
    TrendingUp,
    Search,
    UserCircle,
    Building2,
    ShieldCheck,
    Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ClientTypeModal } from "./client-type-modal"
import { useClientTypes, useDeleteClientType } from "@/hooks/use-settings"
import { toast } from "sonner"
import { ConfirmModal } from "@/components/confirm-modal"

export default function ClientTypesPage() {
    const [searchQuery, setSearchQuery] = React.useState("")
    const [isModalOpen, setIsModalOpen] = React.useState(false)
    const [selectedType, setSelectedType] = React.useState<any>(null)
    const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false)
    const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(null)

    const { data: clientTypes = [], isLoading } = useClientTypes()
    const deleteMutation = useDeleteClientType()

    const filteredTypes = clientTypes.filter((type: any) =>
        type.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleEdit = (type: any) => {
        setSelectedType(type)
        setIsModalOpen(true)
    }

    const handleDelete = (id: string) => {
        setPendingDeleteId(id)
        setConfirmDeleteOpen(true)
    }

    const executeDelete = async () => {
        if (!pendingDeleteId) return
        try {
            await deleteMutation.mutateAsync(pendingDeleteId)
            toast.success("Tipo de cliente excluído com sucesso!")
            setConfirmDeleteOpen(false)
        } catch (error) {
            toast.error("Erro ao excluir tipo de cliente.")
        }
    }

    const getIcon = (index: number) => {
        const icons = [UserCircle, Building2, Users, ShieldCheck]
        return icons[index % icons.length]
    }

    const getColors = (index: number) => {
        const colors = [
            { color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/10" },
            { color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/10" },
            { color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/10" },
            { color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/10" },
        ]
        return colors[index % colors.length]
    }

    return (
        <main className="flex flex-col gap-8 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-neutral-900 dark:text-neutral-100 uppercase">Tipos de Clientes</h1>
                    <p className="text-neutral-500 text-sm font-bold uppercase tracking-widest mt-1">Definição de perfis e multiplicadores de preço</p>
                </div>
                <Button 
                    onClick={() => {
                        setSelectedType(null)
                        setIsModalOpen(true)
                    }}
                    className="gap-2 bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl transition-all active:scale-95 cursor-pointer shadow-none"
                >
                    <Plus className="w-4 h-4" /> Novo Tipo
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {isLoading ? (
                    <div className="col-span-4 flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-neutral-300" />
                    </div>
                ) : (
                    filteredTypes.slice(0, 4).map((type: any, i: number) => {
                        const style = getColors(i)
                        const Icon = getIcon(i)
                        return (
                            <Card key={type.id} className="border-none bg-white dark:bg-neutral-900 shadow-sm rounded-3xl overflow-hidden hover:scale-[1.02] transition-all">
                                <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                                    <div className={`w-16 h-16 rounded-2xl ${style.bg} ${style.color} flex items-center justify-center`}>
                                        <Icon className="w-8 h-8" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-sm font-black uppercase tracking-tight text-neutral-900 dark:text-white">{type.name}</span>
                                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-relaxed">
                                            MÉTRICA: {Number(type.multiplier).toFixed(2)}x
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })
                )}
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input 
                    placeholder="BUSCAR TIPO DE CLIENTE..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-11 h-12 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 rounded-xl text-[10px] font-black uppercase tracking-widest"
                />
            </div>

            <Card className="border-neutral-200 dark:border-neutral-800 shadow-none rounded-2xl overflow-hidden">
                <Table>
                    <TableHeader className="bg-neutral-50 dark:bg-neutral-900/50">
                        <TableRow>
                            <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14 w-[300px]">Tipo de Cliente</TableHead>
                            <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14">Descrição Operacional</TableHead>
                            <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14 text-center">Multiplicador</TableHead>
                            <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14 text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTypes.map((type: any) => (
                            <TableRow key={type.id} className="group hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                                <TableCell className="py-4">
                                    <span className="text-xs font-black uppercase text-neutral-900 dark:text-white">{type.name}</span>
                                </TableCell>
                                <TableCell className="text-xs font-bold text-neutral-500 uppercase leading-relaxed max-w-[400px]">
                                    {type.description || "Sem descrição"}
                                </TableCell>
                                <TableCell className="text-center font-black tabular-nums text-emerald-500">
                                    {Number(type.multiplier).toFixed(2)}x
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-1">
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="w-8 h-8 text-neutral-400 hover:text-neutral-900 cursor-pointer"
                                            onClick={() => handleEdit(type)}
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="w-8 h-8 text-neutral-400 hover:text-red-600 cursor-pointer"
                                            onClick={() => handleDelete(type.id)}
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

            <ClientTypeModal 
                open={isModalOpen} 
                onOpenChange={(open) => {
                    setIsModalOpen(open)
                    if (!open) setSelectedType(null)
                }} 
                type={selectedType}
            />

            <ConfirmModal 
                open={confirmDeleteOpen}
                onOpenChange={setConfirmDeleteOpen}
                onConfirm={executeDelete}
                title="Excluir Tipo de Cliente?"
                description="Esta ação removerá este perfil de cliente e poderá afetar o cálculo de multiplicadores em novos orçamentos."
            />
        </main>
    )
}

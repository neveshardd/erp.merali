"use client"

import * as React from "react"
import { 
    Plus, 
    Trash2, 
    Pencil, 
    Camera, 
    Monitor, 
    Layout,
    Video,
    Box,
    Layers,
    Search,
    Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ImageTypeModal } from "./image-type-modal"
import { useImageTypes, useDeleteImageType } from "@/hooks/use-settings"
import { toast } from "sonner"
import { ConfirmModal } from "@/components/confirm-modal"

export default function ImageTypesPage() {
    const [searchQuery, setSearchQuery] = React.useState("")
    const [isModalOpen, setIsModalOpen] = React.useState(false)
    const [selectedType, setSelectedType] = React.useState<any>(null)
    const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false)
    const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(null)

    const { data: imageTypes = [], isLoading } = useImageTypes()
    const deleteMutation = useDeleteImageType()

    const filteredTypes = imageTypes.filter((type: any) =>
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
            toast.success("Tipo de imagem excluído com sucesso!")
            setConfirmDeleteOpen(false)
        } catch (error) {
            toast.error("Erro ao excluir tipo de imagem.")
        }
    }

    const getIcon = (iconName: string) => {
        const icons: Record<string, any> = { Box, Monitor, Layout, Camera, Video }
        const Icon = icons[iconName] || Box
        return Icon
    }

    const getColors = (index: number) => {
        const colors = [
            { color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/10" },
            { color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/10" },
            { color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/10" },
            { color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/10" },
            { color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/10" },
        ]
        return colors[index % colors.length]
    }

    return (
        <main className="flex flex-col gap-8 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-neutral-900 dark:text-neutral-100 uppercase">Tipos de Imagens</h1>
                    <p className="text-neutral-500 text-sm font-bold uppercase tracking-widest mt-1">Estimativas de tempo base por categoria de render</p>
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

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {isLoading ? (
                    <div className="col-span-5 flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-neutral-300" />
                    </div>
                ) : (
                    filteredTypes.slice(0, 5).map((type: any, i: number) => {
                        const style = getColors(i)
                        const Icon = getIcon(type.icon)
                        return (
                            <Card key={type.id} className="border-none bg-white dark:bg-neutral-900 shadow-sm rounded-2xl overflow-hidden text-center hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all cursor-default">
                                <CardContent className="p-6 flex flex-col items-center gap-3">
                                    <div className={`w-12 h-12 rounded-xl ${style.bg} ${style.color} flex items-center justify-center`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[11px] font-black uppercase text-neutral-900 dark:text-white leading-tight">{type.name}</span>
                                        <span className="text-[10px] font-bold text-neutral-400 tabular-nums uppercase">{type.baseHours}H BASE</span>
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
                    placeholder="BUSCAR TIPO DE IMAGEM..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-11 h-12 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 rounded-xl text-[10px] font-black uppercase tracking-widest"
                />
            </div>

            <Card className="border-neutral-200 dark:border-neutral-800 shadow-none rounded-2xl overflow-hidden">
                <Table>
                    <TableHeader className="bg-neutral-50 dark:bg-neutral-900/50">
                        <TableRow>
                            <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14">Categoria da Imagem</TableHead>
                            <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14 text-center">Horas Base de Produção</TableHead>
                            <TableHead className="font-bold uppercase tracking-widest text-[10px] h-14 text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTypes.map((type: any, i: number) => {
                            const style = getColors(i)
                            const Icon = getIcon(type.icon)
                            return (
                                <TableRow key={type.id} className="group hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg ${style.bg} ${style.color} flex items-center justify-center`}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <span className="text-xs font-black uppercase text-neutral-900 dark:text-white">{type.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center font-black tabular-nums text-neutral-600 dark:text-neutral-300">
                                        {type.baseHours} horas
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
                            )
                        })}
                    </TableBody>
                </Table>
            </Card>

            <ImageTypeModal 
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
                title="Excluir Tipo de Imagem?"
                description="Esta ação removerá esta categoria de imagem da sua base de produção."
            />
        </main>
    )
}

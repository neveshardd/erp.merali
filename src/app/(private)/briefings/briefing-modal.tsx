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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { FileText, UserPlus, Link2, Send } from "lucide-react"
import { useBudgets } from "@/hooks/use-budgets"
import { useCreateBriefing } from "@/hooks/use-briefings"
import { toast } from "sonner"

interface BriefingModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function BriefingModal({ open, onOpenChange }: BriefingModalProps) {
    const [type, setType] = React.useState<"technical" | "general">("technical")
    const { data: budgets = [] } = useBudgets()
    const createBriefing = useCreateBriefing()

    // Form states
    const [selectedBudgetId, setSelectedBudgetId] = React.useState("")
    const [clientName, setClientName] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [phone, setPhone] = React.useState("")
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const handleCreate = async () => {
        setIsSubmitting(true)
        try {
            if (type === "technical") {
                const selectedBudget = budgets.find((b: any) => b.id === selectedBudgetId)
                if (!selectedBudget) {
                    toast.error("Selecione um projeto")
                    return
                }
                
                await createBriefing.mutateAsync({
                    type: "TECHNICAL",
                    projectName: selectedBudget.projectName,
                    clientName: selectedBudget.client?.name || "Cliente",
                    status: "Pendente",
                    content: { budgetId: selectedBudgetId }
                })
            } else {
                if (!clientName) {
                    toast.error("Informe o nome do lead")
                    return
                }
                await createBriefing.mutateAsync({
                    type: "GENERAL",
                    clientName: clientName,
                    email: email,
                    status: "Novo",
                    content: { phone: phone }
                })
            }
            
            toast.success("Briefing criado com sucesso!")
            onOpenChange(false)
            // Reset form
            setSelectedBudgetId("")
            setClientName("")
            setEmail("")
            setPhone("")
        } catch (error) {
            toast.error("Erro ao criar briefing")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
                <DialogHeader className="p-8 bg-neutral-900 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                            {type === "technical" ? <FileText className="w-5 h-5 text-blue-400" /> : <UserPlus className="w-5 h-5 text-purple-400" />}
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-black uppercase tracking-tighter">Novo Briefing</DialogTitle>
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Gerar link de coleta de dados</p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="p-8 flex flex-col gap-8 bg-white dark:bg-neutral-950">
                    <Tabs defaultValue="technical" onValueChange={(v) => setType(v as any)}>
                        <TabsList className="grid w-full grid-cols-2 h-12 bg-neutral-100 dark:bg-neutral-900 p-1 rounded-xl mb-6">
                            <TabsTrigger value="technical" className="rounded-lg font-bold uppercase tracking-widest text-[10px] data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 shadow-none">Técnico (Projeto)</TabsTrigger>
                            <TabsTrigger value="general" className="rounded-lg font-bold uppercase tracking-widest text-[10px] data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-800 shadow-none">Geral (Lead)</TabsTrigger>
                        </TabsList>

                        <TabsContent value="technical" className="flex flex-col gap-6 m-0">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Selecionar Projeto / Orçamento</Label>
                                <Select onValueChange={setSelectedBudgetId} value={selectedBudgetId}>
                                    <SelectTrigger className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800">
                                        <SelectValue placeholder="Busque por projeto ou ID" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {budgets.map((budget: any) => (
                                            <SelectItem key={budget.id} value={budget.id}>
                                                {budget.projectName} ({budget.client?.name})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
                                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wide leading-relaxed">
                                    Ao gerar um briefing técnico, um link exclusivo será criado e vinculado automaticamente ao cronograma de produção deste projeto.
                                </p>
                            </div>
                        </TabsContent>

                        <TabsContent value="general" className="flex flex-col gap-6 m-0">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Nome do Lead</Label>
                                    <Input 
                                        placeholder="Ex: Roberto Carlos" 
                                        className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800"
                                        value={clientName}
                                        onChange={(e) => setClientName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">WhatsApp</Label>
                                    <Input 
                                        placeholder="(11) 99999-9999" 
                                        className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">E-mail para Contato</Label>
                                <Input 
                                    placeholder="roberto@empresa.com" 
                                    className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                <DialogFooter className="p-6 bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row gap-3">
                    <Button 
                        variant="ghost" 
                        onClick={() => onOpenChange(false)}
                        className="font-bold uppercase tracking-widest text-[10px] text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                    >
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleCreate}
                        disabled={isSubmitting}
                        className={`flex-1 gap-2 font-black uppercase tracking-widest text-[10px] h-12 rounded-xl transition-all active:scale-95 cursor-pointer shadow-none ${
                            type === "technical" 
                            ? "bg-blue-600 hover:bg-blue-700 text-white" 
                            : "bg-purple-600 hover:bg-purple-700 text-white"
                        }`}
                    >
                        {isSubmitting ? "Criando..." : (
                            type === "technical" ? <><Link2 className="w-4 h-4" /> Gerar Link Técnico</> : <><Send className="w-4 h-4" /> Criar Lead & Link</>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


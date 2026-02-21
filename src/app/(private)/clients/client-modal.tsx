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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, Save, Mail, Phone, Building2 } from "lucide-react"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { clientSchema, type ClientInput } from "@/schemas/client"
import { useCreateClient } from "@/hooks/use-clients"

interface ClientModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ClientModal({ open, onOpenChange }: ClientModalProps) {
    const { mutate: createClient, isPending } = useCreateClient()
    
    const { 
        register, 
        handleSubmit, 
        reset,
        formState: { errors } 
    } = useForm<ClientInput>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            name: "",
            company: "",
            taxId: "",
            email: "",
            phone: "",
        }
    })

    const onSubmit = (data: ClientInput) => {
        createClient(data, {
            onSuccess: () => {
                onOpenChange(false)
                reset()
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={(val) => {
            if (!val) reset()
            onOpenChange(val)
        }}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
                <DialogHeader className="p-8 bg-blue-600 text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                            <UserPlus className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-black uppercase tracking-tighter">Cadastrar Novo Cliente</DialogTitle>
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Adicionar novo contato à base</p>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="p-8 flex flex-col gap-6 bg-white dark:bg-neutral-950">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Nome Completo</Label>
                                <Input 
                                    {...register("name")}
                                    placeholder="Ex: João Silva" 
                                    className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800" 
                                />
                                {errors.name && <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest">{errors.name.message}</p>}
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Empresa / Escritório</Label>
                                <Input 
                                    {...register("company")}
                                    placeholder="Ex: ArqDesign Studio" 
                                    className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800" 
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">CPF / CNPJ</Label>
                                <Input 
                                    {...register("taxId")}
                                    placeholder="000.000.000-00" 
                                    className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 tabular-nums" 
                                />
                            </div>
                             <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">WhatsApp / Celular</Label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                    <Input 
                                        {...register("phone")}
                                        placeholder="(11) 99999-9999" 
                                        className="h-12 pl-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800" 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">E-mail para Contato</Label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                <Input 
                                    {...register("email")}
                                    placeholder="cliente@email.com" 
                                    className="h-12 pl-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800" 
                                />
                            </div>
                            {errors.email && <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest">{errors.email.message}</p>}
                        </div>
                    </div>

                    <DialogFooter className="p-6 bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-100 dark:border-neutral-800 flex gap-3">
                        <Button 
                            type="button"
                            variant="ghost" 
                            onClick={() => onOpenChange(false)}
                            className="font-bold uppercase tracking-widest text-[10px] text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                        >
                            Cancelar
                        </Button>
                        <Button 
                            type="submit"
                            disabled={isPending}
                            className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[10px] h-12 rounded-xl transition-all active:scale-95 cursor-pointer shadow-xl shadow-blue-500/10"
                        >
                            <Save className="w-4 h-4" /> {isPending ? "Salvando..." : "Finalizar Cadastro"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

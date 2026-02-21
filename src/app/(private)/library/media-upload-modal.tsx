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
import { UploadCloud, X, FileText, Image as ImageIcon, Film, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

import { useCreateMedia } from "@/hooks/use-media"
import { toast } from "sonner"

interface MediaUploadModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function MediaUploadModal({ open, onOpenChange }: MediaUploadModalProps) {
    const createMedia = useCreateMedia()
    const [dragActive, setDragActive] = React.useState(false)
    const [files, setFiles] = React.useState<File[]>([])
    const [isUploading, setIsUploading] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement>(null)

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFiles(Array.from(e.dataTransfer.files))
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (e.target.files && e.target.files[0]) {
            setFiles(Array.from(e.target.files))
        }
    }

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
    }

    const handleUpload = async () => {
        if (files.length === 0) return
        
        setIsUploading(true)
        try {
            for (const file of files) {
                // 1. Get presigned URL
                const response = await fetch("/api/media/upload", {
                    method: "POST",
                    body: JSON.stringify({
                        filename: file.name,
                        contentType: file.type,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                })

                if (!response.ok) {
                    throw new Error("Falha ao obter URL de upload")
                }

                const { url: uploadUrl, publicUrl } = await response.json()

                // 2. Upload to R2
                const uploadResponse = await fetch(uploadUrl, {
                    method: "PUT",
                    body: file,
                    headers: {
                        "Content-Type": file.type,
                    },
                })

                if (!uploadResponse.ok) {
                    throw new Error(`Falha ao subir arquivo ${file.name}`)
                }

                // 3. Save metadata to database
                const type = file.type.startsWith("video") ? "VIDEO" : "IMAGE"
                await createMedia.mutateAsync({
                    type,
                    name: file.name,
                    url: publicUrl,
                    size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
                })
            }

            toast.success(`${files.length} arquivo(s) salvos com sucesso!`)
            onOpenChange(false)
            setFiles([])
        } catch (error: any) {
            console.error("Upload error:", error)
            toast.error(error.message || "Erro ao salvar arquivos na biblioteca")
        } finally {
            setIsUploading(false)
        }
    }


    const getFileIcon = (file: File) => {
        if (file.type.startsWith('image/')) return <ImageIcon className="w-5 h-5 text-blue-500" />
        if (file.type.startsWith('video/')) return <Film className="w-5 h-5 text-purple-500" />
        return <FileText className="w-5 h-5 text-neutral-500" />
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent 
                showCloseButton={false}
                className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl"
            >
                <DialogHeader className="p-8 bg-neutral-900 text-white relative">
                    <button 
                        onClick={() => onOpenChange(false)}
                        className="absolute right-6 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full transition-all cursor-pointer group"
                    >
                        <X className="w-6 h-6 text-white/40 group-hover:text-white" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                            <UploadCloud className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-black uppercase tracking-tighter">Upload de Mídia</DialogTitle>
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Arraste seus arquivos para a biblioteca</p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="p-6 bg-white dark:bg-neutral-950">
                    {files.length === 0 ? (
                        <div 
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => inputRef.current?.click()}
                            className={cn(
                                "border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer group",
                                dragActive 
                                    ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 scale-[0.98]" 
                                    : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/20"
                            )}
                        >
                            <input 
                                ref={inputRef}
                                type="file" 
                                multiple 
                                accept="image/*,video/*"
                                onChange={handleChange}
                                className="hidden" 
                            />
                            
                            <div className="w-16 h-16 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <UploadCloud className={cn("w-8 h-8", dragActive ? "text-blue-500" : "text-neutral-400")} />
                            </div>
                            
                            <div className="text-center">
                                <p className="text-sm font-black uppercase tracking-tight text-neutral-900 dark:text-neutral-100">
                                    Arraste e solte ou clique aqui
                                </p>
                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">
                                    Suporta Imagens e Vídeos até 500MB
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                                    {files.length} {files.length === 1 ? 'Arquivo selecionado' : 'Arquivos selecionados'}
                                </span>
                                <button 
                                    onClick={() => setFiles([])}
                                    className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors"
                                >
                                    Limpar tudo
                                </button>
                            </div>
                            
                            <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                                {files.map((file, idx) => (
                                    <div 
                                        key={idx}
                                        className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 animate-in fade-in slide-in-from-bottom-2 duration-300"
                                        style={{ animationDelay: `${idx * 50}ms` }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-white dark:bg-neutral-800 flex items-center justify-center shadow-sm">
                                                {getFileIcon(file)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate max-w-[200px]">
                                                    {file.name}
                                                </span>
                                                <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">
                                                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                                                </span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => removeFile(idx)}
                                            className="w-8 h-8 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-red-500 transition-all"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-6 flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest leading-relaxed">
                            Seus arquivos serão processados e otimizados automaticamente para entrega em alta performance aos clientes.
                        </p>
                    </div>
                </div>

                <DialogFooter className="p-6 bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-100 dark:border-neutral-800 flex gap-3">
                    <Button 
                        variant="ghost" 
                        onClick={() => onOpenChange(false)}
                        className="font-bold uppercase tracking-widest text-[10px] text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                    >
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleUpload}
                        disabled={files.length === 0 || isUploading}
                        className="flex-1 gap-2 bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white font-black uppercase tracking-widest text-[10px] h-12 rounded-xl transition-all active:scale-95 cursor-pointer shadow-xl shadow-black/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isUploading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Subindo...</span>
                            </div>
                        ) : (
                            <>
                                <UploadCloud className="w-4 h-4" /> 
                                {files.length > 0 ? `Subir ${files.length} Arquivos` : 'Selecionar Arquivos'}
                            </>
                        )}
                    </Button>

                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function Info(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
        </svg>
    )
}

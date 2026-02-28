"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useConfigs, useSaveConfigs } from "@/hooks/use-configs"
import { toast } from "sonner"
import { Loader2, Copy, Trash2, Plus } from "lucide-react"

export default function SettingsPage() {
    const { data: configGroups, isLoading } = useConfigs()
    const saveConfigs = useSaveConfigs()

    type PortfolioConfigFields = {
        heroTitle: string;
        heroSubtitle: string;
        manifestoTitle: string;
        manifestoText: string;
        contactEmail: string;
        contactWhatsApp: string;
    }

    type ErpPortfolioConfigFields = {
        coverTitle: string;
        coverSubtitle: string;
        eyebrow: string;
        manifestoTitle: string;
        manifestoText: string;
        footerText: string;
        textCards: string[]; // Changed to array for CRUD
        contactEmail: string;
        contactPhone: string;
        instagram: string;
        website: string;
    }

    const [portfolioConfig, setPortfolioConfig] = React.useState<PortfolioConfigFields>({
        heroTitle: "Pure Visual Prestige.",
        heroSubtitle: "Elevando projetos arquitetônicos ao patamar de obra de arte através do hiper-realismo extremo.",
        manifestoTitle: "Não entregamos imagens. Entregamos o amanhã.",
        manifestoText: "A Merali Studio nasceu da obsessão pelo detalhe. Atuamos como um laboratório de luz e atmosfera, onde cada pixel é esculpido para criar a ilusão perfeita da realidade.",
        contactEmail: "contato@merali.com.br",
        contactWhatsApp: "+55 61 99999-9999"
    })

    const [erpPortfolioConfig, setErpPortfolioConfig] = React.useState<ErpPortfolioConfigFields>({
        coverTitle: "Merali Studio",
        coverSubtitle: "Visualização Arquitetônica de Alto Padrão",
        eyebrow: "High-End 3D Visualization Studio",
        manifestoTitle: "Transformamos visões em experiências visuais.",
        manifestoText: "Na Merali Studio, acreditamos que a visualização 3D vai além de simples pixels. Nossa missão é capturar a intenção de cada projeto e traduzi-la em imagens que evocam emoção e clareza. Unimos precisão técnica com uma sensibilidade artística apurada, garantindo que cada render conte uma história e valorize cada detalhe da sua arquitetura.",
        footerText: "Merali Studio de Visualização · meralistudio.com.br",
        textCards: [
            "A iluminação correta não apenas mostra, ela revela o propósito do espaço.",
            "O realismo é a ferramenta mais poderosa para alinhar expectativas e acelerar aprovações.",
            "Buscamos o equilíbrio entre a perfeição técnica e a alma do projeto arquitetônico.",
            "Imagens que não apenas apresentam volumes, mas evocam a sensação de habitabilidade.",
            "Nossa meta é reduzir a distância entre o sonho do cliente e a realidade construída.",
            "Cada render é uma oportunidade de contar a história que a planta baixa ainda não revela."
        ],
        contactEmail: "contato@merali.com.br",
        contactPhone: "+55 61 99999-9999",
        instagram: "@merali_studio",
        website: "meralistudio.com.br"
    })

    React.useEffect(() => {
        if (configGroups) {
            // Load Showcase Portfolio
            const portfolioGroup = configGroups.find((g: any) => g.name === "portfolio")
            if (portfolioGroup && portfolioGroup.configs) {
                const newConfig = { ...portfolioConfig }
                portfolioGroup.configs.forEach((c: any) => {
                    if (c.key in newConfig) {
                        (newConfig as any)[c.key] = c.value
                    }
                })
                setPortfolioConfig(newConfig)
            }

            // Load ERP Portfolio
            const erpPortfolioGroup = configGroups.find((g: any) => g.name === "erp-portfolio")
            if (erpPortfolioGroup && erpPortfolioGroup.configs) {
                const newConfig = { ...erpPortfolioConfig }
                erpPortfolioGroup.configs.forEach((c: any) => {
                    if (c.key in newConfig) {
                        if (c.key === 'textCards') {
                            try {
                                // Try to parse as JSON first
                                newConfig.textCards = JSON.parse(c.value)
                            } catch {
                                // Fallback to newline split if it's not JSON
                                newConfig.textCards = c.value.split('\n').filter((t: string) => t.trim().length > 0)
                            }
                        } else {
                            (newConfig as any)[c.key] = c.value
                        }
                    }
                })
                setErpPortfolioConfig(newConfig)
            }
        }
    }, [configGroups])



    const handleSave = async () => {
        try {
            // Save Showcase Portfolio
            const showcaseConfigs = Object.entries(portfolioConfig).map(([key, value]) => ({
                key,
                value,
                label: key
            }))
            
            await saveConfigs.mutateAsync({
                name: "portfolio",
                configs: showcaseConfigs
            })

            // Save ERP Portfolio
            const erpConfigs = Object.entries(erpPortfolioConfig).map(([key, value]) => ({
                key,
                value: key === 'textCards' ? JSON.stringify(value) : value as string,
                label: key
            }))
            
            await saveConfigs.mutateAsync({
                name: "erp-portfolio",
                configs: erpConfigs
            })
            
            toast.success("Configurações salvas com sucesso!")
        } catch (error) {
            toast.error("Erro ao salvar configurações.")
        }
    }


    return (
        <main className="flex flex-col gap-8 p-8 max-w-6xl mx-auto pb-24">
            <div>
                <h1 className="text-3xl font-black tracking-tighter text-neutral-900 dark:text-neutral-100 uppercase">Configurações da Merali</h1>
                <p className="text-neutral-500 text-sm font-bold uppercase tracking-widest mt-1">Gerencie a identidade e o jurídico do seu estúdio</p>
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



            {/* PORTFOLIO */}
            <section className="space-y-6 pt-4">
                <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                    <h2 className="text-sm font-black uppercase tracking-tight text-neutral-900 dark:text-neutral-100">Configurações do Portfólio</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Título Principal (Hero)</Label>
                        <Input 
                            value={portfolioConfig.heroTitle}
                            onChange={(e) => setPortfolioConfig({ ...portfolioConfig, heroTitle: e.target.value })}
                            placeholder="Pure Visual Prestige." 
                            className="h-10 bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-lg text-sm" 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Subtítulo (Hero)</Label>
                        <Textarea 
                            value={portfolioConfig.heroSubtitle}
                            onChange={(e) => setPortfolioConfig({ ...portfolioConfig, heroSubtitle: e.target.value })}
                            placeholder="Elevando projetos arquitetônicos..." 
                            className="min-h-[80px] bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-lg p-3 text-xs" 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Manifesto (Título)</Label>
                        <Input 
                            value={portfolioConfig.manifestoTitle}
                            onChange={(e) => setPortfolioConfig({ ...portfolioConfig, manifestoTitle: e.target.value })}
                            placeholder="Não entregamos imagens. Entregamos o amanhã." 
                            className="h-10 bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-lg text-sm" 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Manifesto (Texto)</Label>
                        <Textarea 
                            value={portfolioConfig.manifestoText}
                            onChange={(e) => setPortfolioConfig({ ...portfolioConfig, manifestoText: e.target.value })}
                            placeholder="A Merali Studio nasceu da obsessão pelo detalhe..." 
                            className="min-h-[80px] bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-lg p-3 text-xs" 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Email de Contato (Portfólio)</Label>
                        <Input 
                            value={portfolioConfig.contactEmail}
                            onChange={(e) => setPortfolioConfig({ ...portfolioConfig, contactEmail: e.target.value })}
                            placeholder="contato@merali.com.br" 
                            className="h-10 bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-lg text-sm" 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">WhatsApp (Portfólio)</Label>
                        <Input 
                            value={portfolioConfig.contactWhatsApp}
                            onChange={(e) => setPortfolioConfig({ ...portfolioConfig, contactWhatsApp: e.target.value })}
                            placeholder="+55 61 99999-9999" 
                            className="h-10 bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-lg text-sm" 
                        />
                    </div>
                </div>
            </section>

            {/* PORTFOLIO ERP (INTERNO/PDF) */}
            <section className="space-y-6 pt-4">
                <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                    <h2 className="text-sm font-black uppercase tracking-tight text-neutral-900 dark:text-neutral-100">Portfólio ERP (Interno/PDF)</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Título da Capa (PDF)</Label>
                        <Input 
                            value={erpPortfolioConfig.coverTitle}
                            onChange={(e) => setErpPortfolioConfig({ ...erpPortfolioConfig, coverTitle: e.target.value })}
                            className="h-10 bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-lg text-sm" 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Slogan (Eyebrow)</Label>
                        <Input 
                            value={erpPortfolioConfig.eyebrow}
                            onChange={(e) => setErpPortfolioConfig({ ...erpPortfolioConfig, eyebrow: e.target.value })}
                            className="h-10 bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-lg text-sm" 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Subtítulo da Capa</Label>
                        <Input 
                            value={erpPortfolioConfig.coverSubtitle}
                            onChange={(e) => setErpPortfolioConfig({ ...erpPortfolioConfig, coverSubtitle: e.target.value })}
                            className="h-10 bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-lg text-sm" 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Rodapé do PDF</Label>
                        <Input 
                            value={erpPortfolioConfig.footerText}
                            onChange={(e) => setErpPortfolioConfig({ ...erpPortfolioConfig, footerText: e.target.value })}
                            className="h-10 bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-lg text-sm" 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Manifesto: Título</Label>
                        <Input 
                            value={erpPortfolioConfig.manifestoTitle}
                            onChange={(e) => setErpPortfolioConfig({ ...erpPortfolioConfig, manifestoTitle: e.target.value })}
                            className="h-10 bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-lg text-sm" 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Manifesto: Texto</Label>
                        <Textarea 
                            value={erpPortfolioConfig.manifestoText}
                            onChange={(e) => setErpPortfolioConfig({ ...erpPortfolioConfig, manifestoText: e.target.value })}
                            className="min-h-[100px] bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-lg p-3 text-xs" 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Email de Contato (Para o PDF)</Label>
                        <Input 
                            value={erpPortfolioConfig.contactEmail}
                            onChange={(e) => setErpPortfolioConfig({ ...erpPortfolioConfig, contactEmail: e.target.value })}
                            className="h-10 bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-lg text-sm" 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Telefone de Contato (Para o PDF)</Label>
                        <Input 
                            value={erpPortfolioConfig.contactPhone}
                            onChange={(e) => setErpPortfolioConfig({ ...erpPortfolioConfig, contactPhone: e.target.value })}
                            className="h-10 bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-lg text-sm" 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Instagram / Link Extra (Para o PDF)</Label>
                        <Input 
                            value={erpPortfolioConfig.instagram}
                            onChange={(e) => setErpPortfolioConfig({ ...erpPortfolioConfig, instagram: e.target.value })}
                            className="h-10 bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-lg text-sm" 
                        />
                    </div>
                    <div className="space-y-4 md:col-span-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Frases Aleatórias (CRUD)</Label>
                            <Button 
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setErpPortfolioConfig({
                                        ...erpPortfolioConfig,
                                        textCards: [...erpPortfolioConfig.textCards, ""]
                                    })
                                }}
                                className="h-7 px-3 text-[9px] font-bold uppercase tracking-widest border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 gap-1.5"
                            >
                                <Plus className="w-3 h-3" />
                                Adicionar Frase
                            </Button>
                        </div>
                        
                        <div className="space-y-3">
                            {erpPortfolioConfig.textCards.map((phrase, index) => (
                                <div key={index} className="flex gap-2 group">
                                    <div className="flex-1">
                                        <Textarea 
                                            value={phrase}
                                            onChange={(e) => {
                                                const newPhrases = [...erpPortfolioConfig.textCards]
                                                newPhrases[index] = e.target.value
                                                setErpPortfolioConfig({ ...erpPortfolioConfig, textCards: newPhrases })
                                            }}
                                            placeholder={`Frase ${index + 1}`}
                                            className="min-h-[60px] bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 rounded-lg p-3 text-xs leading-relaxed resize-none transition-all focus:ring-1 focus:ring-blue-500/20" 
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                const newPhrases = [...erpPortfolioConfig.textCards]
                                                newPhrases.splice(index + 1, 0, phrase)
                                                setErpPortfolioConfig({ ...erpPortfolioConfig, textCards: newPhrases })
                                                toast.success("Frase duplicada")
                                            }}
                                            className="h-8 w-8 text-neutral-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                        >
                                            <Copy className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                                const newPhrases = erpPortfolioConfig.textCards.filter((_, i) => i !== index)
                                                setErpPortfolioConfig({ ...erpPortfolioConfig, textCards: newPhrases })
                                                toast.success("Frase removida")
                                            }}
                                            className="h-8 w-8 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            
                            {erpPortfolioConfig.textCards.length === 0 && (
                                <div className="py-8 border-2 border-dashed border-neutral-50 dark:border-neutral-900 rounded-xl flex flex-col items-center justify-center gap-2">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Nenhuma frase cadastrada</p>
                                    <Button 
                                        type="button"
                                        variant="link"
                                        onClick={() => {
                                            setErpPortfolioConfig({
                                                ...erpPortfolioConfig,
                                                textCards: [""]
                                            })
                                        }}
                                        className="text-[9px] font-bold uppercase tracking-widest text-blue-500"
                                    >
                                        Clique para começar
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

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
                <Button 
                    onClick={handleSave}
                    disabled={saveConfigs.isPending}
                    className="h-12 px-10 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[10px] rounded-lg shadow-lg shadow-blue-500/20 active:scale-95 transition-all gap-2"
                >
                    {saveConfigs.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    Salvar Alterações
                </Button>
            </div>
        </main>
    )
}

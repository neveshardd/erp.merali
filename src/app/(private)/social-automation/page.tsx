"use client";

import {
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  Instagram,
  Loader2,
  Plus,
  Rocket,
  Sparkles,
  Share2,
  Trash2,
  UploadCloud,
  Wand2,
  X,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Magic Icon reference
const MagicIcon = Wand2;

interface HistoryPost {
  id: string;
  caption: string;
  imageUrls: string[];
  postUrl: string | null;
  createdAt: string;
}

interface SocialPostState {
  description: string;
  media: { file: File; preview: string; id: string }[];
  isGeneratingAI: boolean;
  isPosting: boolean;
  postedUrl?: string;
  history: HistoryPost[];
}

export default function SocialAutomationPage() {
  const [state, setState] = React.useState<SocialPostState>({
    description: "",
    media: [],
    isGeneratingAI: false,
    isPosting: false,
    history: [],
  });

  const fetchHistory = React.useCallback(async () => {
    try {
      const res = await fetch("/api/instagram/history");
      if (res.ok) {
        const data = await res.json();
        setState(prev => ({ ...prev, history: data }));
      }
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
    }
  }, []);

  React.useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const currentCount = state.media.length;
      const addedFiles = Array.from(e.target.files);
      
      if (currentCount + addedFiles.length > 10) {
        toast.error("O Instagram permite no máximo 10 imagens por carrossel.");
        return;
      }

      const newFiles = addedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        id: Math.random().toString(36).substr(2, 9),
      }));
      setState((prev) => ({ ...prev, media: [...prev.media, ...newFiles] }));
    }
  };

  const removeMedia = (id: string) => {
    setState((prev) => {
      const filtered = prev.media.filter((m) => m.id !== id);
      // Clean up revokeObjectURL
      const removed = prev.media.find((m) => m.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return { ...prev, media: filtered };
    });
  };

  const generateWithAI = async () => {
    if (state.media.length === 0 && !state.description) {
      toast.error("Adicione uma imagem ou descrição para a Merali AI ter contexto!");
      return;
    }

    setState((prev) => ({ ...prev, isGeneratingAI: true }));
    try {
      const response = await fetch("/api/ai/generate-caption", {
        method: "POST",
        body: JSON.stringify({
          description: state.description,
          files: state.media.map(m => m.file.name)
        }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
          throw new Error(data.error || "Falha na geração");
      }

      setState((prev) => ({ ...prev, description: data.description }));
      toast.success("Legenda gerada pelo Grok com sucesso!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erro ao gerar legenda com IA.");
    } finally {
      setState((prev) => ({ ...prev, isGeneratingAI: false }));
    }
  };

  const handlePost = async () => {
    if (state.media.length === 0) {
      toast.error("Selecione pelo menos uma imagem!");
      return;
    }

    setState((prev) => ({ ...prev, isPosting: true }));
    try {
      // 1. Upload images to R2 first (reusing existing API patterns)
      // For now, let's pretend we have a unified upload + post endpoint or do it sequentially
      
      const uploadedUrls = [];
      for(const m of state.media) {
          const formData = new FormData();
          formData.append("file", m.file);
          
          const res = await fetch("/api/media/direct-upload", {
              method: "POST",
              body: formData,
          });

          if (!res.ok) throw new Error("Falha no upload do servidor");

          const { publicUrl } = await res.json();
          uploadedUrls.push(publicUrl);
      }

      // 2. Call Instagram API
      const response = await fetch("/api/instagram/post", {
        method: "POST",
        body: JSON.stringify({
          caption: state.description,
          imageUrls: uploadedUrls,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao postar");
      }

      const data = await response.json();
      
      // Clear state and show success with link
      setState((prev) => ({ 
        ...prev, 
        postedUrl: data.url,
        media: [],
        description: "" 
      }));

      toast.success("Postagem realizada com sucesso!", {
        description: data.status === "simulated_success" ? "[MODO SIMULAÇÃO] Verifique suas .envs" : "Clique no link para visualizar seu post.",
        action: {
          label: "Ver no Instagram",
          onClick: () => window.open(data.url, "_blank")
        }
      });
      
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erro ao realizar a postagem.");
    } finally {
      setState((prev) => ({ ...prev, isPosting: false }));
      fetchHistory(); // Refresh history
    }
  };

  return (
    <main className="flex flex-col gap-8 max-w-5xl mx-auto w-full p-6">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-linear-to-br from-purple-600 via-pink-500 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/20">
            <Instagram className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-black text-3xl uppercase tracking-tighter text-neutral-900 dark:text-neutral-100 italic leading-none">
              Automação Social
            </h1>
            <p className="text-neutral-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-1">
              Criação Inteligente e Publicação Automática
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Media & Info */}
        <div className="lg:col-span-7 space-y-8">
          <Card className="border-none shadow-xl shadow-black/5 rounded-3xl overflow-hidden">
            <CardHeader className="bg-neutral-50 dark:bg-neutral-900/50 pb-8 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-black uppercase tracking-tight italic">Mídia da Postagem</CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase tracking-widest mt-1">
                    Suporta imagens e vídeos em alta definição
                  </CardDescription>
                </div>
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-xl font-bold uppercase tracking-widest text-[9px] h-10 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Plus className="w-3.5 h-3.5 mr-2" />
                    Adicionar
                </Button>
                <input 
                    type="file" 
                    multiple 
                    accept="image/*,video/*" 
                    onChange={handleFileChange} 
                    className="hidden" 
                    ref={fileInputRef}
                />
              </div>
            </CardHeader>
            <CardContent className="p-8">
                {state.media.length === 0 ? (
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-video w-full rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 hover:border-pink-500/50 hover:bg-pink-500/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 group"
                    >
                        <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-900 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-sm border border-neutral-200 dark:border-neutral-800">
                            <UploadCloud className="w-8 h-8 text-neutral-400 group-hover:text-pink-500 transition-colors" />
                        </div>
                        <div className="text-center">
                            <span className="text-sm font-black uppercase tracking-tight block">Arraste seu projeto aqui</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mt-1">Postagens de visual prestígio</span>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {state.media.map((item) => (
                            <div key={item.id} className="group relative aspect-square rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-lg">
                                <img src={item.preview} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Preview" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button 
                                        variant="destructive" 
                                        size="icon" 
                                        className="rounded-full w-10 h-10 shadow-2xl" 
                                        onClick={() => removeMedia(item.id)}
                                    >
                                        <Trash2 className="w-5 h-5 text-white" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center gap-2 hover:border-pink-500/50 hover:bg-pink-500/5 transition-all text-neutral-400 hover:text-pink-500"
                        >
                            <Plus className="w-6 h-6" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Mais</span>
                        </button>
                    </div>
                )}
            </CardContent>
          </Card>

        </div>

        {/* Right Column: AI & Execution */}
        <div className="lg:col-span-5 space-y-8">
            <Card className="border-pink-500/20 shadow-2xl shadow-pink-500/5 rounded-3xl overflow-hidden bg-linear-to-b from-white to-pink-50/10 dark:from-neutral-950 dark:to-pink-950/5">
                <CardHeader className="pb-6 border-b border-pink-500/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center">
                            <Rocket className="w-5 h-5 text-white dark:text-black" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-black uppercase tracking-tight italic">Legenda com Merali AI</CardTitle>
                            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-pink-600/60 mt-1 flex items-center gap-1.5">
                                <Sparkles className="w-3 h-3" /> IA de visual prestígio
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between ml-1">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Conteúdo Final</Label>
                            <button 
                                onClick={generateWithAI}
                                disabled={state.isGeneratingAI}
                                className="flex items-center gap-1.5 text-pink-600 hover:text-pink-700 font-black uppercase tracking-widest text-[9px] transition-all disabled:opacity-50"
                            >
                                {state.isGeneratingAI ? <Loader2 className="w-3 h-3 animate-spin" /> : <MagicIcon className="w-3 h-3" />}
                                {state.description ? "Refinar Legenda" : "Gerar Legenda"}
                            </button>
                        </div>
                        <Textarea 
                            placeholder="Descreva seu projeto ou deixe a Merali AI criar algo majestoso para você..." 
                            className="min-h-[220px] rounded-2xl bg-neutral-50/50 dark:bg-neutral-950/50 border-neutral-200 dark:border-neutral-800 resize-none p-6 text-sm leading-relaxed"
                            value={state.description}
                            onChange={(e) => setState(prev => ({ ...prev, description: e.target.value }))}
                        />
                         <div className="flex items-start gap-3 p-4 bg-pink-50/50 dark:bg-pink-950/10 rounded-2xl border border-pink-100 dark:border-pink-900/30 mt-2">
                            <AlertCircle className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
                            <p className="text-[9px] font-bold text-pink-600 uppercase tracking-widest leading-relaxed">
                                A Merali AI utiliza visão computacional e análise de contexto para criar legendas que maximizam o engajamento e a percepção de luxo.
                            </p>
                        </div>
                    </div>

                    <Button 
                        onClick={handlePost}
                        disabled={state.isPosting || state.media.length === 0}
                        className="w-full h-16 rounded-2xl bg-neutral-900 hover:bg-black dark:bg-pink-600 dark:hover:bg-pink-700 text-white font-black uppercase tracking-widest text-xs gap-3 shadow-2xl transition-all active:scale-95 disabled:opacity-50 group overflow-hidden relative"
                    >
                        {state.isPosting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <Instagram className="w-5 h-5" />
                                <span>Publicar no Instagram</span>
                                <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12" />
                            </>
                        )}
                    </Button>

                    {state.postedUrl && (
                        <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/30 rounded-2xl animate-in zoom-in-95 duration-500">
                             <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                             <div>
                                <p className="text-[10px] font-black uppercase tracking-tight text-green-900 dark:text-green-100">Postado com sucesso!</p>
                                <a href={state.postedUrl} target="_blank" rel="noreferrer" className="text-[10px] font-black uppercase tracking-widest text-green-600 hover:underline">Ver no Instagram</a>
                             </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>

        {/* Historico de Postagens */}
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-pink-600" />
                <h2 className="font-black text-xl uppercase tracking-tighter italic">Histórico de Lançamentos</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {state.history.length === 0 ? (
                    <div className="col-span-full p-12 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl flex flex-col items-center justify-center text-neutral-400 gap-2">
                        <ImageIcon className="w-8 h-8 opacity-20" />
                        <p className="text-[10px] font-bold uppercase tracking-widest">Nenhuma postagem registrada no ERP.</p>
                    </div>
                ) : (
                    state.history.map((post) => (
                        <Card key={post.id} className="rounded-3xl border-neutral-100 dark:border-neutral-900 bg-white/50 dark:bg-neutral-950/50 backdrop-blur-xl overflow-hidden group hover:border-pink-500/30 transition-all duration-500">
                            <CardContent className="p-0 flex h-32">
                                <div className="w-32 h-full relative overflow-hidden shrink-0">
                                    <img src={post.imageUrls[0]} alt="Post preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    {post.imageUrls.length > 1 && (
                                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded-md text-[8px] font-black text-white uppercase">
                                            +{post.imageUrls.length - 1}
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 flex flex-col justify-between flex-1 min-w-0">
                                    <div className="space-y-1">
                                        <p className="text-neutral-400 text-[8px] font-bold uppercase tracking-widest">
                                            {new Date(post.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                        </p>
                                        <p className="text-neutral-900 dark:text-neutral-100 text-[10px] line-clamp-2 font-medium leading-relaxed italic">
                                            "{post.caption}"
                                        </p>
                                    </div>
                                    {post.postUrl && (
                                        <a 
                                            href={post.postUrl} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="text-pink-600 text-[9px] font-black uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all"
                                        >
                                            Ver no Instagram <Plus className="w-3 h-3" />
                                        </a>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
      </div>
    </main>
  );
}

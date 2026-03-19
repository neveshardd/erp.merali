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
  GripVertical,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided, DraggableStateSnapshot } from "@hello-pangea/dnd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMedia, type MediaItem } from "@/hooks/use-media";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";

// Magic Icon reference
const MagicIcon = Wand2;

// StrictModeDroppable for React 18+ compatibility
const StrictModeDroppable = ({ children, ...props }: any) => {
  const [enabled, setEnabled] = React.useState(false);
  React.useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);
  if (!enabled) {
    return null;
  }
  return <Droppable {...props}>{children}</Droppable>;
};

interface HistoryPost {
  id: string;
  caption: string;
  imageUrls: string[];
  postUrl: string | null;
  createdAt: string;
}

interface SocialPostState {
  description: string;
  media: { file?: File; preview: string; id: string; fromLibrary?: boolean }[];
  postedUrl?: string;
  isLibraryModalOpen: boolean;
}

export default function SocialAutomationPage() {
  const queryClient = useQueryClient();
  const [state, setState] = React.useState<SocialPostState>({
    description: "",
    media: [],
    isLibraryModalOpen: false,
  });

  const { data: libraryMedia = [] } = useMedia();
  const [librarySearch, setLibrarySearch] = React.useState("");

  const { data: history = [], refetch: refetchHistory } = useQuery({
    queryKey: ["social-history"],
    queryFn: async () => {
      const response = await axios.get("/api/instagram/history");
      return response.data as HistoryPost[];
    }
  });

  const { data: igAccount } = useQuery({
    queryKey: ["ig-account"],
    queryFn: async () => {
      const response = await axios.get("/api/instagram/account");
      return response.data;
    }
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const currentCount = state.media.length;
      const addedFiles = Array.from(e.target.files);
      
      if (currentCount + addedFiles.length > 10) {
        toast.error("O Instagram permite no máximo 10 imagens por carrossel.");
        return;
      }

      const newFiles = addedFiles.map((file) => {
        if (file.size > 8 * 1024 * 1024) {
          toast.warning(`A imagem ${file.name} excede 8MB. O Instagram pode rejeitá-la.`);
        }
        return {
          file,
          preview: URL.createObjectURL(file),
          id: Math.random().toString(36).substr(2, 9),
          type: file.type.startsWith("video") ? "VIDEO" : "IMAGE",
        };
      });
      setState((prev) => ({ ...prev, media: [...prev.media, ...newFiles] }));
      setLibrarySearch("");
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(state.media);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setState((prev) => ({ ...prev, media: items }));
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

  const generateMutation = useMutation({
    mutationFn: async () => {
      if (state.media.length === 0 && !state.description) {
        throw new Error("Adicione uma imagem ou descrição para a Merali AI ter contexto!");
      }
      const response = await axios.post("/api/ai/generate-caption", {
        description: state.description,
        files: state.media.map(m => m.file?.name || "library-selection")
      });
      return response.data;
    },
    onSuccess: (data) => {
      setState((prev) => ({ ...prev, description: data.description }));
      toast.success("Legenda refinada com prestígio!");
    },
    onError: (error: any) => {
      const err = error.response?.data?.error;
      const msg = typeof err === "string" ? err : (err?.message || error.message || "Erro ao gerar legenda.");
      toast.error(msg);
    }
  });

  const postMutation = useMutation({
    mutationFn: async () => {
      if (state.media.length === 0) {
        throw new Error("Selecione pelo menos uma imagem!");
      }

      const uploadedUrls = [];
      for(const m of state.media) {
        if (m.fromLibrary) {
          uploadedUrls.push(m.preview);
          continue;
        }
        if (!m.file) continue;

        const presignedReq = await axios.post("/api/media/upload", {
          filename: m.file.name,
          contentType: m.file.type,
        });

        const { url, publicUrl } = presignedReq.data;

        await axios.put(url, m.file, {
          headers: { "Content-Type": m.file.type },
        });

        uploadedUrls.push(publicUrl);
      }

      const response = await axios.post("/api/instagram/post", {
        caption: state.description,
        imageUrls: uploadedUrls,
      });
      return response.data;
    },
    onSuccess: (data) => {
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
      queryClient.invalidateQueries({ queryKey: ["social-history"] });
    },
    onError: (error: any) => {
      const err = error.response?.data?.error;
      const msg = typeof err === "string" ? err : (err?.message || error.message || "Erro ao postar.");
      toast.error(msg);
    }
  });

  return (
    <main className="flex flex-col gap-8 max-w-5xl mx-auto w-full p-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

        <div className="flex items-center gap-2">
            {!igAccount?.businessId ? (
                <Button 
                    className="rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-black uppercase tracking-widest text-[10px] px-6 h-11 shadow-lg shadow-pink-500/20"
                    onClick={() => {
                        const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
                        const redirectUri = encodeURIComponent(`${window.location.origin}/api/auth/social/instagram/callback`);
                        const authUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement`;
                        window.open(authUrl, "Conectar Instagram", "width=600,height=700");
                    }}
                >
                    Conectar Instagram
                </Button>
            ) : (
                <div className="flex items-center gap-2 px-4 h-11 bg-green-500/10 rounded-xl border border-green-500/20">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-green-600">Conectado</span>
                    <button 
                        onClick={() => {
                            const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
                            const redirectUri = encodeURIComponent(`${window.location.origin}/api/auth/social/instagram/callback`);
                            const authUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement`;
                            window.open(authUrl, "Reconectar Instagram", "width=600,height=700");
                        }}
                        className="ml-2 text-neutral-400 hover:text-pink-500 transition-colors"
                        title="Reconectar"
                    >
                        <Share2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}
        </div>
      </header>

      {/* Library Selection Modal */}
      <Dialog open={state.isLibraryModalOpen} onOpenChange={(open) => setState(prev => ({ ...prev, isLibraryModalOpen: open }))}>
          <DialogContent className="max-w-3xl rounded-3xl border-none shadow-2xl p-0 overflow-hidden bg-white dark:bg-neutral-950">
              <DialogHeader className="p-6 border-b border-neutral-100 dark:border-neutral-900">
                  <DialogTitle className="font-black uppercase tracking-tighter italic text-xl">Biblioteca Studio Merali</DialogTitle>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mt-1">Selecione mídias prontas para postagem</p>
              </DialogHeader>
              
              <div className="p-6 space-y-4">
                  <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-pink-600 transition-colors" />
                      <Input 
                          placeholder="Buscar na biblioteca..." 
                          className="pl-11 h-12 bg-neutral-50 dark:bg-neutral-900 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-pink-500/20"
                          value={librarySearch}
                          onChange={(e) => setLibrarySearch(e.target.value)}
                      />
                  </div>

                  <ScrollArea className="h-96">
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 p-1">
                          {libraryMedia
                            .filter((item: MediaItem) => item.name.toLowerCase().includes(librarySearch.toLowerCase()))
                            .map((item: MediaItem) => {
                              const isSelected = state.media.some(m => m.preview === item.url);
                              return (
                                  <button
                                      key={item.id}
                                      onClick={() => {
                                          if (isSelected) {
                                              setState(prev => ({ ...prev, media: prev.media.filter(m => m.preview !== item.url) }));
                                          } else {
                                              if (state.media.length >= 10) {
                                                  toast.error("Limite de 10 imagens atingido.");
                                                  return;
                                              }
                                              setState(prev => ({ 
                                                  ...prev, 
                                                  media: [...prev.media, { preview: item.url, id: item.id, fromLibrary: true }] 
                                              }));
                                          }
                                      }}
                                      className={cn(
                                          "relative aspect-square rounded-xl overflow-hidden group border-2 transition-all",
                                          isSelected ? "border-pink-500 ring-2 ring-pink-500/20" : "border-transparent"
                                      )}
                                  >
                                      <img src={item.url} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                      {isSelected && (
                                          <div className="absolute inset-0 bg-pink-500/20 flex items-center justify-center">
                                              <CheckCircle2 className="w-8 h-8 text-white drop-shadow-lg" />
                                          </div>
                                      )}
                                  </button>
                              );
                          })}
                      </div>
                  </ScrollArea>
              </div>

              <div className="p-6 border-t border-neutral-100 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-950/50 flex justify-end">
                  <Button 
                      onClick={() => setState(prev => ({ ...prev, isLibraryModalOpen: false }))}
                      className="rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-black uppercase tracking-widest text-[10px] px-8"
                  >
                      Concluído
                  </Button>
              </div>
          </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Media & Info */}
        <div className="lg:col-span-7 space-y-8">
          <Card className="border-none shadow-xl shadow-black/5 rounded-3xl relative">
            <CardHeader className="bg-neutral-50 dark:bg-neutral-900/50 pb-8 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-black uppercase tracking-tight italic">Mídia da Postagem</CardTitle>
                  <CardDescription className="text-[10px] font-black uppercase tracking-widest mt-1">
                    Suporta imagens e vídeos em alta definição
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-xl font-black uppercase tracking-widest text-[9px] h-10 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                        onClick={() => setState(prev => ({ ...prev, isLibraryModalOpen: true }))}
                    >
                        <ImageIcon className="w-3.5 h-3.5 mr-2" />
                        Biblioteca
                    </Button>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-xl font-black uppercase tracking-widest text-[9px] h-10 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <UploadCloud className="w-3.5 h-3.5 mr-2" />
                        Upload
                    </Button>
                </div>
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
                            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mt-1">Postagens de visual prestígio</span>
                        </div>
                    </div>
                ) : (
                    <DragDropContext onDragEnd={onDragEnd}>
                        <StrictModeDroppable droppableId="media-grid" direction="horizontal">
                            {(provided: DroppableProvided) => (
                                <div 
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="grid grid-cols-2 sm:grid-cols-3 gap-6 relative"
                                >
                                    {state.media.map((m, index) => {
                                        const isAlreadyPosted = history.some(post => post.imageUrls.includes(m.preview));
                                        return (
                                            <Draggable key={m.id} draggableId={m.id} index={index}>
                                                {(draggableProvided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                                                    <div 
                                                        ref={draggableProvided.innerRef}
                                                        {...draggableProvided.draggableProps}
                                                        style={{
                                                            ...draggableProvided.draggableProps.style,
                                                        }}
                                                        className={cn(
                                                            "relative aspect-square rounded-2xl overflow-hidden group shadow-xl transition-shadow",
                                                            snapshot.isDragging && "shadow-2xl ring-2 ring-pink-500/50 z-50"
                                                        )}
                                                    >
                                                        <img 
                                                            src={m.preview} 
                                                            alt="Post preview" 
                                                            className="w-full h-full object-cover pointer-events-none" 
                                                        />
                                                        
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                            <button 
                                                                onClick={() => removeMedia(m.id)}
                                                                className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg transition-all active:scale-95 z-30"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>

                                                        {/* Number Badge */}
                                                        <div className="absolute top-2 left-2 w-6 h-6 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-[10px] font-black text-white border border-white/20 z-10">
                                                            {index + 1}
                                                        </div>

                                                        {/* Drag Handle */}
                                                        <div 
                                                            {...draggableProvided.dragHandleProps}
                                                            className="absolute bottom-2 right-2 p-1.5 bg-black/60 backdrop-blur-md rounded-lg text-white/50 hover:text-white transition-colors cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 z-20"
                                                        >
                                                            <GripVertical className="w-4 h-4" />
                                                        </div>

                                                        {isAlreadyPosted && (
                                                            <div className="absolute top-2 left-10 right-2 bg-pink-600/90 backdrop-blur-md px-2 py-1 rounded-lg border border-white/20 shadow-xl flex items-center gap-1.5 z-10">
                                                                <AlertCircle className="w-3 h-3 text-white" />
                                                                <span className="text-[8px] font-black text-white uppercase tracking-tighter">Já postado</span>
                                                            </div>
                                                        )}
                                                        
                                                        {m.fromLibrary && (
                                                            <div className="absolute bottom-2 left-2 bg-neutral-900/80 backdrop-blur-md px-2 py-1 rounded-lg text-[7px] font-black text-white uppercase tracking-widest z-10">
                                                                Biblioteca
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </Draggable>
                                        );
                                    })}
                                    {provided.placeholder}
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="aspect-square rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center gap-2 hover:border-pink-500/50 hover:bg-pink-500/5 transition-all text-neutral-400 hover:text-pink-500"
                                    >
                                        <Plus className="w-6 h-6" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Mais</span>
                                    </button>
                                </div>
                            )}
                        </StrictModeDroppable>
                    </DragDropContext>
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
                             <CardDescription className="text-[10px] font-black uppercase tracking-widest text-pink-600/60 mt-1 flex items-center gap-1.5">
                                 <Sparkles className="w-3 h-3" /> IA de visual prestígio
                             </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between ml-1">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Conteúdo Final</Label>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="rounded-xl hover:bg-black/5 dark:hover:bg-white/5 h-10 px-4 transition-all"
                                onClick={() => generateMutation.mutate()}
                                disabled={generateMutation.isPending}
                            >
                                {generateMutation.isPending ? (
                                    <Loader2 className="w-4 h-4 animate-spin text-pink-600" />
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <MagicIcon className="w-3.5 h-3.5 text-pink-600" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-pink-600">
                                            {state.description ? "Refinar Legenda" : "Gerar Legenda"}
                                        </span>
                                    </div>
                                )}
                            </Button>
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
                        className="w-full h-14 bg-black dark:bg-white text-white dark:text-black hover:scale-[1.02] active:scale-[0.98] transition-all rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl group relative overflow-hidden disabled:opacity-50"
                        onClick={() => postMutation.mutate()}
                        disabled={postMutation.isPending || state.media.length === 0}
                    >
                        <div className="absolute inset-0 bg-linear-to-r from-pink-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        {postMutation.isPending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <div className="flex items-center gap-3">
                                <Share2 className="w-5 h-5" />
                                <span>Lançar Postagem</span>
                            </div>
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
        <div className="lg:col-span-12 flex flex-col gap-6 mt-12">
            <div className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-pink-600" />
                <h2 className="font-black text-xl uppercase tracking-tighter italic">Histórico de Lançamentos</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {history.length === 0 ? (
                    <div className="col-span-full p-12 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl flex flex-col items-center justify-center text-neutral-400 gap-2">
                        <ImageIcon className="w-8 h-8 opacity-20" />
                        <p className="text-[10px] font-bold uppercase tracking-widest">Nenhuma postagem registrada no ERP.</p>
                    </div>
                ) : (
                    history.map((post) => (
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

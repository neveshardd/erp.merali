"use client";

import axios from "axios";
import {
  Camera,
  CheckCircle2,
  FileText,
  Info,
  Layers,
  Link2,
  Loader2,
  Plus,
  Send,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function PublicBriefingPage() {
  const params = useParams();
  const id = params.id as string;

  const [briefing, setBriefing] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [submitted, setSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Form states
  const [format, setFormat] = React.useState("");
  const [links, setLinks] = React.useState<string[]>([""]);
  const [mood, setMood] = React.useState("Diurno");
  const [lightingNotes, setLightingNotes] = React.useState("");
  const [materialsNotes, setMaterialsNotes] = React.useState("");

  React.useEffect(() => {
    async function fetchBriefing() {
      try {
        const { data } = await axios.get(`/api/briefings/${id}`);
        setBriefing(data);
        // Initialize form if data exists
        if (data.content) {
          setFormat(data.content.format || "");
          setLinks(data.content.links || [""]);
          setMood(data.content.mood || "Diurno");
          setLightingNotes(data.content.lightingNotes || "");
          setMaterialsNotes(data.content.materialsNotes || "");
        }
      } catch (error) {
        console.error("Error fetching briefing:", error);
      } finally {
        setIsLoading(false);
      }
    }
    if (id) fetchBriefing();
  }, [id]);

  const handleAddLink = () => setLinks([...links, ""]);
  const handleRemoveLink = (index: number) => {
    const newLinks = [...links];
    newLinks.splice(index, 1);
    setLinks(newLinks);
  };
  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.patch(`/api/briefings/${briefing.id}`, {
        status: "Enviado",
        content: {
          ...briefing?.content,
          format,
          links: links.filter((l) => l.trim() !== ""),
          mood,
          lightingNotes,
          materialsNotes,
        },
      });
      setSubmitted(true);
      toast.success("Briefing enviado com sucesso!");
    } catch (error) {
      console.error("Error submitting briefing:", error);
      toast.error("Erro ao enviar briefing. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center p-6 text-neutral-400">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-none shadow-2xl rounded-3xl overflow-hidden">
          <div className="h-2 bg-emerald-500 w-full"></div>
          <CardContent className="p-12 flex flex-col items-center text-center gap-6">
            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-black uppercase tracking-tighter">
                Briefing Enviado!
              </h1>
              <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest leading-relaxed">
                Obrigado! Recebemos suas informações técnicos. Nossa equipe de
                produção irá analisar os dados e entraremos em contato se houver
                dúvidas.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pb-20">
      {/* Public Header */}
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Merali Logo"
              width={40}
              height={40}
              className="rounded-lg shadow-sm"
            />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                Briefing Técnico
              </span>
              <span className="text-xs font-black uppercase tracking-tight text-neutral-900 dark:text-white">
                Merali Studio
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <main className="max-w-4xl mx-auto px-6 mt-12 flex flex-col gap-8">
        {/* Intro Card */}
        <Card className="border-none shadow-xl bg-neutral-900 text-white rounded-3xl overflow-hidden">
          <CardContent className="p-8 md:p-12 relative flex flex-col gap-4">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <FileText className="w-32 h-32" />
            </div>
            <div className="flex items-center gap-2 text-rose-400">
              <Info className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Informações Necessárias
              </span>
            </div>
            <div className="flex flex-col gap-2 relative z-10">
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none">
                {briefing?.projectName || "Projeto Merali"}
              </h1>
              <p className="text-xs md:text-sm font-bold text-white/40 uppercase tracking-[0.2em]">
                Olá {briefing?.clientName}, preencha os detalhes técnicos para{" "}
                <br />
                iniciarmos a produção do seu projeto 3D
              </p>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Section 1: Files */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2 px-1">
              <Layers className="w-4 h-4 text-neutral-400" />
              <h2 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                Arquivos & Formatos
              </h2>
            </div>
            <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 rounded-2xl shadow-sm overflow-hidden">
              <CardContent className="p-8 flex flex-col gap-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                    Formato do Modelo Original
                  </Label>
                  <Input
                    placeholder="Ex: SketchUp 2023, Revit, DWG..."
                    className="h-12 rounded-xl bg-neutral-50 border-neutral-100 dark:bg-neutral-900 dark:border-neutral-800 dark:text-white"
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                      Links para download (Drive/WeTransfer)
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleAddLink}
                      className="h-7 text-[9px] font-black uppercase tracking-widest gap-1 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Adicionar Link
                    </Button>
                  </div>
                  <div className="flex flex-col gap-3">
                    {links.map((link, index) => (
                      <div key={index} className="flex gap-2">
                        <div className="relative flex-1">
                          <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
                          <Input
                            placeholder="Cole o link dos arquivos aqui"
                            className="h-12 pl-12 rounded-xl bg-neutral-50 border-neutral-100 dark:bg-neutral-900 dark:border-neutral-800 dark:text-white"
                            value={link}
                            onChange={(e) =>
                              handleLinkChange(index, e.target.value)
                            }
                            required={index === 0}
                          />
                        </div>
                        {links.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveLink(index)}
                            className="h-12 w-12 rounded-xl text-neutral-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section 2: Atmosphere */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2 px-1">
              <Camera className="w-4 h-4 text-neutral-400" />
              <h2 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                Atmosfera & Iluminação
              </h2>
            </div>
            <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 rounded-2xl shadow-sm overflow-hidden">
              <CardContent className="p-8 flex flex-col gap-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["Diurno", "Crepúsculo", "Noturno"].map((moodOption) => (
                    <button
                      key={moodOption}
                      type="button"
                      onClick={() => setMood(moodOption)}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 group cursor-pointer ${
                        mood === moodOption
                          ? "border-rose-500 bg-rose-50/50 dark:bg-rose-900/10"
                          : "border-neutral-100 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-600"
                      }`}
                    >
                      <span
                        className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                          mood === moodOption
                            ? "text-rose-600 dark:text-rose-400"
                            : "text-neutral-400 group-hover:text-black dark:group-hover:text-white"
                        }`}
                      >
                        {moodOption}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                    Observações de Iluminação e Mood
                  </Label>
                  <Textarea
                    placeholder="Descreva a sensação que deseja passar (ex: Aconchegante, Minimalista, Solar...)"
                    className="min-h-[120px] rounded-xl bg-neutral-50 border-neutral-100 dark:bg-neutral-900 dark:border-neutral-800 p-4 dark:text-white"
                    value={lightingNotes}
                    onChange={(e) => setLightingNotes(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section 3: Materials */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2 px-1">
              <Camera className="w-4 h-4 text-neutral-400" />
              <h2 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                Materiais & Destaques
              </h2>
            </div>
            <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 rounded-2xl shadow-sm overflow-hidden">
              <CardContent className="p-8 space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                  Materiais de Especial Atenção
                </Label>
                <Textarea
                  placeholder="Liste marcas de revestimentos, tipos de madeira, pedras naturais ou itens específicos..."
                  className="min-h-[120px] rounded-xl bg-neutral-50 border-neutral-100 dark:bg-neutral-900 dark:border-neutral-800 p-4 dark:text-white"
                  value={materialsNotes}
                  onChange={(e) => setMaterialsNotes(e.target.value)}
                />
              </CardContent>
            </Card>
          </section>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-16 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-xl transition-all active:scale-[0.98] cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Enviando...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" /> Enviar Briefing ao Estúdio
              </>
            )}
          </Button>
        </form>

        <p className="text-center text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400 py-8">
          Merali Studio de Visualização © 2024 - Sistema de Briefing Técnico
        </p>
      </main>
    </div>
  );
}

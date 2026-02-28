"use client";

import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import {
  BookOpen,
  Download,
  Eye,
  Heart,
  Image as ImageIcon,
  Loader2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useConfigs } from "@/hooks/use-configs";
import type { MediaItem } from "@/hooks/use-media";
import { useMedia } from "@/hooks/use-media";
import { cn } from "@/lib/utils";
import { PortfolioPDFDocument } from "./portfolio-document";

// ── Miniatura da imagem favorita ──────────────────────────────────────────────
function ImageThumb({ item }: { item: MediaItem }) {
  const [loaded, setLoaded] = useState(false);
  const cleanName = item.name.includes(".")
    ? item.name.substring(0, item.name.lastIndexOf("."))
    : item.name;

  return (
    <div className="group relative rounded-xl overflow-hidden border border-neutral-100 dark:border-neutral-800">
      <div className="aspect-square bg-neutral-100 dark:bg-neutral-800 relative overflow-hidden">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-neutral-300 animate-spin" />
          </div>
        )}
        <img
          src={item.url}
          alt={cleanName}
          onLoad={() => setLoaded(true)}
          className={cn(
            "w-full h-full object-cover transition-all duration-500 group-hover:scale-105",
            loaded ? "opacity-100" : "opacity-0",
          )}
        />
        {/* Badge favorito */}
        <div className="absolute top-2 left-2 pointer-events-none">
          <div className="bg-red-500 text-white p-1 rounded-full shadow">
            <Heart className="w-2.5 h-2.5 fill-current" />
          </div>
        </div>
      </div>
      {/* Nome */}
      <div className="px-2 py-1.5 bg-white dark:bg-neutral-900">
        <p className="text-[10px] font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide truncate">
          {cleanName}
        </p>
      </div>
    </div>
  );
}

// ── Modal de Preview PDF ──────────────────────────────────────────────────────
function PDFPreviewModal({
  images,
  configs,
  onClose,
}: {
  images: Array<{ id: string; url: string; name: string }>;
  configs?: any;
  onClose: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "rgba(10,10,10,0.96)" }}
    >
      {/* Barra superior */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white font-black uppercase tracking-widest text-[11px]">
              Preview · Portfólio
            </p>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-0.5">
              {images.length} imagem{images.length !== 1 ? "s" : ""} no
              portfólio
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <PDFDownloadLink
            document={
              <PortfolioPDFDocument images={images} configs={configs} />
            }
            fileName={`${configs?.coverTitle?.toLowerCase().replace(/\s+/g, "-") || "portfolio"}-${new Date().getFullYear()}.pdf`}
          >
            {({ loading }) => (
              <Button
                disabled={loading}
                size="sm"
                className="h-9 bg-white text-neutral-900 hover:bg-neutral-100 font-black uppercase tracking-widest text-[10px] rounded-xl shadow-lg cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 mr-1.5" />
                    Baixar PDF
                  </>
                )}
              </Button>
            )}
          </PDFDownloadLink>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
            title="Fechar (Esc)"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-hidden">
        <PDFViewer
          width="100%"
          height="100%"
          showToolbar={false}
          style={{ border: "none" }}
        >
          <PortfolioPDFDocument images={images} configs={configs} />
        </PDFViewer>
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function PortfolioPage() {
  const { data: allMedia = [], isLoading } = useMedia();
  const { data: configGroups } = useConfigs();
  const [showPreview, setShowPreview] = useState(false);
  const [pdfImages, setPdfImages] = useState<
    Array<{ id: string; url: string; name: string }>
  >([]);
  const [converting, setConverting] = useState(false);

  // Memoized ERP Portfolio Config
  const erpPortfolioConfigs = useMemo(() => {
    if (!configGroups) return undefined;
    const group = configGroups.find((g: any) => g.name === "erp-portfolio");
    if (!group) return undefined;

    const configs: Record<string, string> = {};
    group.configs.forEach((c: any) => {
      configs[c.key] = c.value;
    });
    return configs;
  }, [configGroups]);

  // Apenas imagens favoritas — vídeos excluídos
  const favorites = (allMedia as MediaItem[]).filter(
    (m) => m.isFavorite && m.type === "IMAGE",
  );

  const hasImages = favorites.length > 0;

  // Converte URLs para base64 via proxy (server-side fetch, sem CORS)
  const buildPdfImages = useCallback(async () => {
    if (favorites.length === 0) return;
    setConverting(true);
    try {
      const results = await Promise.all(
        favorites.map(async (m) => {
          try {
            const res = await fetch(
              `/api/image-proxy?url=${encodeURIComponent(m.url)}`,
            );
            const json = await res.json();
            return { id: m.id, url: json.dataUri as string, name: m.name };
          } catch {
            // fallback: URL original (pode não aparecer por CORS, mas tenta)
            return { id: m.id, url: m.url, name: m.name };
          }
        }),
      );
      setPdfImages(results);
    } finally {
      setConverting(false);
    }
  }, [favorites.length, favorites.map]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reconverte quando a lista de favoritos mudar
  useEffect(() => {
    if (!isLoading && favorites.length > 0) {
      buildPdfImages();
    }
  }, [isLoading, buildPdfImages, favorites.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const pdfReady = pdfImages.length > 0 && !converting;
  const showLoader = isLoading || (hasImages && converting);

  return (
    <>
      {showPreview && pdfReady && (
        <PDFPreviewModal
          images={pdfImages}
          configs={erpPortfolioConfigs}
          onClose={() => setShowPreview(false)}
        />
      )}

      <main className="flex flex-col h-full">
        {/* ── Header ────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-6 pt-6 pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 dark:bg-white flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6 text-white dark:text-neutral-900" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-neutral-900 dark:text-neutral-100 uppercase">
                Portfólio
              </h1>
              <p className="text-neutral-500 text-sm mt-0.5">
                Todas as imagens favoritas da biblioteca compõem o portfólio
                PDF.
              </p>
            </div>
          </div>

          {/* Ações */}
          {hasImages && !showLoader && (
            <div className="flex items-center gap-3">
              {converting && (
                <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Preparando imagens...
                </span>
              )}
              <Button
                onClick={() => setShowPreview(true)}
                disabled={!pdfReady}
                variant="outline"
                className="h-10 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-black uppercase tracking-widest text-[11px] rounded-xl cursor-pointer disabled:opacity-40"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>

              <PDFDownloadLink
                document={
                  <PortfolioPDFDocument
                    images={pdfImages}
                    configs={erpPortfolioConfigs}
                  />
                }
                fileName={`${erpPortfolioConfigs?.coverTitle?.toLowerCase().replace(/\s+/g, "-") || "portfolio"}-${new Date().getFullYear()}.pdf`}
              >
                {({ loading }) => (
                  <Button
                    disabled={loading || !pdfReady}
                    className="h-10 bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white font-black uppercase tracking-widest text-[11px] rounded-xl shadow-lg cursor-pointer disabled:opacity-40"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Baixar PDF
                      </>
                    )}
                  </Button>
                )}
              </PDFDownloadLink>
            </div>
          )}
        </div>

        {/* ── Info bar ──────────────────────────────────────────── */}
        {!isLoading && hasImages && (
          <div className="flex items-center gap-3 px-6 py-3 bg-neutral-50 dark:bg-neutral-900/40 border-b border-neutral-100 dark:border-neutral-800">
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
            <span className="text-[11px] font-black uppercase tracking-widest text-neutral-500">
              {favorites.length} imagem{favorites.length !== 1 ? "s" : ""}{" "}
              favorita{favorites.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* ── Conteúdo ────────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-6">
          {showLoader ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <Loader2 className="w-10 h-10 text-neutral-300 animate-spin" />
              <p className="text-[11px] font-black uppercase tracking-widest text-neutral-400">
                {isLoading
                  ? "Carregando biblioteca..."
                  : "Preparando imagens..."}
              </p>
            </div>
          ) : !hasImages ? (
            <div className="flex flex-col items-center justify-center h-full gap-6 text-center max-w-sm mx-auto">
              <div className="w-20 h-20 rounded-3xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <Heart className="w-10 h-10 text-neutral-300" />
              </div>
              <div>
                <h2 className="text-lg font-black uppercase tracking-tighter text-neutral-900 dark:text-white mb-2">
                  Nenhum favorito ainda
                </h2>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  Marque imagens como favoritas na{" "}
                  <a
                    href="/library"
                    className="underline hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    Biblioteca de Mídia
                  </a>{" "}
                  para incluí-las automaticamente no portfólio.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                <ImageIcon className="w-3.5 h-3.5" />
                Apenas imagens são incluídas no portfólio
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {favorites.map((item) => (
                <ImageThumb key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

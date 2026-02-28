"use client";

import {
  Heart,
  Image as ImageIcon,
  Loader2,
  Maximize2,
  Plus,
  Search,
  Trash2,
  Video,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/confirm-modal";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { MediaItem } from "@/hooks/use-media";
import { useDeleteMedia, useMedia, useUpdateMedia } from "@/hooks/use-media";
import { cn } from "@/lib/utils";
import { MediaUploadModal } from "./media-upload-modal";

const MediaCard = ({
  item,
  onToggleFavorite,
  onDelete,
  editingId,
  editName,
  setEditName,
  startEditing,
  saveEdit,
  setEditingId,
  isUpdating,
  onPreview,
}: {
  item: MediaItem;
  onToggleFavorite: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
  editingId: string | null;
  editName: string;
  setEditName: (name: string) => void;
  startEditing: (item: MediaItem) => void;
  saveEdit: () => void;
  setEditingId: (id: string | null) => void;
  isUpdating: boolean;
  onPreview: (item: MediaItem) => void;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="group relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Actions Overlay */}
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <button
          onClick={() => onToggleFavorite(item.id, item.isFavorite)}
          className={cn(
            "p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm transition-colors cursor-pointer",
            item.isFavorite
              ? "text-red-500 bg-white"
              : "text-neutral-600 hover:text-red-500",
          )}
          title={
            item.isFavorite
              ? "Remover dos favoritos"
              : "Adicionado aos favoritos"
          }
        >
          <Heart
            className={cn("w-3.5 h-3.5", item.isFavorite && "fill-current")}
          />
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="p-2 bg-white/90 backdrop-blur-sm hover:bg-red-50 text-red-500 rounded-full shadow-sm transition-colors cursor-pointer"
          title="Excluir"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Thumbnail */}
      <div
        onClick={() => onPreview(item)}
        className="aspect-square relative bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center overflow-hidden cursor-pointer group/thumb"
      >
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800">
            <Loader2 className="w-6 h-6 text-neutral-400 animate-spin" />
          </div>
        )}

        {/* Hover Eye Icon */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/thumb:opacity-100 transition-opacity z-1 flex items-center justify-center">
          <Maximize2 className="w-6 h-6 text-white drop-shadow-lg" />
        </div>

        {item.isFavorite && (
          <div className="absolute top-2 left-2 z-10 pointer-events-none opacity-100 group-hover:opacity-0 transition-opacity">
            <div className="bg-red-500 text-white p-1 rounded-full shadow-lg">
              <Heart className="w-3 h-3 fill-current" />
            </div>
          </div>
        )}
        {item.type === "VIDEO" ? (
          <>
            <video
              src={item.url}
              className={cn(
                "w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity",
                !isLoaded && "opacity-0",
              )}
              muted
              playsInline
              onLoadedData={() => setIsLoaded(true)}
              onMouseOver={(e) => e.currentTarget.play().catch(() => {})}
              onMouseOut={(e) => {
                e.currentTarget.pause();
                e.currentTarget.currentTime = 0;
              }}
            />
            {isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
                <div className="w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center">
                  <Video className="w-5 h-5 text-white" />
                </div>
              </div>
            )}
          </>
        ) : (
          <img
            src={item.url}
            alt={item.name}
            onLoad={() => setIsLoaded(true)}
            className={cn(
              "w-full h-full object-cover group-hover:scale-105 transition-all duration-500",
              !isLoaded ? "opacity-0" : "opacity-100",
            )}
          />
        )}
      </div>

      {/* Footer / Details */}
      <div className="p-3 border-t border-neutral-100 dark:border-neutral-800">
        {editingId === item.id ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              disabled={isUpdating}
              className="w-full text-sm bg-neutral-100 dark:bg-neutral-800 border-none rounded px-2 py-1 focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
              onKeyDown={(e) => {
                if (e.key === "Enter") saveEdit();
                if (e.key === "Escape") setEditingId(null);
              }}
              onBlur={saveEdit}
            />
            {isUpdating && (
              <Loader2 className="w-3 h-3 text-primary animate-spin shrink-0" />
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            <p
              className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate cursor-text hover:text-primary transition-colors select-none"
              title="Clique duas vezes para renomear"
              onDoubleClick={() => startEditing(item)}
            >
              {item.name.includes(".")
                ? item.name.substring(0, item.name.lastIndexOf("."))
                : item.name}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded uppercase font-semibold tracking-wider">
                {item.type}
              </span>
              <span className="text-xs text-neutral-400 tabular-nums">
                {item.size}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function MediaLibraryPage() {
  const { data: mediaItems = [], isLoading } = useMedia();
  const deleteMedia = useDeleteMedia();
  const updateMedia = useUpdateMedia();

  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const filteredItems = mediaItems.filter((item: MediaItem) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const toggleFavorite = async (id: string, current: boolean) => {
    try {
      await updateMedia.mutateAsync({ id, isFavorite: !current });
      toast.success(
        current ? "Removido dos favoritos" : "Adicionado aos favoritos",
      );
    } catch (_error) {
      toast.error("Erro ao atualizar favorito");
    }
  };

  const startEditing = (item: MediaItem) => {
    setEditingId(item.id);
    const nameWithoutExtension = item.name.includes(".")
      ? item.name.substring(0, item.name.lastIndexOf("."))
      : item.name;
    setEditName(nameWithoutExtension);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      const originalItem = mediaItems.find(
        (i: MediaItem) => i.id === editingId,
      );
      if (!originalItem) {
        setEditingId(null);
        return;
      }

      const extension = originalItem.name.includes(".")
        ? originalItem.name.substring(originalItem.name.lastIndexOf("."))
        : "";

      const newFullName = editName.trim() + extension;

      if (editName.trim() && newFullName !== originalItem.name) {
        await updateMedia.mutateAsync({ id: editingId, name: newFullName });
        toast.success("Nome atualizado com sucesso");
      }
      setEditingId(null);
    } catch (_error) {
      toast.error("Erro ao renomear arquivo");
    }
  };

  const handleDelete = (id: string) => {
    setPendingDeleteId(id);
    setConfirmDeleteOpen(true);
  };

  const executeDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await deleteMedia.mutateAsync(pendingDeleteId);
      toast.success("Arquivo excluído com sucesso");
      setConfirmDeleteOpen(false);
    } catch (_error) {
      toast.error("Erro ao excluir arquivo");
    }
  };

  return (
    <main className="flex flex-col gap-8 h-full p-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-bold text-3xl tracking-tight text-neutral-900 dark:text-neutral-100">
            Biblioteca de Mídia
          </h1>
          <p className="text-neutral-500 mt-1">
            Gerencie suas fotos e vídeos do projeto
          </p>
        </div>

        <div className="flex gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Buscar arquivos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-full md:w-64"
            />
          </div>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-sm active:scale-95 duration-200 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar</span>
          </button>
        </div>
      </div>

      <MediaUploadModal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
      />

      {/* Media Preview Modal */}
      <Dialog
        open={!!selectedMedia}
        onOpenChange={(open) => !open && setSelectedMedia(null)}
      >
        <DialogContent
          showCloseButton={false}
          className="w-auto max-w-[95vw] h-auto max-h-[95vh] p-0 bg-transparent border-none shadow-none text-white flex items-center justify-center outline-none"
        >
          <DialogTitle className="sr-only">
            Visualização de{" "}
            {selectedMedia?.type === "VIDEO" ? "Vídeo" : "Imagem"}
          </DialogTitle>

          {/* Botão de fechar fixo no canto da tela */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelectedMedia(null);
            }}
            className="fixed top-10 right-10 z-100 p-2 text-white hover:text-white/80 hover:scale-110 active:scale-95 transition-all cursor-pointer select-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] outline-none"
          >
            <X className="w-10 h-10" />
            <span className="sr-only">Fechar</span>
          </button>

          <div className="relative w-fit h-fit flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl pointer-events-auto">
            {selectedMedia?.type === "VIDEO" ? (
              <video
                src={selectedMedia.url}
                controls
                autoPlay
                className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain shadow-2xl"
              />
            ) : (
              <img
                src={selectedMedia?.url}
                alt={selectedMedia?.name}
                className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain shadow-2xl"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-neutral-500 mt-4 font-bold uppercase tracking-widest text-[10px]">
            Carregando biblioteca...
          </p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/20">
          <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
            <ImageIcon className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
            Nenhum arquivo encontrado
          </h3>
          <p className="text-neutral-500 mt-1 text-center max-w-sm">
            {searchQuery
              ? "Tente buscar por outro termo."
              : "Comece adicionando imagens ou vídeos à sua biblioteca."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredItems.map((item: MediaItem) => (
            <MediaCard
              key={item.id}
              item={item}
              onToggleFavorite={toggleFavorite}
              onDelete={handleDelete}
              editingId={editingId}
              editName={editName}
              setEditName={setEditName}
              startEditing={startEditing}
              saveEdit={saveEdit}
              setEditingId={setEditingId}
              isUpdating={updateMedia.isPending}
              onPreview={setSelectedMedia}
            />
          ))}
        </div>
      )}

      <ConfirmModal
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        onConfirm={executeDelete}
        title="Excluir Arquivo?"
        description="Esta ação removerá permanentemente o arquivo da sua biblioteca de mídia."
      />
    </main>
  );
}

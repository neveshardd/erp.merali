"use client";

import { AlertTriangle, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "danger";
}

export function ConfirmModal({
  open,
  onOpenChange,
  onConfirm,
  title = "Você tem certeza?",
  description = "Esta ação não pode ser desfeita.",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "danger",
}: ConfirmModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="p-0 overflow-hidden border-none shadow-2xl rounded-3xl sm:max-w-[400px]">
        <div
          className={cn(
            "p-8 flex flex-col items-center text-center gap-4",
            variant === "danger"
              ? "bg-red-50 dark:bg-red-500/5"
              : "bg-neutral-50 dark:bg-neutral-800/50",
          )}
        >
          <div
            className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center transition-transform hover:scale-110",
              variant === "danger"
                ? "bg-red-100 dark:bg-red-500/10 text-red-600"
                : "bg-neutral-200 dark:bg-neutral-800 text-neutral-600",
            )}
          >
            {variant === "danger" ? (
              <Trash2 className="w-8 h-8" />
            ) : (
              <AlertTriangle className="w-8 h-8" />
            )}
          </div>

          <div>
            <AlertDialogTitle className="text-xl font-black uppercase tracking-tighter mb-2">
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest leading-relaxed">
              {description}
            </AlertDialogDescription>
          </div>
        </div>

        <AlertDialogFooter className="p-6 bg-white dark:bg-neutral-900 flex flex-col sm:flex-row gap-3">
          <AlertDialogCancel className="flex-1 h-12 rounded-xl border-neutral-100 dark:border-neutral-800 font-bold uppercase tracking-widest text-[10px] hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all cursor-pointer">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            className={cn(
              "flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-none cursor-pointer transition-all active:scale-95",
              variant === "danger"
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-neutral-900 dark:bg-white dark:text-neutral-900 text-white hover:bg-neutral-800",
            )}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

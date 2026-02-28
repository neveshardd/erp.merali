"use client";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContractPDFDocument } from "./document";

export default function PdfButton({
  data,
  fileName,
  variant = "default",
  className = "bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 text-white gap-2 font-bold uppercase tracking-widest text-[10px] h-9 cursor-pointer",
}: any) {
  return (
    <PDFDownloadLink
      document={<ContractPDFDocument data={data} />}
      fileName={fileName}
    >
      {({ loading }: any) => (
        <Button
          disabled={loading}
          variant={variant as any}
          className={className}
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-4 mr-2 animate-spin" /> Gerando...
            </>
          ) : (
            <>
              <Download className="w-3.5 h-4 mr-2" /> Baixar PDF
            </>
          )}
        </Button>
      )}
    </PDFDownloadLink>
  );
}

"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  ArrowLeft,
  Box,
  CheckSquare,
  Clock,
  Download,
  Info,
  Layout,
  Loader2,
  Printer,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import { ServiceOrderPDFDocument } from "./document";

function useServiceOrder(id: string) {
  return useQuery({
    queryKey: ["service-order", id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/budgets/${id}/os`);
      return data;
    },
    enabled: !!id,
  });
}

export default function ServiceOrderPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: os, isLoading } = useServiceOrder(id);

  // State for interactive checkboxes
  const [checkedSteps, setCheckedSteps] = useState<
    Record<string, Record<string, boolean>>
  >({});
  const [checkedQI, setCheckedQI] = useState<Record<number, boolean>>({});

  const toggleStep = (itemId: string, step: string) => {
    setCheckedSteps((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [step]: !prev[itemId]?.[step],
      },
    }));
  };

  const toggleQI = (index: number) => {
    setCheckedQI((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handlePrint = () => window.print();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-neutral-400 animate-spin" />
          <p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">
            Gerando Ordem de Serviço...
          </p>
        </div>
      </div>
    );
  }

  if (!os) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">
          Ordem de Serviço não encontrada.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 p-4 md:p-8 pb-20 print:p-0 print:bg-white print:min-h-0">
      {/* Toolbar */}
      <div className="max-w-[21cm] mx-auto mb-8 flex justify-between items-center print:hidden">
        <Link
          href={`/budgets/${id}`}
          className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors font-bold uppercase tracking-widest text-[10px]"
        >
          <ArrowLeft className="w-3 h-3" /> Voltar ao Projeto
        </Link>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handlePrint}
            className="gap-2 font-bold uppercase tracking-widest text-[10px] h-9 border-neutral-200 dark:border-neutral-800 cursor-pointer"
          >
            <Printer className="w-3.5 h-4" /> Imprimir
          </Button>

          <PDFDownloadLink
            key={JSON.stringify(checkedSteps) + JSON.stringify(checkedQI)}
            document={
              <ServiceOrderPDFDocument
                data={os}
                checkedSteps={checkedSteps}
                checkedQI={checkedQI}
              />
            }
            fileName={`${os.number}.pdf`}
          >
            {({ loading }) => (
              <Button
                disabled={loading}
                className="bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 text-white gap-2 font-bold uppercase tracking-widest text-[10px] h-9 cursor-pointer"
              >
                <Download className="w-3.5 h-4" />
                {loading ? "Gerando..." : "Baixar PDF"}
              </Button>
            )}
          </PDFDownloadLink>
        </div>
      </div>

      {/* A4 Paper */}
      <div className="max-w-[21cm] mx-auto bg-white shadow-2xl print:shadow-none min-h-[29.7cm] p-[1.5cm] flex flex-col gap-8 text-neutral-900 relative">
        {/* Header */}
        <header className="flex justify-between items-center border-b-4 border-neutral-900 pb-6">
          <div className="flex flex-col gap-2">
            <Image
              src="/logo.png"
              alt="Merali Logo"
              width={80}
              height={80}
              className="rounded-xl"
            />
            <h1 className="text-2xl font-black uppercase tracking-tighter mt-2">
              Ordem de Serviço
            </h1>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                Status
              </span>
              <span className="text-sm font-black uppercase">PRODUÇÃO</span>
            </div>
            <span className="text-sm font-black mt-2 tracking-tighter">
              {os.number}
            </span>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              Emissão: {os.date}
            </span>
          </div>
        </header>

        {/* Technical Details Grid */}
        <div className="grid grid-cols-3 gap-6">
          <div className="p-4 bg-neutral-50 border border-neutral-100 rounded-xl flex flex-col gap-2">
            <div className="flex items-center gap-2 text-neutral-400">
              <Box className="w-3 h-3" />
              <span className="text-[9px] font-black uppercase tracking-widest">
                Projeto
              </span>
            </div>
            <span className="text-xs font-black uppercase leading-tight truncate">
              {os.project}
            </span>
          </div>
          <div className="p-4 bg-neutral-50 border border-neutral-100 rounded-xl flex flex-col gap-2">
            <div className="flex items-center gap-2 text-neutral-400">
              <User className="w-3 h-3" />
              <span className="text-[9px] font-black uppercase tracking-widest">
                Cliente
              </span>
            </div>
            <span className="text-xs font-black uppercase leading-tight truncate">
              {os.client}
            </span>
          </div>
          <div className="p-4 bg-neutral-50 border border-neutral-100 rounded-xl flex flex-col gap-2 border-l-4 border-l-red-500">
            <div className="flex items-center gap-2 text-neutral-400">
              <Clock className="w-3 h-3" />
              <span className="text-[9px] font-black uppercase tracking-widest">
                Prazo Final
              </span>
            </div>
            <span className="text-xs font-black uppercase leading-tight text-red-600">
              {os.deadline}
            </span>
          </div>
        </div>

        {/* Production Items */}
        <div className="flex flex-col gap-4">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 pb-2 flex items-center gap-2">
            <Layout className="w-3 h-3" /> Itens de Produção & Briefing (
            {os.items.length})
          </h2>
          <div className="flex flex-col gap-4">
            {os.items.map((item: any, i: number) => (
              <div
                key={i}
                className="border border-neutral-200 rounded-xl overflow-hidden shadow-sm"
              >
                <div className="bg-neutral-900 text-white p-3 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black bg-white/20 px-2 py-0.5 rounded">
                      #{item.id}
                    </span>
                    <span className="text-xs font-black uppercase tracking-tight">
                      {item.description}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest opacity-60 bg-white/10 px-2 py-1 rounded">
                    {item.type} | {item.complexity}
                  </span>
                </div>
                <div className="p-4 flex flex-col gap-3">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col gap-1 min-w-[120px] p-2 bg-neutral-50 rounded-lg">
                      <span className="text-[8px] font-black uppercase text-neutral-400 tracking-widest">
                        Tempo Estimado
                      </span>
                      <span className="text-sm font-black tabular-nums">
                        {Number(item.hours).toFixed(1)}h{" "}
                        {item.quantity > 1 ? `(x${item.quantity})` : ""}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                      <span className="text-[8px] font-black uppercase text-neutral-400 tracking-widest">
                        Notas Técnicas / Requisitos
                      </span>
                      <p className="text-[10px] font-medium text-neutral-600 uppercase leading-relaxed text-justify">
                        {item.notes}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 pt-3 border-t border-neutral-100 grid grid-cols-4 gap-4">
                    {["Modelagem", "Materiais", "Iluminação", "Pós"].map(
                      (p) => (
                        <button
                          key={p}
                          onClick={() => toggleStep(item.id, p)}
                          className="flex items-center gap-2 group cursor-pointer hover:opacity-80 transition-opacity"
                        >
                          <div
                            className={`w-4 h-4 border-2 rounded shrink-0 transition-colors flex items-center justify-center ${checkedSteps[item.id]?.[p]
                                ? "bg-neutral-900 border-neutral-900"
                                : "border-neutral-200"
                              }`}
                          >
                            {checkedSteps[item.id]?.[p] && (
                              <div className="w-1.5 h-1.5 bg-white rounded-full" />
                            )}
                          </div>
                          <span
                            className={`text-[8px] font-black uppercase tracking-tighter ${checkedSteps[item.id]?.[p]
                                ? "text-neutral-900"
                                : "text-neutral-400"
                              }`}
                          >
                            {p}
                          </span>
                        </button>
                      ),
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workflow Checklist */}
        <div className="grid grid-cols-2 gap-8 mt-auto">
          <div className="flex flex-col gap-4">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 pb-2 flex items-center gap-2">
              <CheckSquare className="w-3 h-3" /> Checklist de Qualidade (QI)
            </h2>
            <div className="flex flex-col gap-3">
              {[
                "Verificação de proporções e escalas reais",
                "Otimização de Geometria e Polígonos",
                "Materiais PBR e texturas de alta definição",
                "Iluminação (HDRi + Lights) balanceada",
                "Canal de Render Elements p/ Pós-produção",
              ].map((check, i) => (
                <button
                  key={i}
                  onClick={() => toggleQI(i)}
                  className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div
                    className={`w-4 h-4 border-2 rounded shrink-0 transition-colors flex items-center justify-center ${checkedQI[i]
                        ? "bg-neutral-900 border-neutral-900"
                        : "border-neutral-200"
                      }`}
                  >
                    {checkedQI[i] && (
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-tight transition-colors ${checkedQI[i] ? "text-neutral-900" : "text-neutral-600"
                      }`}
                  >
                    {check}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 pb-2 flex items-center gap-2">
              <Info className="w-3 h-3" /> Resumo de Gestão Produção
            </h2>
            <div className="flex flex-col gap-4 p-4 bg-neutral-50 border border-neutral-100 rounded-xl">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                <span className="text-neutral-400 tracking-widest">
                  Responsável
                </span>
                <span className="text-neutral-900">{os.manager}</span>
              </div>
              <div className="w-full h-px bg-neutral-200"></div>
              <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                <span className="text-neutral-400 tracking-widest">
                  Capacidade Total
                </span>
                <span className="text-xl font-black tabular-nums tracking-tighter">
                  {Number(os.totalHours).toFixed(1)}h de produção
                </span>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-4">
              <div className="w-full h-12 border border-dashed border-neutral-300 rounded flex items-center justify-center bg-neutral-50/30">
                <span className="text-[8px] font-bold text-neutral-300 uppercase tracking-widest">
                  Visto da Coordenação
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer OS */}
        <footer className="mt-12 pt-8 border-t border-neutral-100 flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-black text-neutral-400 uppercase tracking-[0.2em]">
              {os.studio?.name || "Merali Studio"} | Internal Pipeline v2.0
            </span>
            <span className="text-[7px] text-neutral-300 uppercase font-medium">
              Este documento é de uso interno. Informações confidenciais.
            </span>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-1 group">
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></div>
              <span className="text-[8px] font-black text-red-600 uppercase tracking-widest">
                Alta Prioridade
              </span>
            </div>
            <span className="text-[8px] font-bold text-neutral-300 uppercase tracking-widest">
              Documento ID: {id.slice(0, 8).toUpperCase()}
            </span>
          </div>
        </footer>

        {/* Side Tag */}
        <div className="absolute top-0 left-0 w-2 h-40 bg-neutral-900 print:hidden"></div>
      </div>

      <style>{`
                @media print {
                    body { 
                        background: white !important; 
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .print\\:hidden { display: none !important; }
                    main { padding: 0 !important; }
                    .animate-pulse { animation: none !important; }
                    nav, aside, header.main-header { display: none !important; }
                }
            `}</style>
    </div>
  );
}

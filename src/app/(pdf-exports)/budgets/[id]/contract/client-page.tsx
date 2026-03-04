"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ArrowLeft, Download, Loader2, Printer } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

import { ContractPDFDocument } from "./document";

function useContract(id: string) {
  return useQuery({
    queryKey: ["contract", id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/budgets/${id}/contract`);
      return data;
    },
    enabled: !!id,
  });
}

export default function ContractPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: contract, isLoading } = useContract(id);

  const handlePrint = () => window.print();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-neutral-400 animate-spin" />
          <p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">
            Gerando Contrato...
          </p>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">
          Contrato não encontrado.
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
            document={<ContractPDFDocument data={contract} />}
            fileName={`${contract.number} - ${contract.project}.pdf`}
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
      <div className="max-w-[21cm] mx-auto bg-white shadow-2xl print:shadow-none min-h-[29.7cm] p-[2.5cm] flex flex-col gap-8 text-neutral-900 text-justify font-serif">
        {/* Header */}
        <header className="flex flex-col items-center gap-6 border-b border-neutral-100 pb-12 mb-4 font-sans">
          <Image
            src="/logo.png"
            alt="Merali Logo"
            width={60}
            height={60}
            className="rounded-xl"
          />
          <div className="text-center">
            <h1 className="text-2xl font-black uppercase tracking-tighter">
              Instrumento Particular de Prestação de Serviços
            </h1>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mt-2">
              Contrato Nº {contract.number}
            </p>
          </div>
        </header>

        {/* Clauses */}
        <div className="flex flex-col gap-6 text-sm leading-relaxed">
          <section>
            <h2 className="font-bold text-neutral-900 mb-2 uppercase font-sans text-xs tracking-wider border-b border-neutral-50 pb-1">
              1. DAS PARTES
            </h2>
            <p>
              <strong>CONTRATADA:</strong> {contract.contractor.name}, inscrita
              no CNPJ sob o nº {contract.contractor.cnpj}, com sede em{" "}
              {contract.contractor.address}, neste ato representada por{" "}
              {contract.contractor.representative}.
            </p>
            <p className="mt-2">
              <strong>CONTRATANTE:</strong> {contract.client.name},{" "}
              {contract.client.company
                ? `pela empresa ${contract.client.company}`
                : ""}
              ,{" "}
              {contract.client.cnpj
                ? `inscrita no CPF/CNPJ sob o nº ${contract.client.cnpj}`
                : ""}
              , com sede em {contract.client.address}.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-neutral-900 mb-2 uppercase font-sans text-xs tracking-wider border-b border-neutral-50 pb-1">
              2. DO OBJETO
            </h2>
            <p>
              O presente contrato tem como objeto a prestação de serviços de
              visualização arquitetônica 3D para o projeto{" "}
              <strong>"{contract.project}"</strong>, conforme especificações
              técnicas detalhadas no orçamento aprovado.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-neutral-900 mb-2 uppercase font-sans text-xs tracking-wider border-b border-neutral-50 pb-1">
              3. DOS PRAZOS
            </h2>
            <p>
              A CONTRATADA compromete-se a entregar as imagens no prazo acordado
              de <strong>{contract.deadline || "Prazo a definir"}</strong>,
              contados a partir do recebimento de todo o material técnico
              (modelos, referências, plantas) e da confirmação do pagamento{" "}
              {contract.paymentTerms === "HALF_HALF" ? "do sinal" : "integral"}.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-neutral-900 mb-2 uppercase font-sans text-xs tracking-wider border-b border-neutral-50 pb-1">
              4. DO VALOR E PAGAMENTO
            </h2>
            <p>
              Pelo serviço objeto deste contrato, a CONTRATANTE pagará à
              CONTRATADA o valor total de{" "}
              <strong>{formatCurrency(contract.value)}</strong>, distribuído da
              seguinte forma:
            </p>
            <ul className="list-none flex flex-col gap-2 mt-4 px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-lg">
              {contract.installments.map((ins: any, i: number) => (
                <li
                  key={i}
                  className="flex justify-between items-center text-[10px] font-bold uppercase"
                >
                  <span className="text-neutral-500">{ins.desc}</span>
                  <div className="flex gap-4">
                    <span className="text-neutral-400">
                      Vencimento: {ins.date}
                    </span>
                    <span className="text-neutral-900 shrink-0 min-w-[100px] text-right">
                      {formatCurrency(ins.value)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-neutral-900 mb-2 uppercase font-sans text-xs tracking-wider border-b border-neutral-50 pb-1">
              5. DAS RESPONSABILIDADES
            </h2>
            <p>
              É de inteira responsabilidade da CONTRATANTE o fornecimento de
              arquivos técnicos precisos. Alterações estruturais no projeto após
              o início da modelagem ou renderização poderão acarretar em custos
              adicionais e prorrogação de prazos, a serem negociados entre as
              partes.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-neutral-900 mb-2 uppercase font-sans text-xs tracking-wider border-b border-neutral-50 pb-1">
              6. DO FORO
            </h2>
            <p>
              Para dirimir quaisquer questões oriundas deste contrato, as partes
              elegem o Foro da Comarca de São Paulo/SP, com renúncia a qualquer
              outro, por mais privilegiado que seja.
            </p>
          </section>
        </div>

        {/* Signatures */}
        <div className="mt-20 grid grid-cols-2 gap-20 font-sans">
          <div className="flex flex-col items-center gap-2">
            <div className="w-full h-px bg-neutral-200 mb-2"></div>
            <span className="text-[10px] font-black uppercase text-neutral-900">
              {contract.contractor.name}
            </span>
            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
              Contratada
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-full h-px bg-neutral-200 mb-2"></div>
            <span className="text-[10px] font-black uppercase text-neutral-900">
              {contract.client.name}
            </span>
            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
              Contratante
            </span>
          </div>
        </div>

        <footer className="mt-auto pt-8 border-t border-neutral-100 flex justify-between items-center font-sans">
          <span className="text-[8px] font-bold text-neutral-300 uppercase tracking-widest">
            São Paulo, {contract.date}
          </span>
          <span className="text-[8px] font-bold text-neutral-300 uppercase tracking-widest">
            Pág 01/01
          </span>
        </footer>
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
                    nav, aside, header.main-header { display: none !important; }
                }
            `}</style>
    </div>
  );
}

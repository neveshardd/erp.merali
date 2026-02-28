import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const budget = await prisma.budget.findUnique({
      where: { id },
      include: {
        client: true,
        variableCosts: true,
      },
    });

    if (!budget) {
      return NextResponse.json(
        { error: "Orçamento não encontrado" },
        { status: 404 },
      );
    }

    const totalVariableCosts = budget.variableCosts.reduce(
      (s, c) => s + c.value,
      0,
    );
    const total = budget.totalValue + totalVariableCosts;

    const dateFormatted = format(new Date(), "dd 'de' MMMM, yyyy", {
      locale: ptBR,
    });
    const number = `CTR-${format(budget.createdAt, "yyyy")}-${id.slice(-4).toUpperCase()}`;

    return NextResponse.json({
      number,
      date: dateFormatted,
      contractor: {
        name: "MERALI STUDIO DE VISUALIZACAO LTDA",
        cnpj: "50.123.456/0001-00",
        address: "Rua Exemplo, 123 - São Paulo, SP",
        representative: "Jose Eugenio Neves Nunes",
      },
      client: {
        name: budget.client.name,
        company: budget.client.company || "",
        cnpj: budget.client.taxId || "",
        address: "Endereço não cadastrado", // Needs schema update if wanted
      },
      project: budget.projectName,
      value: total,
      installments: [
        { desc: "Entrada 50% (Sinal)", value: total * 0.5, date: "Aprovação" },
        {
          desc: "Entrega Final 50%",
          value: total * 0.5,
          date: budget.deadline || "A combinar",
        },
      ],
    });
  } catch (error) {
    console.error("[CONTRACT_GET]", error);
    return NextResponse.json(
      { error: "Erro ao carregar contrato" },
      { status: 500 },
    );
  }
}

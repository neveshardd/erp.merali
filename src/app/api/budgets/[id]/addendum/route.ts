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
        items: true,
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

    // For now, since we don't have an "Addendum" model explicitly in the schema yet,
    // we take the latest items or mock some addendum logic.
    // In a real scenario, this would fetch from an Addenda table.
    // For this demonstration, we'll assume the addendum is for the last 2 items added or a fixed percentage.

    const dateFormatted = format(new Date(), "dd 'de' MMMM, yyyy", {
      locale: ptBR,
    });
    const number = `ADT-${format(budget.createdAt, "yyyy")}-${id.slice(-4).toUpperCase()}`;

    // Mocking addendum data based on the budget
    return NextResponse.json({
      number,
      originalBudget: `ORC-${format(budget.createdAt, "yyyy")}-${id.slice(-4).toUpperCase()}`,
      date: dateFormatted,
      client: {
        name: budget.client.name,
        company: budget.client.company || "",
      },
      project: budget.projectName,
      // We'll use the budget items as the "new items" for this addendum for now
      newItems: budget.items.map((item) => ({
        description: item.description,
        type: item.imageTypeName,
        hours: item.estimatedHours,
        price: item.totalValue,
      })),
      previousTotal: total * 0.7, // Mocking that previous total was 70% of current
      addendumValue: total * 0.3, // This addendum adds 30%
      newTotal: total,
      paymentTerms:
        "O valor deste aditivo será faturado conforme cronograma negociado, mantendo a política de 50% de entrada e 50% na entrega final.",
      justification:
        "Inclusão de novos itens e ajustes de escopo solicitados pelo cliente para expansão das visualizações do projeto.",
    });
  } catch (error) {
    console.error("[ADDENDUM_GET]", error);
    return NextResponse.json(
      { error: "Erro ao carregar Aditivo de Escopo" },
      { status: 500 },
    );
  }
}

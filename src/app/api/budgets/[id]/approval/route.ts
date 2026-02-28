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
      },
    });

    if (!budget) {
      return NextResponse.json(
        { error: "Orçamento não encontrado" },
        { status: 404 },
      );
    }

    const dateFormatted = format(new Date(), "dd 'de' MMMM, yyyy", {
      locale: ptBR,
    });
    const number = `APR-${format(budget.createdAt, "yyyy")}-${id.slice(-4).toUpperCase()}`;

    return NextResponse.json({
      number,
      date: dateFormatted,
      client: {
        name: budget.client.name,
        company: budget.client.company || "",
      },
      project: budget.projectName,
      itemsDelivered: budget.items.map((item) => ({
        description: item.description,
        status: "Aprovado",
      })),
      completionDate: format(new Date(), "dd/MM/yyyy"),
      rating: 5,
    });
  } catch (error) {
    console.error("[APPROVAL_GET]", error);
    return NextResponse.json(
      { error: "Erro ao carregar Aprovação Final" },
      { status: 500 },
    );
  }
}

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
        items: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!budget) {
      return NextResponse.json(
        { error: "Orçamento não encontrado" },
        { status: 404 },
      );
    }

    const totalHours = budget.items.reduce(
      (s, i) => s + i.estimatedHours * i.quantity,
      0,
    );
    const dateFormatted = format(new Date(), "dd 'de' MMMM, yyyy", {
      locale: ptBR,
    });
    const number = `OS-${format(budget.createdAt, "yyyy")}-${id.slice(-4).toUpperCase()}`;

    return NextResponse.json({
      number,
      date: dateFormatted,
      deadline: budget.deadline || "Prazo a definir",
      priority: budget.status === "APPROVED" ? "Normal" : "Alta",
      project: budget.projectName,
      client: budget.client.name,
      manager: "Equipe Merali",
      totalHours,
      items: budget.items.map((item, idx) => ({
        id: (idx + 1).toString().padStart(2, "0"),
        description: item.description,
        type: item.imageTypeName,
        complexity: item.difficultyName,
        hours: item.estimatedHours,
        quantity: item.quantity,
        notes:
          "Focar em referências de materiais e iluminação realista conforme briefing.",
      })),
      // Future-proofing for external links and workflow steps
      links: [],
      workflow: [
        { step: "Modelagem 3D", status: "Pendente" },
        { step: "Iluminação & Texturização", status: "Pendente" },
        { step: "Renderização", status: "Pendente" },
        { step: "Pós-Produção", status: "Pendente" },
      ],
    });
  } catch (error) {
    console.error("[OS_GET]", error);
    return NextResponse.json(
      { error: "Erro ao carregar Ordem de Serviço" },
      { status: 500 },
    );
  }
}

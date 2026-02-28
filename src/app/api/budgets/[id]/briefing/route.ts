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
      },
    });

    if (!budget) {
      return NextResponse.json(
        { error: "Orçamento não encontrado" },
        { status: 404 },
      );
    }

    // Try to find an existing briefing for this budget
    // We check for TECHNICAL briefings that have this budgetId in their JSON content
    const briefing = await prisma.briefing.findFirst({
      where: {
        type: "TECHNICAL",
        content: {
          path: ["budgetId"],
          equals: id,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const dateFormatted = format(new Date(), "dd 'de' MMMM, yyyy", {
      locale: ptBR,
    });
    const number = `BRF-${format(budget.createdAt, "yyyy")}-${id.slice(-4).toUpperCase()}`;

    // If no briefing exists yet, we return a draft/default structure
    // This allows the preview page to show empty fields that can be filled by the client
    return NextResponse.json({
      id: briefing?.id,
      number,
      date: dateFormatted,
      client: {
        name: budget.client.name,
        company: budget.client.company || "",
      },
      project: budget.projectName,
      // Briefing data from JSON content or defaults
      format: (briefing?.content as any)?.format || "",
      links: (briefing?.content as any)?.links || [],
      mood: (briefing?.content as any)?.mood || "",
      lightingNotes: (briefing?.content as any)?.lightingNotes || "",
      materialsNotes: (briefing?.content as any)?.materialsNotes || "",
      status: briefing?.status || "Pendente",
      updatedAt: briefing?.updatedAt
        ? format(briefing.updatedAt, "dd/MM/yyyy")
        : null,
    });
  } catch (error) {
    console.error("[BRIEFING_GET]", error);
    return NextResponse.json(
      { error: "Erro ao carregar Briefing Técnico" },
      { status: 500 },
    );
  }
}

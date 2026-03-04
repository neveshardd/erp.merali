import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStudioConfigs } from "@/lib/configs";

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
        variableCosts: {
          orderBy: { date: "desc" },
        },
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

    // Compute code and formatted dates
    const code = `ORC-${format(budget.createdAt, "yyyy")}-${id.slice(-4).toUpperCase()}`;
    const dateFormatted = format(budget.createdAt, "dd 'de' MMMM, yyyy", {
      locale: ptBR,
    });

    // Validity: 7 days from creation
    const validUntil = new Date(budget.createdAt);
    validUntil.setDate(validUntil.getDate() + 7);
    const validUntilFormatted = format(validUntil, "dd 'de' MMMM, yyyy", {
      locale: ptBR,
    });

    const studio = await getStudioConfigs();

    return NextResponse.json({
      id: budget.id,
      code,
      date: dateFormatted,
      validUntil: validUntilFormatted,
      projectName: budget.projectName,
      category: budget.category,
      deadline: budget.deadline,
      status: budget.status,
      paymentTerms: (budget as any).paymentTerms,
      totalValue: budget.totalValue,
      clientTypeName: budget.clientTypeName,
      studio,
      client: {
        name: budget.client.name,
        company: budget.client.company || "",
        email: budget.client.email || "",
        phone: budget.client.phone || "",
        taxId: budget.client.taxId || "",
      },
      items: budget.items.map((item) => ({
        id: item.id,
        description: item.description,
        quantity: item.quantity,
        unitValue: item.unitValue,
        totalValue: item.totalValue,
      })),
      variableCosts: budget.variableCosts.map((vc) => ({
        id: vc.id,
        description: vc.description,
        value: vc.value,
        date: format(vc.date, "dd/MM/yyyy", { locale: ptBR }),
      })),
    });
  } catch (error) {
    console.error("[BUDGET_PDF_GET]", error);
    return NextResponse.json(
      { error: "Erro ao gerar dados do PDF" },
      { status: 500 },
    );
  }
}

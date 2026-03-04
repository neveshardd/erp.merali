import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { budgetSchema } from "@/schemas/budget";

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
        items: { orderBy: { createdAt: "asc" } },
        invoices: { orderBy: { createdAt: "asc" } },
      },
    });

    if (!budget) {
      return NextResponse.json(
        { error: "Orçamento não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(budget);
  } catch (error) {
    console.error("[BUDGET_GET]", error);
    return NextResponse.json(
      { error: "Erro ao buscar orçamento" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = budgetSchema.partial().parse(body);

    const { clientId, ...data } = validatedData;
    const budget = await prisma.budget.update({
      where: { id },
      data: {
        ...data,
        ...(clientId ? { client: { connect: { id: clientId } } } : {}),
      },
      include: {
        client: true,
      },
    });

    return NextResponse.json(budget);
  } catch (error) {
    console.error("[BUDGET_PATCH]", error);
    return NextResponse.json(
      { error: "Erro ao atualizar orçamento" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await prisma.budget.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[BUDGET_DELETE]", error);
    return NextResponse.json(
      { error: "Erro ao excluir orçamento" },
      { status: 500 },
    );
  }
}

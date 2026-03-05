import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { budgetSchema } from "@/schemas/budget";
import { sendEmail } from "@/lib/resend";

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

    // Get old budget to check status change
    const oldBudget = await prisma.budget.findUnique({
      where: { id },
    });

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

    // topic 5: Send email if status changed to APPROVED
    if (oldBudget?.status !== "APPROVED" && budget.status === "APPROVED" && budget.client?.email) {
      try {
        await sendEmail({
          to: budget.client.email,
          subject: "Seu Projeto foi Aprovado! - Merali Studio",
          templateId: process.env.RESEND_TEMPLATE_PROJECT_STARTED,
          data: {
            clientName: budget.client.name,
            projectName: budget.projectName,
            bioName: "Jose Eugenio",
            bioImage: `${process.env.NEXT_PUBLIC_APP_URL || "https://erp.merali.com.br"}/avatars/shadcn.jpg`,
          },
        });
      } catch (emailErr) {
        console.error("Non-fatal budget email error:", emailErr);
      }
    }

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

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { budgetSchema } from "@/schemas/budget";

export async function GET() {
  try {
    const budgets = await prisma.budget.findMany({
      include: {
        client: {
          select: {
            name: true,
            company: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(budgets);
  } catch (error) {
    console.error("[BUDGETS_GET]", error);
    return NextResponse.json(
      { error: "Erro ao buscar orçamentos" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = budgetSchema.parse(body);

    // Calculate default hourly rate based on operational costs
    const [fixedCosts, variableCosts] = await Promise.all([
      prisma.fixedCost.findMany(),
      prisma.variableCost.findMany({ where: { budgetId: null } }),
    ]);

    const totalFixed = fixedCosts.reduce((acc, c) => acc + c.value, 0);
    const totalVariable = variableCosts.reduce((acc, c) => acc + c.value, 0);
    const totalOperational = totalFixed + totalVariable;

    // Default base hours (can be changed later in UI)
    const defaultBaseHours = 140;
    const calculatedHourlyRate =
      defaultBaseHours > 0 ? totalOperational / defaultBaseHours : 0;

    const budget = await prisma.budget.create({
      data: {
        ...validatedData,
        hourlyRate: calculatedHourlyRate,
        baseHours: defaultBaseHours,
      },
      include: {
        client: true,
      },
    });

    return NextResponse.json(budget);
  } catch (error) {
    console.error("[BUDGETS_POST]", error);
    return NextResponse.json(
      { error: "Erro ao criar orçamento" },
      { status: 500 },
    );
  }
}

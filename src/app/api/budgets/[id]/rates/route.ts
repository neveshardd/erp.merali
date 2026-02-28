import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const ratesSchema = z.object({
  baseHours: z.number().min(1),
  hourlyRate: z.number().min(0),
  profitMargin: z.number().min(0).max(100),
  multiplier: z.number().min(0),
});

// GET current rates for this budget
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const budget = await prisma.budget.findUnique({
      where: { id },
      select: {
        baseHours: true,
        hourlyRate: true,
        profitMargin: true,
        multiplier: true,
      },
    });
    if (!budget)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(budget);
  } catch (_error) {
    return NextResponse.json(
      { error: "Erro ao buscar taxas" },
      { status: 500 },
    );
  }
}

// PATCH update rates and recalculate all items
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { baseHours, hourlyRate, profitMargin, multiplier } =
      ratesSchema.parse(body);

    // Update budget rates
    await prisma.budget.update({
      where: { id },
      data: { baseHours, hourlyRate, profitMargin, multiplier },
    });

    // Recalculate all items based on new rates
    const items = await prisma.budgetItem.findMany({ where: { budgetId: id } });
    let total = 0;
    for (const item of items) {
      // unitValue = baseHoursUnit * difficultyMultiplier * hourlyRate * multiplier * (1 + profitMargin/100)
      const unitValue =
        item.baseHoursUnit *
        item.difficultyMultiplier *
        hourlyRate *
        multiplier *
        (1 + profitMargin / 100);
      const totalValue = unitValue * item.quantity;
      total += totalValue;
      await prisma.budgetItem.update({
        where: { id: item.id },
        data: {
          unitValue: parseFloat(unitValue.toFixed(2)),
          totalValue: parseFloat(totalValue.toFixed(2)),
          estimatedHours: item.baseHoursUnit * item.difficultyMultiplier,
        },
      });
    }

    await prisma.budget.update({
      where: { id },
      data: { totalValue: parseFloat(total.toFixed(2)) },
    });

    return NextResponse.json({ success: true, totalValue: total });
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("[BUDGET_RATES_PATCH]", error);
    return NextResponse.json(
      { error: "Erro ao atualizar taxas" },
      { status: 500 },
    );
  }
}

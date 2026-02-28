import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fixedCostSchema } from "@/schemas/costs";

export async function GET() {
  try {
    const costs = await prisma.fixedCost.findMany({
      orderBy: { description: "asc" },
    });
    return NextResponse.json(costs);
  } catch (error) {
    console.error("Error fetching fixed costs:", error);
    return NextResponse.json(
      { error: "Erro ao buscar custos fixos" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = fixedCostSchema.parse(body);

    const cost = await prisma.fixedCost.create({
      data: {
        description: validatedData.description,
        category: validatedData.category,
        value: validatedData.value,
        dueDate: validatedData.dueDate,
      },
    });

    return NextResponse.json(cost, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Erro ao criar custo fixo" },
      { status: 500 },
    );
  }
}

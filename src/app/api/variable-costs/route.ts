import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { variableCostSchema } from "@/schemas/costs"

export async function GET() {
  try {
    const costs = await prisma.variableCost.findMany({
      orderBy: { date: "desc" },
      include: { budget: { select: { projectName: true } } }
    })
    return NextResponse.json(costs)
  } catch (error) {
    console.error("Error fetching variable costs:", error)
    return NextResponse.json({ error: "Erro ao buscar custos variáveis" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = variableCostSchema.parse(body)

    const cost = await prisma.variableCost.create({
      data: {
        description: validatedData.description,
        value: validatedData.value,
        date: validatedData.date,
        budgetId: validatedData.budgetId,
      },
    })

    return NextResponse.json(cost, { status: 201 })
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro ao criar custo variável" }, { status: 500 })
  }
}

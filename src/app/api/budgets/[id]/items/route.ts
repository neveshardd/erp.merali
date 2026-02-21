import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const itemSchema = z.object({
  description: z.string().min(1),
  imageTypeName: z.string().min(1),
  difficultyName: z.string().min(1),
  difficultyMultiplier: z.number().min(0),
  baseHoursUnit: z.number().min(0),
  estimatedHours: z.number().min(0),
  quantity: z.number().int().min(1),
  unitValue: z.number().min(0),
  totalValue: z.number().min(0),
})

// GET all items for a budget
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const items = await prisma.budgetItem.findMany({
      where: { budgetId: id },
      orderBy: { createdAt: "asc" },
    })
    return NextResponse.json(items)
  } catch (error) {
    console.error("[BUDGET_ITEMS_GET]", error)
    return NextResponse.json({ error: "Erro ao buscar itens" }, { status: 500 })
  }
}

// POST create a new item
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: budgetId } = await params
    const body = await request.json()
    const data = itemSchema.parse(body)

    const item = await prisma.budgetItem.create({
      data: { budgetId, ...data },
    })

    // Recalculate budget totalValue
    await recalcBudgetTotal(budgetId)

    return NextResponse.json(item, { status: 201 })
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("[BUDGET_ITEMS_POST]", error)
    return NextResponse.json({ error: "Erro ao criar item" }, { status: 500 })
  }
}

async function recalcBudgetTotal(budgetId: string) {
  const items = await prisma.budgetItem.findMany({ where: { budgetId } })
  const total = items.reduce((s, i) => s + i.totalValue, 0)
  await prisma.budget.update({ where: { id: budgetId }, data: { totalValue: total } })
}

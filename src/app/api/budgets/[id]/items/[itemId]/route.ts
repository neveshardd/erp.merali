import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const itemSchema = z.object({
  description: z.string().min(1).optional(),
  imageTypeName: z.string().min(1).optional(),
  difficultyName: z.string().min(1).optional(),
  difficultyMultiplier: z.number().min(0).optional(),
  baseHoursUnit: z.number().min(0).optional(),
  estimatedHours: z.number().min(0).optional(),
  quantity: z.number().int().min(1).optional(),
  unitValue: z.number().min(0).optional(),
  totalValue: z.number().min(0).optional(),
})

// PATCH update item
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const { id: budgetId, itemId } = await params
    const body = await request.json()
    const data = itemSchema.parse(body)

    const item = await prisma.budgetItem.update({
      where: { id: itemId },
      data,
    })

    await recalcBudgetTotal(budgetId)

    return NextResponse.json(item)
  } catch (error: any) {
    if (error?.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("[BUDGET_ITEM_PATCH]", error)
    return NextResponse.json({ error: "Erro ao atualizar item" }, { status: 500 })
  }
}

// DELETE item
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const { id: budgetId, itemId } = await params
    await prisma.budgetItem.delete({ where: { id: itemId } })
    await recalcBudgetTotal(budgetId)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[BUDGET_ITEM_DELETE]", error)
    return NextResponse.json({ error: "Erro ao excluir item" }, { status: 500 })
  }
}

async function recalcBudgetTotal(budgetId: string) {
  const items = await prisma.budgetItem.findMany({ where: { budgetId } })
  const total = items.reduce((s, i) => s + i.totalValue, 0)
  await prisma.budget.update({ where: { id: budgetId }, data: { totalValue: total } })
}

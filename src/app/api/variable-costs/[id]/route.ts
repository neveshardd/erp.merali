import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { variableCostSchema } from "@/schemas/costs"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = variableCostSchema.parse(body)

    const cost = await prisma.variableCost.update({
      where: { id },
      data: {
        description: validatedData.description,
        value: validatedData.value,
        date: validatedData.date,
        budgetId: validatedData.budgetId,
      },
    })

    return NextResponse.json(cost)
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Error updating variable cost:", error)
    return NextResponse.json({ error: "Erro ao atualizar custo variável" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.variableCost.delete({
      where: { id },
    })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error deleting variable cost:", error)
    return NextResponse.json({ error: "Erro ao excluir custo variável" }, { status: 500 })
  }
}

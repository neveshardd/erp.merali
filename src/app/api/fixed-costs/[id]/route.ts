import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { fixedCostSchema } from "@/schemas/costs"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = fixedCostSchema.parse(body)

    const cost = await prisma.fixedCost.update({
      where: { id },
      data: {
        description: validatedData.description,
        category: validatedData.category,
        value: validatedData.value,
        dueDate: validatedData.dueDate,
      },
    })

    return NextResponse.json(cost)
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Error updating fixed cost:", error)
    return NextResponse.json({ error: "Erro ao atualizar custo fixo" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.fixedCost.delete({
      where: { id },
    })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error deleting fixed cost:", error)
    return NextResponse.json({ error: "Erro ao excluir custo fixo" }, { status: 500 })
  }
}

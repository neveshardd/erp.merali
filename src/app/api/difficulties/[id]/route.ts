import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { difficultySchema } from "@/schemas/settings"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = difficultySchema.parse(body)

    const difficulty = await prisma.difficulty.update({
      where: { id },
      data: validatedData,
    })

    return NextResponse.json(difficulty)
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro ao atualizar dificuldade" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.difficulty.delete({
      where: { id },
    })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao excluir dificuldade" }, { status: 500 })
  }
}

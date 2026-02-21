import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { imageTypeSchema } from "@/schemas/settings"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validatedData = imageTypeSchema.parse(body)

    const type = await prisma.imageType.update({
      where: { id },
      data: validatedData,
    })

    return NextResponse.json(type)
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro ao atualizar tipo de imagem" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.imageType.delete({
      where: { id },
    })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao excluir tipo de imagem" }, { status: 500 })
  }
}

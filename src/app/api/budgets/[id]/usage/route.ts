import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const budget = await prisma.budget.findUnique({
      where: { id },
      include: {
        client: true,
      },
    })

    if (!budget) {
      return NextResponse.json({ error: "Orçamento não encontrado" }, { status: 404 })
    }

    const dateFormatted = format(new Date(), "dd 'de' MMMM, yyyy", { locale: ptBR })
    const number = `AUT-${format(budget.createdAt, "yyyy")}-${id.slice(-4).toUpperCase()}`

    return NextResponse.json({
      number,
      date: dateFormatted,
      client: {
        name: budget.client.name,
        company: budget.client.company || "",
      },
      project: budget.projectName,
      terms: [
        "Divulgação em redes sociais (Instagram, LinkedIn, Facebook).",
        "Publicação em site oficial e portfólio digital do estúdio.",
        "Utilização em materiais impressos de marketing e apresentações comerciais.",
        "Submissão para premiações de arquitetura e visualização 3D.",
      ]
    })
  } catch (error) {
    console.error("[USAGE_GET]", error)
    return NextResponse.json({ error: "Erro ao carregar Autorização de Uso de Imagem" }, { status: 500 })
  }
}

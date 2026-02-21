import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // 1. Try to find by primary ID
    let briefing = await prisma.briefing.findUnique({
      where: { id },
    })

    // 2. If not found, try to find a technical briefing associated with this ID as a budgetId
    if (!briefing) {
        const allTechnical = await prisma.briefing.findMany({
            where: { type: 'TECHNICAL' }
        })
        
        briefing = allTechnical.find(b => {
            const content = b.content as any
            return content?.budgetId === id
        }) || null
    }

    // 3. Fallback: If still not found, check if it's a Budget ID and create a "virtual" briefing on the fly
    if (!briefing) {
        const budget = await prisma.budget.findUnique({
            where: { id },
            include: { client: true }
        })

        if (budget) {
            briefing = await prisma.briefing.create({
                data: {
                    type: 'TECHNICAL',
                    projectName: budget.projectName,
                    clientName: budget.client?.name || "Cliente",
                    status: "Pendente",
                    content: { 
                        budgetId: budget.id,
                        format: "",
                        links: [""],
                        mood: "Diurno"
                    }
                }
            })
        }
    }

    if (!briefing) {
      return NextResponse.json({ error: "Briefing não encontrado" }, { status: 404 })
    }

    return NextResponse.json(briefing)
  } catch (error) {
    console.error("Error fetching briefing:", error)
    return NextResponse.json({ error: "Erro ao buscar briefing" }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const briefing = await prisma.briefing.update({
      where: { id },
      data: body,
    })

    return NextResponse.json(briefing)
  } catch (error) {
    console.error("Error updating briefing:", error)
    return NextResponse.json({ error: "Erro ao atualizar briefing" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.briefing.delete({
      where: { id },
    })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error deleting briefing:", error)
    return NextResponse.json({ error: "Erro ao excluir briefing" }, { status: 500 })
  }
}

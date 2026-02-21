import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const briefings = await prisma.briefing.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(briefings)
  } catch (error) {
    console.error("Error fetching briefings:", error)
    return NextResponse.json({ error: "Erro ao buscar briefings" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const briefing = await prisma.briefing.create({
      data: {
        type: body.type || "GENERAL",
        projectName: body.projectName,
        clientName: body.clientName,
        email: body.email,
        status: body.status || "Novo",
        content: body.content || {},
      },
    })

    return NextResponse.json(briefing, { status: 201 })
  } catch (error) {
    console.error("Error creating briefing:", error)
    return NextResponse.json({ error: "Erro ao criar briefing" }, { status: 500 })
  }
}

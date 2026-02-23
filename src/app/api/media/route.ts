import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.FRONTEND_URL || "http://localhost:3001",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export async function OPTIONS(request: Request) {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function GET() {
  try {
    const media = await prisma.media.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(media, { headers: corsHeaders })
  } catch (error) {
    console.error("Error fetching media:", error)
    return NextResponse.json({ error: "Erro ao buscar mídia" }, { status: 500, headers: corsHeaders })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const media = await prisma.media.create({
      data: {
        type: body.type || "IMAGE",
        url: body.url,
        name: body.name,
        size: body.size,
        isFavorite: body.isFavorite || false,
      },
    })

    return NextResponse.json(media, { status: 201, headers: corsHeaders })
  } catch (error) {
    console.error("Error creating media:", error)
    return NextResponse.json({ error: "Erro ao salvar mídia" }, { status: 500, headers: corsHeaders })
  }
}

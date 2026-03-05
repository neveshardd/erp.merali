import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import { corsHeaders } from "@/lib/cors";

export async function OPTIONS(_request: Request) {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    const media = await prisma.media.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(media, { headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching media:", error);
    return NextResponse.json(
      { error: "Erro ao buscar mídia" },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const media = await prisma.media.create({
      data: {
        type: body.type || "IMAGE",
        url: body.url,
        name: body.name,
        size: body.size,
        isFavorite: body.isFavorite || false,
      },
    });

    return NextResponse.json(media, { status: 201, headers: corsHeaders });
  } catch (error) {
    console.error("Error creating media:", error);
    return NextResponse.json(
      { error: "Erro ao salvar mídia" },
      { status: 500, headers: corsHeaders },
    );
  }
}

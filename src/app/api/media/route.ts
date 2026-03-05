import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET() {
  try {
    const media = await prisma.media.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(media);
  } catch (error) {
    console.error("Error fetching media:", error);
    return NextResponse.json(
      { error: "Erro ao buscar mídia" },
      { status: 500 },
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

    return NextResponse.json(media, { status: 201 });
  } catch (error) {
    console.error("Error creating media:", error);
    return NextResponse.json(
      { error: "Erro ao salvar mídia" },
      { status: 500 },
    );
  }
}

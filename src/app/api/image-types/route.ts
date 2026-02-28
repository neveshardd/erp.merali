import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { imageTypeSchema } from "@/schemas/settings";

export async function GET() {
  try {
    const types = await prisma.imageType.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(types);
  } catch (_error) {
    return NextResponse.json(
      { error: "Erro ao buscar tipos de imagens" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = imageTypeSchema.parse(body);

    const type = await prisma.imageType.create({
      data: validatedData,
    });

    return NextResponse.json(type, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Erro ao criar tipo de imagem" },
      { status: 500 },
    );
  }
}

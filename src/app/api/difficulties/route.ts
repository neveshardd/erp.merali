import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { difficultySchema } from "@/schemas/settings";

export async function GET() {
  try {
    const difficulties = await prisma.difficulty.findMany({
      orderBy: { multiplier: "asc" },
    });
    return NextResponse.json(difficulties);
  } catch (_error) {
    return NextResponse.json(
      { error: "Erro ao buscar dificuldades" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = difficultySchema.parse(body);

    const difficulty = await prisma.difficulty.create({
      data: validatedData,
    });

    return NextResponse.json(difficulty, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Erro ao criar dificuldade" },
      { status: 500 },
    );
  }
}

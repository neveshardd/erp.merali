import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET() {
  try {
    const groups = await prisma.configGroup.findMany({
      include: {
        configs: {
          orderBy: { key: "asc" },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(groups);
  } catch (error) {
    console.error("Error fetching configs:", error);
    return NextResponse.json(
      { error: "Erro ao buscar configurações" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, configs } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Nome do grupo é obrigatório" },
        { status: 400 },
      );
    }

    const group = await prisma.configGroup.upsert({
      where: { name },
      update: {},
      create: { name },
    });

    if (configs && Array.isArray(configs)) {
      for (const config of configs) {
        await prisma.config.upsert({
          where: { key: config.key },
          update: {
            value: config.value,
            label: config.label,
            description: config.description,
            groupId: group.id,
          },
          create: {
            key: config.key,
            value: config.value,
            label: config.label,
            description: config.description,
            groupId: group.id,
          },
        });
      }
    }

    const updatedGroup = await prisma.configGroup.findUnique({
      where: { id: group.id },
      include: { configs: true },
    });

    return NextResponse.json(updatedGroup, {
      status: 201,
    });
  } catch (error) {
    console.error("Error saving configs:", error);
    return NextResponse.json(
      { error: "Erro ao salvar configurações" },
      { status: 500 },
    );
  }
}

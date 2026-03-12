import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const account = await prisma.socialAccount.findUnique({
      where: { platform: "instagram" },
      select: {
        updatedAt: true,
        businessId: true,
        platform: true,
      }
    });
    
    return NextResponse.json(account || { connected: false });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar status" }, { status: 500 });
  }
}

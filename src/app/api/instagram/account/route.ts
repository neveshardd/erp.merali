import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session) {
      return NextResponse.json({ connected: false });
    }

    const account = await prisma.socialAccount.findUnique({
      where: {
        platform_userId_sessionId: {
          platform: "instagram",
          userId: session.user.id,
          sessionId: session.session.id,
        }
      },
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

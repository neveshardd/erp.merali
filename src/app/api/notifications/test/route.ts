import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Test endpoint: GET /api/notifications/test
// Creates a test notification to verify the system works end-to-end
export async function GET() {
  try {
    // Check if the notification model is accessible
    const count = await prisma.notification.count();

    // Create a test notification
    const notification = await prisma.notification.create({
      data: {
        title: "Teste de Notificação",
        description:
          "Se você está vendo isso, o sistema de notificações está funcionando perfectamente!",
        type: "success",
        link: "/invoices",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Test notification created",
      notification,
      totalCount: count + 1,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        models: Object.keys(prisma).filter(
          (k) => !k.startsWith("$") && !k.startsWith("_"),
        ),
      },
      { status: 500 },
    );
  }
}

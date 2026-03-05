import { NextResponse } from "next/server";
import { createNotification } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/resend";
import { BriefingReceivedClientEmail, NewBriefingAdminEmail } from "@/components/emails/briefing-emails";

export async function GET() {
  try {
    const briefings = await prisma.briefing.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(briefings);
  } catch (error) {
    console.error("Error fetching briefings:", error);
    return NextResponse.json(
      { error: "Erro ao buscar briefings" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const briefing = await prisma.briefing.create({
      data: {
        type: body.type || "GENERAL",
        projectName: body.projectName,
        clientName: body.clientName,
        email: body.email,
        status: body.status || "Novo",
        content: body.content || {},
      },
    });

    await createNotification({
      title: "Novo Briefing Recebido",
      description: `O cliente ${briefing.clientName} enviou um novo briefing para ${briefing.projectName}.`,
      type: "info",
      link: "/briefings",
    });

    // topic 3: Send emails
    try {
      // 1. Alert Admin (You)
      await sendEmail({
        to: "contato@merali.com.br",
        subject: `Novo Briefing: ${briefing.projectName || "Sem Nome"} - ${briefing.clientName || "Cliente"}`,
        react: NewBriefingAdminEmail({
          clientName: briefing.clientName || "Cliente",
          projectName: briefing.projectName || "Sem Nome",
        }),
      });

      // 2. Confirm to Client
      if (briefing.email) {
        await sendEmail({
          to: briefing.email,
          subject: `Recebemos seu Briefing - Merali Studio`,
          react: BriefingReceivedClientEmail({
            clientName: briefing.clientName || "Cliente",
            projectName: briefing.projectName || "Sem Nome",
          }),
        });
      }
    } catch (emailErr) {
      console.error("Non-fatal error sending briefing emails:", emailErr);
    }

    return NextResponse.json(briefing, { status: 201 });
  } catch (error) {
    console.error("Error creating briefing:", error);
    return NextResponse.json(
      { error: "Erro ao criar briefing" },
      { status: 500 },
    );
  }
}

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import extenso from "extenso";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // 'signal' or 'final'
    const portion = searchParams.get("portion") || "100"; // percentage string

    const budget = await prisma.budget.findUnique({
      where: { id },
      include: {
        client: true,
        variableCosts: true,
      },
    });

    if (!budget) {
      return NextResponse.json(
        { error: "Orçamento não encontrado" },
        { status: 404 },
      );
    }

    const totalVariableCosts = budget.variableCosts.reduce(
      (s, c) => s + c.value,
      0,
    );
    const total = budget.totalValue + totalVariableCosts;

    // Default to total if no type specified
    let receiptValue = total;
    let description = `referente ao pagamento total do serviço de visualização 3D do projeto '${budget.projectName}'.`;

    if (type === "signal") {
      receiptValue = total * 0.5;
      description = `referente à 1ª parcela (Entrada 50%) do serviço de visualização 3D do projeto '${budget.projectName}'.`;
    } else if (type === "final") {
      receiptValue = total * 0.5;
      description = `referente à 2ª parcela (Entrega Final 50%) do serviço de visualização 3D do projeto '${budget.projectName}'.`;
    } else if (portion && !Number.isNaN(Number(portion))) {
      const p = Number(portion) / 100;
      receiptValue = total * p;
      description = `referente ao pagamento de ${portion}% do serviço de visualização 3D do projeto '${budget.projectName}'.`;
    }

    const valueFormatted = receiptValue.toFixed(2).replace(".", ",");
    const amountInWords = extenso(valueFormatted, { mode: "currency" });
    const dateFormatted = format(new Date(), "dd 'de' MMMM, yyyy", {
      locale: ptBR,
    });
    const number = `REC-${format(new Date(), "yyyyMMdd")}-${id.slice(-4).toUpperCase()}`;

    return NextResponse.json({
      number,
      date: dateFormatted,
      value: receiptValue,
      amountInWords,
      payer: {
        name: budget.client.name,
        company: budget.client.company || "",
        cnpj: budget.client.taxId || "",
      },
      receiver: {
        name: "MERALI STUDIO DE VISUALIZACAO LTDA",
        cnpj: "50.123.456/0001-00",
        address: "Rua Exemplo, 123 - São Paulo, SP",
      },
      description,
    });
  } catch (error) {
    console.error("[RECEIPT_GET]", error);
    return NextResponse.json(
      { error: "Erro ao carregar recibo" },
      { status: 500 },
    );
  }
}

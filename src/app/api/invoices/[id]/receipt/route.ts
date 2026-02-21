import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
// @ts-ignore
import extenso from 'extenso'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id') || ''

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        client: true,
        budget: true,
      },
    })

    if (!invoice) {
      return NextResponse.json({ error: 'Fatura não encontrada' }, { status: 404 })
    }

    const amount = invoice.amount ?? 0
    const valueFormatted = amount.toFixed(2).replace('.', ',')
    const amountInWords = extenso(valueFormatted, { mode: 'currency' })

    const dateFormatted = format(new Date(), "dd 'de' MMMM, yyyy", { locale: ptBR })
    const paidAtFormatted = invoice.updatedAt
      ? format(new Date(invoice.updatedAt), "dd 'de' MMMM, yyyy", { locale: ptBR })
      : dateFormatted

    const number = `REC-${format(new Date(), 'yyyyMMdd')}-${id.slice(-4).toUpperCase()}`

    const projectName = invoice.budget?.projectName ?? ''
    const description = projectName
      ? `referente ao pagamento via Stripe da fatura #${id.slice(-6).toUpperCase()} relativa ao projeto '${projectName}'.`
      : `referente ao pagamento via Stripe da fatura #${id.slice(-6).toUpperCase()}.`

    return NextResponse.json({
      invoiceId: id,
      number,
      date: dateFormatted,
      paidAt: paidAtFormatted,
      value: amount,
      amountInWords,
      sessionId,
      projectName,
      description,
      payer: {
        name: invoice.client?.name ?? 'Cliente',
        company: invoice.client?.company ?? '',
        cnpj: invoice.client?.taxId ?? '',
      },
      receiver: {
        name: 'MERALI STUDIO DE VISUALIZACAO LTDA',
        cnpj: '50.123.456/0001-00',
      },
    })
  } catch (error) {
    console.error('[INVOICE_RECEIPT_GET]', error)
    return NextResponse.json({ error: 'Erro ao gerar recibo' }, { status: 500 })
  }
}

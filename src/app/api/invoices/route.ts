import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        client: true,
        budget: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(invoices)
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return NextResponse.json({ error: 'Erro ao buscar faturas' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const invoice = await prisma.invoice.create({
      data: {
        budgetId: body.budgetId,
        clientId: body.clientId,
        amount: body.amount,
        dueDate: new Date(body.dueDate),
        status: body.status || 'PENDING',
      },
      include: {
        client: true,
        budget: true,
      }
    })

    return NextResponse.json(invoice, { status: 201 })
  } catch (error) {
    console.error('Error creating invoice:', error)
    return NextResponse.json({ error: 'Erro ao criar fatura' }, { status: 500 })
  }
}

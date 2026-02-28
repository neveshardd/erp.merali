import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function formatBRL(amount: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)
}

// Derive notifications from real database state — no need to "create" them
export async function GET() {
  try {
    const now = new Date()
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // 1. Recently paid invoices (last 7 days)
    const recentlyPaid = await prisma.invoice.findMany({
      where: {
        status: 'PAID',
        paidAt: { gte: last7Days }
      },
      include: { client: true },
      orderBy: { paidAt: 'desc' },
      take: 10
    })

    // 2. Overdue invoices (dueDate past, still pending)
    const overdueInvoices = await prisma.invoice.findMany({
      where: {
        status: 'PENDING',
        dueDate: { lt: now }
      },
      include: { client: true },
      orderBy: { dueDate: 'asc' },
      take: 5
    })

    // 3. Invoices due soon (next 3 days)
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
    const dueSoon = await prisma.invoice.findMany({
      where: {
        status: 'PENDING',
        dueDate: { gte: now, lte: threeDaysFromNow }
      },
      include: { client: true },
      orderBy: { dueDate: 'asc' },
      take: 5
    })

    // 4. New briefings (last 7 days)
    const recentBriefings = await prisma.briefing.findMany({
      where: {
        createdAt: { gte: last7Days }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    })

    // Build notification list from derived data
    const notifications: any[] = []

    // Paid invoices → success
    for (const invoice of recentlyPaid) {
      notifications.push({
        id: `paid-${invoice.id}`,
        title: 'Pagamento Recebido',
        description: `${invoice.client?.name ?? 'Cliente'} pagou ${formatBRL(invoice.amount)}.`,
        type: 'success',
        link: '/invoices',
        createdAt: invoice.paidAt ?? invoice.updatedAt,
        read: false
      })
    }

    // Overdue invoices → error
    for (const invoice of overdueInvoices) {
      const daysLate = Math.floor((now.getTime() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24))
      notifications.push({
        id: `overdue-${invoice.id}`,
        title: 'Fatura Vencida',
        description: `${invoice.client?.name ?? 'Cliente'} — ${formatBRL(invoice.amount)} venceu há ${daysLate} dia${daysLate !== 1 ? 's' : ''}.`,
        type: 'error',
        link: '/invoices',
        createdAt: invoice.dueDate,
        read: false
      })
    }

    // Due soon → warning
    for (const invoice of dueSoon) {
      const daysLeft = Math.ceil((new Date(invoice.dueDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      notifications.push({
        id: `due-soon-${invoice.id}`,
        title: 'Fatura Vence em Breve',
        description: `${invoice.client?.name ?? 'Cliente'} — ${formatBRL(invoice.amount)} vence em ${daysLeft} dia${daysLeft !== 1 ? 's' : ''}.`,
        type: 'warning',
        link: '/invoices',
        createdAt: invoice.dueDate,
        read: false
      })
    }

    // New briefings → info
    for (const briefing of recentBriefings) {
      notifications.push({
        id: `briefing-${briefing.id}`,
        title: 'Novo Briefing Recebido',
        description: `${briefing.clientName} enviou um briefing para "${briefing.projectName}".`,
        type: 'info',
        link: '/briefings',
        createdAt: briefing.createdAt,
        read: false
      })
    }

    // Sort by most recent first
    notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json(notifications)
  } catch (error: any) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    })
    return NextResponse.json(notifications)
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'Erro ao buscar notificações' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, readAll } = await request.json()

    if (readAll) {
      await prisma.notification.updateMany({
        where: { read: false },
        data: { read: true }
      })
      return NextResponse.json({ success: true })
    }

    if (id) {
      const notification = await prisma.notification.update({
        where: { id },
        data: { read: true }
      })
      return NextResponse.json(notification)
    }

    return NextResponse.json({ error: 'Missing id or readAll' }, { status: 400 })
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json({ error: 'Erro ao atualizar notificação' }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns"

export async function GET() {
    try {
        const now = new Date()
        const currentMonthStart = startOfMonth(now)
        const currentMonthEnd = endOfMonth(now)
        
        // 1. Get stats for cards
        // Total value of approved budgets in the current month (Revenue)
        const revenueResult = await prisma.budget.aggregate({
            where: {
                status: 'APPROVED',
                updatedAt: {
                    gte: currentMonthStart,
                    lte: currentMonthEnd,
                }
            },
            _sum: {
                totalValue: true
            }
        })
        const revenue = revenueResult._sum.totalValue || 0

        // Total value of pending/in-progress budgets (Expected Revenue)
        const pendingResult = await prisma.budget.aggregate({
            where: {
                status: {
                    in: ['PENDING', 'IN_PROGRESS']
                }
            },
            _sum: {
                totalValue: true
            }
        })
        const pending = pendingResult._sum.totalValue || 0

        // New clients this month
        const newClients = await prisma.client.count({
            where: {
                createdAt: {
                    gte: currentMonthStart,
                    lte: currentMonthEnd,
                }
            }
        })

        // Conversion rate (Approved / Total created) this month
        const totalBudgetsThisMonth = await prisma.budget.count({
            where: {
                createdAt: {
                    gte: currentMonthStart,
                    lte: currentMonthEnd,
                }
            }
        })
        const approvedBudgetsThisMonth = await prisma.budget.count({
            where: {
                status: 'APPROVED',
                updatedAt: {
                    gte: currentMonthStart,
                    lte: currentMonthEnd,
                }
            }
        })
        const conversion = totalBudgetsThisMonth > 0 
            ? (approvedBudgetsThisMonth / totalBudgetsThisMonth) * 100 
            : 0

        // 2. Get data for line chart (last 6 months)
        const chartData = []
        for (let i = 5; i >= 0; i--) {
            const date = subMonths(now, i)
            const monthStart = startOfMonth(date)
            const monthEnd = endOfMonth(date)
            
            const monthRevenue = await prisma.budget.aggregate({
                where: {
                    status: 'APPROVED',
                    updatedAt: {
                        gte: monthStart,
                        lte: monthEnd,
                    }
                },
                _sum: {
                    totalValue: true
                }
            })
            
            chartData.push({
                month: format(date, 'MMM'),
                value: monthRevenue._sum.totalValue || 0
            })
        }

        // 3. Last 5 budgets
        const lastBudgets = await prisma.budget.findMany({
            take: 5,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                client: {
                    select: {
                        name: true
                    }
                }
            }
        })

        return NextResponse.json({
            stats: {
                revenue,
                pending,
                newClients,
                conversion
            },
            chartData,
            lastBudgets
        })

    } catch (error) {
        console.error("Dashboard stats error:", error)
        return NextResponse.json(
            { error: "Erro ao carregar dados do dashboard" }, 
            { status: 500 }
        )
    }
}

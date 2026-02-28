import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);

    // 1. Get stats for cards
    // Total value of PAID invoices in the current month (Real Revenue)
    const revenueResult = await prisma.invoice.aggregate({
      where: {
        status: "PAID",
        paidAt: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
      },
      _sum: {
        amount: true,
      },
    });
    const revenue = revenueResult._sum.amount || 0;

    // Total value of PENDING invoices (Expected Cash Flow)
    const pendingResult = await prisma.invoice.aggregate({
      where: {
        status: "PENDING",
        dueDate: {
          gte: currentMonthStart,
        },
      },
      _sum: {
        amount: true,
      },
    });
    const pending = pendingResult._sum.amount || 0;

    // New clients this month
    const newClients = await prisma.client.count({
      where: {
        createdAt: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
      },
    });

    // Conversion rate (Approved Budgets / Total created) this month
    const totalBudgetsThisMonth = await prisma.budget.count({
      where: {
        createdAt: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
      },
    });
    const approvedBudgetsThisMonth = await prisma.budget.count({
      where: {
        status: "APPROVED",
        updatedAt: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
      },
    });
    const conversion =
      totalBudgetsThisMonth > 0
        ? (approvedBudgetsThisMonth / totalBudgetsThisMonth) * 100
        : 0;

    // 2. Get data for line chart (last 6 months - Based on Paid Invoices)
    const chartData = [];
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(now, i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);

      const monthRevenue = await prisma.invoice.aggregate({
        where: {
          status: "PAID",
          paidAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
        _sum: {
          amount: true,
        },
      });

      chartData.push({
        month: format(date, "MMM"),
        value: monthRevenue._sum.amount || 0,
      });
    }

    // 3. Last 5 activities (Recent budgets or invoices)
    const lastBudgets = await prisma.budget.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        client: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      stats: {
        revenue,
        pending,
        newClients,
        conversion,
      },
      chartData,
      lastBudgets,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Erro ao carregar dados do dashboard" },
      { status: 500 },
    );
  }
}

"use client"

import { TrendingUp, Users, FileText, PieChart, ArrowRight, Loader2 } from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"
import { formatCurrency } from "@/lib/utils"

export default function DashboardPage() {
    const { data, isLoading } = useDashboardStats()

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-neutral-500 mt-4 font-bold uppercase tracking-widest text-[10px]">Carregando Visão Geral...</p>
            </div>
        )
    }

    const stats = [
        { 
            title: "Receita (Mês)", 
            value: formatCurrency(data?.stats.revenue || 0), 
            sub: "Confirmado em conta", 
            icon: TrendingUp, 
            color: "text-emerald-500" 
        },
        { 
            title: "Pendente Total", 
            value: formatCurrency(data?.stats.pending || 0), 
            sub: "Aguardando pagamento", 
            icon: FileText, 
            color: "text-neutral-500" 
        },
        { 
            title: "Novos Clientes", 
            value: (data?.stats.newClients || 0).toString(), 
            sub: "Este mês", 
            icon: Users, 
            color: "text-neutral-500" 
        },
        { 
            title: "Conversão", 
            value: `${Math.round(data?.stats.conversion || 0)}%`, 
            sub: "Orçamentos aprovados", 
            icon: PieChart, 
            color: "text-neutral-500" 
        },
    ]

    // Normalize chart data for SVG
    const maxVal = Math.max(...(data?.chartData.map(d => d.value) || [1]), 1)
    const chartPoints = data?.chartData.map((d, i) => {
        const x = i * 200
        const y = 200 - (d.value / maxVal * 160) // Keep some padding at top
        return { x, y }
    }) || []

    const pathData = chartPoints.length > 0
        ? `M ${chartPoints.map(p => `${p.x} ${p.y}`).join(" L ")}`
        : ""

    return (
        <main className="flex flex-col gap-8 p-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tighter text-neutral-900 dark:text-neutral-100 uppercase">Resumo Geral</h1>
                <p className="text-neutral-500 mt-1 uppercase text-[10px] font-bold tracking-widest leading-none">Bem-vindo ao Merali Studio</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="border border-neutral-200 dark:border-neutral-800 shadow-none bg-white dark:bg-neutral-900 rounded-xl overflow-hidden group hover:border-neutral-900 dark:hover:border-white transition-all cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 bg-neutral-50/50 dark:bg-neutral-800/30 px-5 pt-4">
                            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 leading-none">{stat.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 pt-4">
                            <div className="text-2xl font-black text-neutral-900 dark:text-neutral-100 tabular-nums leading-none tracking-tighter">{stat.value}</div>
                            <div className="flex items-center gap-1.5 mt-3 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                                <stat.icon className={`w-3 h-3 ${stat.color === 'text-emerald-500' ? 'text-emerald-500' : 'text-neutral-400'}`} />
                                <span className={stat.color === 'text-emerald-500' ? 'text-emerald-500' : ''}>{stat.sub}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Section */}
                <Card className="lg:col-span-2 border border-neutral-200 dark:border-neutral-800 shadow-none bg-white dark:bg-neutral-900 rounded-xl overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4 bg-neutral-50/50 dark:bg-neutral-800/30 px-6">
                        <div>
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-neutral-500">Faturamento Semestral</CardTitle>
                            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mt-1">Status de recebimentos aprovados</CardDescription>
                        </div>
                        <span className="text-[10px] text-neutral-400 uppercase font-black tracking-widest opacity-30">BRL</span>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="h-[320px] w-full relative flex flex-col justify-end">
                            {/* Grid Lines */}
                            <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none opacity-50">
                                {[1.0, 0.8, 0.6, 0.4, 0.2, 0].map((val) => (
                                    <div key={val} className="flex items-center gap-4 w-full">
                                        <span className="text-[10px] text-neutral-300 w-16 text-right tabular-nums font-bold">
                                            {formatCurrency(maxVal * val, 0)}
                                        </span>
                                        <div className="h-px bg-neutral-100 dark:bg-neutral-800 flex-1" />
                                    </div>
                                ))}
                            </div>
                            
                            {/* SVG Line Chart */}
                            <div className="relative h-[256px] ml-16 mb-8 pb-4">
                                <svg className="w-full h-full" viewBox="0 0 1000 200" preserveAspectRatio="none">
                                    <path 
                                        d={pathData} 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-neutral-900 dark:text-white transition-all duration-700"
                                    />
                                    {chartPoints.map((p, i) => (
                                        <rect 
                                            key={i} 
                                            x={p.x - 4} 
                                            y={p.y - 4} 
                                            width="8" 
                                            height="8" 
                                            className="fill-neutral-900 dark:fill-white stroke-white dark:stroke-neutral-900"
                                            strokeWidth="2" 
                                        />
                                    ))}
                                </svg>
                            </div>

                            {/* X Axis Labels */}
                            <div className="flex justify-between ml-16 px-4 text-[10px] text-neutral-400 uppercase font-black tabular-nums tracking-widest">
                                {data?.chartData.map(d => (
                                    <span key={d.month}>{d.month}</span>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* List Section */}
                <Card className="border border-neutral-200 dark:border-neutral-800 shadow-none bg-white dark:bg-neutral-900 rounded-xl overflow-hidden flex flex-col">
                    <CardHeader className="border-b border-neutral-100 dark:border-neutral-800 pb-4 bg-neutral-50/50 dark:bg-neutral-800/30 px-6">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest text-neutral-500">Últimos Orçamentos</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 flex flex-col flex-1">
                        <div className="flex flex-col gap-3 flex-1">
                            {data?.lastBudgets.map((item, i) => (
                                <Link 
                                    key={item.id} 
                                    href={`/budgets/${item.id}`}
                                    className="flex items-center justify-between p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-white transition-all group bg-neutral-50/30 cursor-pointer"
                                >
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-black text-neutral-900 dark:text-neutral-100 uppercase tracking-tight group-hover:text-blue-600 transition-colors truncate max-w-[150px]">{item.projectName}</span>
                                        <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold truncate max-w-[150px]">{item.client.name}</span>
                                    </div>
                                    <Badge variant="outline" className="text-[9px] font-black bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 px-2 py-0.5 text-neutral-500">{item.status}</Badge>
                                </Link>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800">
                            <Link 
                                href="/budgets" 
                                className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-900 dark:text-white hover:opacity-70 transition-all group cursor-pointer"
                            >
                                <span>Ver todos os orçamentos</span>
                                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}

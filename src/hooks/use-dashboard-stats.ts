import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export interface DashboardStats {
    stats: {
        revenue: number
        pending: number
        newClients: number
        conversion: number
    }
    chartData: Array<{
        month: string
        value: number
    }>
    lastBudgets: Array<{
        id: string
        projectName: string
        status: string
        client: {
            name: true
        }
    }>
}

export function useDashboardStats() {
    return useQuery<DashboardStats>({
        queryKey: ["dashboard-stats"],
        queryFn: async () => {
            const { data } = await axios.get("/api/dashboard/stats")
            return data
        },
    })
}

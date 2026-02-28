import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

export interface Notification {
    id: string
    title: string
    description: string
    type: 'success' | 'warning' | 'info' | 'error'
    read: boolean
    link?: string
    createdAt: string
}

export function useNotifications() {
    const queryClient = useQueryClient()

    const { data: notifications = [], isLoading } = useQuery<Notification[]>({
        queryKey: ["notifications"],
        queryFn: async () => {
            const response = await axios.get("/api/notifications")
            return response.data
        },
        refetchInterval: 30000, // Poll every 30 seconds
    })

    const markAsRead = useMutation({
        mutationFn: async (id: string) => {
            await axios.patch("/api/notifications", { id })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] })
        },
    })

    const markAllAsRead = useMutation({
        mutationFn: async () => {
            await axios.patch("/api/notifications", { readAll: true })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] })
        },
    })

    const unreadCount = notifications.filter(n => !n.read).length

    return {
        notifications,
        isLoading,
        unreadCount,
        markAsRead,
        markAllAsRead
    }
}

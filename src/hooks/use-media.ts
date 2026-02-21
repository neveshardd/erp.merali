import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

export interface MediaItem {
  id: string
  type: "IMAGE" | "VIDEO"
  url: string
  name: string
  size?: string
  isFavorite: boolean
  createdAt: string
  updatedAt: string
}


export function useMedia() {
  return useQuery({
    queryKey: ["media"],
    queryFn: async () => {
      const response = await axios.get("/api/media")
      return response.data
    },
  })
}

export function useCreateMedia() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post("/api/media", data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] })
    },
  })
}

export function useUpdateMedia() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const response = await axios.patch(`/api/media/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] })
    },
  })
}

export function useDeleteMedia() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/media/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] })
    },
  })
}

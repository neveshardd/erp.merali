import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { ClientTypeInput, ImageTypeInput, DifficultyInput } from "@/schemas/settings"

// Client Types
export function useClientTypes() {
  return useQuery({
    queryKey: ["client-types"],
    queryFn: async () => {
      const { data } = await axios.get("/api/client-types")
      return data
    },
  })
}

export function useCreateClientType() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (type: ClientTypeInput) => {
      const { data } = await axios.post("/api/client-types", type)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-types"] })
    },
  })
}

export function useUpdateClientType() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...type }: ClientTypeInput & { id: string }) => {
      const { data } = await axios.patch(`/api/client-types/${id}`, type)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-types"] })
    },
  })
}

export function useDeleteClientType() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/client-types/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-types"] })
    },
  })
}

// Image Types
export function useImageTypes() {
  return useQuery({
    queryKey: ["image-types"],
    queryFn: async () => {
      const { data } = await axios.get("/api/image-types")
      return data
    },
  })
}

export function useCreateImageType() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (type: ImageTypeInput) => {
      const { data } = await axios.post("/api/image-types", type)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["image-types"] })
    },
  })
}

export function useUpdateImageType() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...type }: ImageTypeInput & { id: string }) => {
      const { data } = await axios.patch(`/api/image-types/${id}`, type)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["image-types"] })
    },
  })
}

export function useDeleteImageType() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/image-types/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["image-types"] })
    },
  })
}

// Difficulties
export function useDifficulties() {
  return useQuery({
    queryKey: ["difficulties"],
    queryFn: async () => {
      const { data } = await axios.get("/api/difficulties")
      return data
    },
  })
}

export function useCreateDifficulty() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (difficulty: DifficultyInput) => {
      const { data } = await axios.post("/api/difficulties", difficulty)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["difficulties"] })
    },
  })
}

export function useUpdateDifficulty() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...difficulty }: DifficultyInput & { id: string }) => {
      const { data } = await axios.patch(`/api/difficulties/${id}`, difficulty)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["difficulties"] })
    },
  })
}

export function useDeleteDifficulty() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/difficulties/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["difficulties"] })
    },
  })
}

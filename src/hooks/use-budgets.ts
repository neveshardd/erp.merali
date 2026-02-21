import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { BudgetInput } from "@/schemas/budget"

export function useBudgets() {
  return useQuery({
    queryKey: ["budgets"],
    queryFn: async () => {
      const response = await axios.get("/api/budgets")
      return response.data
    },
  })
}

export function useBudget(id: string) {
  return useQuery({
    queryKey: ["budgets", id],
    queryFn: async () => {
      const response = await axios.get(`/api/budgets/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

export function useCreateBudget() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: BudgetInput) => {
      const response = await axios.post("/api/budgets", data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] })
    },
  })
}

export function useUpdateBudget() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<BudgetInput> & { id: string }) => {
      const response = await axios.patch(`/api/budgets/${id}`, data)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] })
      queryClient.invalidateQueries({ queryKey: ["budgets", variables.id] })
    },
  })
}

export function useDeleteBudget() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/budgets/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] })
    },
  })
}

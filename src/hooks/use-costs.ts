import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { FixedCostInput, VariableCostInput } from "@/schemas/costs";

// Fixed Costs
export function useFixedCosts() {
  return useQuery({
    queryKey: ["fixed-costs"],
    queryFn: async () => {
      const { data } = await axios.get("/api/fixed-costs");
      return data;
    },
  });
}

export function useCreateFixedCost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (cost: FixedCostInput) => {
      const { data } = await axios.post("/api/fixed-costs", cost);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fixed-costs"] });
    },
  });
}

export function useUpdateFixedCost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...cost }: FixedCostInput & { id: string }) => {
      const { data } = await axios.patch(`/api/fixed-costs/${id}`, cost);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fixed-costs"] });
    },
  });
}

export function useDeleteFixedCost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/fixed-costs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fixed-costs"] });
    },
  });
}

// Variable Costs
export function useVariableCosts() {
  return useQuery({
    queryKey: ["variable-costs"],
    queryFn: async () => {
      const { data } = await axios.get("/api/variable-costs");
      return data;
    },
  });
}

export function useCreateVariableCost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (cost: VariableCostInput) => {
      const { data } = await axios.post("/api/variable-costs", cost);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["variable-costs"] });
    },
  });
}

export function useUpdateVariableCost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...cost }: VariableCostInput & { id: string }) => {
      const { data } = await axios.patch(`/api/variable-costs/${id}`, cost);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["variable-costs"] });
    },
  });
}

export function useDeleteVariableCost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/variable-costs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["variable-costs"] });
    },
  });
}

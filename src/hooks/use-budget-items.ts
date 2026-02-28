import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export interface BudgetItem {
  id: string;
  budgetId: string;
  description: string;
  imageTypeName: string;
  difficultyName: string;
  difficultyMultiplier: number;
  baseHoursUnit: number;
  estimatedHours: number;
  quantity: number;
  unitValue: number;
  totalValue: number;
}

export interface BudgetRates {
  baseHours: number;
  hourlyRate: number;
  profitMargin: number;
  multiplier: number;
}

export function useBudgetItems(budgetId: string) {
  return useQuery<BudgetItem[]>({
    queryKey: ["budget-items", budgetId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/budgets/${budgetId}/items`);
      return data;
    },
    enabled: !!budgetId,
  });
}

export function useCreateBudgetItem(budgetId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: Omit<BudgetItem, "id" | "budgetId">) => {
      const { data } = await axios.post(`/api/budgets/${budgetId}/items`, item);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget-items", budgetId] });
      queryClient.invalidateQueries({ queryKey: ["budgets", budgetId] });
    },
  });
}

export function useDeleteBudgetItem(budgetId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (itemId: string) => {
      await axios.delete(`/api/budgets/${budgetId}/items/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget-items", budgetId] });
      queryClient.invalidateQueries({ queryKey: ["budgets", budgetId] });
    },
  });
}

export function useUpdateBudgetItem(budgetId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      itemId,
      ...data
    }: Partial<BudgetItem> & { itemId: string }) => {
      const { data: updated } = await axios.patch(
        `/api/budgets/${budgetId}/items/${itemId}`,
        data,
      );
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget-items", budgetId] });
      queryClient.invalidateQueries({ queryKey: ["budgets", budgetId] });
    },
  });
}

export function useDuplicateBudgetItem(budgetId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (itemId: string) => {
      const { data: items } = await axios.get(`/api/budgets/${budgetId}/items`);
      const itemToDuplicate = items.find(
        (item: BudgetItem) => item.id === itemId,
      );

      if (!itemToDuplicate) throw new Error("Item não encontrado");

      const {
        id,
        budgetId: bId,
        createdAt,
        updatedAt,
        ...copyData
      } = itemToDuplicate;
      const { data: newEntry } = await axios.post(
        `/api/budgets/${budgetId}/items`,
        {
          ...copyData,
          description: `${copyData.description} (Cópia)`,
        },
      );
      return newEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget-items", budgetId] });
      queryClient.invalidateQueries({ queryKey: ["budgets", budgetId] });
    },
  });
}

export function useBudgetRates(budgetId: string) {
  return useQuery<BudgetRates>({
    queryKey: ["budget-rates", budgetId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/budgets/${budgetId}/rates`);
      return data;
    },
    enabled: !!budgetId,
  });
}

export function useUpdateBudgetRates(budgetId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (rates: BudgetRates) => {
      const { data } = await axios.patch(
        `/api/budgets/${budgetId}/rates`,
        rates,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget-rates", budgetId] });
      queryClient.invalidateQueries({ queryKey: ["budget-items", budgetId] });
      queryClient.invalidateQueries({ queryKey: ["budgets", budgetId] });
    },
  });
}

export function useImageTypes() {
  return useQuery({
    queryKey: ["image-types"],
    queryFn: async () => {
      const { data } = await axios.get("/api/image-types");
      return data as Array<{
        id: string;
        name: string;
        baseHours: number;
        icon?: string;
      }>;
    },
  });
}

export function useDifficulties() {
  return useQuery({
    queryKey: ["difficulties"],
    queryFn: async () => {
      const { data } = await axios.get("/api/difficulties");
      return data as Array<{
        id: string;
        name: string;
        multiplier: number;
        criteria?: string;
      }>;
    },
  });
}

export function useOperationalCosts() {
  return useQuery({
    queryKey: ["operational-costs"],
    queryFn: async () => {
      const [fixedRes, variableRes] = await Promise.all([
        axios.get("/api/fixed-costs"),
        axios.get("/api/variable-costs"),
      ]);

      const fixedTotal = (fixedRes.data as any[]).reduce(
        (s, c) => s + c.value,
        0,
      );
      // Only include variable costs that are NOT linked to a budget (general operational costs)
      const variableTotal = (variableRes.data as any[])
        .filter((c) => !c.budgetId)
        .reduce((s, c) => s + c.value, 0);

      return {
        fixed: fixedTotal,
        variable: variableTotal,
        total: fixedTotal + variableTotal,
      };
    },
  });
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useInvoices() {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const response = await axios.get("/api/invoices");
      return response.data;
    },
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post("/api/invoices", data);
      return response.data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      if (data.budgetId) {
        queryClient.invalidateQueries({ queryKey: ["budgets", data.budgetId] });
      }
    },
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const response = await axios.patch(`/api/invoices/${id}`, data);
      return response.data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice", data.id] });
      if (data.budgetId) {
        queryClient.invalidateQueries({ queryKey: ["budgets", data.budgetId] });
      }
    },
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/invoices/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      // Invalidate all budgets to be safe, as we don't know which budget this invoice belonged to
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
  });
}

export function useCreateCheckout() {
  return useMutation({
    mutationFn: async ({
      id,
      gateway,
    }: {
      id: string;
      gateway: "stripe" | "mercadopago";
    }) => {
      const response = await axios.post(`/api/invoices/${id}/checkout`, {
        gateway,
      });
      return response.data;
    },
  });
}

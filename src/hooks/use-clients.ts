import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { ClientInput } from "@/schemas/client";

export function useClients() {
  return useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data } = await axios.get("/api/clients");
      return data;
    },
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (client: ClientInput) => {
      const { data } = await axios.post("/api/clients", client);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete(`/api/clients/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ClientInput> }) => {
      const response = await axios.patch(`/api/clients/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}

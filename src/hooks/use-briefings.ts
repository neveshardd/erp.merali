import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export function useBriefings() {
  return useQuery({
    queryKey: ["briefings"],
    queryFn: async () => {
      const response = await axios.get("/api/briefings");
      return response.data;
    },
  });
}

export function useCreateBriefing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post("/api/briefings", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["briefings"] });
    },
  });
}

export function useUpdateBriefing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const response = await axios.patch(`/api/briefings/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["briefings"] });
    },
  });
}

export function useDeleteBriefing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/briefings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["briefings"] });
    },
  });
}

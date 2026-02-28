import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

export function useConfigs() {
  return useQuery({
    queryKey: ["configs"],
    queryFn: async () => {
      const { data } = await axios.get("/api/configs")
      return data
    },
  })
}

export function useSaveConfigs() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ name, configs }: { name: string; configs: any[] }) => {
      const { data } = await axios.post("/api/configs", { name, configs })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configs"] })
    },
  })
}

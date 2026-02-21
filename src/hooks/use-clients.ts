import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { ClientInput } from "@/schemas/client"

export function useClients() {
  return useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data } = await axios.get("/api/clients")
      return data
    },
  })
}

export function useCreateClient() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (client: ClientInput) => {
      const { data } = await axios.post("/api/clients", client)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] })
    },
  })
}

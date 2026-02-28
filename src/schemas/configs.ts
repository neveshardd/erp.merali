import { z } from "zod"

export const configSchema = z.object({
  key: z.string().min(1, "Chave é obrigatória"),
  value: z.string().min(1, "Valor é obrigatório"),
  label: z.string().optional(),
  description: z.string().optional(),
})

export const configGroupSchema = z.object({
  name: z.string().min(1, "Nome do grupo é obrigatório"),
  configs: z.array(configSchema).optional(),
})

export type ConfigInput = z.infer<typeof configSchema>
export type ConfigGroupInput = z.infer<typeof configGroupSchema>

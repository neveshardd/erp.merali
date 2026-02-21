import { z } from "zod"

export const clientTypeSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  multiplier: z.coerce.number().min(0, "Multiplicador não pode ser negativo"),
  description: z.string().optional(),
})

export type ClientTypeInput = z.infer<typeof clientTypeSchema>

export const imageTypeSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  baseHours: z.coerce.number().min(0, "Horas base não podem ser negativas"),
  icon: z.string().optional().nullable(),
  description: z.string().optional(),
})

export type ImageTypeInput = z.infer<typeof imageTypeSchema>

export const difficultySchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  multiplier: z.coerce.number().min(0, "Multiplicador não pode ser negativo"),
  criteria: z.string().optional(),
})

export type DifficultyInput = z.infer<typeof difficultySchema>

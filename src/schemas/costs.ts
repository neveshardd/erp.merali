import { z } from "zod";

export const fixedCostSchema = z.object({
  description: z.string().min(3, "Descrição deve ter pelo menos 3 caracteres"),
  category: z.string().optional(),
  value: z.coerce.number().positive("Valor deve ser positivo"),
  dueDate: z.coerce.number().min(1).max(31).optional().nullable(),
});

export type FixedCostInput = z.infer<typeof fixedCostSchema>;

export const variableCostSchema = z.object({
  description: z.string().min(3, "Descrição deve ter pelo menos 3 caracteres"),
  value: z.coerce.number().positive("Valor deve ser positivo"),
  date: z.coerce.date().default(() => new Date()),
  budgetId: z.string().optional().nullable(),
});

export type VariableCostInput = z.infer<typeof variableCostSchema>;

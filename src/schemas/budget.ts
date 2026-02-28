import { z } from "zod";

export const budgetSchema = z.object({
  projectName: z
    .string()
    .min(2, "Nome do projeto deve ter pelo menos 2 caracteres"),
  clientId: z.string().min(1, "Selecione um cliente"),
  clientTypeName: z.string().min(1, "Selecione o perfil do cliente"),
  category: z.string().optional(),
  deadline: z.string().optional(),
  status: z
    .enum(["PENDING", "APPROVED", "IN_PROGRESS", "FINISHED", "CANCELLED"])
    .default("PENDING"),
  totalValue: z.number().optional().default(0),
});

export type BudgetInput = z.infer<typeof budgetSchema>;

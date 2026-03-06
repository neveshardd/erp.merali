import { z } from "zod";

export const bioLinkSchema = z.object({
    title: z.string().min(1, "O título é obrigatório"),
    url: z.string().url("A URL deve ser válida"),
    icon: z.string().optional().nullable(),
    order: z.number().int().default(0),
    isActive: z.boolean().default(true),
});

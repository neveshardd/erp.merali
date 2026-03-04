import { prisma } from "./prisma";

export async function getStudioConfigs() {
    const group = await (prisma as any).configGroup.findUnique({
        where: { name: "studio" },
        include: { configs: true },
    });

    const defaults = {
        name: "Merali Studio",
        cnpj: "50.123.456/0001-00",
        email: "contato@merali.com.br",
        phone: "+55 61 99999-9999",
        website: "www.merali.com.br",
        address: "Endereço não cadastrado",
        city: "São Paulo/SP",
        representative: "Jose Eugenio Neves Nunes",
        terms: "Pagamento devido em até 7 dias após a emissão. Valores em atraso poderão sofrer multa de 2% e juros de 1% ao mês. Este orçamento é válido por 7 dias."
    };

    if (!group) return defaults;

    const configs = { ...defaults };
    (group.configs as any[]).forEach((c: any) => {
        if (c.key in configs) {
            (configs as any)[c.key] = c.value;
        }
    });

    return configs;
}

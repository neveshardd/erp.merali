import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { auth } from "./src/lib/auth";

const DATABASE_URL = process.env.DATABASE_URL;

// ── Credenciais do usuário seed (via .env) ───────────────────────────────────
const SEED_NAME = process.env.SEED_NAME;
const SEED_EMAIL = process.env.SEED_EMAIL;
const SEED_PASSWORD = process.env.SEED_PASSWORD;

if (!DATABASE_URL || !SEED_NAME || !SEED_EMAIL || !SEED_PASSWORD) {
    console.error("Variáveis de ambiente obrigatórias não definidas:");
    if (!DATABASE_URL) console.error("   - DATABASE_URL");
    if (!SEED_NAME) console.error("   - SEED_NAME");
    if (!SEED_EMAIL) console.error("   - SEED_EMAIL");
    if (!SEED_PASSWORD) console.error("   - SEED_PASSWORD");
    console.error("\n   Defina-as no arquivo .env e tente novamente.");
    process.exit(1);
}

const adapter = new PrismaPg({ connectionString: DATABASE_URL });
const prisma = new PrismaClient({ adapter });
// ────────────────────────────────────────────────────────────────────────────

async function main() {
    console.log("Iniciando seed...\n");

    // Verifica se o usuário já existe
    const existing = await prisma.user.findUnique({
        where: { email: SEED_EMAIL },
    });

    if (existing) {
        console.log(`Usuário já existe: ${SEED_EMAIL}`);
        console.log("   Nenhuma alteração foi feita.");
        return;
    }

    // Cria o usuário via better-auth (já faz o hash da senha corretamente)
    try {
        const result = await auth.api.signUpEmail({
            body: {
                name: SEED_NAME as string,
                email: SEED_EMAIL as string,
                password: SEED_PASSWORD as string,
            },
        });

        console.log("Usuário criado com sucesso!");
        console.log(`   Nome:  ${result.user.name}`);
        console.log(`   Email: ${result.user.email}`);
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error("Erro ao criar usuário:", msg);
        process.exit(1);
    }
}

main()
    .catch((e) => {
        console.error("Erro inesperado:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bioLinkSchema } from "@/schemas/bio-link";

import { isOriginAllowed, corsHeaders } from "@/lib/cors";

export async function GET(request: Request) {
    try {
        const origin = request.headers.get("origin");
        const isAllowed = isOriginAllowed(origin);

        const links = await prisma.bioLink.findMany({
            orderBy: { order: "asc" },
        });

        const headers = new Headers();
        if (origin && isAllowed) {
            headers.set("Access-Control-Allow-Origin", origin);
            headers.set("Access-Control-Allow-Credentials", "true");
        }

        return NextResponse.json(links, { headers });
    } catch (error) {
        console.error("Error fetching bio links:", error);
        return NextResponse.json(
            { error: "Erro ao buscar links da bio" },
            { status: 500 },
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedData = bioLinkSchema.parse(body);

        const link = await prisma.bioLink.create({
            data: validatedData,
        });

        return NextResponse.json(link, { status: 201 });
    } catch (error: any) {
        if (error.name === "ZodError") {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        console.error("Error creating bio link:", error);
        return NextResponse.json(
            { error: "Erro ao criar link da bio" },
            { status: 500 },
        );
    }
}

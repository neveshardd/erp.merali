import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bioLinkSchema } from "@/schemas/bio-link";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const link = await prisma.bioLink.findUnique({
            where: { id },
        });

        if (!link) {
            return NextResponse.json({ error: "Link não encontrado" }, { status: 404 });
        }

        return NextResponse.json(link);
    } catch (error) {
        console.error("Error fetching bio link:", error);
        return NextResponse.json({ error: "Erro ao buscar link" }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const validatedData = bioLinkSchema.partial().parse(body);

        const link = await prisma.bioLink.update({
            where: { id },
            data: validatedData,
        });

        return NextResponse.json(link);
    } catch (error: any) {
        if (error.name === "ZodError") {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        console.error("Error updating bio link:", error);
        return NextResponse.json({ error: "Erro ao atualizar link" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.bioLink.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("Error deleting bio link:", error);
        return NextResponse.json({ error: "Erro ao excluir link" }, { status: 500 });
    }
}

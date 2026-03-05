import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clientSchema } from "@/schemas/client";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const validatedData = clientSchema.partial().parse(body);

        const client = await prisma.client.update({
            where: { id },
            data: validatedData,
        });

        return NextResponse.json(client);
    } catch (error) {
        console.error("[CLIENT_PATCH]", error);
        return NextResponse.json(
            { error: "Erro ao atualizar cliente" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.client.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("[CLIENT_DELETE]", error);
        return NextResponse.json(
            { error: "Erro ao excluir cliente" },
            { status: 500 }
        );
    }
}

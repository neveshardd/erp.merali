import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const media = await prisma.media.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(media);
  } catch (error) {
    console.error("Error updating media:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar mídia" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // 1. Get media from DB to get the URL
    const media = await prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      return NextResponse.json(
        { error: "Mídia não encontrada" },
        { status: 404 },
      );
    }

    // 2. Extract key from URL
    // Assuming URL is like: https://public-url.com/key.extension
    const fileKey = media.url.split("/").pop();

    if (fileKey && !media.url.startsWith("http") === false) {
      try {
        const { DeleteObjectCommand } = await import("@aws-sdk/client-s3");
        const { s3Client, BUCKET_NAME } = await import("@/lib/s3");

        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: fileKey,
          }),
        );
      } catch (r2Error) {
        console.error("Error deleting from R2:", r2Error);
        // We continue deleting from DB even if R2 fails
      }
    }

    // 3. Delete from DB
    await prisma.media.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting media:", error);
    return NextResponse.json(
      { error: "Erro ao excluir mídia" },
      { status: 500 },
    );
  }
}

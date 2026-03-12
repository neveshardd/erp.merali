import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const inputSchema = z.object({
  caption: z.string().min(1, "A legenda não pode estar vazia"),
  imageUrls: z.array(z.string().url()).min(1, "Pelo menos uma imagem é necessária"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = inputSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ 
        error: "Dados de entrada inválidos", 
        details: result.error.format() 
      }, { status: 400 });
    }

    const { caption, imageUrls } = result.data;

    // 1. Buscar credenciais do Banco de Dados
    const account = await prisma.socialAccount.findUnique({
      where: { platform: "instagram" }
    });

    if (!account || !account.accessToken || !account.businessId) {
      return NextResponse.json({ 
        error: "Instagram não conectado", 
        details: "Por favor, realize a conexão no painel de Automação Social primeiro." 
      }, { status: 401 });
    }

    let accessToken = account.accessToken;
    const igId = account.businessId;

    // 2. Lógica de Auto-Renovação (se o token tiver mais de 30 dias, tentamos renovar)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    if (account.updatedAt < thirtyDaysAgo) {
      console.log("Renovando token do Instagram automaticamente...");
      try {
        const appId = process.env.FACEBOOK_APP_ID;
        const appSecret = process.env.FACEBOOK_APP_SECRET;
        
        const refreshRes = await fetch(
          `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${accessToken}`
        );
        const refreshData = await refreshRes.json();
        
        if (refreshRes.ok && refreshData.access_token) {
          accessToken = refreshData.access_token;
          await prisma.socialAccount.update({
            where: { id: account.id },
            data: { 
              accessToken,
              updatedAt: new Date()
            }
          });
          console.log("Token renovado com sucesso.");
        }
      } catch (refreshError) {
        console.error("Falha ao renovar token automaticamente:", refreshError);
        // Continuamos com o token antigo, talvez ainda funcione
      }
    }

    // Instagram API Workflow
    const isCarousel = imageUrls.length > 1;

    if (isCarousel) {
      // Step 1: Create Media Containers for each child item
      // Instagram allows up to 10 items in a carousel
      const itemsToPublish = imageUrls.slice(0, 10);
      const childContainerIds = [];

      for (const imageUrl of itemsToPublish) {
        const itemRes = await fetch(`https://graph.facebook.com/v21.0/${igId}/media`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            image_url: imageUrl,
            is_carousel_item: "true",
            access_token: accessToken,
          }),
        });

        const itemData = await itemRes.json();
        if (!itemRes.ok) {
          throw new Error(`Erro ao criar item do carrossel: ${itemData.error?.message}`);
        }
        childContainerIds.push(itemData.id);
      }

      // Step 2: Create Carousel Master Container
      const carouselRes = await fetch(`https://graph.facebook.com/v21.0/${igId}/media`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          media_type: "CAROUSEL",
          children: childContainerIds.join(","),
          caption: caption,
          access_token: accessToken,
        }),
      });

      const carouselData = await carouselRes.json();
      if (!carouselRes.ok) {
        throw new Error(`Erro ao criar container de carrossel: ${carouselData.error?.message}`);
      }

      const creationId = carouselData.id;

      // Step 3: Aguardar o processamento do carrossel
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Step 4: Publish the Carousel
      const publishRes = await fetch(`https://graph.facebook.com/v21.0/${igId}/media_publish`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          creation_id: creationId,
          access_token: accessToken,
        }),
      });

      const publishData = await publishRes.json();
      if (!publishRes.ok) {
        throw new Error(`Erro ao publicar carrossel: ${publishData.error?.message || "O Instagram recusou o carrossel"}`);
      }

      const postId = publishData.id;
      
      // Step 5: Obter o link real da postagem (Permalink)
      let postUrl = `https://www.instagram.com/reels/`; // Fallback
      try {
        const permalinkRes = await fetch(`https://graph.facebook.com/v21.0/${postId}?fields=permalink&access_token=${accessToken}`);
        const permalinkData = await permalinkRes.json();
        if (permalinkRes.ok && permalinkData.permalink) {
          postUrl = permalinkData.permalink;
        }
      } catch (e) {
        console.error("Erro ao buscar permalink do carrossel:", e);
      }

      // Save to history
      try {
        await prisma.socialPost.create({
          data: {
            caption,
            imageUrls,
            platform: "instagram",
            postId: postId,
            postUrl: postUrl,
            status: "published"
          }
        });
      } catch (dbError) {
        console.error("Failed to save post history to DB:", dbError);
      }

      return NextResponse.json({ 
        status: "published", 
        id: postId,
        url: postUrl
      });

    } else {
      // Single Image Flow
      const primaryImageUrl = imageUrls[0];

      // Step 1: Create Media Container
      const containerRes = await fetch(`https://graph.facebook.com/v21.0/${igId}/media`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          image_url: primaryImageUrl,
          caption: caption,
          access_token: accessToken,
        }),
      });

      const containerData = await containerRes.json();
      if (!containerRes.ok) {
        throw new Error(`Erro ao criar container: ${containerData.error?.message || "Resposta inválida do Instagram"}`);
      }

      const creationId = containerData.id;

      // Step 2: Aguardar o processamento da imagem (importante para evitar erro de "Media not ready")
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Step 3: Publish the Container
      const publishRes = await fetch(`https://graph.facebook.com/v21.0/${igId}/media_publish`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          creation_id: creationId,
          access_token: accessToken,
        }),
      });

      const publishData = await publishRes.json();
      if (!publishRes.ok) {
        throw new Error(`Erro ao publicar: ${publishData.error?.message || "O Instagram não autorizou a publicação"}`);
      }

      const postId = publishData.id;

      // Step 4: Obter o link real da postagem (Permalink)
      let postUrl = `https://www.instagram.com/p/${postId}/`; // Fallback
      try {
        const permalinkRes = await fetch(`https://graph.facebook.com/v21.0/${postId}?fields=permalink&access_token=${accessToken}`);
        const permalinkData = await permalinkRes.json();
        if (permalinkRes.ok && permalinkData.permalink) {
          postUrl = permalinkData.permalink;
        }
      } catch (e) {
        console.error("Erro ao buscar permalink:", e);
      }

      // Save to history
      try {
        await prisma.socialPost.create({
          data: {
            caption,
            imageUrls,
            platform: "instagram",
            postId: postId,
            postUrl: postUrl,
            status: "published"
          }
        });
      } catch (dbError) {
        console.error("Failed to save post history to DB:", dbError);
      }

      return NextResponse.json({ 
        status: "published", 
        id: postId,
        url: postUrl
      });
    }

  } catch (error: any) {
    console.error("Instagram Route Error:", error);
    return NextResponse.json({ 
      error: "Erro ao processar a postagem",
      details: error.message || "Erro interno no servidor"
    }, { status: 500 });
  }
}

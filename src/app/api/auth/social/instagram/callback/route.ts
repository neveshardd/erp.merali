import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Código de autorização não fornecido" }, { status: 400 });
  }

  const appId = process.env.FACEBOOK_APP_ID;
  const appSecret = process.env.FACEBOOK_APP_SECRET;
  
  // Construct redirectUri from the incoming request's origin
  const origin = new URL(request.url).origin;
  const redirectUri = `${origin}/api/auth/social/instagram/callback`;

  try {
    // 1. Trocar o código pelo Access Token de curta duração
    const tokenRes = await fetch(
      `https://graph.facebook.com/v21.0/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&redirect_uri=${redirectUri}&code=${code}`
    );
    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) throw new Error(tokenData.error?.message || "Erro ao obter token");

    const shortToken = tokenData.access_token;

    // 2. Trocar pelo Token de LONGA DURAÇÃO (60 dias)
    const longTokenRes = await fetch(
      `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortToken}`
    );
    const longTokenData = await longTokenRes.json();
    const accessToken = longTokenData.access_token;

    // 3. Descobrir o Instagram Business ID automaticamente
    const accountsRes = await fetch(
      `https://graph.facebook.com/v21.0/me/accounts?fields=instagram_business_account,name&access_token=${accessToken}`
    );
    const accountsData = await accountsRes.json();

    const igAccount = accountsData.data?.find((acc: any) => acc.instagram_business_account);
    const igId = igAccount?.instagram_business_account?.id;

    if (!igId) {
      return NextResponse.json({ 
        error: "Nenhuma conta do Instagram Business encontrada vinculada à sua página do Facebook. Verifique as configurações no app do Instagram." 
      }, { status: 404 });
    }

    // 4. Salvar ou atualizar no Banco de Dados automaticamente
    await prisma.socialAccount.upsert({
      where: { platform: "instagram" },
      update: {
        accessToken: accessToken,
        businessId: igId,
        updatedAt: new Date(),
      },
      create: {
        platform: "instagram",
        accessToken: accessToken,
        businessId: igId,
      },
    });

    // 5. Retornar os dados para o usuário e informar que foi salvo
    return new NextResponse(`
      <html>
        <head>
          <meta charset="UTF-8">
        </head>
        <body style="font-family: sans-serif; padding: 40px; background: #fafafa; color: #333; display: flex; align-items: center; justify-content: center; min-height: 80vh;">
          <div style="max-width: 500px; width: 100%; background: white; padding: 40px; border-radius: 30px; box-shadow: 0 20px 50px rgba(0,0,0,0.05); text-align: center;">
            <div style="font-size: 50px; margin-bottom: 20px;">✅</div>
            <h1 style="color: #333; font-weight: 900; letter-spacing: -0.05em; margin-bottom: 10px;">CONECTADO!</h1>
            <p style="color: #666; line-height: 1.6;">As credenciais foram salvas automaticamente no banco de dados do ERP.</p>
            <div style="background: #f8f8f8; padding: 15px; border-radius: 15px; margin: 25px 0; font-size: 13px; color: #888;">
              O sistema agora renovará os tokens automaticamente.
            </div>
            <button onclick="window.close()" style="background: #000; color: white; border: none; padding: 15px 30px; border-radius: 15px; font-weight: bold; cursor: pointer; width: 100%; transition: scale 0.2s;">Fechar Janela</button>
          </div>
        </body>
      </html>
    `, { headers: { "Content-Type": "text/html" } });

  } catch (error: any) {
    console.error("Auth Callback Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

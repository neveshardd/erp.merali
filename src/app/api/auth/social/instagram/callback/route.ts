import { NextResponse } from "next/server";

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

    // 4. Retornar os dados para o usuário salvar (ou salvar no DB futuramente)
    // Por agora, vamos mostrar na tela para você copiar uma última vez e colocar no .env de forma definitiva
    return new NextResponse(`
      <html>
        <body style="font-family: sans-serif; padding: 40px; background: #fafafa; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 20px; shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <h1 style="color: #e1306c;">✨ Conectado com Sucesso!</h1>
            <p>O ERP Studio Merali agora tem acesso ao seu Instagram.</p>
            <div style="background: #f0f0f0; padding: 20px; border-radius: 10px; margin-top: 20px;">
              <p><strong>Copie estas variáveis para o seu arquivo .env:</strong></p>
              <pre style="white-space: pre-wrap; word-break: break-all;">
INSTAGRAM_ACCESS_TOKEN=${accessToken}
INSTAGRAM_BUSINESS_ID=${igId}
              </pre>
            </div>
            <p style="margin-top: 20px; color: #666; font-size: 14px;">Este token é de longa duração e não expirará em poucas horas.</p>
            <button onclick="window.close()" style="background: #333; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Fechar Janela</button>
          </div>
        </body>
      </html>
    `, { headers: { "Content-Type": "text/html" } });

  } catch (error: any) {
    console.error("Auth Callback Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

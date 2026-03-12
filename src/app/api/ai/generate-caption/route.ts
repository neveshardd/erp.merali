import { NextResponse } from "next/server";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";

const inputSchema = z.object({
  description: z.string().optional(),
  files: z.array(z.string()).optional().default([]),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = inputSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Dados de entrada inválidos" }, { status: 400 });
    }

    const { description, files } = result.data;
    const apiKey = process.env.GEMINI_API_KEY;

    // Fallback logic for development without API Key
    if (!apiKey) {
      console.warn("GEMINI_API_KEY not configured. Falling back to simulation mode.");
      return NextResponse.json({
        description: `[Simulação Merali]: Elevando o conceito de design contemporâneo. Cada detalhe das imagens ${files.join(", ")} reflete nossa obsessão por visual de prestígio e hiper-realismo. Contexto: ${description || "Beleza arquitetônica pura."} #MeraliStudio #Architecture #LuxuryDesign`
      });
    }

    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        systemInstruction: `Você é o estrategista de comunicação do Studio Merali, especializado em marketing de ultra-luxo e visual de prestígio. 
        Seu objetivo é criar legendas para Instagram que transpareçam exclusividade, precisão técnica e sofisticação arquitetônica.
        Diretrizes:
        - Tom: Majestoso, técnico, porém inspirador.
        - Foco: Hiper-realismo, atmosfera, luz e a transformação do amanhã.
        - Estrutura: Comece com uma frase de impacto curta e poderosa. Siga com um parágrafo curto e envolvente. Use 2-3 emojis elegantes e blocos de hashtags estratégicas.
        - Idioma: Português Brasileiro de alto nível.
        - HASHTAGS (Obrigatório): Sempre utilize uma combinação das seguintes hashtags de alto engajamento para Renders 3D e ArchViz: #ArchViz #3DRendering #CGI #ArchitectureVisualization #InteriorDesign #ArchitectureDaily #Hyperrealism #DigitalArch #StudioMerali.
        - Nunca use palavras clichê como 'incrível' ou 'top'. Prefira 'atemporal', 'sublime', 'excepcional', 'precisão'.`
    });

    const prompt = `Você é um editor de luxo de elite especializado em arquitetura e visualização 3D para o "Studio Merali".
    Sua tarefa é REFINAR e ELEVAR o texto ou contexto fornecido pelo usuário para o padrão majestoso da referência abaixo.

    REFERÊNCIA DE ESTILO (PADRÃO STUDIO MERALI):
    "Existe uma grande diferença entre mostrar uma fachada e fazer com que ela seja sentida. 
    A luz atravessa o vidro, revela volumes e cria reflexos... 
    Não buscamos apenas representar arquitetura. Buscamos atmosfera. Intenção. Contexto."

    DIRETRIZES DE REFINAMENTO:
    1. PRIORIDADE: Use o texto do usuário como a base da 'intenção'. Se o texto estiver simples, transforme-o em algo poético, técnico e minimalista.
    2. FOCO: Injete conceitos de 'atmosfera', 'luz', 'presença' e 'experiência sensorial'.
    3. HASHTAGS: Inclua obrigatoriamente as hashtags em alta: #ArchViz #3DRendering #CGI #ArchitectureVisualization #ArchitectureDaily #VisualizacaoArquitetonica #StudioMerali.
    4. ESTRUTURA OBRIGATÓRIA: 
       - Um parágrafo impactante em Português (refinando a ideia original).
       - Uma assinatura de marca poderosa em Português.
       - Uma versão fiel e elegante em Inglês (EN).
       - O bloco de hashtags premium mencionado.
       
    TEXTO/CONTEXTO ORIGINAL DO USUÁRIO: "${description || "Uma nova obra prima do Studio Merali."}"

    Forneça APENAS a legenda final refinada, sem introduções ou comentários.`;

    const resultAI = await model.generateContent(prompt);
    const responseAI = await resultAI.response;
    const content = responseAI.text();

    if (!content) {
      throw new Error("Resposta vazia da IA");
    }

    return NextResponse.json({ description: content.trim() });

  } catch (error: any) {
    console.error("Gemini AI Route Error:", error);
    
    // Identificar erro de cota ou chave inválida
    if (error.message?.includes("API key")) {
        return NextResponse.json({ error: "Chave de API do Google Gemini inválida ou não configurada." }, { status: 401 });
    }
    
    return NextResponse.json({ error: "Erro ao processar a legenda com o Google Gemini. Verifique sua cota gratuita." }, { status: 500 });
  }
}

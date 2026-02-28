import React from 'react'
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer'

// ── Paleta ────────────────────────────────────────────────────────────────────
const DARK  = '#0a0a0a'
const GRAY  = '#6b6b6b'
const LIGHT = '#f0f0f0'
const WHITE = '#ffffff'

// ── Medidas A4 (595 × 842 pt) ─────────────────────────────────────────────────
const PAD    = 40   // Aumentado de 16 para 40 para margens mais seguras
const GAP    = 12   // Aumentado de 8 para 12 para mais respiro entre imagens
const HDR    = 48   // Aumentado de 32 para 48 para um header mais imponente
const FTR    = 40   // Aumentado de 24 para 40 para um footer mais limpo
const TEXT_CARDS = [
    "A iluminação correta não apenas mostra, ela revela o propósito do espaço.",
    "O realismo é a ferramenta mais poderosa para alinhar expectativas e acelerar aprovações.",
    "Buscamos o equilíbrio entre a perfeição técnica e a alma do projeto arquitetônico.",
    "Imagens que não apenas apresentam volumes, mas evocam a sensação de habitabilidade.",
    "Nossa meta é reduzir a distância entre o sonho do cliente e a realidade construída.",
    "Cada render é uma oportunidade de contar a história que a planta baixa ainda não revela."
]

const s = StyleSheet.create({
    // ── Capa ─────────────────────────────────────────────────────────────────
    coverPage: {
        width: 595,
        height: 842,
        backgroundColor: DARK,
    },
    coverBg: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
    },
    coverOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: DARK,
        opacity: 0.75,
    },
    coverContent: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: PAD * 1.5,
    },
    eyebrow: {
        fontSize: 9, // Aumentado de 7 para 9
        fontFamily: 'Helvetica-Bold',
        color: WHITE,
        opacity: 0.38,
        textTransform: 'uppercase',
        letterSpacing: 4, // Mais espaçamento para elegância
        marginBottom: 16,
        textAlign: 'center',
    },
    coverTitle: {
        fontSize: 72, // Aumentado de 54 para 72
        fontFamily: 'Helvetica-Bold',
        color: WHITE,
        textTransform: 'uppercase',
        lineHeight: 1.0,
        marginBottom: 8,
        textAlign: 'center',
    },
    coverSub: {
        fontSize: 18, // Aumentado de 13 para 18
        fontFamily: 'Helvetica',
        color: WHITE,
        opacity: 0.48,
        textTransform: 'uppercase',
        letterSpacing: 3,
        marginBottom: 36,
        textAlign: 'center',
    },
    divider: {
        width: 40, height: 2,
        backgroundColor: WHITE,
        opacity: 0.22,
        marginBottom: 26,
    },
    meta:      { flexDirection: 'row', gap: 28, marginTop: 10 },
    metaItem:  { flexDirection: 'column', gap: 3, alignItems: 'center' },
    metaLabel: {
        fontSize: 8, // Aumentado de 6 para 8
        fontFamily: 'Helvetica-Bold',
        color: WHITE, opacity: 0.32,
        textTransform: 'uppercase', letterSpacing: 1.5,
    },
    metaValue: {
        fontSize: 11, // Aumentado de 9 para 11
        fontFamily: 'Helvetica-Bold',
        color: WHITE, opacity: 0.68,
        textTransform: 'uppercase',
        textAlign: 'center',
    },

    // ── Página de galeria ─────────────────────────────────────────────────────
    galleryPage: {
        backgroundColor: WHITE,
        width: 595,
        height: 842,
        paddingTop: 20,    // Margem de segurança superior absoluta
        paddingBottom: 20, // Margem de segurança inferior absoluta
    },
    header: {
        height: HDR,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: PAD,
        borderBottomWidth: 0.5,
        borderBottomColor: LIGHT,
    },
    headerBrand: {
        fontSize: 6.5, fontFamily: 'Helvetica-Bold',
        color: GRAY, textTransform: 'uppercase', letterSpacing: 1.5,
    },
    headerNum: {
        fontSize: 6.5, fontFamily: 'Helvetica-Bold',
        color: GRAY, opacity: 0.45, letterSpacing: 1,
    },
    footer: {
        height: FTR,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: PAD,
        borderTopWidth: 0.5,
        borderTopColor: LIGHT,
    },
    footerText: {
        fontSize: 5.5, fontFamily: 'Helvetica-Bold',
        color: '#C0C0C0', textTransform: 'uppercase', letterSpacing: 0.8,
    },
    footerDot: {
        width: 3, height: 3, borderRadius: 1.5,
        backgroundColor: DARK, opacity: 0.12,
    },
    caption: {
        marginTop: 6,
        fontSize: 6, fontFamily: 'Helvetica-Bold',
        color: GRAY, textTransform: 'uppercase',
        letterSpacing: 0.5, opacity: 0.6,
    },

    // ── Página de Manifesto ──────────────────────────────────────────────────
    manifestoPage: {
        backgroundColor: DARK,
        width: 595,
        height: 842,
        padding: PAD * 2,
        justifyContent: 'center',
    },
    manifestoEyebrow: {
        fontSize: 10, fontFamily: 'Helvetica-Bold',
        color: WHITE, opacity: 0.3, textTransform: 'uppercase',
        letterSpacing: 4, marginBottom: 24,
    },
    manifestoTitle: {
        fontSize: 32, fontFamily: 'Helvetica-Bold',
        color: WHITE, lineHeight: 1.2, marginBottom: 32,
        textTransform: 'uppercase', letterSpacing: -1,
    },
    manifestoText: {
        fontSize: 12, fontFamily: 'Helvetica',
        color: WHITE, opacity: 0.7, lineHeight: 1.8,
        marginBottom: 20,
    },
    manifestoHighlight: {
        color: WHITE, fontFamily: 'Helvetica-Bold', opacity: 1,
    },

    // ── Novo: Card de Texto na Galeria ───────────────────────────────────────
    textCard: {
        backgroundColor: LIGHT,
        borderRadius: 3,
        padding: 12,
        marginBottom: GAP,
        minHeight: 120,
        justifyContent: 'center',
    },
    textCardContent: {
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        color: GRAY,
        lineHeight: 1.5,
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
})

// ── Helpers ───────────────────────────────────────────────────────────────────
export interface PortfolioPDFProps {
    images: Array<{ id: string; url: string; name: string }>
    year?: string
    configs?: {
        coverTitle?: string
        coverSubtitle?: string
        eyebrow?: string
        manifestoTitle?: string
        manifestoText?: string
        footerText?: string
        textCards?: string
        contactEmail?: string
        contactPhone?: string
        instagram?: string
        website?: string
    }
}

function cleanName(n: string) {
    return n.includes('.') ? n.substring(0, n.lastIndexOf('.')) : n
}

function chunk<T>(arr: T[], size: number): T[][] {
    const out: T[][] = []
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
    return out
}

// ── Bloco Dinâmico (Imagem ou Texto) ─────────────────────────────────────────
type GroupItem = 
    | { type: 'IMAGE'; url: string; name: string }
    | { type: 'TEXT'; content: string }

function GalleryItem({ item }: { item: GroupItem }) {
    if (item.type === 'TEXT') {
        return (
            <View style={s.textCard}>
                <Text style={s.textCardContent}>{item.content}</Text>
            </View>
        )
    }

    return (
        <View style={{ marginBottom: GAP }}>
            <Image
                src={item.url}
                style={{ width: '100%', borderRadius: 3 }}
            />
            <Text style={s.caption}>{cleanName(item.name)}</Text>
        </View>
    )
}

// ── Página de galeria (2 colunas, imagens no tamanho natural) ─────────────────
function GalleryPage({
    items,
    pageNum,
    total,
    brandText = "Merali Studio · Portfólio",
    footerText = "Merali Studio de Visualização · meralistudio.com.br"
}: {
    items: GroupItem[]
    pageNum: number
    total: number
    brandText?: string
    footerText?: string
}) {
    // Distribui alternadamente entre as duas colunas
    const col1 = items.filter((_, i) => i % 2 === 0)
    const col2 = items.filter((_, i) => i % 2 === 1)

    const colW = (595 - PAD * 2 - GAP) / 2

    return (
        <Page size="A4" style={s.galleryPage}>
            <View style={s.header}>
                <Text style={s.headerBrand}>{brandText}</Text>
                <Text style={s.headerNum}>{pageNum} / {total}</Text>
            </View>

            {/* Duas colunas fluidas */}
            <View style={{
                flex: 1,
                flexDirection: 'row',
                gap: GAP,
                paddingHorizontal: PAD,
                paddingVertical: PAD * 1.5, // Mais espaço vertical para evitar colar no header/footer
            }}>
                {/* Coluna 1 */}
                <View style={{ width: colW }}>
                    {col1.map((item, i) => <GalleryItem key={i} item={item} />)}
                </View>
                {/* Coluna 2 */}
                <View style={{ width: colW }}>
                    {col2.map((item, i) => <GalleryItem key={i} item={item} />)}
                </View>
            </View>

            <View style={s.footer}>
                <Text style={s.footerText}>{footerText}</Text>
                <View style={s.footerDot} />
                <Text style={s.footerText}>Portfólio Selecionado</Text>
            </View>
        </Page>
    )
}

// ── Documento principal ───────────────────────────────────────────────────────
export function PortfolioPDFDocument({ images, year, configs }: PortfolioPDFProps) {
    const coverImage  = images[0]
    const currentYear = year ?? new Date().getFullYear().toString()

    const defaultTexts = [
        "A iluminação correta não apenas mostra, ela revela o propósito do espaço.",
        "O realismo é a ferramenta mais poderosa para alinhar expectativas e acelerar aprovações.",
        "Buscamos o equilíbrio entre a perfeição técnica e a alma do projeto arquitetônico.",
        "Imagens que não apenas apresentam volumes, mas evocam a sensação de habitabilidade.",
        "Nossa meta é reduzir a distância entre o sonho do cliente e a realidade construída.",
        "Cada render é uma oportunidade de contar a história que a planta baixa ainda não revela."
    ]

    const textCards = configs?.textCards 
        ? configs.textCards.split('\n').filter(t => t.trim().length > 0)
        : defaultTexts

    // 4 itens por página
    const rawChunks = chunk(images, 4)
    const pages: GroupItem[][] = rawChunks.map((group, pageIdx) => {
        const items: GroupItem[] = group.map(img => ({ type: 'IMAGE', ...img }))
        
        // Sempre garante que cada página tenha exatamente 4 itens para não haver "buracos"
        if (items.length < 4) {
            const needed = 4 - items.length
            for (let i = 0; i < needed; i++) {
                items.push({ 
                    type: 'TEXT', 
                    content: textCards[(pageIdx + items.length + i) % textCards.length] 
                })
            }
        }
        return items
    })

    return (
        <Document>
            {/* ── Capa ──────────────────────────────────────────────── */}
            <Page size="A4" style={s.coverPage}>
                {coverImage && (
                    <Image src={coverImage.url} style={s.coverBg} />
                )}
                <View style={s.coverOverlay} />
                <View style={s.coverContent}>
                    <Text style={s.eyebrow}>{configs?.eyebrow || "High-End 3D Visualization Studio"}</Text>
                    <Text style={s.coverTitle}>{configs?.coverTitle || "Merali\nStudio"}</Text>
                    <Text style={s.coverSub}>{configs?.coverSubtitle || "Visualização Arquitetônica de Alto Padrão"}</Text>
                    <View style={s.divider} />
                    <View style={s.meta}>
                        <View style={s.metaItem}>
                            <Text style={s.metaLabel}>Ano</Text>
                            <Text style={s.metaValue}>{currentYear}</Text>
                        </View>
                        <View style={s.metaItem}>
                            <Text style={s.metaLabel}>Coleção</Text>
                            <Text style={s.metaValue}>Portfolio Selecionado</Text>
                        </View>
                        <View style={s.metaItem}>
                            <Text style={s.metaLabel}>Foco</Text>
                            <Text style={s.metaValue}>Realismo & Emoção</Text>
                        </View>
                    </View>
                </View>
            </Page>

            {/* ── Página de Aproximação (About) ─────────────────────────── */}
            <Page size="A4" style={s.manifestoPage}>
                <Text style={s.manifestoEyebrow}>Nossa Essência</Text>
                <Text style={s.manifestoTitle}>
                    {configs?.manifestoTitle || "Transformamos visões em\nexperiências visuais."}
                </Text>
                <Text style={s.manifestoText}>
                    {configs?.manifestoText || "Na Merali Studio, acreditamos que a visualização 3D vai além de simples pixels. Nossa missão é capturar a intenção de cada projeto e traduzi-la em imagens que evocam emoção e clareza. Unimos precisão técnica com uma sensibilidade artística apurada, garantindo que cada render conte uma história e valorize cada detalhe da sua arquitetura."}
                </Text>
                <View style={[s.divider, { backgroundColor: WHITE, marginTop: 20, opacity: 0.2 }]} />
            </Page>

            {/* ── Galeria ────────────────────────────────────────────── */}
            {pages.map((group, i) => (
                <GalleryPage
                    key={i}
                    items={group}
                    pageNum={i + 1}
                    total={pages.length}
                    brandText={`${configs?.coverTitle || "Merali Studio"} · Portfólio`}
                    footerText={configs?.footerText || "Merali Studio de Visualização · meralistudio.com.br"}
                />
            ))}

            {/* ── Página Final ───────────────────────────────────────── */}
            <Page size="A4" style={s.coverPage}>
                <View style={s.coverOverlay} />
                <View style={[s.coverContent, { alignItems: 'center', paddingBottom: 80 }]}>
                    <Text style={[s.eyebrow, { textAlign: 'center', color: WHITE, opacity: 0.5 }]}>
                        Vamos construir o futuro juntos?
                    </Text>
                    <Text style={[s.coverTitle, { fontSize: 54, textAlign: 'center' }]}>
                        {configs?.coverTitle || "Merali Studio"}
                    </Text>
                    <Text style={[s.coverSub, { textAlign: 'center', marginBottom: 24, fontSize: 16 }]}>
                        Visualização de Arquitetura
                    </Text>
                    <View style={[s.divider, { alignSelf: 'center' }]} />
                    <View style={{ alignItems: 'center', gap: 8 }}>
                        <Text style={[s.metaValue, { opacity: 0.6, fontSize: 10 }]}>{configs?.website || "meralistudio.com.br"}</Text>
                        <Text style={[s.metaValue, { opacity: 0.6, fontSize: 10 }]}>{configs?.instagram || "@merali_studio"}</Text>
                        <Text style={[s.metaValue, { opacity: 0.6, fontSize: 10 }]}>{configs?.contactEmail || "contato@meralistudio.com.br"}</Text>
                    </View>
                </View>
            </Page>
        </Document>
    )
}


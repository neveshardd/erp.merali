import React from 'react'
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer'

const GREEN = '#10b981'
const DARK = '#171717'
const GRAY = '#737373'
const LIGHT = '#F5F5F5'
const FAINT = '#FAFAFA'
const WHITE = '#FFFFFF'

const styles = StyleSheet.create({
    page: {
        backgroundColor: WHITE,
        fontFamily: 'Helvetica',
        color: DARK,
        fontSize: 9,
        paddingBottom: 44, // espaço reservado pro footer fixo
    },

    // ── Banner Header ──────────────────────────────────────────
    banner: {
        backgroundColor: DARK,
        paddingHorizontal: 50,
        paddingTop: 26,
        paddingBottom: 22,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    bannerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    logo: {
        width: 46,
        height: 46,
        borderRadius: 8,
    },
    bannerBrandInfo: {
        flexDirection: 'column',
        gap: 2,
    },
    bannerTitle: {
        fontSize: 24,
        fontFamily: 'Helvetica-Bold',
        color: WHITE,
        textTransform: 'uppercase',
    },
    bannerSubtitle: {
        fontSize: 7,
        fontFamily: 'Helvetica-Bold',
        color: WHITE,
        opacity: 0.4,
        textTransform: 'uppercase',
    },
    bannerRight: {
        alignItems: 'flex-end',
        gap: 5,
    },
    bannerAmountLabel: {
        fontSize: 7,
        fontFamily: 'Helvetica-Bold',
        color: WHITE,
        opacity: 0.4,
        textTransform: 'uppercase',
        marginBottom: 1,
    },
    bannerAmount: {
        fontSize: 26,
        fontFamily: 'Helvetica-Bold',
        color: WHITE,
    },
    paidBadge: {
        backgroundColor: GREEN,
        borderRadius: 20,
        paddingHorizontal: 9,
        paddingVertical: 3,
        alignSelf: 'flex-end',
    },
    paidBadgeText: {
        fontSize: 6,
        fontFamily: 'Helvetica-Bold',
        color: WHITE,
        textTransform: 'uppercase',
    },

    strip: {
        backgroundColor: GREEN,
        height: 4,
    },

    body: {
        paddingHorizontal: 50,
        paddingTop: 20,
    },

    // ── Meta row ────────────────────────────────────────────────
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: LIGHT,
    },
    metaLabel: {
        fontSize: 6,
        fontFamily: 'Helvetica-Bold',
        color: GRAY,
        textTransform: 'uppercase',
        marginBottom: 3,
    },
    metaValue: {
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        color: DARK,
        textTransform: 'uppercase',
    },
    metaValueGreen: {
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        color: GREEN,
        textTransform: 'uppercase',
    },

    // ── Two column cards ─────────────────────────────────────────
    twoCol: {
        flexDirection: 'row',
        gap: 14,
        marginBottom: 14,
    },
    infoCard: {
        flex: 1,
        backgroundColor: FAINT,
        borderRadius: 7,
        padding: 12,
        borderLeftWidth: 3,
        borderLeftColor: LIGHT,
    },
    infoCardGreen: {
        flex: 1,
        backgroundColor: '#f0fdf4',
        borderRadius: 7,
        padding: 12,
        borderLeftWidth: 3,
        borderLeftColor: GREEN,
    },
    infoCardTitle: {
        fontSize: 6,
        fontFamily: 'Helvetica-Bold',
        color: GRAY,
        textTransform: 'uppercase',
        marginBottom: 6,
    },
    infoName: {
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        color: DARK,
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    infoDetail: {
        fontSize: 7,
        fontFamily: 'Helvetica',
        color: GRAY,
        textTransform: 'uppercase',
        marginBottom: 1,
    },

    // ── Statement box ────────────────────────────────────────────
    statementBox: {
        borderWidth: 1,
        borderColor: LIGHT,
        borderRadius: 7,
        padding: 13,
        marginBottom: 14,
        backgroundColor: FAINT,
    },
    statementTitle: {
        fontSize: 6,
        fontFamily: 'Helvetica-Bold',
        color: GRAY,
        textTransform: 'uppercase',
        marginBottom: 6,
    },
    statementText: {
        fontSize: 9,
        fontFamily: 'Helvetica',
        color: DARK,
        lineHeight: 1.6,
    },
    statementBold: {
        fontFamily: 'Helvetica-Bold',
    },
    statementUpper: {
        textTransform: 'uppercase',
    },
    quoteBox: {
        marginTop: 8,
        padding: 10,
        backgroundColor: WHITE,
        borderRadius: 5,
        borderLeftWidth: 3,
        borderLeftColor: GREEN,
    },
    quoteText: {
        fontSize: 7,
        fontFamily: 'Helvetica-BoldOblique',
        color: '#525252',
        textAlign: 'justify',
    },

    // ── Table ────────────────────────────────────────────────────
    table: {
        marginBottom: 14,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: DARK,
        borderRadius: 5,
        paddingHorizontal: 12,
        paddingVertical: 7,
        marginBottom: 2,
    },
    tableHeaderText: {
        fontSize: 6,
        fontFamily: 'Helvetica-Bold',
        color: WHITE,
        textTransform: 'uppercase',
        flex: 1,
    },
    tableHeaderTextRight: {
        fontSize: 6,
        fontFamily: 'Helvetica-Bold',
        color: WHITE,
        textTransform: 'uppercase',
        textAlign: 'right',
    },
    tableRow: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 9,
        borderBottomWidth: 1,
        borderBottomColor: LIGHT,
        alignItems: 'center',
    },
    tableCell: {
        flex: 1,
        fontSize: 8,
        fontFamily: 'Helvetica',
        color: DARK,
    },
    tableCellBold: {
        flex: 1,
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        color: DARK,
    },
    tableCellRight: {
        fontSize: 8,
        fontFamily: 'Helvetica',
        color: DARK,
        textAlign: 'right',
    },
    tableTotalRow: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: GREEN,
        borderRadius: 5,
        marginTop: 2,
        alignItems: 'center',
    },
    tableTotalLabel: {
        flex: 1,
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        color: WHITE,
        textTransform: 'uppercase',
    },
    tableTotalValue: {
        fontSize: 11,
        fontFamily: 'Helvetica-Bold',
        color: WHITE,
    },

    // ── Transaction ID ───────────────────────────────────────────
    txBox: {
        backgroundColor: FAINT,
        borderRadius: 7,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 14,
        gap: 4,
    },
    txLabel: {
        fontSize: 6,
        fontFamily: 'Helvetica-Bold',
        color: GRAY,
        textTransform: 'uppercase',
    },
    txValue: {
        fontSize: 7,
        fontFamily: 'Helvetica-Bold',
        color: DARK,
    },

    // ── Signature ────────────────────────────────────────────────
    signatureSection: {
        alignItems: 'center',
        gap: 4,
        marginBottom: 10,
    },
    signatureDate: {
        fontSize: 7,
        color: GRAY,
        fontFamily: 'Helvetica-Bold',
        textTransform: 'uppercase',
        marginBottom: 22,
    },
    signatureLine: {
        width: 200,
        height: 1,
        backgroundColor: '#D4D4D4',
        marginBottom: 4,
    },
    signatureName: {
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        color: DARK,
        textTransform: 'uppercase',
    },
    signatureCnpj: {
        fontSize: 6,
        fontFamily: 'Helvetica-Bold',
        color: GRAY,
        textTransform: 'uppercase',
    },
    signatureLegal: {
        fontSize: 6,
        fontFamily: 'Helvetica-BoldOblique',
        color: '#C0C0C0',
        textTransform: 'uppercase',
        textAlign: 'center',
        marginTop: 3,
    },

    // ── Footer fixo ──────────────────────────────────────────────
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 50,
        paddingVertical: 11,
        borderTopWidth: 1,
        borderTopColor: LIGHT,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: WHITE,
    },
    footerText: {
        fontSize: 6,
        fontFamily: 'Helvetica-Bold',
        color: '#C0C0C0',
        textTransform: 'uppercase',
    },
    footerBadge: {
        backgroundColor: FAINT,
        borderRadius: 4,
        paddingHorizontal: 7,
        paddingVertical: 3,
    },
    footerBadgeText: {
        fontSize: 6,
        fontFamily: 'Helvetica-Bold',
        color: GRAY,
        textTransform: 'uppercase',
    },
})

export interface InvoiceReceiptPDFProps {
    data: {
        invoiceId: string
        number: string
        date: string
        paidAt?: string
        value: number
        amountInWords: string
        sessionId?: string
        payer: {
            name: string
            company?: string
            cnpj?: string
        }
        receiver: {
            name: string
            cnpj: string
        }
        projectName?: string
        description: string
    }
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export function InvoiceReceiptPDFDocument({ data }: InvoiceReceiptPDFProps) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* ── Banner ──────────────────────────────────── */}
                <View style={styles.banner}>
                    <View style={styles.bannerLeft}>
                        <Image src="/logo.png" style={styles.logo} />
                        <View style={styles.bannerBrandInfo}>
                            <Text style={styles.bannerTitle}>Recibo</Text>
                            <Text style={styles.bannerSubtitle}>Merali Studio de Visualização</Text>
                        </View>
                    </View>
                    <View style={styles.bannerRight}>
                        <Text style={styles.bannerAmountLabel}>Valor Pago</Text>
                        <Text style={styles.bannerAmount}>{formatCurrency(data.value)}</Text>
                        <View style={styles.paidBadge}>
                            <Text style={styles.paidBadgeText}>✓ Pagamento Confirmado</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.strip} />

                <View style={styles.body}>

                    {/* ── Meta ────────────────────────────────── */}
                    <View style={styles.metaRow}>
                        <View>
                            <Text style={styles.metaLabel}>Número do Recibo</Text>
                            <Text style={styles.metaValue}>{data.number}</Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={styles.metaLabel}>Status</Text>
                            <Text style={styles.metaValueGreen}>Liquidado</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.metaLabel}>Data do Pagamento</Text>
                            <Text style={styles.metaValue}>{data.paidAt || data.date}</Text>
                        </View>
                    </View>

                    {/* ── Pagador / Recebedor ──────────────────── */}
                    <View style={styles.twoCol}>
                        <View style={styles.infoCard}>
                            <Text style={styles.infoCardTitle}>Pagador</Text>
                            <Text style={styles.infoName}>{data.payer.name}</Text>
                            {data.payer.company ? <Text style={styles.infoDetail}>{data.payer.company}</Text> : null}
                            {data.payer.cnpj ? <Text style={styles.infoDetail}>CNPJ/CPF: {data.payer.cnpj}</Text> : null}
                        </View>
                        <View style={styles.infoCardGreen}>
                            <Text style={styles.infoCardTitle}>Recebedor</Text>
                            <Text style={styles.infoName}>{data.receiver.name}</Text>
                            <Text style={styles.infoDetail}>CNPJ: {data.receiver.cnpj}</Text>
                            {data.projectName ? <Text style={styles.infoDetail}>Projeto: {data.projectName}</Text> : null}
                        </View>
                    </View>

                    {/* ── Declaração ──────────────────────────── */}
                    <View style={styles.statementBox}>
                        <Text style={styles.statementTitle}>Declaração de Recebimento</Text>
                        <Text style={styles.statementText}>
                            {'Recebemos de '}
                            <Text style={[styles.statementBold, styles.statementUpper]}>{data.payer.name}</Text>
                            {data.payer.company ? `, representante da empresa ${data.payer.company}, ` : ' '}
                            {data.payer.cnpj ? `inscrita no CNPJ/CPF sob o nº ${data.payer.cnpj}, ` : ''}
                            {'a importância de '}
                            <Text style={styles.statementBold}>{data.amountInWords.toUpperCase()}</Text>
                            {'. Para maior clareza, firmamos o presente recibo.'}
                        </Text>
                        <View style={styles.quoteBox}>
                            <Text style={styles.quoteText}>"{data.description}"</Text>
                        </View>
                    </View>

                    {/* ── Tabela ──────────────────────────────── */}
                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <Text style={styles.tableHeaderText}>Descrição</Text>
                            <Text style={styles.tableHeaderText}>Referência</Text>
                            <Text style={styles.tableHeaderText}>Método</Text>
                            <Text style={styles.tableHeaderTextRight}>Valor</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCellBold}>
                                {data.projectName ? `Projeto ${data.projectName}` : 'Serviço Prestado'}
                            </Text>
                            <Text style={styles.tableCell}>Fatura #{data.invoiceId.slice(-6).toUpperCase()}</Text>
                            <Text style={styles.tableCell}>Stripe</Text>
                            <Text style={styles.tableCellRight}>{formatCurrency(data.value)}</Text>
                        </View>
                        <View style={styles.tableTotalRow}>
                            <Text style={styles.tableTotalLabel}>Total Pago</Text>
                            <Text style={styles.tableTotalValue}>{formatCurrency(data.value)}</Text>
                        </View>
                    </View>

                    {/* ── ID da Transação ─────────────────────── */}
                    {data.sessionId ? (
                        <View style={styles.txBox}>
                            <Text style={styles.txLabel}>ID da Transação (Stripe)</Text>
                            <Text style={styles.txValue}>{data.sessionId}</Text>
                        </View>
                    ) : null}

                    {/* ── Assinatura ──────────────────────────── */}
                    <View style={styles.signatureSection}>
                        <Text style={styles.signatureDate}>São Paulo, {data.date}</Text>
                        <View style={styles.signatureLine} />
                        <Text style={styles.signatureName}>{data.receiver.name}</Text>
                        <Text style={styles.signatureCnpj}>CNPJ: {data.receiver.cnpj}</Text>
                        <Text style={styles.signatureLegal}>
                            Este documento serve como comprovante definitivo de quitação.
                        </Text>
                    </View>

                </View>

                {/* ── Footer fixo no rodapé ────────────────────── */}
                <View style={styles.footer} fixed>
                    <Text style={styles.footerText}>
                        Recibo gerado em {data.date} · Merali Studio de Visualização
                    </Text>
                    <View style={styles.footerBadge}>
                        <Text style={styles.footerBadgeText}>Pagamento Seguro via Stripe</Text>
                    </View>
                </View>

            </Page>
        </Document>
    )
}

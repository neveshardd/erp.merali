import React from 'react'
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer'
import { formatCurrency } from '@/lib/utils'

// Use standard PDF fonts (Helvetica) for maximum reliability
const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: '#FFFFFF',
        fontFamily: 'Helvetica',
        color: '#171717',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderTopWidth: 8,
        borderTopColor: '#10B981', // Emerald 500
        paddingTop: 20,
        marginBottom: 30,
    },
    logo: {
        width: 60,
        height: 60,
        borderRadius: 12,
        marginBottom: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#A3A3A3',
        textTransform: 'uppercase',
        marginTop: 2,
    },
    headerRight: {
        alignItems: 'flex-end',
    },
    docNumber: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    docDate: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#A3A3A3',
        textTransform: 'uppercase',
    },
    grid: {
        flexDirection: 'row',
        gap: 30,
        marginBottom: 30,
    },
    gridCol: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 8,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: '#D1D5DB',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        paddingBottom: 4,
        marginBottom: 8,
    },
    refText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#4B5563',
        textTransform: 'uppercase',
    },
    justificationBox: {
        backgroundColor: '#F9FAFB',
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    justificationText: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#6B7280',
        textTransform: 'uppercase',
        lineHeight: 1.4,
    },
    table: {
        width: '100%',
        marginBottom: 30,
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderBottomColor: '#111827',
        paddingBottom: 6,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        paddingVertical: 12,
        alignItems: 'center',
    },
    colDesc: { flex: 3 },
    colValue: { flex: 1, textAlign: 'right' },
    headerLabel: {
        fontSize: 8,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: '#9CA3AF',
    },
    itemDesc: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: '#111827',
    },
    itemSub: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        marginTop: 2,
    },
    itemPrice: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    summaryBox: {
        backgroundColor: '#111827',
        borderRadius: 16,
        padding: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        color: '#FFFFFF',
        marginBottom: 30,
    },
    summaryCol: {
        flex: 1,
    },
    summaryLabel: {
        fontSize: 8,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: 'rgba(255, 255, 255, 0.4)',
        marginBottom: 4,
    },
    summaryVal: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    summaryValHighlight: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#10B981',
    },
    summaryValBig: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    termsSection: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 40,
    },
    termsIcon: {
        width: 12,
        height: 12,
        backgroundColor: '#10B981',
        borderRadius: 6,
    },
    termsContent: {
        flex: 1,
        borderLeftWidth: 2,
        borderLeftColor: '#D1FAE5',
        paddingLeft: 12,
    },
    termsTitle: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#10B981',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    termsText: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#6B7280',
        textTransform: 'uppercase',
        lineHeight: 1.5,
    },
    signatures: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 60,
        marginTop: 'auto',
        paddingBottom: 40,
    },
    signatureBlock: {
        flex: 1,
        alignItems: 'center',
    },
    signatureLine: {
        width: '100%',
        height: 1,
        backgroundColor: '#E5E7EB',
        marginBottom: 6,
    },
    signatureName: {
        fontSize: 8,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    footerText: {
        fontSize: 7,
        fontWeight: 'bold',
        color: '#D1D5DB',
        textTransform: 'uppercase',
    }
})

interface AddendumPDFProps {
    data: {
        number: string
        originalBudget: string
        date: string
        client: {
            name: string
            company: string
        }
        project: string
        newItems: Array<{
            description: string
            type: string
            hours: number
            price: number
        }>
        previousTotal: number
        addendumValue: number
        newTotal: number
        paymentTerms: string
        justification: string
    }
}

export function AddendumPDFDocument({ data }: AddendumPDFProps) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View>
                        <Image src="/logo.png" style={styles.logo} />
                        <Text style={styles.title}>Aditivo de Escopo</Text>
                        <Text style={styles.subtitle}>Instrumento de Alteração Contratual</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <Text style={styles.docNumber}>{data.number}</Text>
                        <Text style={styles.docDate}>Emissão: {data.date}</Text>
                    </View>
                </View>

                <View style={[styles.grid, { marginBottom: 20 }]}>
                    <View style={styles.gridCol}>
                        <Text style={styles.sectionTitle}>Referência Contratual</Text>
                        <Text style={styles.refText}>Orçamento: {data.originalBudget}</Text>
                        <Text style={[styles.refText, { color: '#9CA3AF', fontSize: 8, marginTop: 4 }]}>
                            Projeto: {data.project}
                        </Text>
                        <Text style={[styles.refText, { color: '#9CA3AF', fontSize: 8 }]}>
                            Cliente: {data.client.company || data.client.name}
                        </Text>
                    </View>
                    <View style={styles.gridCol}>
                        <Text style={styles.sectionTitle}>Justificativa da Alteração</Text>
                        <View style={styles.justificationBox}>
                            <Text style={styles.justificationText}>{data.justification}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.table}>
                    <Text style={styles.sectionTitle}>Novos Itens Adicionados</Text>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.colDesc, styles.headerLabel]}>Descrição do Novo Item</Text>
                        <Text style={[styles.colValue, styles.headerLabel]}>Valor Adicional</Text>
                    </View>
                    {data.newItems.map((item, i) => (
                        <View key={i} style={styles.tableRow}>
                            <View style={styles.colDesc}>
                                <Text style={styles.itemDesc}>{item.description}</Text>
                                <Text style={styles.itemSub}>{item.type} | +{item.hours}h estimadas</Text>
                            </View>
                            <View style={styles.colValue}>
                                <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                <View wrap={false} style={styles.summaryBox}>
                    <View style={[styles.summaryCol, { borderRightWidth: 1, borderRightColor: 'rgba(255, 255, 255, 0.1)' }]}>
                        <Text style={styles.summaryLabel}>Valor Original</Text>
                        <Text style={styles.summaryVal}>{formatCurrency(data.previousTotal)}</Text>
                    </View>
                    <View style={[styles.summaryCol, { borderRightWidth: 1, borderRightColor: 'rgba(255, 255, 255, 0.1)', paddingLeft: 20 }]}>
                        <Text style={[styles.summaryLabel, { color: '#10B981' }]}>Adicional Aditivo</Text>
                        <Text style={styles.summaryValHighlight}>+ {formatCurrency(data.addendumValue)}</Text>
                    </View>
                    <View style={[styles.summaryCol, { paddingLeft: 20 }]}>
                        <Text style={styles.summaryLabel}>Novo Valor Total</Text>
                        <Text style={styles.summaryValBig}>{formatCurrency(data.newTotal)}</Text>
                    </View>
                </View>

                <View wrap={false} style={styles.termsSection}>
                    <View style={styles.termsIcon} />
                    <View style={styles.termsContent}>
                        <Text style={styles.termsTitle}>Condições Adicionais</Text>
                        <Text style={styles.termsText}>
                            {data.paymentTerms}{"\n\n"}
                            As demais cláusulas do contrato original permanecem inalteradas e em pleno vigor.
                        </Text>
                    </View>
                </View>

                <View style={styles.signatures}>
                    <View style={styles.signatureBlock}>
                        <View style={styles.signatureLine} />
                        <Text style={styles.signatureName}>Merali Studio</Text>
                    </View>
                    <View style={styles.signatureBlock}>
                        <View style={styles.signatureLine} />
                        <Text style={styles.signatureName}>{data.client.name}</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Merali ERP Document Engine</Text>
                    <Text style={styles.footerText}>Pág 01/01</Text>
                </View>
            </Page>
        </Document>
    )
}

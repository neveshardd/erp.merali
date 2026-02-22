import React from 'react'
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer'

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
        borderTopColor: '#06B6D4', // Cyan 500
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
        color: '#0891B2',
    },
    docDate: {
        fontSize: 8,
        lineHeight: 1.5,
        fontWeight: 'bold',
        color: '#A3A3A3',
        textTransform: 'uppercase',
    },
    statementBox: {
        backgroundColor: '#F9FAFB',
        padding: 24,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        marginBottom: 30,
    },
    statementTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    statementText: {
        fontSize: 10,
        lineHeight: 1.6,
        color: '#4B5563',
        textAlign: 'justify',
    },
    bold: {
        fontWeight: 'bold',
        color: '#111827',
    },
    sectionTitle: {
        fontSize: 8,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: '#D1D5DB',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        paddingBottom: 4,
        marginBottom: 12,
    },
    itemCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        borderRadius: 8,
        marginBottom: 8,
    },
    itemText: {
        fontSize: 9,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: '#111827',
    },
    itemStatus: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#10B981',
        textTransform: 'uppercase',
    },
    grid: {
        flexDirection: 'row',
        gap: 30,
        marginTop: 20,
        marginBottom: 40,
    },
    gridCol: {
        flex: 1,
    },
    ratingRow: {
        flexDirection: 'row',
        gap: 4,
        marginBottom: 6,
    },
    star: {
        width: 12,
        height: 12,
        backgroundColor: '#06B6D4',
        borderRadius: 2,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    infoLabel: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#9CA3AF',
        textTransform: 'uppercase',
    },
    infoVal: {
        fontSize: 8,
        fontWeight: 'bold',
        textTransform: 'uppercase',
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
    signatureRole: {
        fontSize: 7,
        color: '#9CA3AF',
        textTransform: 'uppercase',
        marginTop: 2,
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 7,
        fontWeight: 'bold',
        color: '#D1D5DB',
        textTransform: 'uppercase',
    },
    protocol: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    dot: {
        width: 4,
        height: 4,
        backgroundColor: '#06B6D4',
        borderRadius: 2,
    }
})

interface ApprovalPDFProps {
    data: {
        number: string
        date: string
        client: {
            name: string
            company: string
        }
        project: string
        itemsDelivered: Array<{
            description: string
            status: string
        }>
        completionDate: string
        rating: number
    }
    rating?: number
}

export function ApprovalPDFDocument({ data, rating = 5 }: ApprovalPDFProps) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View>
                        <Image src="/logo.png" style={styles.logo} />
                        <Text style={styles.title}>Aprovação Final</Text>
                        <Text style={styles.subtitle}>Termo de Encerramento e Aceite de Projeto</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <Text style={styles.docNumber}>{data.number}</Text>
                        <Text style={styles.docDate}>Data: {data.date}</Text>
                    </View>
                </View>

                <View wrap={false} style={styles.statementBox}>
                    <Text style={styles.statementTitle}>Declaração de Aceite</Text>
                    <Text style={styles.statementText}>
                        Eu, <Text style={styles.bold}>{data.client.name}</Text>, representante da empresa <Text style={styles.bold}>{data.client.company}</Text>, declaro para os devidos fins que recebi e aprovei todos os produtos e serviços listados neste documento, referentes ao projeto <Text style={styles.bold}>"{data.project}"</Text> executado pelo <Text style={styles.bold}>MERALI STUDIO</Text>.
                        {"\n\n"}
                        Confirmo que a entrega está em total conformidade com as especificações contratadas, dando por encerrada esta etapa de produção sem quaisquer pendências técnicas ou artísticas.
                    </Text>
                </View>

                <View>
                    <Text style={styles.sectionTitle}>Itens Entregues e Conferidos</Text>
                    {data.itemsDelivered.map((item, i) => (
                        <View key={i} style={styles.itemCard}>
                            <Text style={styles.itemText}>{item.description}</Text>
                            <Text style={styles.itemStatus}>100% OK</Text>
                        </View>
                    ))}
                </View>

                <View wrap={false} style={styles.grid}>
                    <View style={styles.gridCol}>
                        <Text style={styles.sectionTitle}>Avaliação de Qualidade</Text>
                        <View style={styles.ratingRow}>
                            {[1, 2, 3, 4, 5].map(s => (
                                <View key={s} style={[
                                    styles.star,
                                    s > rating ? { backgroundColor: '#F3F4F6' } : {}
                                ]} />
                            ))}
                        </View>
                        <Text style={[styles.infoLabel, { fontSize: 7 }]}>
                            Nível de Satisfação: {
                                rating === 5 ? "Excelente" : 
                                rating === 4 ? "Muito Bom" : 
                                rating === 3 ? "Bom" : 
                                rating === 2 ? "Regular" : "Insatisfatório"
                            }
                        </Text>
                    </View>
                    <View style={styles.gridCol}>
                        <Text style={styles.sectionTitle}>Informações de Encerramento</Text>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Data de Conclusão</Text>
                            <Text style={styles.infoVal}>{data.completionDate}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Status Financeiro</Text>
                            <Text style={[styles.infoVal, { color: '#10B981' }]}>Liquidado</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.signatures}>
                    <View style={styles.signatureBlock}>
                        <View style={styles.signatureLine} />
                        <Text style={styles.signatureName}>Merali Studio</Text>
                        <Text style={styles.signatureRole}>Responsável Técnico</Text>
                    </View>
                    <View style={styles.signatureBlock}>
                        <View style={styles.signatureLine} />
                        <Text style={styles.signatureName}>{data.client.name}</Text>
                        <Text style={styles.signatureRole}>Assinante do Projeto</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <View style={styles.protocol}>
                        <View style={styles.dot} />
                        <Text style={styles.footerText}>Protocolo Digital Verificado</Text>
                    </View>
                    <Text style={styles.footerText}>Merali ERP Document Engine | Pág 01/01</Text>
                </View>
            </Page>
        </Document>
    )
}

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
        borderTopColor: '#F43F5E', // Rose 500
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
        color: '#E11D48',
    },
    docDate: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#A3A3A3',
        textTransform: 'uppercase',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 8,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: '#D1D5DB',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        paddingBottom: 4,
        marginBottom: 10,
    },
    infoGrid: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 20,
    },
    infoBox: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        padding: 12,
        borderRadius: 8,
    },
    infoLabel: {
        fontSize: 7,
        fontWeight: 'bold',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#111827',
        textTransform: 'uppercase',
    },
    contentBlock: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#F3F4F6',
        borderRadius: 12,
        padding: 16,
        marginBottom: 15,
    },
    contentTitle: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#111827',
        textTransform: 'uppercase',
        marginBottom: 6,
    },
    contentText: {
        fontSize: 9,
        lineHeight: 1.5,
        color: '#4B5563',
    },
    linkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    linkDot: {
        width: 3,
        height: 3,
        backgroundColor: '#F43F5E',
        borderRadius: 1.5,
    },
    linkText: {
        fontSize: 8,
        color: '#2563EB',
        textDecoration: 'underline',
    },
    moodBadge: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        backgroundColor: '#FEE2E2',
        borderRadius: 4,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    moodText: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#9F1239',
        textTransform: 'uppercase',
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 'auto',
    },
    footerText: {
        fontSize: 7,
        fontWeight: 'bold',
        color: '#D1D5DB',
        textTransform: 'uppercase',
    }
})

interface BriefingPDFProps {
    data: {
        number: string
        date: string
        client: {
            name: string
            company: string
        }
        project: string
        format: string
        links: string[]
        mood: string
        lightingNotes: string
        materialsNotes: string
        status: string
    }
}

export function BriefingPDFDocument({ data }: BriefingPDFProps) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <View>
                        <Image src="/logo.png" style={styles.logo} />
                        <Text style={styles.title}>Briefing Técnico</Text>
                        <Text style={styles.subtitle}>Especificações e Requisitos de Produção 3D</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <Text style={styles.docNumber}>{data.number}</Text>
                        <Text style={styles.docDate}>Emissão: {data.date}</Text>
                    </View>
                </View>

                <View style={styles.infoGrid}>
                    <View style={styles.infoBox}>
                        <Text style={styles.infoLabel}>Projeto</Text>
                        <Text style={styles.infoValue}>{data.project}</Text>
                    </View>
                    <View style={styles.infoBox}>
                        <Text style={styles.infoLabel}>Cliente</Text>
                        <Text style={styles.infoValue}>{data.client.company || data.client.name}</Text>
                    </View>
                </View>

                <View wrap={false} style={styles.section}>
                    <Text style={styles.sectionTitle}>Arquivos e Formatos Originais</Text>
                    <View style={styles.contentBlock}>
                        <Text style={styles.contentTitle}>Formato do Modelo</Text>
                        <Text style={styles.contentText}>{data.format || "NÃO INFORMADO"}</Text>
                    </View>
                    <View style={styles.contentBlock}>
                        <Text style={styles.contentTitle}>Links para Download</Text>
                        {data.links && data.links.length > 0 ? (
                            data.links.map((link, i) => (
                                <View key={i} style={styles.linkRow}>
                                    <View style={styles.linkDot} />
                                    <Text style={styles.linkText}>{link}</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={[styles.contentText, { color: '#9CA3AF', fontSize: 8 }]}>NENHUM LINK ANEXADO</Text>
                        )}
                    </View>
                </View>

                <View wrap={false} style={styles.section}>
                    <Text style={styles.sectionTitle}>Direcionamento Artístico</Text>
                    <View style={styles.contentBlock}>
                        <Text style={styles.contentTitle}>Atmosfera / Mood</Text>
                        {data.mood && (
                            <View style={styles.moodBadge}>
                                <Text style={styles.moodText}>{data.mood}</Text>
                            </View>
                        )}
                        <Text style={styles.contentText}>
                            {data.lightingNotes || "Nenhum detalhe de iluminação ou atmosfera fornecido."}
                        </Text>
                    </View>
                </View>

                <View wrap={false} style={styles.section}>
                    <Text style={styles.sectionTitle}>Materiais e Detalhamento</Text>
                    <View style={styles.contentBlock}>
                        <Text style={styles.contentText}>
                            {data.materialsNotes || "Nenhuma observação específica sobre materiais ou acabamentos."}
                        </Text>
                    </View>
                </View>

                <View style={[styles.section, { marginTop: 20 }]}>
                    <Text style={[styles.infoLabel, { fontSize: 8, color: '#F43F5E' }]}>Status do Briefing: {data.status}</Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Merali ERP Document Engine | Technical Unit</Text>
                    <Text style={styles.footerText}>Pág 01/01</Text>
                </View>
            </Page>
        </Document>
    )
}

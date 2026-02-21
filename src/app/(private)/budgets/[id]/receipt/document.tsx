import React from 'react'
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer'
import { formatCurrency } from '@/lib/utils'

// Use standard PDF fonts (Helvetica) for maximum reliability
const styles = StyleSheet.create({
    page: {
        padding: '2cm',
        backgroundColor: '#FFFFFF',
        fontFamily: 'Helvetica',
        color: '#171717',
    },
    container: {
        borderWidth: 2,
        borderColor: '#F5F5F5',
        borderStyle: 'dashed',
        padding: 40,
        minHeight: '14cm',
        position: 'relative',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 40,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    logo: {
        width: 60,
        height: 60,
        borderRadius: 12,
    },
    brandInfo: {
        flexDirection: 'column',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    brandName: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#A3A3A3',
        textTransform: 'uppercase',
        marginTop: 2,
    },
    headerRight: {
        alignItems: 'flex-end',
    },
    valueBox: {
        backgroundColor: '#171717',
        padding: 15,
        borderRadius: 12,
        alignItems: 'flex-end',
    },
    valueLabel: {
        fontSize: 8,
        fontWeight: 'bold',
        color: 'rgba(255, 255, 255, 0.5)',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    valueText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    receiptNumber: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#737373',
        textTransform: 'uppercase',
        marginTop: 8,
    },
    body: {
        marginTop: 30,
        fontSize: 11,
        lineHeight: 1.8,
    },
    paragraph: {
        marginBottom: 15,
    },
    bold: {
        fontWeight: 'bold',
    },
    upper: {
        textTransform: 'uppercase',
    },
    descriptionBox: {
        marginTop: 10,
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#FAFAFA',
        borderWidth: 1,
        borderColor: '#F5F5F5',
        borderRadius: 8,
    },
    descriptionText: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#525252',
        textTransform: 'uppercase',
        fontStyle: 'italic',
        textAlign: 'justify',
    },
    dateContainer: {
        marginTop: 40,
        alignItems: 'flex-end',
    },
    dateText: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    signatureSection: {
        marginTop: 60,
        alignItems: 'center',
    },
    signatureLine: {
        width: 250,
        height: 1,
        backgroundColor: '#E5E5E5',
        marginBottom: 8,
    },
    receiverName: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    receiverCnpj: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#737373',
        textTransform: 'uppercase',
        marginTop: 2,
    },
    legalNote: {
        fontSize: 7,
        fontWeight: 'bold',
        color: '#D4D4D4',
        textTransform: 'uppercase',
        marginTop: 10,
        fontStyle: 'italic',
    }
})

interface ReceiptPDFProps {
    data: {
        number: string
        date: string
        value: number
        amountInWords: string
        payer: {
            name: string
            company: string
            cnpj: string
        }
        receiver: {
            name: string
            cnpj: string
        }
        description: string
    }
}

export function ReceiptPDFDocument({ data }: ReceiptPDFProps) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <Image src="/logo.png" style={styles.logo} />
                            <View style={styles.brandInfo}>
                                <Text style={styles.title}>Recibo</Text>
                                <Text style={styles.brandName}>Merali Studio de Visualização</Text>
                            </View>
                        </View>
                        <View style={styles.headerRight}>
                            <View style={styles.valueBox}>
                                <Text style={styles.valueLabel}>Valor do Pagamento</Text>
                                <Text style={styles.valueText}>{formatCurrency(data.value)}</Text>
                            </View>
                            <Text style={styles.receiptNumber}>Nº {data.number}</Text>
                        </View>
                    </View>

                    <View style={styles.body}>
                        <Text style={styles.paragraph}>
                            Recebemos de <Text style={[styles.bold, styles.upper]}>{data.payer.name}</Text>, 
                            {data.payer.company ? ` representante da empresa ${data.payer.company}, ` : ''} 
                            {data.payer.cnpj ? `inscrita no CNPJ/CPF sob o nº ${data.payer.cnpj}, ` : ''}
                            a importância de <Text style={styles.bold}>{data.amountInWords.toUpperCase()}</Text>.
                        </Text>
                        
                        <View style={styles.descriptionBox}>
                            <Text style={styles.descriptionText}>"{data.description}"</Text>
                        </View>

                        <Text style={styles.paragraph}>
                            Para maior clareza, firmamos o presente recibo.
                        </Text>
                    </View>

                    <View style={styles.dateContainer}>
                        <Text style={styles.dateText}>São Paulo, {data.date}</Text>
                    </View>

                    <View style={styles.signatureSection}>
                        <View style={styles.signatureLine} />
                        <Text style={styles.receiverName}>{data.receiver.name}</Text>
                        <Text style={styles.receiverCnpj}>CNPJ: {data.receiver.cnpj}</Text>
                        <Text style={styles.legalNote}>Este documento serve como comprovante definitivo de quitação.</Text>
                    </View>
                </View>
            </Page>
        </Document>
    )
}

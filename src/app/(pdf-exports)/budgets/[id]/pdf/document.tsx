"use client";

import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { formatCurrency } from "@/lib/utils";

// Use standard PDF fonts which are ultra-reliable (Helvetica, Times-Roman, Courier)
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 40,
    fontFamily: "Helvetica",
    color: "#171717",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottom: 2,
    borderBottomColor: "#171717",
    paddingBottom: 20,
    marginBottom: 30,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  headerRight: {
    textAlign: "right",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  codeRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "baseline",
    marginTop: 4,
  },
  label: {
    fontSize: 8,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#A3A3A3",
  },
  value: {
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },
  smallValue: {
    fontSize: 9,
    fontWeight: "bold",
    marginLeft: 4,
  },
  infoGrid: {
    flexDirection: "row",
    gap: 40,
    marginBottom: 30,
  },
  infoCol: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 8,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#D4D4D4",
    borderBottom: 1,
    borderBottomColor: "#F5F5F5",
    paddingBottom: 4,
    marginBottom: 10,
  },
  clientName: {
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  clientCompany: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#737373",
    textTransform: "uppercase",
    marginTop: 2,
  },
  contactRow: {
    fontSize: 9,
    color: "#525252",
    marginTop: 8,
  },
  projectName: {
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  projectDetail: {
    fontSize: 9,
    color: "#525252",
    marginTop: 2,
  },
  table: {
    width: "100%",
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottom: 2,
    borderBottomColor: "#171717",
    paddingBottom: 6,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: 1,
    borderBottomColor: "#F5F5F5",
    paddingVertical: 10,
    alignItems: "center",
  },
  colDesc: {
    flex: 4,
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  colQty: {
    flex: 1,
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "center",
    color: "#737373",
  },
  colUnit: {
    flex: 2,
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "right",
    color: "#737373",
  },
  colTotal: { flex: 2, fontSize: 10, fontWeight: "bold", textAlign: "right" },

  tableHeaderLabel: {
    fontSize: 8,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#A3A3A3",
  },

  totalsSection: {
    flexDirection: "row",
    gap: 40,
  },
  totalsBox: {
    flex: 1,
    backgroundColor: "#171717",
    padding: 20,
    borderRadius: 12,
    color: "#FFFFFF",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottom: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    paddingBottom: 8,
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 8,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "rgba(255, 255, 255, 0.5)",
  },
  totalValue: {
    fontSize: 10,
    fontWeight: "bold",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  grandTotalLabel: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  grandTotalValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  observations: {
    flex: 1,
  },
  obsText: {
    fontSize: 8,
    color: "#737373",
    fontWeight: "bold",
    lineHeight: 1.5,
    textTransform: "uppercase",
  },
  footer: {
    marginTop: 30,
    borderTop: 1,
    borderTopColor: "#F5F5F5",
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#D4D4D4",
    textTransform: "uppercase",
  },
});

export function BudgetPDFDocument({ data }: { data: any }) {
  const totalVariableCosts = data.variableCosts.reduce(
    (s: number, c: any) => s + c.value,
    0,
  );
  const subtotal = data.totalValue;
  const total = subtotal + totalVariableCosts;

  // Payment schedule logic matching the preview
  const paymentSchedule = [
    {
      description: "Entrada 50% (Sinal)",
      value: total * 0.5,
      date: "Aprovação",
    },
    {
      description: "Entrega Final 50%",
      value: total * 0.5,
      date: data.deadline || "A combinar",
    },
  ];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Row */}
        <View style={styles.header}>
          <View>
            <Image src="/logo.png" style={styles.logo} />
            <View style={{ marginTop: 10 }}>
              <Text style={[styles.label, { fontSize: 7, color: "#171717" }]}>
                Merali Studio de Visualização
              </Text>
              <Text style={[styles.label, { fontSize: 6, color: "#737373" }]}>
                CNPJ: 50.123.456/0001-00
              </Text>
              <Text style={[styles.label, { fontSize: 6, color: "#737373" }]}>
                www.merali.com.br | contato@merali.com.br
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.title}>Orçamento</Text>
            <View style={styles.codeRow}>
              <Text style={styles.label}>Código</Text>
              <Text style={styles.value}>{data.code}</Text>
            </View>
            <View style={styles.codeRow}>
              <Text style={styles.label}>Emissão</Text>
              <Text style={styles.smallValue}>{data.date}</Text>
            </View>
            <View style={styles.codeRow}>
              <Text style={styles.label}>Validade</Text>
              <Text style={styles.smallValue}>{data.validUntil}</Text>
            </View>
          </View>
        </View>

        {/* Client and Project Info Row */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCol}>
            <Text style={styles.sectionTitle}>Dados do Cliente</Text>
            <Text style={styles.clientName}>{data.client.name}</Text>
            {data.client.company && (
              <Text style={styles.clientCompany}>{data.client.company}</Text>
            )}
            {data.client.taxId && (
              <Text
                style={[
                  styles.contactRow,
                  {
                    fontSize: 8,
                    color: "#171717",
                    marginTop: 4,
                    fontWeight: "bold",
                  },
                ]}
              >
                CPF/CNPJ: {data.client.taxId}
              </Text>
            )}
            <Text style={styles.contactRow}>{data.client.email}</Text>
            <Text style={[styles.contactRow, { marginTop: 2 }]}>
              {data.client.phone}
            </Text>
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.sectionTitle}>Informações do Projeto</Text>
            <Text style={styles.projectName}>{data.projectName}</Text>
            {data.deadline && (
              <View style={{ marginTop: 4 }}>
                <Text style={styles.label}>Prazo Estimado</Text>
                <Text
                  style={[
                    styles.projectDetail,
                    { fontWeight: "bold", fontSize: 10, color: "#171717" },
                  ]}
                >
                  {data.deadline}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Production Items Table */}
        {data.items.length > 0 && (
          <View style={styles.table}>
            <Text style={styles.sectionTitle}>
              Discriminação de Serviços / Visualização
            </Text>
            <View style={styles.tableHeader}>
              <Text style={[styles.colDesc, styles.tableHeaderLabel]}>
                Serviço
              </Text>
              <Text style={[styles.colQty, styles.tableHeaderLabel]}>Qtd</Text>
              <Text style={[styles.colUnit, styles.tableHeaderLabel]}>
                Unitário
              </Text>
              <Text
                style={[
                  styles.colTotal,
                  styles.tableHeaderLabel,
                  { color: "#171717" },
                ]}
              >
                Total
              </Text>
            </View>
            {data.items.map((item: any) => (
              <View key={item.id} style={styles.tableRow}>
                <Text style={styles.colDesc}>{item.description}</Text>
                <Text style={styles.colQty}>{item.quantity}</Text>
                <Text style={styles.colUnit}>
                  {formatCurrency(item.unitValue)}
                </Text>
                <Text style={styles.colTotal}>
                  {formatCurrency(item.totalValue)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Variable Costs Table */}
        {data.variableCosts.length > 0 && (
          <View style={styles.table}>
            <Text style={styles.sectionTitle}>
              Custos Adicionais / Deslocamento
            </Text>
            <View style={styles.tableHeader}>
              <Text style={[styles.colDesc, styles.tableHeaderLabel]}>
                Descrição
              </Text>
              <Text style={[styles.colQty, styles.tableHeaderLabel]}>Data</Text>
              <Text
                style={[
                  styles.colTotal,
                  styles.tableHeaderLabel,
                  { color: "#171717" },
                ]}
              >
                Valor
              </Text>
            </View>
            {data.variableCosts.map((item: any) => (
              <View key={item.id} style={styles.tableRow}>
                <Text style={styles.colDesc}>{item.description}</Text>
                <Text style={styles.colQty}>{item.date}</Text>
                <Text style={styles.colTotal}>
                  {formatCurrency(item.value)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Bottom Section: Obs, Payment and Totals */}
        <View wrap={false} style={[styles.totalsSection, { marginTop: 40 }]}>
          <View style={styles.observations}>
            <View style={{ marginBottom: 15 }}>
              <Text style={styles.sectionTitle}>Observações</Text>
              <Text style={styles.obsText}>
                O prazo de entrega inicia após a aprovação do orçamento e o
                envio de todo o material técnico. Valores sujeitos a revisão
                mediante alteração de escopo.
              </Text>
            </View>

            <View>
              <Text style={styles.sectionTitle}>Cronograma de Pagamento</Text>
              <View style={{ gap: 4 }}>
                {paymentSchedule.map((p, i) => (
                  <View
                    key={i}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      backgroundColor: "#FAFAFA",
                      padding: 6,
                      borderWidth: 1,
                      borderStyle: "solid",
                      borderColor: "#E5E5E5",
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          fontSize: 8,
                          fontWeight: "bold",
                          color: "#171717",
                        }}
                      >
                        {p.description}
                      </Text>
                      <Text style={{ fontSize: 7, color: "#737373" }}>
                        {p.date}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 9,
                        fontWeight: "bold",
                        color: "#171717",
                      }}
                    >
                      {formatCurrency(p.value)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View style={{ flex: 1 }}>
            <View style={styles.totalsBox}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal</Text>
                <Text style={styles.totalValue}>
                  {formatCurrency(data.totalValue)}
                </Text>
              </View>
              {totalVariableCosts > 0 && (
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Custos Extras</Text>
                  <Text style={styles.totalValue}>
                    {formatCurrency(totalVariableCosts)}
                  </Text>
                </View>
              )}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Desconto</Text>
                <Text style={[styles.totalValue, { color: "#4ADE80" }]}>
                  - R$ 0,00
                </Text>
              </View>
              <View style={styles.grandTotalRow}>
                <Text style={styles.grandTotalLabel}>Total</Text>
                <Text style={styles.grandTotalValue}>
                  {formatCurrency(total)}
                </Text>
              </View>
            </View>

            {/* Signature Line Area - Prominent */}
            <View style={{ marginTop: 40, alignItems: "center" }}>
              <View
                style={{
                  width: "80%",
                  height: 1,
                  backgroundColor: "#171717",
                  marginBottom: 5,
                }}
              />
              <Text
                style={{
                  fontSize: 9,
                  fontWeight: "bold",
                  color: "#171717",
                  textAlign: "center",
                  textTransform: "uppercase",
                }}
              >
                Merali Studio de Visualização
              </Text>
              <Text
                style={{
                  fontSize: 7,
                  color: "#737373",
                  textAlign: "center",
                  textTransform: "uppercase",
                  marginTop: 2,
                }}
              >
                {data.date}
              </Text>
            </View>
          </View>
        </View>

        {/* Simple Footer */}
        <View style={[styles.footer, { marginTop: 30 }]}>
          <Text style={styles.footerText}>
            Documento gerado eletronicamente por Merali ERP
          </Text>
          <Text style={styles.footerText}>Pág 01/01</Text>
        </View>
      </Page>
    </Document>
  );
}

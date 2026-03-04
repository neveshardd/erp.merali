import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

// Use standard PDF fonts (Helvetica) for maximum reliability
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
    color: "#171717",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 4,
    borderBottomColor: "#171717",
    paddingBottom: 20,
    marginBottom: 20,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  statusBadge: {
    backgroundColor: "#171717",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
  osNumber: {
    fontSize: 12,
    fontWeight: "bold",
  },
  osDate: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#A3A3A3",
    textTransform: "uppercase",
    marginTop: 2,
  },
  infoGrid: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 20,
  },
  infoCol: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F5F5F5",
  },
  infoLabel: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#A3A3A3",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 9,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  sectionTitle: {
    fontSize: 8,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#737373",
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
    paddingBottom: 4,
    marginBottom: 10,
  },
  itemCard: {
    borderWidth: 1,
    borderColor: "#EEEEEE",
    borderRadius: 8,
    marginBottom: 10,
    overflow: "hidden",
  },
  itemHeader: {
    backgroundColor: "#171717",
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
  itemBadge: {
    fontSize: 7,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.6)",
    textTransform: "uppercase",
  },
  itemBody: {
    padding: 10,
    flexDirection: "row",
    gap: 20,
  },
  itemStat: {
    width: 80,
  },
  itemNotes: {
    flex: 1,
  },
  statLabel: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#A3A3A3",
    textTransform: "uppercase",
  },
  statValue: {
    fontSize: 9,
    fontWeight: "bold",
  },
  notesText: {
    fontSize: 8,
    color: "#525252",
    lineHeight: 1.4,
    textTransform: "uppercase",
  },
  checklistRow: {
    flexDirection: "row",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#FAFAFA",
    gap: 15,
  },
  checkItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  checkSquare: {
    width: 8,
    height: 8,
    borderWidth: 1,
    borderColor: "#D4D4D4",
    borderRadius: 1,
  },
  checkLabel: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#A3A3A3",
    textTransform: "uppercase",
  },
  bottomGrid: {
    flexDirection: "row",
    gap: 30,
    marginTop: 20,
  },
  bottomSection: {
    flex: 1,
  },
  qiRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  qiText: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#525252",
    textTransform: "uppercase",
  },
  managementBox: {
    backgroundColor: "#FAFAFA",
    padding: 12,
    borderRadius: 8,
  },
  managementRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  managementLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#A3A3A3",
    textTransform: "uppercase",
  },
  managementValue: {
    fontSize: 8,
    fontWeight: "bold",
  },
  signatureArea: {
    marginTop: 15,
    height: 40,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    borderStyle: "dashed",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  signatureLabel: {
    fontSize: 7,
    color: "#D4D4D4",
    textTransform: "uppercase",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#D4D4D4",
    textTransform: "uppercase",
  },
  urgentBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  dot: {
    width: 4,
    height: 4,
    backgroundColor: "#DC2626",
    borderRadius: 2,
  },
  urgentText: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#DC2626",
    textTransform: "uppercase",
  },
});

interface OSPDFProps {
  data: {
    number: string;
    date: string;
    deadline: string;
    project: string;
    client: string;
    manager: string;
    totalHours: number;
    items: Array<{
      id: string;
      description: string;
      type: string;
      complexity: string;
      hours: number;
      quantity: number;
      notes: string;
    }>;
    studio?: {
      name: string;
      email: string;
      phone: string;
    };
  };
  checkedSteps?: Record<string, Record<string, boolean>>;
  checkedQI?: Record<number, boolean>;
}

export function ServiceOrderPDFDocument({
  data,
  checkedSteps = {},
  checkedQI = {},
}: OSPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Image src="/logo.png" style={styles.logo} />
            <Text style={[styles.infoValue, { marginTop: 10, fontSize: 10 }]}>
              Ordem de Serviço
            </Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Produção</Text>
            </View>
            <Text style={styles.osNumber}>{data.number}</Text>
            <Text style={styles.osDate}>Emissão: {data.date}</Text>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Projeto</Text>
            <Text style={styles.infoValue}>{data.project}</Text>
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Cliente</Text>
            <Text style={styles.infoValue}>{data.client}</Text>
          </View>
          <View
            style={[
              styles.infoCol,
              { borderLeftWidth: 4, borderLeftColor: "#DC2626" },
            ]}
          >
            <Text style={styles.infoLabel}>Prazo Final</Text>
            <Text style={[styles.infoValue, { color: "#DC2626" }]}>
              {data.deadline}
            </Text>
          </View>
        </View>

        <View>
          <Text style={styles.sectionTitle}>
            Itens de Produção & Briefing ({data.items.length})
          </Text>
          {data.items.map((item, i) => (
            <View key={i} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>
                  #{item.id} {item.description}
                </Text>
                <Text style={styles.itemBadge}>
                  {item.type} | {item.complexity}
                </Text>
              </View>
              <View style={styles.itemBody}>
                <View style={styles.itemStat}>
                  <Text style={styles.statLabel}>Tempo Estimado</Text>
                  <Text style={styles.statValue}>
                    {Number(item.hours).toFixed(1)}h{" "}
                    {item.quantity > 1 ? `(x${item.quantity})` : ""}
                  </Text>
                </View>
                <View style={styles.itemNotes}>
                  <Text style={styles.statLabel}>Notas Técnicas</Text>
                  <Text style={styles.notesText}>{item.notes}</Text>
                </View>
              </View>
              <View
                style={[
                  styles.checklistRow,
                  { paddingHorizontal: 10, paddingBottom: 8 },
                ]}
              >
                {["Modelagem", "Materiais", "Iluminação", "Pós"].map((p) => {
                  const isChecked = checkedSteps[item.id]?.[p];
                  return (
                    <View key={p} style={styles.checkItem}>
                      <View
                        style={[
                          styles.checkSquare,
                          isChecked
                            ? {
                              backgroundColor: "#171717",
                              borderColor: "#171717",
                            }
                            : {},
                        ]}
                      />
                      <Text
                        style={[
                          styles.checkLabel,
                          isChecked ? { color: "#171717" } : {},
                        ]}
                      >
                        {p}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          ))}
        </View>

        <View wrap={false} style={styles.bottomGrid}>
          <View style={styles.bottomSection}>
            <Text style={styles.sectionTitle}>Checklist de Qualidade (QI)</Text>
            {[
              "Verificação de proporções e escalas reais",
              "Otimização de Geometria e Polígonos",
              "Materiais PBR e texturas de alta definição",
              "Iluminação (HDRi + Lights) balanceada",
              "Canal de Render Elements p/ Pós-produção",
            ].map((check, i) => {
              const isChecked = checkedQI[i];
              return (
                <View key={i} style={styles.qiRow}>
                  <View
                    style={[
                      styles.checkSquare,
                      { width: 10, height: 10 },
                      isChecked
                        ? { backgroundColor: "#171717", borderColor: "#171717" }
                        : {},
                    ]}
                  />
                  <Text
                    style={[
                      styles.qiText,
                      isChecked ? { color: "#171717" } : {},
                    ]}
                  >
                    {check}
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={styles.bottomSection}>
            <Text style={styles.sectionTitle}>Resumo de Gestão Produção</Text>
            <View style={styles.managementBox}>
              <View style={styles.managementRow}>
                <Text style={styles.managementLabel}>Responsável</Text>
                <Text style={styles.managementValue}>{data.manager}</Text>
              </View>
              <View
                style={[
                  styles.managementRow,
                  {
                    borderTopWidth: 1,
                    borderTopColor: "#EEEEEE",
                    paddingTop: 6,
                  },
                ]}
              >
                <Text style={styles.managementLabel}>Capacidade Total</Text>
                <Text style={[styles.managementValue, { fontSize: 10 }]}>
                  {Number(data.totalHours).toFixed(1)}h de produção
                </Text>
              </View>
            </View>
            <View style={styles.signatureArea}>
              <Text style={styles.signatureLabel}>Visto da Coordenação</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <View>
            <Text style={styles.footerText}>
              {data.studio?.name || "Merali Studio"} | Internal Pipeline v2.0
            </Text>
            <Text
              style={[styles.footerText, { fontSize: 6, color: "#E5E5E5" }]}
            >
              Uso Interno - Confidencial
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 15 }}>
            <View style={styles.urgentBadge}>
              <View style={styles.dot} />
              <Text style={styles.urgentText}>Alta Prioridade</Text>
            </View>
            <Text style={styles.footerText}>Pág 01/01</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

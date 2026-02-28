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
    alignItems: "flex-start",
    borderTopWidth: 8,
    borderTopColor: "#A855F7", // Purple 500
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
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#A3A3A3",
    textTransform: "uppercase",
    marginTop: 2,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  docNumber: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#9333EA",
  },
  docDate: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#A3A3A3",
    textTransform: "uppercase",
  },
  consentBox: {
    backgroundColor: "#FAF5FF",
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F3E8FF",
    marginBottom: 30,
  },
  consentTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#7E22CE",
    textTransform: "uppercase",
    marginBottom: 10,
  },
  consentText: {
    fontSize: 10,
    lineHeight: 1.6,
    color: "#4B5563",
    textAlign: "justify",
  },
  bold: {
    fontWeight: "bold",
    color: "#111827",
  },
  sectionTitle: {
    fontSize: 8,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#D1D5DB",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    paddingBottom: 4,
    marginBottom: 12,
  },
  termsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 30,
  },
  termCard: {
    width: "48%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  termText: {
    fontSize: 8,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#6B7280",
    lineHeight: 1.3,
  },
  legalNote: {
    backgroundColor: "#111827",
    color: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 40,
  },
  legalTitle: {
    fontSize: 8,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#A855F7",
    marginBottom: 6,
  },
  legalText: {
    fontSize: 8,
    lineHeight: 1.5,
    opacity: 0.6,
    textTransform: "uppercase",
  },
  signatures: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 60,
    marginTop: "auto",
    paddingBottom: 40,
  },
  signatureBlock: {
    flex: 1,
    alignItems: "center",
  },
  signatureLine: {
    width: "100%",
    height: 1,
    backgroundColor: "#E5E7EB",
    marginBottom: 6,
  },
  signatureName: {
    fontSize: 8,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  signatureRole: {
    fontSize: 7,
    color: "#9CA3AF",
    textTransform: "uppercase",
    marginTop: 2,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#D1D5DB",
    textTransform: "uppercase",
  },
  protocol: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dot: {
    width: 4,
    height: 4,
    backgroundColor: "#A855F7",
    borderRadius: 2,
  },
});

interface UsagePDFProps {
  data: {
    number: string;
    date: string;
    client: {
      name: string;
      company: string;
    };
    project: string;
    terms: string[];
  };
}

export function UsagePDFDocument({ data }: UsagePDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Image src="/logo.png" style={styles.logo} />
            <Text style={styles.title}>Uso de Imagem</Text>
            <Text style={styles.subtitle}>
              Cessão de Direitos para Portfólio e Marketing
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.docNumber}>{data.number}</Text>
            <Text style={styles.docDate}>Data: {data.date}</Text>
          </View>
        </View>

        <View wrap={false} style={styles.consentBox}>
          <Text style={styles.consentTitle}>Termo de Consentimento</Text>
          <Text style={styles.consentText}>
            Pelo presente instrumento, eu{" "}
            <Text style={styles.bold}>{data.client.name}</Text>, devidamente
            qualificado como proprietário ou representante legal do cliente{" "}
            <Text style={styles.bold}>{data.client.company}</Text>, autorizo de
            forma gratuita e sem restrições territoriais ou temporais o{" "}
            <Text style={styles.bold}>MERALI STUDIO DE VISUALIZAÇÃO</Text> a
            utilizar as imagens produzidas para o projeto{" "}
            <Text style={styles.bold}>"{data.project}"</Text> para fins de
            divulgação de seu trabalho artístico e técnico.
          </Text>
        </View>

        <View>
          <Text style={styles.sectionTitle}>Escopo da Autorização</Text>
          <View style={styles.termsGrid}>
            {data.terms.map((term, i) => (
              <View key={i} style={styles.termCard}>
                <Text style={styles.termText}>{term}</Text>
              </View>
            ))}
          </View>
        </View>

        <View wrap={false} style={styles.legalNote}>
          <Text style={styles.legalTitle}>Proteção de Dados e Copyright</Text>
          <Text style={styles.legalText}>
            O Merali Studio compromete-se a não divulgar informações sigilosas
            extras, limitando-se apenas à representação visual do projeto. O
            Copyright legal das imagens permanece de propriedade do estúdio
            conforme lei de direitos autorais, sendo esta autorização referente
            apenas à exibição pública.
          </Text>
        </View>

        <View style={styles.signatures}>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>Merali Studio</Text>
            <Text style={styles.signatureRole}>
              Detentor dos Direitos Autorais
            </Text>
          </View>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>{data.client.name}</Text>
            <Text style={styles.signatureRole}>Autorizante (Cliente)</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.protocol}>
            <View style={styles.dot} />
            <Text style={styles.footerText}>
              Autorização de Marketing Merali Studio
            </Text>
          </View>
          <Text style={styles.footerText}>Pág 01/01</Text>
        </View>
      </Page>
    </Document>
  );
}

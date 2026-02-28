import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { formatCurrency } from "@/lib/utils";

// Use standard PDF fonts (Helvetica) for maximum reliability
const styles = StyleSheet.create({
  page: {
    padding: "2cm",
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
    color: "#171717",
  },
  header: {
    flexDirection: "column",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
    paddingBottom: 20,
    marginBottom: 20,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#737373",
    textTransform: "uppercase",
    marginTop: 5,
  },
  content: {
    fontSize: 10,
    lineHeight: 1.6,
    textAlign: "justify",
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: "bold",
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#FAFAFA",
    paddingBottom: 2,
    marginBottom: 5,
  },
  paragraph: {
    marginBottom: 8,
  },
  bold: {
    fontWeight: "bold",
  },
  installmentList: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#FAFAFA",
    borderRadius: 4,
  },
  installmentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  signatureContainer: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 40,
  },
  signatureBox: {
    flex: 1,
    alignItems: "center",
  },
  signatureLine: {
    width: "100%",
    height: 1,
    backgroundColor: "#E5E5E5",
    marginBottom: 5,
  },
  signatureName: {
    fontSize: 9,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  signatureLabel: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#A3A3A3",
    textTransform: "uppercase",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: "2cm",
    right: "2cm",
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
});

interface ContractPDFProps {
  data: {
    number: string;
    date: string;
    contractor: {
      name: string;
      cnpj: string;
      address: string;
      representative: string;
    };
    client: {
      name: string;
      company: string;
      cnpj: string;
      address: string;
    };
    project: string;
    value: number;
    deadline: string;
    installments: Array<{
      desc: string;
      value: number;
      date: string;
    }>;
  };
}

export function ContractPDFDocument({ data }: ContractPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image src="/logo.png" style={styles.logo} />
          <Text style={styles.title}>
            Instrumento Particular de Prestação de Serviços
          </Text>
          <Text style={styles.subtitle}>Contrato Nº {data.number}</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. DAS PARTES</Text>
            <Text style={styles.paragraph}>
              <Text style={styles.bold}>CONTRATADA:</Text>{" "}
              {data.contractor.name}, inscrita no CNPJ sob o nº{" "}
              {data.contractor.cnpj}, com sede em {data.contractor.address},
              neste ato representada por {data.contractor.representative}.
            </Text>
            <Text style={styles.paragraph}>
              <Text style={styles.bold}>CONTRATANTE:</Text> {data.client.name},{" "}
              {data.client.company ? `pela empresa ${data.client.company}` : ""}
              ,{" "}
              {data.client.cnpj
                ? `inscrita no CPF/CNPJ sob o nº ${data.client.cnpj}`
                : ""}
              .
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. DO OBJETO</Text>
            <Text style={styles.paragraph}>
              O presente contrato tem como objeto a prestação de serviços de
              visualização arquitetônica 3D para o projeto "{data.project}",
              conforme especificações técnicas detalhadas no orçamento aprovado.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. DOS PRAZOS</Text>
            <Text style={styles.paragraph}>
              A CONTRATADA compromete-se a entregar as imagens no prazo acordado
              de {data.deadline || "Prazo a definir"}, contados a partir do
              recebimento de todo o material técnico (modelos, referências,
              plantas) e da confirmação do pagamento do sinal.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. DO VALOR E PAGAMENTO</Text>
            <Text style={styles.paragraph}>
              Pelo serviço objeto deste contrato, a CONTRATANTE pagará à
              CONTRATADA o valor total de {formatCurrency(data.value)},
              distribuído da seguinte forma:
            </Text>
            <View style={styles.installmentList}>
              {data.installments.map((ins, i) => (
                <View key={i} style={styles.installmentRow}>
                  <View style={{ flex: 1 }}>
                    <Text>{ins.desc}</Text>
                  </View>
                  <View style={{ width: 100, textAlign: "right" }}>
                    <Text>Venc: {ins.date}</Text>
                  </View>
                  <View style={{ width: 120, textAlign: "right" }}>
                    <Text>{formatCurrency(ins.value)}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. DAS RESPONSABILIDADES</Text>
            <Text style={styles.paragraph}>
              É de inteira responsabilidade da CONTRATANTE o fornecimento de
              arquivos técnicos precisos. Alterações estruturais no projeto após
              o início da modelagem ou renderização poderão acarretar em custos
              adicionais e prorrogação de prazos, a serem negociados entre as
              partes.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. DO FORO</Text>
            <Text style={styles.paragraph}>
              Para dirimir quaisquer questões oriundas deste contrato, as partes
              elegem o Foro da Comarca de São Paulo/SP, com renúncia a qualquer
              outro, por mais privilegiado que seja.
            </Text>
          </View>
        </View>

        <View style={styles.signatureContainer}>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>{data.contractor.name}</Text>
            <Text style={styles.signatureLabel}>Contratada</Text>
          </View>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>{data.client.name}</Text>
            <Text style={styles.signatureLabel}>Contratante</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>São Paulo, {data.date}</Text>
          <Text style={styles.footerText}>Pág 01/01</Text>
        </View>
      </Page>
    </Document>
  );
}

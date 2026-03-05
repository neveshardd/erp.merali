import * as React from "react";
import { EmailLayout } from "./layout";

interface NewInvoiceEmailProps {
    clientName: string;
    amount: string;
    dueDate: string;
    paymentUrl: string;
}

export const NewInvoiceEmail = ({
    clientName,
    amount,
    dueDate,
    paymentUrl,
}: NewInvoiceEmailProps) => (
    <EmailLayout
        title="Nova Fatura"
        previewText={`Olá ${clientName}, fatura de ${amount} aguardando pagamento.`}
    >
        <p style={{ margin: "0 0 24px" }}>
            Olá <strong>{clientName}</strong>,
        </p>
        <p style={{ margin: "0 0 40px" }}>
            Uma nova fatura foi gerada para o seu projeto. O pagamento pode ser realizado via Cartão de Crédito ou Boleto.
        </p>

        <div style={{
            padding: "32px",
            backgroundColor: "#050505",
            borderRadius: "24px",
            border: "1px solid #222",
            marginBottom: "40px"
        }}>
            <div style={{ marginBottom: "20px" }}>
                <span style={{ fontSize: "10px", color: "#444", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "4px" }}>Valor Total</span>
                <span style={{ fontSize: "24px", fontWeight: "900", color: "#ffffff" }}>{amount}</span>
            </div>
            <div>
                <span style={{ fontSize: "10px", color: "#444", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "4px" }}>Data de Vencimento</span>
                <span style={{ fontSize: "24px", fontWeight: "900", color: "#ffffff" }}>{dueDate}</span>
            </div>
        </div>

        <div style={{ textAlign: "center" }}>
            <a href={paymentUrl} style={{
                display: "inline-block",
                backgroundColor: "#ffffff",
                color: "#050505",
                padding: "20px 48px",
                borderRadius: "16px",
                textDecoration: "none",
                fontWeight: "900",
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.2em"
            }}>
                Realizar Pagamento
            </a>
        </div>
    </EmailLayout>
);

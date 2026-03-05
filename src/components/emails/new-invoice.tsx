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
            padding: "40px",
            backgroundColor: "#050505",
            border: "1px solid #1a1a1a",
            marginBottom: "60px"
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
                display: "block",
                backgroundColor: "#ffffff",
                color: "#000000",
                padding: "24px 48px",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "14px",
                textAlign: "center",
                textTransform: "uppercase",
                letterSpacing: "0.2em"
            }}>
                Realizar Pagamento
            </a>
        </div>
    </EmailLayout>
);

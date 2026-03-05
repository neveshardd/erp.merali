import * as React from "react";
import { EmailLayout } from "./layout";

interface PaymentReceivedEmailProps {
    clientName: string;
    amount: string;
    invoiceId: string;
}

export const PaymentReceivedEmail = ({
    clientName,
    amount,
    invoiceId,
}: PaymentReceivedEmailProps) => (
    <EmailLayout
        title="Confirmado"
        previewText={`Olá ${clientName}, recebemos seu pagamento de ${amount}.`}
    >
        <p style={{ margin: "0 0 24px" }}>
            Olá <strong>{clientName}</strong>,
        </p>
        <p style={{ margin: "0 0 40px" }}>
            Confirmamos o recebimento do seu pagamento referente à fatura <strong>#{invoiceId.slice(-8).toUpperCase()}</strong>.
        </p>

        <div style={{
            padding: "60px 40px",
            backgroundColor: "#000000",
            border: "1px solid #10b981",
            textAlign: "center",
            marginBottom: "60px"
        }}>
            <span style={{ fontSize: "10px", color: "#10b981", textTransform: "uppercase", letterSpacing: "0.4em", display: "block", marginBottom: "16px" }}>
                PAGAMENTO CONFIRMADO
            </span>
            <span style={{ fontSize: "48px", fontWeight: "500", color: "#ffffff", letterSpacing: "-0.04em" }}>
                {amount}
            </span>
        </div>

        <p style={{ margin: "0", textAlign: "center", color: "#444", fontSize: "14px" }}>
            Seu projeto continua progredindo conforme o planejado.
        </p>
    </EmailLayout>
);

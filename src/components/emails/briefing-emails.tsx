import * as React from "react";
import { EmailLayout } from "./layout";

interface NewBriefingEmailProps {
    clientName: string;
    projectName: string;
}

export const NewBriefingAdminEmail = ({
    clientName,
    projectName,
}: NewBriefingEmailProps) => (
    <EmailLayout
        title="Novo Briefing"
        previewText={`Um novo briefing foi enviado por ${clientName}.`}
    >
        <p style={{ margin: "0 0 32px" }}>
            Um novo briefing foi preenchido no sistema Merali.
        </p>

        <div style={{
            padding: "32px",
            backgroundColor: "#050505",
            borderRadius: "24px",
            border: "1px solid #222",
            marginBottom: "40px"
        }}>
            <p style={{ margin: "0 0 4px 0", fontSize: "10px", color: "#444", textTransform: "uppercase", letterSpacing: "0.1em" }}>Cliente</p>
            <p style={{ margin: "0 0 20px 0", fontSize: "18px", fontWeight: "900", color: "#fff" }}>{clientName}</p>

            <p style={{ margin: "0 0 4px 0", fontSize: "10px", color: "#444", textTransform: "uppercase", letterSpacing: "0.1em" }}>Projeto</p>
            <p style={{ margin: "0", fontSize: "18px", fontWeight: "900", color: "#fff" }}>{projectName}</p>
        </div>

        <div style={{ textAlign: "center" }}>
            <a href="https://erp.merali.com.br/briefings" style={{
                display: "inline-block",
                backgroundColor: "#ffffff",
                color: "#050505",
                padding: "20px 40px",
                borderRadius: "16px",
                textDecoration: "none",
                fontWeight: "900",
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.1em"
            }}>
                Ver no Dashboard
            </a>
        </div>
    </EmailLayout>
);

export const BriefingReceivedClientEmail = ({
    clientName,
    projectName,
}: NewBriefingEmailProps) => (
    <EmailLayout
        title="Recebido"
        previewText={`Olá ${clientName}, recebemos suas informações para o projeto ${projectName}.`}
    >
        <p style={{ margin: "0 0 24px" }}>
            Olá <strong>{clientName}</strong>,
        </p>
        <p style={{ margin: "0 0 32px" }}>
            Recebemos as informações do seu briefing para o projeto <strong>{projectName}</strong>. Nossa equipe já está analisando todos os detalhes para dar o próximo passo.
        </p>
        <p style={{ margin: "0", color: "#444" }}>
            Em breve entraremos em contato com você para apresentar a proposta ou tirar dúvidas complementares.
        </p>
    </EmailLayout>
);

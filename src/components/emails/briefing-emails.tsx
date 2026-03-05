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
            padding: "40px",
            backgroundColor: "#050505",
            border: "1px solid #1a1a1a",
            marginBottom: "60px"
        }}>
            <p style={{ margin: "0 0 8px 0", fontSize: "10px", color: "#666", textTransform: "uppercase", letterSpacing: "0.2em" }}>Cliente</p>
            <p style={{ margin: "0 0 32px 0", fontSize: "20px", fontWeight: "500", color: "#ffffff" }}>{clientName}</p>

            <p style={{ margin: "0 0 8px 0", fontSize: "10px", color: "#666", textTransform: "uppercase", letterSpacing: "0.2em" }}>Projeto</p>
            <p style={{ margin: "0", fontSize: "20px", fontWeight: "500", color: "#ffffff" }}>{projectName}</p>
        </div>

        <div style={{ textAlign: "center" }}>
            <a href="https://erp.merali.com.br/briefings" style={{
                display: "block",
                backgroundColor: "#ffffff",
                color: "#000000",
                padding: "24px 40px",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "14px",
                textTransform: "uppercase",
                letterSpacing: "0.2em"
            }}>
                Acessar Briefing
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

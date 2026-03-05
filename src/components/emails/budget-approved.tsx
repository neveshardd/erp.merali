import * as React from "react";
import { EmailLayout } from "./layout";

interface BudgetApprovedEmailProps {
    clientName: string;
    projectName: string;
}

export const BudgetApprovedEmail = ({
    clientName,
    projectName,
}: BudgetApprovedEmailProps) => (
    <EmailLayout
        title="Iniciado"
        previewText={`Boas notícias ${clientName}! Seu projeto ${projectName} foi aprovado.`}
    >
        <p style={{ margin: "0 0 24px" }}>
            Olá <strong>{clientName}</strong>,
        </p>
        <p style={{ margin: "0 0 32px", fontSize: "20px", color: "#ffffff", fontWeight: "bold", lineHeight: "1.2" }}>
            Estamos muito felizes em anunciar que o projeto <strong>{projectName}</strong> foi aprovado e oficialmente iniciado.
        </p>
        <p style={{ margin: "0 0 40px" }}>
            Este é o começo de uma jornada para transformar sua visão em realidade através do hiper-realismo. Nossa equipe de artitas já está reservada para o cronograma do seu projeto.
        </p>

        <div style={{
            padding: "32px",
            backgroundColor: "#10b981",
            textAlign: "center",
            marginBottom: "60px"
        }}>
            <p style={{ margin: "0", fontSize: "14px", fontWeight: "600", color: "#000000", textTransform: "uppercase", letterSpacing: "0.2em" }}>
                PRODUÇÃO INICIADA
            </p>
        </div>

        <p style={{ margin: "0", color: "#444" }}>
            Em breve você receberá as primeiras atualizações. Caso tenha qualquer dúvida, estamos à disposição.
        </p>
    </EmailLayout>
);

import * as React from "react";

interface EmailTemplateProps {
    title: string;
    previewText: string;
    children: React.ReactNode;
}

export const EmailLayout = ({ title, children }: EmailTemplateProps) => (
    <div style={{
        backgroundColor: "#000000",
        fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        margin: "0",
        padding: "0",
        color: "#ffffff",
        width: "100%",
    }}>
        <table align="center" border={0} cellPadding="0" cellSpacing="0" width="100%" style={{ maxWidth: "600px", margin: "0 auto", backgroundColor: "#000000" }}>
            {/* Header Padding */}
            <tr><td style={{ height: "60px" }}></td></tr>

            {/* Logo */}
            <tr>
                <td style={{ padding: "0 40px" }}>
                    <img
                        src="https://erp.merali.com.br/logo.png"
                        alt="Merali Studio"
                        style={{ width: "40px", height: "40px", display: "block" }}
                    />
                </td>
            </tr>

            {/* Separator / Top Spacing */}
            <tr><td style={{ height: "60px" }}></td></tr>

            {/* Content Area */}
            <tr>
                <td style={{ padding: "0 40px" }}>
                    <h2 style={{
                        fontSize: "36px",
                        fontWeight: "500",
                        letterSpacing: "-0.02em",
                        lineHeight: "1.1",
                        margin: "0 0 40px 0",
                        color: "#ffffff",
                    }}>
                        {title}
                    </h2>

                    <div style={{
                        color: "#eeeeee",
                        fontSize: "16px",
                        lineHeight: "1.6",
                        fontWeight: "400"
                    }}>
                        {children}
                    </div>
                </td>
            </tr>

            {/* Footer Spacing */}
            <tr><td style={{ height: "100px" }}></td></tr>

            {/* Footer */}
            <tr>
                <td style={{
                    padding: "40px",
                    backgroundColor: "#050505",
                    borderTop: "1px solid #1a1a1a"
                }}>
                    <div style={{ fontSize: "12px", color: "#666", lineHeight: "1.5" }}>
                        <strong>Merali Studio</strong>
                        <br />
                        Design System for the Future.
                        <br /><br />
                        © 2026 Merali. Todos os direitos reservados.
                        <br />
                        Brasília, DF.
                    </div>
                </td>
            </tr>
            <tr><td style={{ height: "40px" }}></td></tr>
        </table>
    </div >
);

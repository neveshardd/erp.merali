import * as React from "react";

interface EmailTemplateProps {
    title: string;
    previewText: string;
    children: React.ReactNode;
}

export const EmailLayout = ({ title, children }: EmailTemplateProps) => (
    <div style={{
        backgroundColor: "#050505",
        fontFamily: "Helvetica, Arial, sans-serif",
        margin: "0",
        padding: "0",
        color: "#ffffff",
        width: "100%",
    }}>
        <table align="center" border={0} cellPadding="0" cellSpacing="0" width="100%" style={{ maxWidth: "600px", margin: "40px auto", backgroundColor: "#0f0f0f", borderRadius: "32px", overflow: "hidden", border: "1px solid #222" }}>
            <tr>
                <td style={{ padding: "60px 40px 40px", textAlign: "center" }}>
                    <h1 style={{
                        fontSize: "20px",
                        fontWeight: "900",
                        letterSpacing: "0.4em",
                        textTransform: "uppercase",
                        margin: "0",
                        color: "#ffffff",
                    }}>
                        Merali<span style={{ color: "#444" }}>Studio</span>
                    </h1>
                </td>
            </tr>
            <tr>
                <td style={{ padding: "0 40px" }}>
                    <div style={{ height: "1px", backgroundColor: "#222" }}></div>
                </td>
            </tr>
            <tr>
                <td style={{ padding: "60px 40px" }}>
                    <h2 style={{
                        fontSize: "42px",
                        fontWeight: "900",
                        letterSpacing: "-0.04em",
                        textTransform: "uppercase",
                        marginBottom: "32px",
                        lineHeight: "0.9",
                        color: "#ffffff",
                    }}>
                        {title}
                    </h2>

                    <div style={{ color: "#999", fontSize: "16px", lineHeight: "1.6" }}>
                        {children}
                    </div>

                    <div style={{ marginTop: "60px", paddingTop: "40px", borderTop: "1px solid #222", fontSize: "10px", color: "#444", textAlign: "center", textTransform: "uppercase", letterSpacing: "0.2em" }}>
                        Pure Visual Prestige.
                        <br />
                        <br />
                        © 2026 Merali Studio.
                        <br />
                        Brasília, DF.
                    </div>
                </td>
            </tr>
        </table>
    </div>
);

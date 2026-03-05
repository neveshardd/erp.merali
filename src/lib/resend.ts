import { Resend } from "resend";
import * as React from "react";

export const EMAIL_FROM = "Merali Studio <contato@merali.com.br>";

interface SendEmailParams {
    to: string | string[];
    subject: string;
    react?: React.ReactElement | string; // Optional if using templateId
    templateId?: string;
    data?: any;
}

export async function sendEmail({ to, subject, react, templateId, data }: SendEmailParams) {
    const apiKey = process.env.RESEND_API_KEY;

    console.log("--- [DEBUG EMAIL START] ---");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("TemplateId:", templateId);
    console.log("From:", EMAIL_FROM);

    if (!apiKey) {
        console.error("❌ RESEND_API_KEY is missing!");
        throw new Error("Resend API key is not configured");
    }

    const resend = new Resend(apiKey);

    try {
        let options: any = {
            from: EMAIL_FROM,
            to,
            subject,
            headers: {
                "X-Entity-Ref-ID": Math.random().toString(36).substring(7),
                "X-Priority": "1 (Highest)",
            },
        };

        if (templateId && typeof templateId === "string" && templateId.length > 0) {
            // Use hosted template
            console.log("[Resend] Sending using Template ID:", templateId);
            options.template_id = templateId;
            if (data) options.data = data;
        } else if (react) {
            // Fallback to local rendering
            console.log("[Resend] Pre-rendering component...");
            let htmlContent: string;
            if (typeof react === "string") {
                htmlContent = react;
            } else {
                const { renderToStaticMarkup } = require("react-dom/server");
                htmlContent = renderToStaticMarkup(react);
            }
            options.html = htmlContent;
        } else {
            const errorMsg = "Missing both 'react' and 'templateId'. Check if your RESEND_TEMPLATE env variables are set correctly.";
            console.error(`❌ ${errorMsg}`);
            throw new Error(errorMsg);
        }

        const response = await resend.emails.send(options);

        if (response.error) {
            console.error("❌ Resend API Error:", response.error);
            throw new Error(`Resend Error: ${response.error.message}`);
        }

        console.log("✅ Resend success! ID:", response.data?.id);
        console.log("--- [DEBUG EMAIL END] ---");
        return response.data;
    } catch (error: any) {
        console.error("❌ Exception in sendEmail:", error.message || error);
        console.log("--- [DEBUG EMAIL END] ---");
        throw error;
    }
}

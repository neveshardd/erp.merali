import { Resend } from "resend";
import * as React from "react";

export const EMAIL_FROM = "Merali Studio <contato@merali.com.br>";

interface SendEmailParams {
    to: string | string[];
    subject: string;
    react: React.ReactElement | string;
}

export async function sendEmail({ to, subject, react }: SendEmailParams) {
    const apiKey = process.env.RESEND_API_KEY;

    console.log("--- [DEBUG EMAIL START] ---");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("From:", EMAIL_FROM);
    console.log("API Key length:", apiKey?.length);
    console.log("API Key prefix:", apiKey?.substring(0, 7));

    if (!apiKey) {
        console.error("❌ RESEND_API_KEY is missing!");
        throw new Error("Resend API key is not configured");
    }

    const resend = new Resend(apiKey);

    try {
        console.log("[Resend] Sending request...");
        const response = await resend.emails.send({
            from: EMAIL_FROM,
            to,
            subject,
            react: typeof react === "string" ? undefined : react,
            html: typeof react === "string" ? react : undefined,
        });

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

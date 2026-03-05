import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const EMAIL_FROM = "Merali Studio <contato@merali.com.br>";

interface SendEmailParams {
    to: string | string[];
    subject: string;
    react: React.ReactElement | string;
}

export async function sendEmail({ to, subject, react }: SendEmailParams) {
    try {
        const data = await resend.emails.send({
            from: EMAIL_FROM,
            to,
            subject,
            react: typeof react === "string" ? undefined : react,
            html: typeof react === "string" ? react : undefined,
        });
        return data;
    } catch (error) {
        console.error("Error sending email:", error);
        return null;
    }
}

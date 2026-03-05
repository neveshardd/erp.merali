# Templates HTML para Resend - Merali Studio (V2)

Copie e cole o código abaixo diretamente no seu dashboard do Resend. 
Adicionei a **Imagem de Perfil** e os **Links Reais** que apontam para a nova página de pagamento.

---

## 1. Nova Fatura (Fatura em Aberto)

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nova Fatura - Merali Studio</title>
</head>
<body style="background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; color: #ffffff; width: 100%;">
    <!-- Preheader -->
    <div style="display: none; max-height: 0px; overflow: hidden;">
        Olá {{clientName}}, sua nova fatura de {{amount}} está disponível para pagamento.
    </div>

    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #000000;">
        <tr><td style="height: 60px;"></td></tr>
        <tr>
            <td style="padding: 0 40px;">
                <img src="https://erp.merali.com.br/logo.png" alt="Merali Studio" style="width: 40px; height: 40px; display: block; border: none;">
            </td>
        </tr>
        <tr><td style="height: 60px;"></td></tr>
        <tr>
            <td style="padding: 0 40px;">
                <h2 style="font-size: 36px; font-weight: 500; letter-spacing: -0.02em; line-height: 1.1; margin: 0 0 40px 0; color: #ffffff;">Nova Fatura</h2>
                <div style="color: #eeeeee; font-size: 16px; line-height: 1.6; font-weight: 400;">
                    <p style="margin: 0 0 24px;">Olá <strong>{{clientName}}</strong>,</p>
                    <p style="margin: 0 0 40px;">Uma nova fatura foi gerada para o seu projeto. O pagamento pode ser realizado via PIX Instantâneo, Cartão de Crédito ou Boleto.</p>
                    
                    <div style="padding: 40px; background-color: #050505; border: 1px solid #1a1a1a; margin-bottom: 60px;">
                        <div style="margin-bottom: 24px;">
                            <span style="font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 0.2em; display: block; margin-bottom: 4px;">Valor Total</span>
                            <span style="font-size: 24px; font-weight: 600; color: #ffffff;">{{amount}}</span>
                        </div>
                        <div>
                            <span style="font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 0.2em; display: block; margin-bottom: 4px;">Data de Vencimento</span>
                            <span style="font-size: 24px; font-weight: 600; color: #ffffff;">{{dueDate}}</span>
                        </div>
                    </div>
                </div>
            </td>
        </tr>
        <tr>
            <td style="padding: 0 40px;">
                <a href="{{paymentUrl}}" target="_blank" style="display: block; background-color: #ffffff; color: #000000; padding: 24px 48px; text-decoration: none; font-weight: 700; font-size: 14px; text-align: center; text-transform: uppercase; letter-spacing: 0.2em;">Realizar Pagamento</a>
            </td>
        </tr>
        
        <tr><td style="height: 80px;"></td></tr>

        <!-- Profile Section -->
        <tr>
            <td style="padding: 40px; border-top: 1px solid #1a1a1a; text-align: left;">
                <table border="0" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding-right: 20px;">
                            <img src="{{bioImage}}" alt="{{bioName}}" style="width: 48px; height: 48px; border-radius: 50%; display: block; object-fit: cover; background-color: #1a1a1a;">
                        </td>
                        <td>
                            <p style="margin: 0; font-size: 14px; font-weight: 700; color: #ffffff;">{{bioName}}</p>
                            <p style="margin: 0; font-size: 11px; font-weight: 600; color: #666; text-transform: uppercase; tracking-widest: 0.1em;">Diretor de Design</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <tr>
            <td style="padding: 0 40px 40px 40px;">
                <div style="font-size: 11px; color: #444; line-height: 1.5; font-weight: 500;">
                    <strong>Merali Studio</strong> &bull; Design System for the Future.<br>
                    Brasília, DF. &copy; 2026.
                </div>
            </td>
        </tr>
    </table>
</body>
</html>
```

---

## 2. Confirmação de Pagamento

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pagamento Confirmado - Merali Studio</title>
</head>
<body style="background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; color: #ffffff; width: 100%;">
    <!-- Preheader -->
    <div style="display: none; max-height: 0px; overflow: hidden;">
        Recebemos seu pagamento de {{amount}}. Obrigado pela confiança!
    </div>

    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #000000;">
        <tr><td style="height: 60px;"></td></tr>
        <tr>
            <td style="padding: 0 40px;">
                <img src="https://erp.merali.com.br/logo.png" alt="Merali Studio" style="width: 40px; height: 40px; display: block; border: none;">
            </td>
        </tr>
        <tr><td style="height: 60px;"></td></tr>
        <tr>
            <td style="padding: 0 40px;">
                <h2 style="font-size: 36px; font-weight: 500; letter-spacing: -0.02em; line-height: 1.1; margin: 0 0 40px 0; color: #ffffff;">Confirmado</h2>
                <div style="color: #eeeeee; font-size: 16px; line-height: 1.6; font-weight: 400;">
                    <p style="margin: 0 0 24px;">Olá <strong>{{clientName}}</strong>,</p>
                    <p style="margin: 0 0 40px;">Confirmamos o recebimento do seu pagamento referente à fatura <strong>#{{invoiceId}}</strong>.</p>
                    
                    <div style="padding: 60px 40px; border: 1px solid #10b981; text-align: center; margin-bottom: 60px;">
                        <span style="font-size: 10px; color: #10b981; text-transform: uppercase; letter-spacing: 0.4em; display: block; margin-bottom: 16px;">PAGAMENTO CONFIRMADO</span>
                        <span style="font-size: 48px; font-weight: 700; color: #ffffff; letter-spacing: -0.04em;">{{amount}}</span>
                    </div>
                </div>
            </td>
        </tr>
        
        <tr><td style="height: 80px;"></td></tr>

        <!-- Profile Section -->
        <tr>
            <td style="padding: 40px; border-top: 1px solid #1a1a1a; text-align: left;">
                <table border="0" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding-right: 20px;">
                            <img src="{{bioImage}}" alt="{{bioName}}" style="width: 48px; height: 48px; border-radius: 50%; display: block; object-fit: cover; background-color: #1a1a1a;">
                        </td>
                        <td>
                            <p style="margin: 0; font-size: 14px; font-weight: 700; color: #ffffff;">{{bioName}}</p>
                            <p style="margin: 0; font-size: 11px; font-weight: 600; color: #666; text-transform: uppercase; tracking-widest: 0.1em;">Diretor de Design</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <tr>
            <td style="padding: 0 40px 40px 40px;">
                <div style="font-size: 11px; color: #444; line-height: 1.5; font-weight: 500;">
                    <strong>Merali Studio</strong> &bull; Design System for the Future.<br>
                    Brasília, DF. &copy; 2026.
                </div>
            </td>
        </tr>
    </table>
</body>
</html>
```

---

## 3. Projeto Iniciado

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Projeto Iniciado - Merali Studio</title>
</head>
<body style="background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; color: #ffffff; width: 100%;">
    <!-- Preheader -->
    <div style="display: none; max-height: 0px; overflow: hidden;">
        Boas notícias {{clientName}}! Iniciamos a produção do projeto {{projectName}}.
    </div>

    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #000000;">
        <tr><td style="height: 60px;"></td></tr>
        <tr>
            <td style="padding: 0 40px;">
                <img src="https://erp.merali.com.br/logo.png" alt="Merali Studio" style="width: 40px; height: 40px; display: block; border: none;">
            </td>
        </tr>
        <tr><td style="height: 60px;"></td></tr>
        <tr>
            <td style="padding: 0 40px;">
                <h2 style="font-size: 36px; font-weight: 500; letter-spacing: -0.02em; line-height: 1.1; margin: 0 0 40px 0; color: #ffffff;">Iniciado</h2>
                <div style="color: #eeeeee; font-size: 16px; line-height: 1.6; font-weight: 400;">
                    <p style="margin: 0 0 24px;">Olá <strong>{{clientName}}</strong>,</p>
                    <p style="margin: 0 0 40px;">Seu projeto <strong>{{projectName}}</strong> foi aprovado e oficialmente iniciado. Nossa equipe já está trabalhando na produção.</p>
                    
                    <div style="padding: 32px; background-color: #10b981; text-align: center; margin-bottom: 60px; border-radius: 0px;">
                        <span style="font-size: 14px; font-weight: 700; color: #000000; text-transform: uppercase; letter-spacing: 0.2em;">PRODUÇÃO INICIADA</span>
                    </div>
                </div>
            </td>
        </tr>
        
        <tr><td style="height: 80px;"></td></tr>

        <!-- Profile Section -->
        <tr>
            <td style="padding: 40px; border-top: 1px solid #1a1a1a; text-align: left;">
                <table border="0" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding-right: 20px;">
                            <img src="{{bioImage}}" alt="{{bioName}}" style="width: 48px; height: 48px; border-radius: 50%; display: block; object-fit: cover; background-color: #1a1a1a;">
                        </td>
                        <td>
                            <p style="margin: 0; font-size: 14px; font-weight: 700; color: #ffffff;">{{bioName}}</p>
                            <p style="margin: 0; font-size: 11px; font-weight: 600; color: #666; text-transform: uppercase; tracking-widest: 0.1em;">Diretor de Design</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <tr>
            <td style="padding: 0 40px 40px 40px;">
                <div style="font-size: 11px; color: #444; line-height: 1.5; font-weight: 500;">
                    <strong>Merali Studio</strong> &bull; Design System for the Future.<br>
                    Brasília, DF. &copy; 2026.
                </div>
            </td>
        </tr>
    </table>
</body>
</html>
```

# Templates HTML para Resend - Merali Studio

Copie e cole o código abaixo diretamente no seu dashboard do Resend. 
**DICA DE PREVIEW**: Adicionei um bloco oculto no início de cada template. O texto que você colocar dentro da primeira `div` (onde diz `{{previewText}}`) será o que aparecerá na notificação do celular/caixa de entrada do cliente.

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
<body style="background-color: #000000; font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0; color: #ffffff; width: 100%;">
    <!-- Preheader (Texto que aparece na notificação do celular) -->
    <div style="display: none; max-height: 0px; overflow: hidden;">
        Olá {{clientName}}, sua nova fatura de {{amount}} está disponível para pagamento.
    </div>
    <div style="display: none; max-height: 0px; overflow: hidden;">
        &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
    </div>

    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #000000;">
        <tr><td style="height: 60px;"></td></tr>
        <tr>
            <td style="padding: 0 40px;">
                <img src="https://erp.merali.com.br/logo.png" alt="Merali Studio" style="width: 40px; height: 40px; display: block;">
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
                        <div style="margin-bottom: 20px;">
                            <span style="font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 0.2em; display: block; margin-bottom: 4px;">Valor Total</span>
                            <span style="font-size: 24px; font-weight: 500; color: #ffffff;">{{amount}}</span>
                        </div>
                        <div>
                            <span style="font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 0.2em; display: block; margin-bottom: 4px;">Data de Vencimento</span>
                            <span style="font-size: 24px; font-weight: 500; color: #ffffff;">{{dueDate}}</span>
                        </div>
                    </div>
                </div>
            </td>
        </tr>
        <tr>
            <td style="padding: 0 40px;">
                <a href="{{paymentUrl}}" style="display: block; background-color: #ffffff; color: #000000; padding: 24px 48px; text-decoration: none; font-weight: 600; font-size: 14px; text-align: center; text-transform: uppercase; letter-spacing: 0.2em;">Realizar Pagamento</a>
            </td>
        </tr>
        <tr><td style="height: 100px;"></td></tr>
        <tr>
            <td style="padding: 40px; background-color: #050505; border-top: 1px solid #1a1a1a;">
                <div style="font-size: 12px; color: #666; line-height: 1.5;">
                    <strong>Merali Studio</strong><br>
                    Design System for the Future.<br><br>
                    © 2026 Merali. Todos os direitos reservados.<br>
                    Brasília, DF.
                </div>
            </td>
        </tr>
        <tr><td style="height: 40px;"></td></tr>
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
<body style="background-color: #000000; font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0; color: #ffffff; width: 100%;">
    <!-- Preheader -->
    <div style="display: none; max-height: 0px; overflow: hidden;">
        Recebemos seu pagamento de {{amount}}. Obrigado pela confiança!
    </div>
    <div style="display: none; max-height: 0px; overflow: hidden;">
        &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
    </div>

    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #000000;">
        <tr><td style="height: 60px;"></td></tr>
        <tr>
            <td style="padding: 0 40px;">
                <img src="https://erp.merali.com.br/logo.png" alt="Merali Studio" style="width: 40px; height: 40px; display: block;">
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
                        <span style="font-size: 48px; font-weight: 500; color: #ffffff; letter-spacing: -0.04em;">{{amount}}</span>
                    </div>
                </div>
            </td>
        </tr>
        <tr><td style="height: 100px;"></td></tr>
        <tr>
            <td style="padding: 40px; background-color: #050505; border-top: 1px solid #1a1a1a;">
                <div style="font-size: 12px; color: #666; line-height: 1.5;">
                    <strong>Merali Studio</strong><br>
                    Design System for the Future.<br><br>
                    © 2026 Merali. Todos os direitos reservados.<br>
                    Brasília, DF.
                </div>
            </td>
        </tr>
    </table>
</body>
</html>
```

---

## 3. Projeto Iniciado (Orçamento Aprovado)

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Projeto Iniciado - Merali Studio</title>
</head>
<body style="background-color: #000000; font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0; color: #ffffff; width: 100%;">
    <!-- Preheader -->
    <div style="display: none; max-height: 0px; overflow: hidden;">
        Boas notícias {{clientName}}! Iniciamos a produção do projeto {{projectName}}.
    </div>
    <div style="display: none; max-height: 0px; overflow: hidden;">
        &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
    </div>

    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #000000;">
        <tr><td style="height: 60px;"></td></tr>
        <tr>
            <td style="padding: 0 40px;">
                <img src="https://erp.merali.com.br/logo.png" alt="Merali Studio" style="width: 40px; height: 40px; display: block;">
            </td>
        </tr>
        <tr><td style="height: 60px;"></td></tr>
        <tr>
            <td style="padding: 0 40px;">
                <h2 style="font-size: 36px; font-weight: 500; letter-spacing: -0.02em; line-height: 1.1; margin: 0 0 40px 0; color: #ffffff;">Iniciado</h2>
                <div style="color: #eeeeee; font-size: 16px; line-height: 1.6; font-weight: 400;">
                    <p style="margin: 0 0 24px;">Olá <strong>{{clientName}}</strong>,</p>
                    <p style="margin: 0 0 40px;">Seu projeto <strong>{{projectName}}</strong> foi aprovado e oficialmente iniciado.</p>
                    <div style="padding: 32px; background-color: #10b981; text-align: center; margin-bottom: 60px;">
                        <p style="margin: 0; font-size: 14px; font-weight: 600; color: #000000; text-transform: uppercase; letter-spacing: 0.2em;">PRODUÇÃO INICIADA</p>
                    </div>
                </div>
            </td>
        </tr>
        <tr><td style="height: 100px;"></td></tr>
        <tr>
            <td style="padding: 40px; background-color: #050505; border-top: 1px solid #1a1a1a;">
                <div style="font-size: 12px; color: #666; line-height: 1.5;">
                    <strong>Merali Studio</strong><br>
                    Design System for the Future.<br><br>
                    © 2026 Merali. Todos os direitos reservados.<br>
                    Brasília, DF.
                </div>
            </td>
        </tr>
    </table>
</body>
</html>
```

# Guia de E-mails Transacionais - Merali Studio

Este diretório contém os templates de e-mail do sistema, desenvolvidos com foco em um design minimalista, de alto contraste e estilo "Uber" (quadrado, preto e branco).

---

## 🎨 Design System (Uber-like)
- **Cores**: Fundo `#000000`, Texto `#ffffff`, Destaques em `#eeeeee` ou `#10b981` (sucesso).
- **Formatos**: Cantos retos (0px border-radius), sem bordas externas, tipografia limpa.
- **Logotipo**: Favicon oficial em 40x40px no topo.

---

## 🏗️ Estrutura Colecionável

### 1. Layout Base (`layout.tsx`)
O componente que envolve todos os outros. Define o fundo, logo e footer.
- **Propriedades**: `title`, `previewText`, `children`.

### 2. Nova Fatura (`new-invoice.tsx`)
Enviado quando uma fatura é gerada.
```tsx
<NewInvoiceEmail 
  clientName="João da Silva" 
  amount="R$ 1.500,00" 
  dueDate="10 de Março" 
  paymentUrl="..." 
/>
```

### 3. Pagamento Confirmado (`payment-received.tsx`)
Enviado logo após a compensação do PIX ou Cartão (Stripe/MP).
```tsx
<PaymentReceivedEmail 
  clientName="João da Silva" 
  amount="R$ 1.500,00" 
  invoiceId="..." 
/>
```

### 4. Orçamento Aprovado (`budget-approved.tsx`)
Notificação de início de produção após aprovação do projeto.
```tsx
<BudgetApprovedEmail 
  clientName="João da Silva" 
  projectName="Maquete Residencial X" 
/>
```

### 5. Briefing (`briefing-emails.tsx`)
Contém dois templates: um para o Admin (notificando novo envio) e um para o Cliente (confirmando recebimento).

---

## 🛠️ Como Editar os Templates
Todos os templates usam **Inline CSS** (via prop `style` do React). Isso é obrigatório para garantir que o estilo funcione no Gmail/Outlook.

**Regras de Ouro:**
1. **Nunca use classes externas ou Tailwind**: E-mails não as suportam.
2. **Use Px em vez de Rem**: Melhora a compatibilidade em clientes antigos.
3. **Imagens Externas**: Sempre use URLs absolutas (Ex: `https://erp.merali.com.br/logo.png`).
4. **Alinhamento**: Sempre use `<table>` para estruturas complexas.

---

## 🚀 Como Enviar via Código
O envio é centralizado na biblioteca `src/lib/resend.ts`.
```typescript
import { sendEmail } from "@/lib/resend";
import { NewInvoiceEmail } from "@/components/emails/new-invoice";

await sendEmail({
  to: "cliente@email.com",
  subject: "Nova Fatura - Merali Studio",
  react: <NewInvoiceEmail {...dados} />
});
```

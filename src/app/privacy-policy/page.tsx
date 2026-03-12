
import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 font-sans text-neutral-800 leading-relaxed">
      <h1 className="text-3xl font-black uppercase tracking-tighter mb-8 italic">Política de Privacidade</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 uppercase tracking-tight">1. Introdução</h2>
        <p>
          Esta Política de Privacidade descreve como o ERP Studio Merali ("nós", "nosso") coleta, utiliza e protege suas informações ao utilizar nossos serviços de automação social integrados com a API do Instagram e Facebook.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 uppercase tracking-tight">2. Coleta de Dados via Meta API</h2>
        <p>
          Nosso aplicativo solicita acesso às seguintes informações através da API da Meta (Facebook/Instagram):
        </p>
        <ul className="list-disc ml-6 mt-2 space-y-2">
          <li><strong>instagram_basic:</strong> Para identificar sua conta Business.</li>
          <li><strong>instagram_content_publish:</strong> Para permitir que você publique imagens e legendas diretamente do nosso ERP.</li>
          <li><strong>pages_show_list / pages_read_engagement:</strong> Para gerenciar a conexão entre sua página do Facebook e sua conta do Instagram.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 uppercase tracking-tight">3. Uso das Informações</h2>
        <p>
          Os dados coletados (Tokens de Acesso) são utilizados única e exclusivamente para autenticar o envio de postagens comandadas por você dentro do ERP. Não compartilhamos, vendemos ou utilizamos esses tokens para qualquer outra finalidade.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 uppercase tracking-tight">4. Armazenamento e Segurança</h2>
        <p>
          Os tokens de acesso são armazenados de forma segura em nosso banco de dados criptografado para permitir a funcionalidade de postagem contínua e renovação automática, evitando expirações frequentes.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 uppercase tracking-tight">5. Deleção de Dados</h2>
        <p>
          Você pode revogar o acesso do nosso aplicativo a qualquer momento através das configurações de segurança do seu Facebook/Instagram ou solicitando a exclusão da sua conta em nosso ERP, o que removerá permanentemente todos os tokens associados.
        </p>
      </section>

      <section className="mb-12 border-t pt-8 border-neutral-100">
        <p className="text-sm text-neutral-500">
          Última atualização: 11 de Março de 2026. <br />
          Studio Merali - Gestão de Prestígio.
        </p>
      </section>
    </div>
  );
}

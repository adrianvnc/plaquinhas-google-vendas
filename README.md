# 📍 Plaquinhas Google - Gestor de Vendas & Ativação

Software desenvolvido sob medida para controle de vendas de **Plaquinhas de Avaliação Google (NFC & QR Code)** para estabelecimentos locais.

## 🚀 Funcionalidades

1. **Adicionar Venda:**
   - **Cliente:** Nome do estabelecimento ou proprietário.
   - **Nicho:** Restaurante, Barbearia, Saúde/Clínica, Pet Shop, Varejo, etc.
   - **Como foi a venda? (Nível de Dificuldade):** Fácil (🟢), Médio (🟡), Difícil (🔴) com badges visuais.
   - **Data e Hora:** Preenchimento automático ou customizado.
   - **Já está funcionando?:** Switch interativo (✅ Funcionando vs ⏳ Pendente de configuração).
   - **Campos adicionais úteis:** Valor (R$), Quantidade, WhatsApp e Observações.

2. **Tabelinha de Vendas (Desktop) & Cards Mobile:**
   - Alternância de status de ativação com 1 clique.
   - Botão de WhatsApp direto com mensagem de pós-venda pronta.
   - Edição e exclusão rápida.
   - Filtros por busca, status e nível de dificuldade.
   - Exportação completa para Excel / CSV.

3. **Armazenamento e Sincronização:**
   - **Firebase Firestore:** Conexão nativa e sincronização em tempo real.
   - **Armazenamento Local Resiliente:** Se estiver na rua sem internet ou sem autenticação no Firebase, todas as vendas são mantidas 100% seguras na memória local.
   - **Backup e Restauração:** Exportação e importação de arquivo JSON com 1 clique.

## 💻 Como Rodar Localmente

```bash
cd plaquinhas-google-vendas
npm install
npm run dev
```

## 🌐 Publicação na Vercel

O projeto foi configurado com `vercel.json` e já está versionado no GitHub:
- **Repositório GitHub:** [adrianvnc/plaquinhas-google-vendas](https://github.com/adrianvnc/plaquinhas-google-vendas)
- **Importação Direta na Vercel:** [Deploy no Vercel](https://vercel.com/new/import?s=https://github.com/adrianvnc/plaquinhas-google-vendas)

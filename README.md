# Ethical Guardian — React Prototype

Protótipo do app *Ethical Guardian* (React + Vite) gerado automaticamente.

**O que esse projeto contém**
- Protótipo funcional em React que simula:
  - botão SOCORRO (usa Geolocation API e envia alertas simulados para contatos);
  - fluxo de denúncia manual;
  - seção de contatos (adicionar/editar/remover/marcar como confiável);
  - modo claro/escuro discreto;
  - histórico local de alertas;
  - suporte básico a idiomas (pt-BR, en, es) e texto citando a LEI Nº 13.431/2017;
  - denûncia silenciosa por palavra-chave (simulada).

**Limitações**
- Hotword (detecção por voz em background) e envio real de SMS/ligação exigem implementação nativa (Android/iOS) e permissões específicas. O protótipo web *simula* esse comportamento.
- Tailwind é carregado via CDN (apenas para prototipagem).

## Como rodar localmente

Requisitos:
- Node.js (>=18) e npm

Passos:
```bash
# instale dependências
npm install

# rode em modo dev
npm run dev

# abra no navegador o endereço mostrado pelo Vite
```

## Observações de segurança e legais
O app deve criptografar dados sensíveis e obedecer à legislação local. O texto legal citado: **LEI Nº 13.431, DE 4 DE ABRIL DE 2017**. Revisão jurídica recomendada.


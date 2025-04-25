# Rally Carbono Neutro - Aplicativo de Coleta de Dados

Aplicativo web responsivo para coleta de dados em eventos do Rally Carbono Neutro. Funciona offline e é compatível com tablets e smartphones.

## Tecnologias Utilizadas

- **Next.js** - Framework React para renderização do lado do servidor
- **Bootstrap** - Framework CSS para design responsivo
- **IndexedDB** - Banco de dados do navegador para armazenamento offline
- **Service Worker** - Para funcionalidade offline
- **Google Sheets API** - Para sincronização de dados
- **XLSX** - Para exportação de dados em formato Excel

## Funcionalidades

- Formulário para coleta de dados de veículos
- Armazenamento offline de dados usando IndexedDB
- Lista de veículos com funcionalidade de busca
- Edição de dados armazenados localmente
- Sincronização com Google Sheets
- Exportação de dados para Excel (.xlsx)
- Funciona offline com suporte a múltiplos usuários em diferentes dispositivos
- Design responsivo para tablets e smartphones

## Pré-requisitos

- Node.js 14.x ou superior
- Conta do Google e credenciais de service account para o Google Sheets API

## Configuração

1. Clone o repositório
   ```
   git clone https://github.com/seu-usuario/rally-carbono-neutro.git
   cd rally-carbono-neutro
   ```

2. Instale as dependências
   ```
   npm install
   ```

3. Configure as variáveis de ambiente
   - Copie o arquivo `.env.local.example` para `.env.local`
   - Substitua o valor de `GOOGLE_SERVICE_ACCOUNT_KEY` com suas credenciais de service account
   - Opcionalmente, adicione um ID de planilha existente em `GOOGLE_SPREADSHEET_ID`

4. Execute o projeto em modo de desenvolvimento
   ```
   npm run dev
   ```

5. Acesse o aplicativo em `http://localhost:3000`

## Estrutura do Projeto

- `/public` - Arquivos estáticos e service worker
- `/src/components` - Componentes React
- `/src/contexts` - Contextos React para gerenciamento de estado
- `/src/db` - Implementação do IndexedDB
- `/src/hooks` - Hooks personalizados
- `/src/lib` - Funções utilitárias e APIs
- `/src/pages` - Rotas e páginas do Next.js
- `/src/styles` - Estilos globais e específicos

## Build e Deployment

Para gerar uma versão de produção:

```
npm run build
npm run start
```

Para implantação em produção, recomenda-se usar serviços como Vercel ou Netlify que suportam aplicativos Next.js.

## Funcionalidades Offline

O aplicativo utiliza um Service Worker para funcionar offline. As operações realizadas enquanto offline serão sincronizadas automaticamente quando a conexão for restabelecida.

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.

## Manutenção e Suporte

Para relatar problemas ou solicitar novas funcionalidades, abra uma issue no repositório do GitHub.
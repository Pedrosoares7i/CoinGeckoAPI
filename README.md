# CriptoPainel

Painel financeiro responsivo que exibe as 100 principais criptomoedas por market cap, consumindo a API pública do CoinGecko. O projeto foi desenvolvido com Vite + React (JavaScript) para o componente **Programação Web III** do Curso Técnico em Desenvolvimento de Sistemas.

## Demonstração de recursos

- Lista de moedas com preço, variação 24h, ranking e market cap.
- Busca local por nome ou símbolo com debounce de 400 ms.
- Alternância entre BRL e USD, com formatação via `Intl.NumberFormat`.
- Ordenação por market cap, preço, maior alta e maior queda.
- Paginação de 12 moedas por página.
- Cartões de resumo com maior alta, maior queda e quantidade de resultados.
- Modal de detalhes com gráfico SVG de 7 dias desenhado manualmente.
- Cache em memória de 60 segundos e botão **Atualizar**.
- Estados de carregamento, erro, lista vazia e tentativa novamente.

## API utilizada

**CoinGecko API v3** — https://api.coingecko.com/api/v3

Endpoints consumidos:

| Uso | Endpoint |
| --- | --- |
| Lista de moedas | `GET /coins/markets?vs_currency=brl&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h` |
| Detalhes | `GET /coins/{id}?localization=false&tickers=false&community_data=false&developer_data=false` |
| Histórico de 7 dias | `GET /coins/{id}/market_chart?vs_currency=brl&days=7` |

O plano público/gratuito da CoinGecko tem limite de aproximadamente **30 requisições por minuto**. Por isso, a busca é feita localmente sobre a lista já carregada e os dados do mercado ficam em cache por 60 segundos.

### A API exigiu chave?

Não. No teste realizado com `curl` em `/coins/markets`, a API respondeu **HTTP 200 sem chave**. A aplicação funciona sem configuração adicional. Ainda assim, o suporte a chave é opcional e foi implementado: se `VITE_COINGECKO_API_KEY` existir, o header `x-cg-demo-api-key` é enviado automaticamente.

## Chave de API opcional

Caso a CoinGecko passe a exigir chave no seu ambiente ou você queira usar o plano Demo:

1. Acesse https://www.coingecko.com/en/api e crie uma conta gratuita (plano **Demo**).
2. Gere sua chave no painel da CoinGecko.
3. Crie um arquivo `.env` na raiz do projeto com:

```env
VITE_COINGECKO_API_KEY=sua_chave_aqui
```

4. Reinicie o servidor de desenvolvimento.

O arquivo `.env.example` serve como modelo. O `.env` já está no `.gitignore` e não deve ser commitado.

## Como instalar e rodar

Pré-requisito: Node.js 20.19 ou superior (ou 22.12+).

```bash
npm install
npm run dev
```

Abra o endereço informado pelo Vite (normalmente `http://localhost:5173`).

Para gerar a versão de produção:

```bash
npm run build
npm run preview
```

## Estrutura de pastas

```text
.
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── CoinCard.jsx
│   │   ├── CoinList.jsx
│   │   ├── CoinModal.jsx
│   │   ├── EmptyState.jsx
│   │   ├── ErrorMessage.jsx
│   │   ├── Filters.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── Loader.jsx
│   │   ├── Pagination.jsx
│   │   ├── PriceChart.jsx
│   │   └── SummaryCards.jsx
│   ├── hooks/
│   │   ├── useDebounce.js
│   │   └── useMarkets.js
│   ├── services/
│   │   └── coingecko.js
│   ├── utils/
│   │   └── format.js
│   ├── App.css
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

## Conceitos de aula aplicados

- **Requisições HTTP com `fetch`**: centralizadas em `services/coingecko.js`, com montagem dos parâmetros via `URLSearchParams`.
- **Componentes e props**: interface dividida em componentes pequenos e reutilizáveis (`Header`, `CoinCard`, `CoinModal`, etc.).
- **Estados com `useState`**: lista de moedas, carregamento, erro, busca, moeda de referência, ordenação, página atual e moeda selecionada.
- **`useEffect`**: disparo e cancelamento de requisições, bloqueio de scroll do modal, reset de paginação e atalho da tecla Esc.
- **`AbortController`**: requisições antigas são canceladas ao trocar de moeda, refazer a busca ou fechar o modal. Erros de `AbortError` são ignorados.
- **Tratamento de erros**: mensagens específicas para HTTP 429 (limite de requisições), 401/403 (chave ausente ou inválida), falha de rede e outros status.
- **Loading e estados vazios**: spinner durante as requisições, mensagem amigável de erro com **Tentar novamente** e estado vazio para buscas sem resultado.
- **Debounce**: hook `useDebounce` evita filtrar a lista a cada tecla e respeita o limite da API.
- **Cache em memória**: `useMarkets` reutiliza a resposta por 60 segundos por moeda de referência.
- **Formatação internacional**: `Intl.NumberFormat` para moeda, notação compacta e percentuais em `pt-BR`.
- **SVG manual**: o mini gráfico de 7 dias é gerado com `<polyline>` e `<polygon>`, sem biblioteca de gráficos.
- **Acessibilidade**: textos alternativos, `aria-label`, foco visível, navegação por teclado nos cards, `role="dialog"` e `aria-modal` no modal.

## Atribuição

Dados fornecidos por [CoinGecko](https://www.coingecko.com).

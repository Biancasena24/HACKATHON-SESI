# Cuidaê+

Plataforma de autocuidado e saúde preventiva que conecta o trabalhador, a empresa e a Atenção Primária à Saúde (APS / UBS).

## Identificação

- Nome da Equipe: Ctrl+Alt+Health
- Integrantes da Equipe: Bianca Sena dos Santos, Gustavo Machado dos Santos, João Victor Santana Coelho, Luiz Conrado de Farias Neto, Raquel Mota Lima, Ulisses Pedro da Silva Santos
- Desafio: "Como podemos desenvolver soluções inovadoras que ampliem o engajamento dos trabalhadores nas iniciativas de saúde e transformem o autocuidado em um hábito contínuo, promovendo prevenção, protagonismo e melhore os resultados da saúde?
  Como transformar o autocuidado de uma recomendação pontual em uma escolha cotidiana, capaz de mobilizar, manter trabalhadores engajados e gerar impacto real nos resultados de saúde?"

---

## 1. Funcionalidades Principais

### Para o Trabalhador

- Acesso aos seus dados:
  Acesso exclusivo: Apenas o próprio colaborador tem acesso ao seu histórico individual de consultas e uso da APS.
  Consulta e portabilidade: O trabalhador pode visualizar sua evolução histórica a qualquer momento pelo aplicativo para utilizar as informações em consultas com profissionais de saúde ou na UBS.

- Desafios e Metas de Autocuidado:
  Metas semanais personalizáveis (hidratação, pausas ativas, caminhadas de 15 minutos, respiração guiada e agendamento de consultas de rotina na UBS).

- Comunidade e Gamificação Saudável:
  Engajamento coletivo entre times da empresa, somando pontos para conquistas e premiações compartilhadas sem exposição de dados individuais.

- Conexão Direta com a APS (UBS de Referência):
  Busca de UBS por CEP e visualização em mapa interativo centrado na localização GPS do trabalhador, orientações sobre vacinas do calendário adulto e histórico de atendimentos preventivos.

- Check-in Rápido de Saúde:
  Avaliação diária de sono e nível de pressão/estresse, acompanhada de mapa corporal interativo para identificação precoce de dores ou desconfortos físicos (coluna, joelhos, ombros, punhos, cabeça).

- Canais de Acolhimento Gratuito:
  Acesso rápido e integrado a canais de suporte humanizado e emergência (CVV 188 e SAMU 192).

### Para a Gestão da Empresa

- Painel de Indicadores Coletivos:
  Visão macro das queixas mais frequentes relatadas pelos funcionários (prevalência de dores lombares, dores em articulações, estresse elevado).

- Alertas Ergonômicos e Recomendações:
  Sugestões de intervenções no ambiente de trabalho (ginástica laboral, adequação de postos, rodízios de turnos).

- Mapa de Sinais por Setor:
  Visualização matricial das áreas da organização para direcionamento assertivo de campanhas internas de saúde, preservando o anonimato de grupos menores que o limite de segurança.

- Acesso Dedicado com Perfil Corporativo:
  Área de login exclusiva para gestores de RH e SST, com credenciais corporativas ou acesso direto para avaliação.

### Acesso para Bancas Avaliadoras

- Modo "Acesse como jurado":
  Tanto no login do trabalhador quanto no login corporativo, há um atalho de acesso mockado ("Acesse como jurado") que permite explorar todas as telas, dados de demonstração e fluxos da aplicação instantaneamente, sem necessidade de cadastro prévio ou confirmação de e-mail.

---

## 3. Tecnologias Utilizadas

O projeto foi construído utilizando uma arquitetura moderna, com foco em alta performance, renderização ágil e tipagem estrita em ponta a ponta:

- Framework e Roteamento:
  - React 19
  - TanStack Start (Fullstack SSR e SSR streaming)
  - TanStack Router (Roteamento tipado com verificação estática de rotas e busca segura)
  - TanStack Query v5 (Gerenciamento de cache, estado assíncrono e sincronização de dados)

- Linguagem e Tipagem:
  - TypeScript (Tipagem estrita em componentes, rotas, tabelas do banco e contratos de dados)

- Estilização e Design System:
  - Tailwind CSS v4
  - Radix UI (Componentes acessíveis e semânticos: Dialogs, Tabs, Sheet, Accordion, Progress, Tooltips)
  - Lucide React (Ícones vetoriais padronizados)
  - tw-animate-css (Animações fluidas de transição de tela e feedback)

- Visualização de Dados e Mapas:
  - Recharts (Gráficos corporativos de queixas, distribuição e acompanhamento)
  - OpenStreetMap Embed (Renderização cartográfica da localização e unidades de saúde)
  - API ViaCEP (Geolocalização e resolução de endereços por código postal)

- Backend, Autenticação e Persistência:
  - Supabase (PostgreSQL para dados de usuários, perfis, check-ins e logs de hábitos)
  - Supabase Auth (Autenticação segura via e-mail e senha, OAuth e persistência de sessão)

---

## 4. Como Executar o Projeto Localmente

### Pré-requisitos

- Node.js (versão 20.x ou superior recomendada)
- npm ou bun

### Passo a Passo

1. Clonar o repositório:

2. Instalar as dependências:

```bash
npm install
```

3. Executar o servidor de desenvolvimento:

```bash
npm run dev
```

O projeto estará disponível no endereço indicado pelo terminal (geralmente `http://localhost:3000`).

---

## 5. Diretrizes de Privacidade e LGPD

- Não realização de diagnósticos: O Cuidaê+ atua exclusivamente como ferramenta de conscientização e acompanhamento preventivo, deixando claro ao usuário que não substitui consultas com profissionais de saúde.
- Proteção de dados do colaborador: Dados individuais de humor, sintomas e anotações pessoais nunca são expostos nominalmente ao empregador.
- Anonimização corporativa: O painel da empresa exibe unicamente agregações estatísticas. Setores com menos de 10 colaboradores ativos têm seus dados ocultados no mapa de calor para impedir qualquer identificação indireta.

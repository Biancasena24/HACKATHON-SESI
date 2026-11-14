# VIVA+ — adaptação às novas ideias

Primeiro fecho o que ficou pendente: criar o painel da empresa e deixar o app abrindo sem erros. Depois entram as ideias abaixo, adaptadas ao foco em APS/SUS.

## 1. Grupos e competição saudável (estilo GymRats)
- Pessoas entram em **equipes** (por setor, turno ou convite com código).
- Ranking semanal **por equipe, não individual**: pontua a média de participação (check-ins e desafios), nunca o estado de saúde.
- Premiações simbólicas: selos, troféu da semana e um "prêmio da empresa" configurável (ex.: day off da equipe).
- Mural da equipe com incentivos ("a equipe de vocês caminhou 2.000 min!") e convites para desafios em grupo.

## 2. Rede de apoio
- Cada pessoa pode marcar até 3 "pessoas de apoio" da equipe, que recebem só um convite gentil ("chame fulano para uma caminhada"), nunca dados de saúde.
- Comunidades por interesse (caminhada, parar de fumar, sono) com convites e participação.

## 3. Saúde bucal em destaque
- Novo eixo "Boca saudável": desafios (escovar após o almoço, fio dental, trocar escova a cada 3 meses).
- No check-in: opção "dor ou sangramento na gengiva/dente".
- Na área do SUS: como conseguir atendimento odontológico na UBS (equipe de Saúde Bucal) e lembrete de consulta anual.

## 4. Meu histórico de saúde (paciente dono dos dados)
- Nova área "Minha saúde" com **dados de demonstração** simulando a integração futura com o prontuário da APS (consultas, vacinas, exames, pressão, peso, saúde bucal).
- **Relatório pessoal mensal**: situação atual, o que melhorou, próximos cuidados e "o que você está poupando" (ex.: estimativa de custos evitados com prevenção — valores ilustrativos e explicados).
- **Alertas preventivos** baseados no histórico ("faz 2 anos da última consulta odontológica", "vacina dT vencendo"). Sem diagnóstico: sempre "converse com sua UBS".
- **Dependentes**: cadastrar filhos/familiares para lembretes de vacina e consultas, com incentivo para levar a família à UBS.
- Exame físico mais completo na demonstração: pressão, IMC, circunferência abdominal e glicemia, com explicação em linguagem simples.

## 5. Acompanhamento contínuo — transparente, não "silencioso"
- Os padrões (cansaço, dor, estresse, faltas ao cuidado) continuam sendo lidos a partir do que a própria pessoa registra, com **aviso claro e consentimento**. Não há monitoramento escondido, porque isso fere a LGPD e a confiança.
- Para a empresa: no painel, os **riscos do ambiente de trabalho** (dados do programa de gerenciamento de riscos, de demonstração) aparecem cruzados com as tendências coletivas e anônimas ("setor com ruído alto + relatos de dor de cabeça").

## 6. Letramento digital (prioridade de usabilidade)
- **Modo simples**: letras maiores, menos texto, botões grandes, ícones com rótulo.
- **Ouvir a tela**: botão de áudio que lê o conteúdo em voz alta.
- Check-in só com toques (sem digitação) e tutorial de primeiro uso com 3 telas.

## 7. Recorte no interior
- No perfil: "moro na capital / no interior / na zona rural". No interior e na zona rural, o app destaca a UBS e o Agente Comunitário de Saúde, além de desafios que não dependem de internet.

## Fora de escopo (dúvidas em aberto)
- Integração real com S+ / PEP-SUS: só simulação nesta versão.
- Planilha financeira: preciso que você explique o que ela deve conter.

## Detalhes técnicos
- Novas tabelas: teams, team_members, support_contacts, dependents. O histórico clínico de demonstração é gerado em código a partir do id do usuário; não há dados reais.
- Ranking por equipe calculado por função no banco, que retorna apenas agregados e esconde equipes com menos de 3 pessoas.
- Leitura em voz alta pela fala nativa do navegador.
- Testes para: pontuação de equipe, alertas preventivos e o aviso de acolhimento.

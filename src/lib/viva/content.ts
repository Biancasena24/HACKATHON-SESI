import type { WorkMode } from "./challenges";

export const MODE_TIPS: Record<WorkMode, { title: string; text: string }[]> = {
  home_office: [
    { title: "Tela na altura dos olhos", text: "Uma pilha de livros embaixo do notebook já ajuda o pescoço." },
    { title: "Hora de desligar", text: "Combine com você mesmo um horário para fechar o computador." },
    { title: "Saia de casa um pouco", text: "Uma volta no quarteirão conta como pausa e como movimento." },
  ],
  operacional: [
    { title: "Aqueça antes do turno", text: "Dois minutos de movimentos leves preparam o corpo para o esforço." },
    { title: "Peso perto do corpo", text: "Ao levantar algo, dobre os joelhos e mantenha a carga próxima." },
    { title: "Água sempre por perto", text: "Em ambientes quentes, beba antes de sentir sede." },
  ],
  noturno: [
    { title: "Proteja seu sono de dia", text: "Quarto escuro, celular no silencioso e um aviso na porta ajudam." },
    { title: "Refeição leve na madrugada", text: "Prefira algo leve para não pesar no fim do turno." },
    { title: "Mesmo horário de dormir", text: "Manter uma rotina, mesmo nas folgas, ajuda o corpo a se ajustar." },
  ],
  retorno: [
    { title: "Um passo de cada vez", text: "Volte ao ritmo aos poucos. Respeitar limites também é cuidado." },
    { title: "Converse com sua equipe", text: "Combinar ajustes no início ajuda o retorno a ser sustentável." },
    { title: "Acompanhamento na UBS", text: "Sua equipe de Saúde da Família pode acompanhar essa fase com você." },
  ],
};

export const BODY_AREAS: { id: string; label: string; nudge: string }[] = [
  { id: "cabeca", label: "Cabeça", nudge: "Faça uma pausa longe das telas e beba um copo de água." },
  { id: "olhos", label: "Olhos", nudge: "Às 15h, experimente a regra 20-20-20: olhe para longe por 20 segundos." },
  { id: "boca", label: "Dentes e gengiva", nudge: "Dor ou sangramento na gengiva merece atenção: a equipe de Saúde Bucal da UBS pode avaliar." },
  { id: "pescoco", label: "Pescoço", nudge: "Às 15h, um alongamento de 30 segundos: incline a cabeça devagar para cada lado." },
  { id: "ombros", label: "Ombros", nudge: "Gire os ombros para trás 10 vezes, bem devagar." },
  { id: "peito", label: "Dor no peito", nudge: "Pare a atividade e descanse. Se a dor for forte, persistente ou vier com falta de ar, procure atendimento médico ou ligue 192 (SAMU)." },
  { id: "costas", label: "Lombar", nudge: "Levante a cada hora e caminhe um pouco. Se a dor continuar, procure sua UBS." },
  { id: "maos", label: "Punhos e mãos", nudge: "Abra e feche as mãos e gire os punhos por 30 segundos." },
  { id: "pernas", label: "Pernas e pés", nudge: "Se ficou muito tempo em pé, eleve as pernas por alguns minutos no descanso." },
];

export const MENTAL_CONTENT = [
  {
    title: "Estresse não é fraqueza",
    read: "2 min",
    text: "Sentir pressão é uma resposta natural do corpo. Quando ela fica constante, é sinal de que algo no dia a dia — inclusive no trabalho — precisa de ajuste. Falar sobre isso é um passo de cuidado, não de fraqueza.",
  },
  {
    title: "Sinais de sobrecarga para observar",
    read: "2 min",
    text: "Cansaço que não passa com o descanso, irritação fora do comum, dificuldade para dormir ou para se concentrar. Se você notar esses sinais por vários dias, vale conversar com alguém de confiança ou com a equipe da sua UBS.",
  },
  {
    title: "Limites saudáveis no trabalho",
    read: "2 min",
    text: "Combinar horários, pedir prazos possíveis e fazer pausas não é falta de compromisso. Um ambiente de trabalho saudável é responsabilidade de todos, não só sua.",
  },
  {
    title: "Pequenos respiros ao longo do dia",
    read: "1 min",
    text: "Um minuto respirando devagar, um copo de água, olhar pela janela. Pequenas pausas repetidas fazem mais diferença do que uma grande pausa de vez em quando.",
  },
];

export const SUPPORT_CHANNELS = [
  { name: "CVV — Centro de Valorização da Vida", detail: "Ligue 188, 24 horas, gratuito. Também por chat em cvv.org.br.", href: "https://cvv.org.br", phone: "188" },
  { name: "Sua Unidade Básica de Saúde (UBS)", detail: "Porta de entrada do SUS, inclusive para saúde mental. Pode encaminhar ao CAPS quando necessário.", href: "/cuidado" },
  { name: "SAMU", detail: "Em situação de emergência, ligue 192.", phone: "192" },
];

export const CAMPAIGN = {
  name: "Novembro Azul",
  text: "Este mês a empresa convida todos a cuidar da saúde do homem: informação, prevenção e conversa sem tabu.",
  collectiveGoal: { label: "Minutos caminhados pela equipe", target: 20000, current: 13840 },
};

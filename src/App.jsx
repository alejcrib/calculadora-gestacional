import { useMemo, useState } from "react";

const tiposGravidez = [
  {
    titulo: "Gravidez única",
    descricao: "Gestação em que há apenas um bebê em desenvolvimento no útero.",
  },
  {
    titulo: "Gemelar",
    descricao:
      "Quando há dois ou mais bebês. Pode exigir acompanhamento mais próximo.",
  },
  {
    titulo: "Ectópica",
    descricao:
      "Ocorre quando a implantação acontece fora do útero. Requer avaliação médica imediata.",
  },
  {
    titulo: "Molar",
    descricao:
      "Alteração rara relacionada ao desenvolvimento anormal do tecido gestacional.",
  },
  {
    titulo: "Alto risco",
    descricao:
      "Gestação que exige monitoramento mais cuidadoso por fatores maternos ou fetais.",
  },
  {
    titulo: "Anembrionária",
    descricao:
      "Quando o saco gestacional se desenvolve, mas o embrião não evolui adequadamente.",
  },
];

const conteudosEducativos = [
  {
    titulo: "O que é DUM?",
    texto:
      "DUM significa Data da Última Menstruação. Ela é uma referência usada para estimar o início da idade gestacional quando a data é conhecida e confiável.",
  },
  {
    titulo: "O que é DPP?",
    texto:
      "DPP significa Data Provável do Parto. É uma estimativa calculada com base em 40 semanas de gestação, mas o nascimento pode ocorrer antes ou depois dessa data.",
  },
  {
    titulo: "Como calcular idade gestacional?",
    texto:
      "Pela DUM, conta-se o número de dias desde a última menstruação e converte-se em semanas e dias. Pela primeira ultrassonografia, soma-se a idade gestacional do exame aos dias passados desde a realização do exame.",
  },
  {
    titulo: "O que é primeira ultrassonografia?",
    texto:
      "É um exame de imagem realizado no início da gestação. Quando o laudo informa semanas e dias, esses dados podem ajudar a estimar a idade gestacional atual.",
  },
  {
    titulo: "Trimestres da gravidez",
    texto:
      "De forma geral, o 1º trimestre vai até 13 semanas, o 2º trimestre vai de 14 a 27 semanas e o 3º trimestre começa a partir de 28 semanas.",
  },
  {
    titulo: "Importante",
    texto:
      "Esta calculadora fornece apenas uma estimativa educativa. O acompanhamento com profissional de saúde é indispensável para avaliação individual.",
  },
];

const perguntasFrequentes = [
  {
    pergunta: "A calculadora substitui consulta médica?",
    resposta:
      "Não. Ela fornece uma estimativa educativa. A confirmação da idade gestacional e da DPP deve ser feita por profissional de saúde.",
  },
  {
    pergunta: "Qual método é melhor: DUM ou ultrassonografia?",
    resposta:
      "Depende do caso. Quando a DUM é incerta, a primeira ultrassonografia pode ajudar bastante. O ideal é seguir a orientação do pré-natal.",
  },
  {
    pergunta: "Por que a DPP é apenas provável?",
    resposta:
      "Porque o parto pode acontecer antes ou depois da data estimada. A DPP é uma referência, não uma garantia exata.",
  },
  {
    pergunta: "Posso calcular pela DPP informada no laudo?",
    resposta:
      "Sim. A aba Por DPP permite estimar a idade gestacional atual usando uma data provável do parto já informada.",
  },
];

const checklistsPorTrimestre = {
  "1º trimestre": [
    "Iniciar ou confirmar o acompanhamento pré-natal.",
    "Organizar exames iniciais conforme orientação profissional.",
    "Confirmar idade gestacional e datação da gestação.",
  ],
  "2º trimestre": [
    "Manter consultas regulares de acompanhamento.",
    "Acompanhar o crescimento fetal conforme orientação.",
    "Organizar dúvidas para as próximas consultas.",
  ],
  "3º trimestre": [
    "Conversar sobre plano de parto e maternidade de referência.",
    "Organizar documentos e mala da maternidade.",
    "Acompanhar sinais e orientações finais do pré-natal.",
  ],
};

function formatarData(data) {
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function converterDiasParaSemanas(totalDias) {
  const diasNormalizados = Math.max(0, totalDias);
  return {
    semanas: Math.floor(diasNormalizados / 7),
    dias: diasNormalizados % 7,
  };
}

function normalizarData(data) {
  const novaData = new Date(data);
  novaData.setHours(0, 0, 0, 0);
  return novaData;
}

export default function CalculadoraGestacional() {
  const [modoCalculo, setModoCalculo] = useState("dum");
  const [dataUltimaMenstruacao, setDataUltimaMenstruacao] = useState("");
  const [dataUltrassom, setDataUltrassom] = useState("");
  const [semanasUltrassom, setSemanasUltrassom] = useState("");
  const [diasUltrassom, setDiasUltrassom] = useState("");
  const [dataProvavelParto, setDataProvavelParto] = useState("");
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState("");
  const [mostrarInfo, setMostrarInfo] = useState(false);
  const [mensagemCopiado, setMensagemCopiado] = useState("");
  const [faqAberto, setFaqAberto] = useState(null);
  const [tema, setTema] = useState("escuro");

  const modoEscuro = tema === "escuro";

  const trimestre = resultado
    ? resultado.semanas <= 13
      ? "1º trimestre"
      : resultado.semanas <= 27
      ? "2º trimestre"
      : "3º trimestre"
    : "";

  const montarResultado = ({ metodo, metodoCurto, semanas, dias, diasGestacao, dataParto, extra = {} }) => {
    const hoje = normalizarData(new Date());
    const dataPartoNormalizada = normalizarData(dataParto);
    const diasRestantes = Math.max(
      0,
      Math.ceil((dataPartoNormalizada.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
    );

    setResultado({
      metodo,
      metodoCurto,
      semanas,
      dias,
      diasGestacao,
      parto: formatarData(dataParto),
      diasRestantes,
      dataPartoISO: dataParto.toISOString(),
      ...extra,
    });
  };

  const calcularPorDum = () => {
    if (!dataUltimaMenstruacao) {
      setResultado(null);
      setErro("Selecione a data da última menstruação.");
      return;
    }

    const dum = new Date(dataUltimaMenstruacao);
    const hoje = new Date();

    if (Number.isNaN(dum.getTime())) {
      setResultado(null);
      setErro("Data inválida.");
      return;
    }

    if (dum > hoje) {
      setResultado(null);
      setErro("A data da última menstruação não pode ser futura.");
      return;
    }

    const diasGestacao = Math.floor(
      (normalizarData(hoje).getTime() - normalizarData(dum).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const { semanas, dias } = converterDiasParaSemanas(diasGestacao);
    const dataParto = new Date(dum);
    dataParto.setDate(dataParto.getDate() + 280);

    montarResultado({
      metodo: "Data da Última Menstruação",
      metodoCurto: "DUM",
      semanas,
      dias,
      diasGestacao,
      dataParto,
    });
  };

  const calcularPorUltrassom = () => {
    if (!dataUltrassom) {
      setResultado(null);
      setErro("Selecione a data da ultrassonografia.");
      return;
    }

    if (semanasUltrassom === "") {
      setResultado(null);
      setErro("Informe as semanas indicadas no laudo da ultrassonografia.");
      return;
    }

    const semanasBase = Number(semanasUltrassom);
    const diasBase = diasUltrassom === "" ? 0 : Number(diasUltrassom);
    const usg = new Date(dataUltrassom);
    const hoje = new Date();

    if (Number.isNaN(usg.getTime())) {
      setResultado(null);
      setErro("Data da ultrassonografia inválida.");
      return;
    }

    if (usg > hoje) {
      setResultado(null);
      setErro("A data da ultrassonografia não pode ser futura.");
      return;
    }

    if (
      Number.isNaN(semanasBase) ||
      semanasBase < 0 ||
      semanasBase > 42 ||
      Number.isNaN(diasBase) ||
      diasBase < 0 ||
      diasBase > 6
    ) {
      setResultado(null);
      setErro("Informe uma idade gestacional válida: semanas entre 0 e 42, dias entre 0 e 6.");
      return;
    }

    const diasNoExame = semanasBase * 7 + diasBase;
    const diasDesdeExame = Math.floor(
      (normalizarData(hoje).getTime() - normalizarData(usg).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const diasGestacao = diasNoExame + diasDesdeExame;

    const { semanas, dias } = converterDiasParaSemanas(diasGestacao);
    const dataParto = new Date(usg);
    dataParto.setDate(dataParto.getDate() + (280 - diasNoExame));

    montarResultado({
      metodo: "Primeira ultrassonografia",
      metodoCurto: "1ª USG",
      semanas,
      dias,
      diasGestacao,
      dataParto,
      extra: {
        semanasNoExame: semanasBase,
        diasNoExame: diasBase,
      },
    });
  };

  const calcularPorDpp = () => {
    if (!dataProvavelParto) {
      setResultado(null);
      setErro("Selecione a data provável do parto.");
      return;
    }

    const dpp = new Date(dataProvavelParto);
    const hoje = new Date();

    if (Number.isNaN(dpp.getTime())) {
      setResultado(null);
      setErro("Data provável do parto inválida.");
      return;
    }

    const diasRestantes = Math.ceil(
      (normalizarData(dpp).getTime() - normalizarData(hoje).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const diasGestacao = 280 - diasRestantes;

    if (diasGestacao < 0 || diasGestacao > 315) {
      setResultado(null);
      setErro("A DPP informada parece estar fora do intervalo esperado para uma gestação atual.");
      return;
    }

    const { semanas, dias } = converterDiasParaSemanas(diasGestacao);

    montarResultado({
      metodo: "Data Provável do Parto",
      metodoCurto: "DPP",
      semanas,
      dias,
      diasGestacao,
      dataParto: dpp,
    });
  };

  const calcularGestacao = () => {
    setErro("");
    setMensagemCopiado("");

    if (modoCalculo === "dum") {
      calcularPorDum();
      return;
    }

    if (modoCalculo === "usg") {
      calcularPorUltrassom();
      return;
    }

    calcularPorDpp();
  };

  const limparCalculo = () => {
    setDataUltimaMenstruacao("");
    setDataUltrassom("");
    setSemanasUltrassom("");
    setDiasUltrassom("");
    setDataProvavelParto("");
    setResultado(null);
    setErro("");
    setMensagemCopiado("");
  };

  const progresso = useMemo(() => {
    if (!resultado) return 0;
    return Math.min(resultado.semanas / 40, 1);
  }, [resultado]);

  const percentualGestacao = Math.round(progresso * 100);

  const textoResultado = resultado
    ? `Calculadora Gestacional\n\nIdade gestacional: ${resultado.semanas} semanas e ${resultado.dias} dias\nDPP: ${resultado.parto}\nDias restantes para a DPP: ${resultado.diasRestantes}\nTrimestre: ${trimestre}\nMétodo usado: ${resultado.metodo}\n\nCalculado em: https://calculadora-gestacional-seven.vercel.app/`
    : "";

  const copiarResultado = async () => {
    if (!resultado) return;

    try {
      await navigator.clipboard.writeText(textoResultado);
      setMensagemCopiado("Resultado copiado.");
    } catch {
      setMensagemCopiado("Não foi possível copiar automaticamente.");
    }
  };

  const compartilharWhatsApp = () => {
    if (!resultado) return;
    const url = `https://wa.me/?text=${encodeURIComponent(textoResultado)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const gerarPdf = () => {
    if (!resultado) return;

    const janela = window.open("", "_blank", "width=900,height=700");
    if (!janela) return;

    const dataEmissao = formatarData(new Date());

    janela.document.write(`
      <!doctype html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8" />
          <title>Resultado - Calculadora Gestacional</title>
          <style>
            body { margin: 0; padding: 40px; font-family: Arial, Helvetica, sans-serif; color: #0f172a; background: #fff7fb; }
            .card { max-width: 760px; margin: 0 auto; background: #ffffff; border: 1px solid #fbcfe8; border-radius: 24px; padding: 32px; }
            h1 { margin: 0 0 8px; color: #be185d; font-size: 30px; }
            .subtitle { margin: 0 0 28px; color: #64748b; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
            .box { border-radius: 18px; background: #fff1f2; padding: 20px; margin-bottom: 16px; }
            .label { color: #64748b; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; }
            .value { margin-top: 6px; font-size: 22px; font-weight: 900; }
            .footer { margin-top: 28px; font-size: 12px; color: #64748b; line-height: 1.6; }
            @media print { body { background: #ffffff; } .card { border: none; } }
          </style>
        </head>
        <body>
          <main class="card">
            <h1>Calculadora Gestacional</h1>
            <p class="subtitle">Resultado estimado de idade gestacional e data provável do parto. Emitido em ${dataEmissao}.</p>
            <div class="grid">
              <section class="box"><div class="label">Idade gestacional</div><div class="value">${resultado.semanas} semanas e ${resultado.dias} dias</div></section>
              <section class="box"><div class="label">Data provável do parto</div><div class="value">${resultado.parto}</div></section>
              <section class="box"><div class="label">Dias restantes para a DPP</div><div class="value">${resultado.diasRestantes} dias</div></section>
              <section class="box"><div class="label">Trimestre</div><div class="value">${trimestre}</div></section>
            </div>
            <section class="box"><div class="label">Método utilizado</div><div class="value">${resultado.metodo}</div></section>
            <p class="footer">Esta ferramenta fornece apenas uma estimativa e não substitui acompanhamento médico.<br />Desenvolvido por Alexandre Ribeiro · https://calculadora-gestacional-seven.vercel.app/</p>
          </main>
          <script>window.onload = () => window.print();</script>
        </body>
      </html>
    `);

    janela.document.close();
  };

  const circumference = 2 * Math.PI * 52;
  const strokeDashoffset = circumference * (1 - progresso);

  const classes = {
    main: modoEscuro
      ? "min-h-screen overflow-hidden bg-[#120a18] text-white relative"
      : "min-h-screen overflow-hidden bg-[#fff7fb] text-slate-950 relative",
    background: modoEscuro
      ? "absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(168,85,247,0.26),transparent_32%),radial-gradient(circle_at_85%_20%,rgba(236,72,153,0.22),transparent_30%),linear-gradient(135deg,#120a18_0%,#21142b_48%,#3b1736_100%)]"
      : "absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(244,114,182,0.22),transparent_32%),radial-gradient(circle_at_85%_20%,rgba(251,207,232,0.55),transparent_32%),linear-gradient(135deg,#fff7fb_0%,#fff_48%,#ffe4f1_100%)]",
    grid: modoEscuro
      ? "absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:44px_44px] opacity-35"
      : "absolute inset-0 bg-[linear-gradient(rgba(190,24,93,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(190,24,93,0.045)_1px,transparent_1px)] bg-[size:44px_44px] opacity-60",
    nav: modoEscuro
      ? "mb-8 flex items-center justify-between rounded-full border border-white/10 bg-white/[0.07] px-4 py-3 shadow-2xl backdrop-blur-2xl"
      : "mb-8 flex items-center justify-between rounded-full border border-pink-100 bg-white/80 px-4 py-3 shadow-xl shadow-pink-100/60 backdrop-blur-2xl",
    softText: modoEscuro ? "text-pink-50/75" : "text-slate-600",
    heroCard: modoEscuro
      ? "rounded-3xl border border-white/10 bg-white/[0.08] p-5 shadow-xl backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/[0.12]"
      : "rounded-3xl border border-pink-100 bg-white/80 p-5 shadow-xl shadow-pink-100/60 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white",
    outerPanel: modoEscuro
      ? "rounded-[2.2rem] border border-white/15 bg-white/[0.09] p-3 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
      : "rounded-[2.2rem] border border-pink-100 bg-white/60 p-3 shadow-[0_30px_90px_rgba(244,114,182,0.18)] backdrop-blur-2xl",
    innerPanel: modoEscuro
      ? "rounded-[1.8rem] border border-white/10 bg-[#fffafc] p-6 text-slate-950 shadow-2xl sm:p-7"
      : "rounded-[1.8rem] border border-pink-100 bg-white p-6 text-slate-950 shadow-2xl shadow-pink-100/60 sm:p-7",
    infoSection: modoEscuro
      ? "mt-10 rounded-[2rem] border border-white/10 bg-white/[0.08] p-6 shadow-2xl backdrop-blur-2xl sm:p-8"
      : "mt-10 rounded-[2rem] border border-pink-100 bg-white/80 p-6 shadow-2xl shadow-pink-100/60 backdrop-blur-2xl sm:p-8",
    infoCard: modoEscuro
      ? "rounded-3xl border border-white/10 bg-white/[0.08] p-5 shadow-xl backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/[0.12]"
      : "rounded-3xl border border-pink-100 bg-white p-5 shadow-xl shadow-pink-100/50 transition hover:-translate-y-1 hover:bg-pink-50/40",
  };

  return (
    <main className={classes.main}>
      <div className={classes.background} />
      <div className={classes.grid} />
      <div className={modoEscuro ? "absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-500/20 blur-3xl" : "absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-pink-300/30 blur-3xl"} />
      <div className={modoEscuro ? "absolute -bottom-40 -right-28 h-[28rem] w-[28rem] rounded-full bg-pink-500/15 blur-3xl" : "absolute -bottom-40 -right-28 h-[28rem] w-[28rem] rounded-full bg-rose-200/50 blur-3xl"} />

      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8">
        <nav className={classes.nav}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-xl">
              <span className="h-4 w-4 rounded-full bg-gradient-to-br from-pink-600 to-rose-500" />
            </div>
            <div>
              <p className="text-sm font-extrabold tracking-wide">Calculadora Gestacional</p>
              <p className={modoEscuro ? "text-xs text-pink-100/65" : "text-xs text-slate-500"}>DUM, 1ª USG, DPP e guia educativo</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a href="https://github.com/alejcrib/calculadora-gestacional" target="_blank" rel="noreferrer" className={modoEscuro ? "hidden rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/15 sm:inline-flex" : "hidden rounded-full border border-pink-100 bg-white px-4 py-2 text-xs font-bold text-pink-700 shadow-sm transition hover:bg-pink-50 sm:inline-flex"}>
              GitHub
            </a>
            <button onClick={() => setTema(modoEscuro ? "claro" : "escuro")} className={modoEscuro ? "rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/15" : "rounded-full border border-pink-100 bg-white px-4 py-2 text-xs font-bold text-pink-700 shadow-sm transition hover:bg-pink-50"}>
              {modoEscuro ? "Modo claro" : "Modo escuro"}
            </button>
          </div>
        </nav>

        <div className="grid flex-1 items-start gap-8 lg:grid-cols-[1fr_480px]">
          <div className="space-y-8">
            <div className={modoEscuro ? "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm text-pink-50 shadow-xl backdrop-blur-xl" : "inline-flex items-center gap-2 rounded-full border border-pink-100 bg-white/80 px-4 py-2 text-sm text-pink-700 shadow-xl shadow-pink-100/60 backdrop-blur-xl"}>
              <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_16px_rgba(110,231,183,0.9)]" />
              Calculadora com três métodos de estimativa
            </div>

            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-black leading-[0.96] tracking-tight sm:text-6xl lg:text-7xl">Calcule sua idade gestacional com clareza.</h1>
              <p className={`max-w-2xl text-lg leading-8 ${classes.softText}`}>Use DUM, primeira ultrassonografia ou DPP para estimar semanas, dias, trimestre, data provável do parto e gerar um resultado compartilhável.</p>
            </div>

            <div className="grid max-w-2xl gap-4 sm:grid-cols-3">
              <div className={classes.heroCard}><p className="text-3xl font-black">DUM</p><p className={`mt-1 text-sm leading-5 ${classes.softText}`}>última menstruação</p></div>
              <div className={classes.heroCard}><p className="text-3xl font-black">1ª USG</p><p className={`mt-1 text-sm leading-5 ${classes.softText}`}>ultrassonografia</p></div>
              <div className={classes.heroCard}><p className="text-3xl font-black">DPP</p><p className={`mt-1 text-sm leading-5 ${classes.softText}`}>data provável do parto</p></div>
            </div>
          </div>

          <aside className={classes.outerPanel}>
            <div className={classes.innerPanel}>
              <div className="mb-7 flex items-start justify-between gap-4">
                <div><p className="text-sm font-bold uppercase tracking-[0.2em] text-rose-500">Calculadora</p><h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Gestacional</h2><p className="mt-2 text-sm leading-6 text-slate-500">Escolha o método de cálculo e preencha os dados.</p></div>
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.3rem] bg-gradient-to-br from-pink-600 to-rose-500 shadow-xl shadow-pink-200"><span className="h-5 w-5 rounded-full border-2 border-white/90" /></div>
              </div>

              <div className="mb-5 grid grid-cols-3 rounded-2xl bg-slate-100 p-1">
                {[{ id: "dum", label: "DUM" }, { id: "usg", label: "1ª USG" }, { id: "dpp", label: "DPP" }].map((item) => (
                  <button key={item.id} type="button" onClick={() => { setModoCalculo(item.id); setErro(""); setResultado(null); setMensagemCopiado(""); }} className={`rounded-xl px-2 py-3 text-sm font-black transition ${modoCalculo === item.id ? "bg-white text-rose-600 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="space-y-5">
                {modoCalculo === "dum" && (
                  <div><label className="mb-2 block text-sm font-extrabold text-slate-700">Data da Última Menstruação</label><input type="date" value={dataUltimaMenstruacao} onChange={(e) => setDataUltimaMenstruacao(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-slate-900 shadow-sm outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100" /></div>
                )}

                {modoCalculo === "usg" && (
                  <div className="space-y-4">
                    <div><label className="mb-2 block text-sm font-extrabold text-slate-700">Data da primeira ultrassonografia</label><input type="date" value={dataUltrassom} onChange={(e) => setDataUltrassom(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-slate-900 shadow-sm outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100" /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="mb-2 block text-sm font-extrabold text-slate-700">Semanas no exame</label><input type="number" min="0" max="42" value={semanasUltrassom} onChange={(e) => setSemanasUltrassom(e.target.value)} placeholder="Ex.: 8" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-slate-900 shadow-sm outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100" /></div>
                      <div><label className="mb-2 block text-sm font-extrabold text-slate-700">Dias</label><input type="number" min="0" max="6" value={diasUltrassom} onChange={(e) => setDiasUltrassom(e.target.value)} placeholder="Ex.: 3" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-slate-900 shadow-sm outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100" /></div>
                    </div>
                    <p className="rounded-2xl bg-rose-50 px-4 py-3 text-xs leading-5 text-slate-500">Use a idade gestacional informada no laudo da primeira ultrassonografia.</p>
                  </div>
                )}

                {modoCalculo === "dpp" && (
                  <div><label className="mb-2 block text-sm font-extrabold text-slate-700">Data Provável do Parto</label><input type="date" value={dataProvavelParto} onChange={(e) => setDataProvavelParto(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-slate-900 shadow-sm outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100" /><p className="mt-3 rounded-2xl bg-rose-50 px-4 py-3 text-xs leading-5 text-slate-500">Use esta opção quando você já tem uma DPP informada em consulta, laudo ou aplicativo de pré-natal.</p></div>
                )}

                {erro && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{erro}</div>}

                <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                  <button onClick={calcularGestacao} className="rounded-2xl bg-gradient-to-r from-pink-600 to-rose-500 px-5 py-4 text-base font-black text-white shadow-xl shadow-pink-200 transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-pink-200 active:translate-y-0">Calcular agora</button>
                  <button onClick={limparCalculo} className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-black text-slate-600 transition hover:bg-slate-50">Limpar</button>
                </div>
              </div>

              {resultado ? (
                <>
                  <div className="mt-7 overflow-hidden rounded-3xl border border-pink-100 bg-gradient-to-br from-pink-50 to-rose-50 shadow-inner">
                    <div className="border-b border-pink-100 px-5 py-4"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-rose-500">Resultado</p><h3 className="mt-1 text-lg font-black text-slate-900">Estimativa calculada</h3></div><span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">{resultado.metodoCurto}</span></div></div>
                    <div className="grid gap-3 p-5">
                      <div className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm font-bold text-slate-500">Idade gestacional</p><div className="mt-2 flex items-end gap-2"><span className="text-5xl font-black tracking-tight text-slate-950">{resultado.semanas}</span><span className="pb-2 text-sm font-bold text-slate-500">semanas</span></div><p className="mt-1 text-sm font-semibold text-rose-500">+ {resultado.dias} dias</p></div>
                      <div className="rounded-2xl bg-white p-5 shadow-sm"><p className="text-sm font-bold text-slate-500">Data provável do parto</p><p className="mt-2 text-2xl font-black capitalize leading-tight text-slate-950">{resultado.parto}</p><p className="mt-2 text-sm font-bold text-rose-500">Faltam aproximadamente {resultado.diasRestantes} dias para a DPP.</p><p className="mt-2 text-xs font-semibold text-slate-400">Método usado: {resultado.metodo}</p></div>

                      <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-bold text-slate-500">Evolução da gestação</p><p className="text-xs text-slate-400">Visualização estimada do progresso gestacional</p></div><span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-black text-rose-500">{trimestre}</span></div>
                        <div className="mt-5 grid items-center gap-6">
                          <div className="relative mx-auto h-40 w-40"><svg className="h-40 w-40 -rotate-90" viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" fill="none" stroke="#fce7f3" strokeWidth="10" /><circle cx="60" cy="60" r="52" fill="none" stroke="url(#progressGradient)" strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="transition-all duration-700 ease-out" /><defs><linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ec4899" /><stop offset="100%" stopColor="#f43f5e" /></linearGradient></defs></svg><div className="absolute inset-0 flex flex-col items-center justify-center text-center"><span className="text-4xl font-black text-slate-950">{resultado.semanas}</span><span className="text-xs font-bold uppercase tracking-wide text-slate-500">semanas</span><span className="mt-1 text-xs font-semibold text-rose-500">{percentualGestacao}% da gestação</span></div></div>
                          <div className="space-y-4"><div className="rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 p-4"><p className="text-sm font-bold text-slate-700">Fase atual: <span className="text-rose-500">{trimestre}</span></p><p className="mt-1 text-sm text-slate-500">A estimativa foi calculada com base em 40 semanas gestacionais.</p></div><div><div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500"><span>Início</span><span>Desenvolvimento</span><span>Final</span></div><div className="h-3 w-full overflow-hidden rounded-full bg-pink-100"><div className="h-full rounded-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-700" style={{ width: `${percentualGestacao}%` }} /></div></div></div>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <p className="text-sm font-bold text-slate-500">Checklist educativo do {trimestre}</p>
                        <ul className="mt-3 space-y-2 text-sm text-slate-600">
                          {(checklistsPorTrimestre[trimestre] || []).map((item) => <li key={item} className="flex gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-rose-400" /> <span>{item}</span></li>)}
                        </ul>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3">
                        <button onClick={copiarResultado} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50">Copiar</button>
                        <button onClick={compartilharWhatsApp} className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700 transition hover:bg-emerald-100">WhatsApp</button>
                        <button onClick={gerarPdf} className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-black text-rose-600 transition hover:bg-rose-100">Gerar PDF</button>
                      </div>
                      {mensagemCopiado && <p className="text-center text-xs font-bold text-rose-500">{mensagemCopiado}</p>}
                    </div>
                  </div>
                  <button onClick={() => setMostrarInfo(!mostrarInfo)} className="mt-5 w-full rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-black text-rose-600 transition hover:bg-rose-100">{mostrarInfo ? "Ocultar tipos de gravidez" : "Ver tipos de gravidez"}</button>
                </>
              ) : (
                <>
                  <div className="mt-7 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center"><p className="text-sm font-semibold text-slate-500">O resultado aparecerá aqui após o cálculo.</p></div>
                  <button onClick={() => setMostrarInfo(!mostrarInfo)} className="mt-5 w-full rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-black text-rose-600 transition hover:bg-rose-100">{mostrarInfo ? "Ocultar tipos de gravidez" : "Ver tipos de gravidez"}</button>
                </>
              )}

              <p className="mt-6 text-center text-xs leading-5 text-slate-400">Esta ferramenta fornece apenas uma estimativa e não substitui acompanhamento médico.</p>
            </div>
          </aside>
        </div>

        {mostrarInfo && (
          <section className={classes.infoSection}>
            <div className="mb-6"><p className={modoEscuro ? "text-sm font-bold uppercase tracking-[0.2em] text-pink-200/80" : "text-sm font-bold uppercase tracking-[0.2em] text-pink-600"}>Tipos de gravidez</p><h2 className="mt-2 text-3xl font-black tracking-tight">Entenda melhor algumas classificações gestacionais</h2><p className={`mt-3 max-w-3xl text-sm leading-7 ${classes.softText}`}>Abaixo estão alguns tipos de gravidez e situações gestacionais frequentemente mencionadas no contexto obstétrico.</p></div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{tiposGravidez.map((item) => <article key={item.titulo} className={classes.infoCard}><div className="mb-4 h-10 w-10 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500" /><h3 className="text-xl font-black">{item.titulo}</h3><p className={`mt-3 text-sm leading-7 ${classes.softText}`}>{item.descricao}</p></article>)}</div>
          </section>
        )}

        <section className={classes.infoSection}>
          <div className="mb-6"><p className={modoEscuro ? "text-sm font-bold uppercase tracking-[0.2em] text-pink-200/80" : "text-sm font-bold uppercase tracking-[0.2em] text-pink-600"}>Guia educativo</p><h2 className="mt-2 text-3xl font-black tracking-tight">Como a calculadora gestacional funciona?</h2><p className={`mt-3 max-w-3xl text-sm leading-7 ${classes.softText}`}>Conteúdo complementar para explicar os principais conceitos usados no cálculo.</p></div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{conteudosEducativos.map((item) => <article key={item.titulo} className={classes.infoCard}><div className="mb-4 h-10 w-10 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500" /><h3 className="text-xl font-black">{item.titulo}</h3><p className={`mt-3 text-sm leading-7 ${classes.softText}`}>{item.texto}</p></article>)}</div>
        </section>

        <section className={classes.infoSection}>
          <div className="mb-6"><p className={modoEscuro ? "text-sm font-bold uppercase tracking-[0.2em] text-pink-200/80" : "text-sm font-bold uppercase tracking-[0.2em] text-pink-600"}>Perguntas frequentes</p><h2 className="mt-2 text-3xl font-black tracking-tight">Dúvidas comuns sobre o cálculo gestacional</h2></div>
          <div className="space-y-3">{perguntasFrequentes.map((item, index) => <div key={item.pergunta} className={classes.infoCard}><button onClick={() => setFaqAberto(faqAberto === index ? null : index)} className="flex w-full items-center justify-between gap-4 text-left"><span className="text-lg font-black">{item.pergunta}</span><span className="text-2xl font-black text-rose-400">{faqAberto === index ? "−" : "+"}</span></button>{faqAberto === index && <p className={`mt-3 text-sm leading-7 ${classes.softText}`}>{item.resposta}</p>}</div>)}</div>
        </section>

        <section className={classes.infoSection}>
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center"><div><p className={modoEscuro ? "text-sm font-bold uppercase tracking-[0.2em] text-pink-200/80" : "text-sm font-bold uppercase tracking-[0.2em] text-pink-600"}>Sobre o projeto</p><h2 className="mt-2 text-3xl font-black tracking-tight">Projeto criado por Alexandre Ribeiro</h2><p className={`mt-3 max-w-3xl text-sm leading-7 ${classes.softText}`}>Esta calculadora foi desenvolvida com React, Tailwind CSS e Vercel como uma ferramenta educativa e também como projeto de portfólio.</p></div><a href="https://github.com/alejcrib/calculadora-gestacional" target="_blank" rel="noreferrer" className="rounded-2xl bg-gradient-to-r from-pink-600 to-rose-500 px-6 py-4 text-center text-sm font-black text-white shadow-xl shadow-pink-950/20 transition hover:-translate-y-0.5">Ver código no GitHub</a></div>
        </section>

        <footer className={modoEscuro ? "relative mt-10 text-center text-xs text-pink-100/60" : "relative mt-10 text-center text-xs text-slate-500"}>Desenvolvido por <span className={modoEscuro ? "font-semibold text-pink-50" : "font-semibold text-pink-700"}>Alexandre Ribeiro</span> · React + Tailwind CSS</footer>
      </section>
    </main>
  );
}

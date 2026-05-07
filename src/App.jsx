import { useState } from "react";

export default function CalculadoraGestacional() {
  const [dataUltimaMenstruacao, setDataUltimaMenstruacao] = useState("");
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState("");

  const calcularGestacao = () => {
    setErro("");

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

    const diferencaMs = hoje.getTime() - dum.getTime();
    const diasGestacao = Math.floor(diferencaMs / (1000 * 60 * 60 * 24));

    const semanas = Math.floor(diasGestacao / 7);
    const dias = diasGestacao % 7;

    const dataParto = new Date(dum);
    dataParto.setDate(dataParto.getDate() + 280);

    const opcoes = {
      day: "2-digit",
      month: "long",
      year: "numeric",
    };

    setResultado({
      semanas,
      dias,
      parto: dataParto.toLocaleDateString("pt-BR", opcoes),
    });
  };

  return (
    <main className="min-h-screen bg-[#120817] text-white overflow-hidden relative flex items-center justify-center px-5 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(236,72,153,0.35),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(244,63,94,0.28),_transparent_35%)]" />
      <div className="absolute -top-28 -left-28 h-80 w-80 rounded-full bg-pink-500/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-rose-400/20 blur-3xl" />

      <section className="relative w-full max-w-5xl grid lg:grid-cols-[1.05fr_0.95fr] gap-8 items-center">
        <div className="space-y-7">
          <span className="inline-flex items-center rounded-full border border-pink-300/20 bg-white/10 px-4 py-2 text-sm text-pink-100 shadow-lg backdrop-blur">
            Calculadora obstétrica simples e rápida
          </span>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Calculadora Gestacional
            </h1>

            <p className="max-w-xl text-base sm:text-lg text-pink-100/85 leading-relaxed">
              Informe a data da última menstruação para estimar a idade gestacional e a data provável do parto.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 max-w-xl">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-bold">40</p>
              <p className="text-sm text-pink-100/80">semanas como base</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-bold">280</p>
              <p className="text-sm text-pink-100/80">dias estimados</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-bold">DUM</p>
              <p className="text-sm text-pink-100/80">método usado</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/15 bg-white/[0.08] p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-xl">
              🤰
            </div>

            <h2 className="text-2xl font-extrabold">Faça o cálculo</h2>
            <p className="mt-2 text-sm text-pink-100/75">
              Resultado gerado automaticamente a partir da DUM.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-pink-100">
                Data da Última Menstruação (DUM)
              </label>

              <input
                type="date"
                value={dataUltimaMenstruacao}
                onChange={(e) => setDataUltimaMenstruacao(e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-white/95 px-4 py-4 text-slate-900 shadow-lg outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-300/30"
              />
            </div>

            {erro && (
              <div className="rounded-2xl border border-red-300/30 bg-red-500/15 px-4 py-3 text-sm text-red-100">
                {erro}
              </div>
            )}

            <button
              onClick={calcularGestacao}
              className="w-full rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 px-5 py-4 text-base font-extrabold text-white shadow-xl shadow-pink-950/30 transition hover:-translate-y-0.5 hover:from-pink-400 hover:to-rose-400 active:translate-y-0"
            >
              Calcular idade gestacional
            </button>
          </div>

          {resultado && (
            <div className="mt-7 space-y-4 rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm text-pink-100/75">Resultado</p>
                  <h3 className="text-xl font-bold">Estimativa gestacional</h3>
                </div>
                <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-100 border border-emerald-300/20">
                  calculado
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-pink-100/75">Idade gestacional</p>
                  <p className="mt-1 text-3xl font-black">{resultado.semanas}</p>
                  <p className="text-sm text-pink-100/80">semanas e {resultado.dias} dias</p>
                </div>

                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-pink-100/75">Data provável do parto</p>
                  <p className="mt-2 text-xl font-black capitalize leading-snug">{resultado.parto}</p>
                </div>
              </div>
            </div>
          )}

          <p className="mt-6 text-center text-xs leading-relaxed text-pink-100/60">
            Esta ferramenta fornece apenas uma estimativa. Para avaliação individual, consulte um profissional de saúde.
          </p>
        </div>
      </section>
    </main>
  );
}

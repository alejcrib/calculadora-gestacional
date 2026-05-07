import React, { useState } from "react";

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
    const diasGestacao = Math.floor(
      diferencaMs / (1000 * 60 * 60 * 24)
    );

    const semanas = Math.floor(diasGestacao / 7);
    const dias = diasGestacao % 7;

    const dataParto = new Date(dum);
    dataParto.setDate(dataParto.getDate() + 280);

    const opcoes = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };

    setResultado({
      semanas,
      dias,
      parto: dataParto.toLocaleDateString("pt-BR", opcoes),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-900 via-pink-800 to-rose-700 flex items-center justify-center p-6 overflow-hidden relative">
      <div className="absolute w-96 h-96 bg-pink-400 opacity-20 rounded-full blur-3xl top-10 left-10"></div>
      <div className="absolute w-80 h-80 bg-rose-300 opacity-20 rounded-full blur-3xl bottom-10 right-10"></div>

      <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-[32px] p-8 w-full max-w-md text-white">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🤰</div>

          <h1 className="text-4xl font-extrabold tracking-tight mb-2">
            Calculadora Gestacional
          </h1>

          <p className="text-pink-100 text-sm">
            Descubra a idade gestacional e a data provável do parto.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-semibold text-pink-100">
              Data da Última Menstruação (DUM)
            </label>

            <input
              type="date"
              value={dataUltimaMenstruacao}
              onChange={(e) => setDataUltimaMenstruacao(e.target.value)}
              className="w-full bg-white/20 border border-white/20 rounded-2xl p-4 text-white focus:outline-none focus:ring-4 focus:ring-pink-300 transition"
            />
          </div>

          {erro && (
            <div className="bg-red-500/20 border border-red-300 text-red-100 p-3 rounded-2xl text-sm">
              {erro}
            </div>
          )}

          <button
            onClick={calcularGestacao}
            className="w-full bg-white text-pink-700 font-bold py-4 rounded-2xl text-lg hover:scale-105 hover:bg-pink-100 transition-all duration-300 shadow-xl"
          >
            Calcular Gestação
          </button>
        </div>

        {resultado && (
          <div className="mt-8 bg-white/15 border border-white/20 rounded-3xl p-6 backdrop-blur-lg shadow-2xl">
            <h2 className="text-2xl font-bold mb-5 text-center">
              Resultado
            </h2>

            <div className="grid gap-4">
              <div className="bg-white/10 rounded-2xl p-4 text-center">
                <p className="text-sm text-pink-100 mb-1">
                  Idade Gestacional
                </p>

                <p className="text-2xl font-extrabold">
                  {resultado.semanas} semanas
                </p>

                <p className="text-pink-100">
                  e {resultado.dias} dias
                </p>
              </div>

              <div className="bg-white/10 rounded-2xl p-4 text-center">
                <p className="text-sm text-pink-100 mb-1">
                  Data Provável do Parto
                </p>

                <p className="text-2xl font-extrabold">
                  {resultado.parto}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 text-center text-xs text-pink-100 opacity-80">
          Desenvolvido com React + Tailwind CSS
        </div>
      </div>
    </div>
  );
}

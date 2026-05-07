import "./App.css";
import { useState } from "react";

export default function App() {
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

    const diasGestacao = Math.floor((hoje - dum) / (1000 * 60 * 60 * 24));

    const semanas = Math.floor(diasGestacao / 7);
    const dias = diasGestacao % 7;

    const dataParto = new Date(dum);
    dataParto.setDate(dataParto.getDate() + 280);

    setResultado({
      semanas,
      dias,
      parto: dataParto.toLocaleDateString("pt-BR"),
    });
  };

  return (
    <main className="pagina">
      <section className="card">
        <div className="emoji">🤰</div>

        <h1>Calculadora Gestacional</h1>

        <p className="descricao">
          Descubra a idade gestacional e a data provável do parto.
        </p>

        <label>Data da Última Menstruação (DUM)</label>

        <input
          type="date"
          value={dataUltimaMenstruacao}
          onChange={(e) => setDataUltimaMenstruacao(e.target.value)}
        />

        {erro && <div className="erro">{erro}</div>}

        <button onClick={calcularGestacao}>
          Calcular Gestação
        </button>

        {resultado && (
          <div className="resultado">
            <h2>Resultado</h2>

            <p>
              <strong>Idade Gestacional:</strong>
              <br />
              {resultado.semanas} semanas e {resultado.dias} dias
            </p>

            <p>
              <strong>Data Provável do Parto:</strong>
              <br />
              {resultado.parto}
            </p>
          </div>
        )}

        <footer>Desenvolvido com React</footer>
      </section>
    </main>
  );
}
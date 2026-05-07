import { useState } from "react";

export default function App() {
  const [dataUltimaMenstruacao, setDataUltimaMenstruacao] = useState("");
  const [resultado, setResultado] = useState(null);

  const calcularGestacao = () => {
    if (!dataUltimaMenstruacao) {
      alert("Selecione uma data.");
      return;
    }

    const dum = new Date(dataUltimaMenstruacao);
    const hoje = new Date();

    const diferencaMs = hoje - dum;

    const diasGestacao =
      Math.floor(diferencaMs / (1000 * 60 * 60 * 24));

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
    <div style={styles.body}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          🤰 Calculadora Gestacional
        </h1>

        <p style={styles.subtitle}>
          Descubra a idade gestacional e a data provável do parto
        </p>

        <label style={styles.label}>
          Data da Última Menstruação
        </label>

        <input
          type="date"
          value={dataUltimaMenstruacao}
          onChange={(e) =>
            setDataUltimaMenstruacao(e.target.value)
          }
          style={styles.input}
        />

        <button
          onClick={calcularGestacao}
          style={styles.button}
        >
          Calcular
        </button>

        {resultado && (
          <div style={styles.resultado}>
            <h2>Resultado</h2>

            <p>
              <strong>Idade Gestacional:</strong>
              <br />
              {resultado.semanas} semanas e{" "}
              {resultado.dias} dias
            </p>

            <p>
              <strong>Data provável do parto:</strong>
              <br />
              {resultado.parto}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  body: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(135deg,#5b0e8b,#d63384,#ff5f6d)",
    padding: "20px",
    fontFamily: "Arial",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(12px)",
    borderRadius: "28px",
    padding: "30px",
    color: "white",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  },

  title: {
    textAlign: "center",
    marginBottom: "10px",
    fontSize: "32px",
  },

  subtitle: {
    textAlign: "center",
    marginBottom: "25px",
    opacity: 0.9,
  },

  label: {
    display: "block",
    marginBottom: "10px",
    fontWeight: "bold",
  },

  input: {
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    border: "none",
    marginBottom: "20px",
    fontSize: "16px",
  },

  button: {
    width: "100%",
    padding: "15px",
    borderRadius: "16px",
    border: "none",
    background: "white",
    color: "#c2185b",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  resultado: {
    marginTop: "25px",
    background: "rgba(255,255,255,0.1)",
    padding: "20px",
    borderRadius: "20px",
    textAlign: "center",
  },
};
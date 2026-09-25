// ==========================================
// DADOS DO BOLETIM (ARRAY DE OBJETOS)
// ==========================================
const dadosBoletim = [
  { disciplina: "Língua Portuguesa", tri1: 82, tri2: "7,8", tri3: 85, faltas: [2, 1, 1] },
  { disciplina: "Matemática", tri1: 52, tri2: "5,8", tri3: null, faltas: [3, 2, 1] },
  { disciplina: "Ciências", tri1: "8,1", tri2: 76, tri3: 8.0, faltas: [1, 2, 0] },
  { disciplina: "História", tri1: 7.0, tri2: 84, tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Geografia", tri1: 68, tri2: 7.3, tri3: "7,9", faltas: [0, 1, 1] },
  { disciplina: "Língua Inglesa", tri1: 86, tri2: "8,1", tri3: 8.7, faltas: [1, 0, 0] },
  { disciplina: "Arte", tri1: 9.0, tri2: 92, tri3: null, faltas: [1, 1, 0] },
  { disciplina: "Educação Física", tri1: 95, tri2: 9.0, tri3: "9,4", faltas: [0, 1, 0] },
  { disciplina: "Educação Digital", tri1: 88, tri2: 9.1, tri3: 93, faltas: [1, 0, 1] },
  { disciplina: "Educação Financeira", tri1: 74, tri2: "7,8", tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Estudo Orientado", tri1: 8.0, tri2: 83, tri3: "8,5", faltas: [0, 1, 0] },
  { disciplina: "Redação e Leitura", tri1: 62, tri2: "6,8", tri3: null, faltas: [2, 1, 1] },
  { disciplina: "Pensamento Lógico", tri1: 48, tri2: 5.6, tri3: "6,0", faltas: [2, 2, 1] },
  { disciplina: "Literatura Arte e Movimento", tri1: "7,7", tri2: 80, tri3: null, faltas: [1, 0, 1] },
  { disciplina: "Práticas Experimentais", tri1: 58, tri2: "6,2", tri3: 6.4, faltas: [1, 1, 1] }
];

// ==========================================
// FUNÇÕES DE PROCESSAMENTO
// ==========================================

// Função para normalizar notas na escala de 0 a 10
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  let num = valor;
  if (typeof num === "string") {
    num = num.replace(",", ".");
  }
  num = Number(num);

  if (isNaN(num)) {
    return null;
  }

  if (num >= 0 && num <= 10) {
    return num;
  } else if (num > 10 && num <= 100) {
    return num / 10;
  } else {
    return null;
  }
}

// Calcula a média usando apenas notas disponíveis (não transforma nota ausente em zero)
function calcularMedia(n1, n2, n3) {
  const notasValidas = [n1, n2, n3].filter(n => n !== null);
  if (notasValidas.length === 0) return null;

  const soma = notasValidas.reduce((acc, curr) => acc + curr, 0);
  return soma / notasValidas.length;
}

// Define a situação da disciplina com base na média obtida
function obterSituacao(media) {
  if (media === null) {
    return "Nota ainda não disponível";
  } else if (media >= 6.0) {
    return "Bom desempenho";
  } else {
    return "Atenção";
  }
}

// Soma o total de faltas dos trimestres
function somarFaltas(faltasArray) {
  return faltasArray.reduce((acc, curr) => acc + curr, 0);
}

// Formata a nota para exibição no padrão brasileiro (ex: 8.5 vira "8,5")
function formatarNota(nota) {
  if (nota === null) return "—";
  return nota.toFixed(1).replace(".", ",");
}

// ==========================================
// PREENCHIMENTO AUTOMÁTICO DO SITE (DOM)
// ==========================================
function carregarBoletim() {
  const tabelaBody = document.getElementById("tabela-boletim");
  tabelaBody.innerHTML = "";

  let somaMedias = 0;
  let qtdMediasValidas = 0;
  let totalFaltasGeral = 0;
  let qtdBomDesempenho = 0;
  let qtdAtencao = 0;

  // Preenche cada linha da tabela dinamicamente
  dadosBoletim.forEach(item => {
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    const media = calcularMedia(n1, n2, n3);
    const faltas = somarFaltas(item.faltas);
    const situacao = obterSituacao(media);

    // Contadores para os cards
    totalFaltasGeral += faltas;
    if (media !== null) {
      somaMedias += media;
      qtdMediasValidas++;
    }

    if (situacao === "Bom desempenho") {
      qtdBomDesempenho++;
    } else if (situacao === "Atenção") {
      qtdAtencao++;
    }

    // Define a classe de cor para a situação
    let classeSituacao = "situacao-indisponivel";
    if (situacao === "Bom desempenho") classeSituacao = "situacao-bom";
    if (situacao === "Atenção") classeSituacao = "situacao-atencao";

    // Cria a linha da tabela
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.disciplina}</td>
      <td>${formatarNota(n1)}</td>
      <td>${formatarNota(n2)}</td>
      <td>${formatarNota(n3)}</td>
      <td><strong>${formatarNota(media)}</strong></td>
      <td>${faltas}</td>
      <td class="${classeSituacao}">${situacao}</td>
    `;
    tabelaBody.appendChild(tr);
  });

  // Atualiza os dados dos Cards
  const mediaGeralCalculada = qtdMediasValidas > 0 ? (somaMedias / qtdMediasValidas).toFixed(1).replace(".", ",") : "—";
  
  document.getElementById("media-geral").textContent = mediaGeralCalculada;
  document.getElementById("total-faltas").textContent = totalFaltasGeral;
  document.getElementById("bom-desempenho").textContent = qtdBomDesempenho;
  document.getElementById("precisa-atencao").textContent = qtdAtencao;

  // NOTA: A frequência de 92% é apenas demonstrativa/fictícia para esta primeira versão do projeto.
  document.getElementById("frequencia-geral").textContent = "92%";
}

// Inicializa o preenchimento assim que o arquivo é lido
carregarBoletim();
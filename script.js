// CONFIGURAÇÃO FIXA DO ALUNO
const CONFIG_ALUNO = {
  turma: "8C",
  numeroChamada: 23,
  apiUrl: "https://boletim-api.profbt.com.br"
};

// Variável de sessão em memória para o PIN
let pinSessao = "";

// DADOS LOCAIS INICIAIS DA TURMA
let dadosBoletim = [
  { disciplina: "Língua Portuguesa", tri1: "8,0", tri2: "6,7", tri3: null, faltas: [0, 3, 0] },
  { disciplina: "Matemática", tri1: "8,0", tri2: "7,9", tri3: null, faltas: [0, 2, 0] },
  { disciplina: "Ciências", tri1: "7,5", tri2: "9,4", tri3: null, faltas: [0, 2, 0] },
  { disciplina: "História", tri1: "7,5", tri2: "10,0", tri3: null, faltas: [0, 2, 0] },
  { disciplina: "Geografia", tri1: "6,9", tri2: "8,6", tri3: null, faltas: [0, 5, 0] },
  { disciplina: "Língua Inglesa", tri1: "9,3", tri2: "8,1", tri3: null, faltas: [0, 0, 0] },
  { disciplina: "Arte", tri1: "7,5", tri2: "8,7", tri3: null, faltas: [0, 0, 0] },
  { disciplina: "Educação Física", tri1: "9,3", tri2: "8,6", tri3: null, faltas: [0, 2, 0] },
  { disciplina: "Educação Digital", tri1: "8,0", tri2: "9,0", tri3: null, faltas: [0, 1, 0] },
  { disciplina: "Educação Financeira", tri1: "10,0", tri2: "9,4", tri3: null, faltas: [0, 1, 0] },
  { disciplina: "Estudo Orientado", tri1: "8,1", tri2: "8,5", tri3: null, faltas: [0, 2, 0] },
  { disciplina: "Redação e Leitura", tri1: "8,1", tri2: "8,5", tri3: null, faltas: [0, 3, 0] },
  { disciplina: "Pensamento Lógico", tri1: "10,0", tri2: "9,7", tri3: null, faltas: [0, 0, 0] },
  { disciplina: "Literatura Arte e Movimento", tri1: "8,2", tri2: "8,2", tri3: null, faltas: [0, 0, 0] },
  { disciplina: "Práticas Experimentais", tri1: "7,3", tri2: "9,0", tri3: null, faltas: [0, 1, 0] }
];

// Normaliza nota dos dados antigos (suporta escala de 0 a 100)
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

// Validação rigorosa para EDIÇÃO (aceita apenas 0 a 10 ou vazio)
function validarNotaEdicao(valorStr) {
  const v = valorStr.trim();
  if (v === "") return { valido: true, valor: null };
  const num = Number(v.replace(",", "."));
  if (isNaN(num) || num < 0 || num > 10) {
    return { valido: false, valor: null };
  }
  return { valido: true, valor: num };
}

// Validação de falta para EDIÇÃO (aceita apenas inteiro >= 0)
function validarFaltaEdicao(valorStr) {
  const v = valorStr.trim();
  if (v === "") return { valido: false, valor: null };
  const num = Number(v);
  if (!Number.isInteger(num) || num < 0) {
    return { valido: false, valor: null };
  }
  return { valido: true, valor: num };
}

// Funções de cálculo
function calcularMedia(n1, n2, n3) {
  const notasValidas = [n1, n2, n3].filter(n => n !== null);
  if (notasValidas.length === 0) return null;
  const soma = notasValidas.reduce((acc, curr) => acc + curr, 0);
  return soma / notasValidas.length;
}

function obterSituacao(media) {
  if (media === null) {
    return "Nota ainda não disponível";
  } else if (media >= 6.0) {
    return "Bom desempenho";
  } else {
    return "Atenção";
  }
}

function somarFaltas(faltasArray) {
  if (!Array.isArray(faltasArray)) return 0;
  return faltasArray.reduce((acc, curr) => acc + (Number(curr) || 0), 0);
}

function formatarNota(nota) {
  if (nota === null || nota === undefined) return "—";
  return Number(nota).toFixed(1).replace(".", ",");
}

// Atualização limpa da Tabela e dos Cards
function carregarBoletim() {
  const tabelaBody = document.getElementById("tabela-boletim");
  tabelaBody.innerHTML = "";

  let somaMedias = 0;
  let qtdMediasValidas = 0;
  let totalFaltasGeral = 0;
  let qtdBomDesempenho = 0;
  let qtdAtencao = 0;

  dadosBoletim.forEach(item => {
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    const media = calcularMedia(n1, n2, n3);
    const faltas = somarFaltas(item.faltas);
    const situacao = obterSituacao(media);

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

    let classeSituacao = "situacao-indisponivel";
    if (situacao === "Bom desempenho") classeSituacao = "situacao-bom";
    if (situacao === "Atenção") classeSituacao = "situacao-atencao";

    const tr = document.createElement("tr");

    const tdDisc = document.createElement("td");
    tdDisc.textContent = item.disciplina;
    tr.appendChild(tdDisc);

    const td1 = document.createElement("td");
    td1.textContent = formatarNota(n1);
    tr.appendChild(td1);

    const td2 = document.createElement("td");
    td2.textContent = formatarNota(n2);
    tr.appendChild(td2);

    const td3 = document.createElement("td");
    td3.textContent = formatarNota(n3);
    tr.appendChild(td3);

    const tdMedia = document.createElement("td");
    const strongMedia = document.createElement("strong");
    strongMedia.textContent = formatarNota(media);
    tdMedia.appendChild(strongMedia);
    tr.appendChild(tdMedia);

    const tdFaltas = document.createElement("td");
    tdFaltas.textContent = faltas;
    tr.appendChild(tdFaltas);

    const tdSit = document.createElement("td");
    tdSit.className = classeSituacao;
    tdSit.textContent = situacao;
    tr.appendChild(tdSit);

    tabelaBody.appendChild(tr);
  });

  const mediaGeralCalculada = qtdMediasValidas > 0 ? (somaMedias / qtdMediasValidas).toFixed(1).replace(".", ",") : "—";

  document.getElementById("media-geral").textContent = mediaGeralCalculada;
  document.getElementById("total-faltas").textContent = totalFaltasGeral;
  document.getElementById("bom-desempenho").textContent = qtdBomDesempenho;
  document.getElementById("precisa-atencao").textContent = qtdAtencao;
  document.getElementById("frequencia-geral").textContent = "92%";
}

// LOGIN / ABRIR BOLETIM
document.getElementById("form-login").addEventListener("submit", async function(e) {
  e.preventDefault();
  const inputPin = document.getElementById("pin-input");
  const msgLogin = document.getElementById("mensagem-login");
  const pinDigitado = inputPin.value.trim();

  if (!pinDigitado) return;

  msgLogin.style.color = "#fff";
  msgLogin.textContent = "Conectando...";

  try {
    const resposta = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/abrir`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinDigitado
      })
    });

    if (resposta.status === 401) {
      msgLogin.style.color = "#f44336";
      msgLogin.textContent = "Turma, chamada ou PIN inválidos.";
      return;
    }

    if (resposta.status === 429) {
      msgLogin.style.color = "#f44336";
      msgLogin.textContent = "Muitas tentativas. Aguarde um minuto e tente novamente.";
      return;
    }

    if (!resposta.ok) {
      msgLogin.style.color = "#f44336";
      msgLogin.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
      return;
    }

    const json = await resposta.json();

    // PIN mantido somente em memória
    pinSessao = pinDigitado;
    inputPin.value = ""; // Limpa o campo por segurança

    // Trata dados retornados da API (DADOS DA API > DADOS LOCAIS)
    if (json.dados && json.dados.disciplinas && json.dados.disciplinas.length > 0) {
      dadosBoletim = json.dados.disciplinas;
    } else if (json.dados && Array.isArray(json.dados) && json.dados.length > 0) {
      dadosBoletim = json.dados;
    }

    document.getElementById("area-login").style.display = "none";
    document.getElementById("conteudo-boletim").style.display = "block";
    carregarBoletim();

  } catch (erro) {
    msgLogin.style.color = "#f44336";
    msgLogin.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
  }
});

// ABRIR PAINEL DE EDIÇÃO
document.getElementById("btn-alterar-dados").addEventListener("click", function() {
  const areaEdicao = document.getElementById("area-edicao");
  const container = document.getElementById("container-edicao-disciplinas");
  container.innerHTML = "";

  dadosBoletim.forEach((item, index) => {
    const n1 = item.tri1 !== null && item.tri1 !== undefined ? String(item.tri1).replace(".", ",") : "";
    const n2 = item.tri2 !== null && item.tri2 !== undefined ? String(item.tri2).replace(".", ",") : "";
    const n3 = item.tri3 !== null && item.tri3 !== undefined ? String(item.tri3).replace(".", ",") : "";

    const f1 = item.faltas && item.faltas[0] !== undefined ? item.faltas[0] : 0;
    const f2 = item.faltas && item.faltas[1] !== undefined ? item.faltas[1] : 0;
    const f3 = item.faltas && item.faltas[2] !== undefined ? item.faltas[2] : 0;

    const divItem = document.createElement("div");
    divItem.className = "item-edicao";

    const title = document.createElement("h4");
    title.textContent = item.disciplina;
    divItem.appendChild(title);

    const grid = document.createElement("div");
    grid.className = "grid-campos-edicao";

    grid.innerHTML = `
      <div class="campo-grupo">
        <label>Nota 1º Tri</label>
        <input type="text" id="edit-n1-${index}" value="${n1}" placeholder="ex: 7,5">
      </div>
      <div class="campo-grupo">
        <label>Nota 2º Tri</label>
        <input type="text" id="edit-n2-${index}" value="${n2}" placeholder="ex: 8,0">
      </div>
      <div class="campo-grupo">
        <label>Nota 3º Tri</label>
        <input type="text" id="edit-n3-${index}" value="${n3}" placeholder="ex: 9,0">
      </div>
      <div class="campo-grupo">
        <label>Faltas 1º Tri</label>
        <input type="number" id="edit-f1-${index}" value="${f1}" min="0">
      </div>
      <div class="campo-grupo">
        <label>Faltas 2º Tri</label>
        <input type="number" id="edit-f2-${index}" value="${f2}" min="0">
      </div>
      <div class="campo-grupo">
        <label>Faltas 3º Tri</label>
        <input type="number" id="edit-f3-${index}" value="${f3}" min="0">
      </div>
    `;

    divItem.appendChild(grid);
    container.appendChild(divItem);
  });

  areaEdicao.style.display = "block";
  document.getElementById("mensagem-edicao").textContent = "";
});

// CANCELAR EDIÇÃO
document.getElementById("btn-cancelar-edicao").addEventListener("click", function() {
  document.getElementById("area-edicao").style.display = "none";
});

// SALVAR ALTERAÇÕES
document.getElementById("btn-salvar-alteracoes").addEventListener("click", async function() {
  const msgEdicao = document.getElementById("mensagem-edicao");
  msgEdicao.style.color = "#fff";
  msgEdicao.textContent = "Validando dados...";

  let temErro = false;
  const novasDisciplinas = [];

  dadosBoletim.forEach((item, index) => {
    const elN1 = document.getElementById(`edit-n1-${index}`);
    const elN2 = document.getElementById(`edit-n2-${index}`);
    const elN3 = document.getElementById(`edit-n3-${index}`);
    const elF1 = document.getElementById(`edit-f1-${index}`);
    const elF2 = document.getElementById(`edit-f2-${index}`);
    const elF3 = document.getElementById(`edit-f3-${index}`);

    // Limpa destaque de erros anteriores
    [elN1, elN2, elN3, elF1, elF2, elF3].forEach(el => el.classList.remove("campo-invalido"));

    const valN1 = validarNotaEdicao(elN1.value);
    const valN2 = validarNotaEdicao(elN2.value);
    const valN3 = validarNotaEdicao(elN3.value);

    const valF1 = validarFaltaEdicao(elF1.value);
    const valF2 = validarFaltaEdicao(elF2.value);
    const valF3 = validarFaltaEdicao(elF3.value);

    if (!valN1.valido) { elN1.classList.add("campo-invalido"); temErro = true; }
    if (!valN2.valido) { elN2.classList.add("campo-invalido"); temErro = true; }
    if (!valN3.valido) { elN3.classList.add("campo-invalido"); temErro = true; }

    if (!valF1.valido) { elF1.classList.add("campo-invalido"); temErro = true; }
    if (!valF2.valido) { elF2.classList.add("campo-invalido"); temErro = true; }
    if (!valF3.valido) { elF3.classList.add("campo-invalido"); temErro = true; }

    novasDisciplinas.push({
      disciplina: item.disciplina,
      tri1: valN1.valor,
      tri2: valN2.valor,
      tri3: valN3.valor,
      faltas: [valF1.valor, valF2.valor, valF3.valor]
    });
  });

  if (temErro) {
    msgEdicao.style.color = "#f44336";
    msgEdicao.textContent = "Verifique os campos destacados em vermelho. As notas devem ser de 0 a 10 e as faltas números inteiros maiores ou iguais a 0.";
    return;
  }

  msgEdicao.style.color = "#fff";
  msgEdicao.textContent = "Salvando...";

  try {
    const resposta = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/salvar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinSessao,
        dados: {
          disciplinas: novasDisciplinas
        }
      })
    });

    if (!resposta.ok) {
      msgEdicao.style.color = "#f44336";
      msgEdicao.textContent = "Erro ao salvar no servidor. Tente novamente.";
      return;
    }

    // Sucesso
    dadosBoletim = novasDisciplinas;
    carregarBoletim();

    msgEdicao.style.color = "#4caf50";
    msgEdicao.textContent = "Dados salvos com sucesso!";

    setTimeout(() => {
      document.getElementById("area-edicao").style.display = "none";
      msgEdicao.textContent = "";
    }, 1500);

  } catch (erro) {
    msgEdicao.style.color = "#f44336";
    msgEdicao.textContent = "Falha de conexão. Não foi possível salvar as alterações.";
  }
});
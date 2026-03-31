// storage.js - Lógica de Persistência de Dados

const STORAGE_CONFIG = {
  STORAGE_KEY: 'medcof_v3'
};

// Objeto para armazenar dados em memória
let checked = {};

// Carregar dados do localStorage
function loadData() {
  try {
    const data = localStorage.getItem(STORAGE_CONFIG.STORAGE_KEY);
    if (data) {
      checked = JSON.parse(data);
    }
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    checked = {};
  }
}

// Salvar dados no localStorage
function saveData() {
  try {
    localStorage.setItem(STORAGE_CONFIG.STORAGE_KEY, JSON.stringify(checked));
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
  }
}

// Gerar chave única para uma aula
function getAulaKey(area, bloco, index) {
  return `${area}__${bloco}__${index}`;
}

// Marcar/desmarcar uma aula
function toggleAula(key) {
  if (checked[key]) {
    delete checked[key];
  } else {
    checked[key] = 1;
  }
  saveData();
}

// Verificar se uma aula está marcada
function isAulaMarked(key) {
  return !!checked[key];
}

// Limpar todos os dados
function clearAllData() {
  checked = {};
  saveData();
}

// Contar aulas marcadas em um bloco
function countDoneInBloco(area, bloco, aulas) {
  return aulas.filter((_, i) => isAulaMarked(getAulaKey(area, bloco, i))).length;
}

// Contar aulas marcadas em uma área
function countAreaProgress(area, data) {
  let done = 0;
  let total = 0;

  Object.keys(data[area]).forEach((bloco) => {
    const aulas = data[area][bloco];
    total += aulas.length;
    done += countDoneInBloco(area, bloco, aulas);
  });

  return { done, total };
}

// Calcular progresso global
function getGlobalProgress(data) {
  let totalDone = 0;
  let totalAulas = 0;

  Object.keys(data).forEach((area) => {
    const { done, total } = countAreaProgress(area, data);
    totalDone += done;
    totalAulas += total;
  });

  return {
    done: totalDone,
    total: totalAulas,
    percentage: totalAulas ? Math.round((totalDone / totalAulas) * 100) : 0
  };
}

// Inicializar storage na carga da página
function initStorage() {
  loadData();
}

const state = {
  kpis: {
    mediaVelocidade: 0,
    kmRodado: 0,
    diasAtivos: 0,
    horaPico: '-',
    diaPico: '-'
  }
};

export function setKpis(data) {
  state.kpis = { ...data };
}

export function getKpis() {
  return state.kpis;
}
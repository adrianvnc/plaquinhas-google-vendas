export const NICHOS_SUGERIDOS = [
  'Restaurante / Lanchonete',
  'Barbearia / Salão de Beleza',
  'Saúde / Odontologia / Clínica',
  'Pet Shop / Veterinária',
  'Varejo / Loja / Moda',
  'Automotivo / Oficina / Lava Rápido',
  'Academia / Crossfit / Lutas',
  'Padaria / Confeitaria',
  'Mercado / Conveniência',
  'Estética / Manicure / Sobrancelhas',
  'Farmácia / Drogaria',
  'Outro'
];

export const NIVEIS_DIFICULDADE = [
  {
    id: 'Fácil',
    label: 'Fácil',
    descricao: 'Cliente comprou de primeira, sem objeção',
    color: 'emerald',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20',
    iconBg: 'bg-emerald-500',
    emoji: '🟢'
  },
  {
    id: 'Médio',
    label: 'Médio',
    descricao: 'Precisou de demonstração ou conversa',
    color: 'amber',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20',
    iconBg: 'bg-amber-500',
    emoji: '🟡'
  },
  {
    id: 'Difícil',
    label: 'Difícil',
    descricao: 'Negociação dura, desconto ou muitas dúvidas',
    color: 'rose',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20',
    iconBg: 'bg-rose-500',
    emoji: '🔴'
  }
];

export function formatDateTime(isoString) {
  if (!isoString) return '-';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch {
    return isoString;
  }
}

export function formatCurrency(value) {
  const num = Number(value) || 0;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(num);
}

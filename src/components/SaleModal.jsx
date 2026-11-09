import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  Calendar, 
  Clock, 
  Store, 
  Tag, 
  AlertCircle, 
  DollarSign, 
  Phone, 
  FileText,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { NICHOS_SUGERIDOS, NIVEIS_DIFICULDADE } from '../constants';

export default function SaleModal({ isOpen, onClose, onSave, editingSale }) {
  const [cliente, setCliente] = useState('');
  const [nicho, setNicho] = useState(NICHOS_SUGERIDOS[0]);
  const [outroNicho, setOutroNicho] = useState('');
  const [dificuldade, setDificuldade] = useState('Fácil');
  const [dataHora, setDataHora] = useState('');
  const [funcionando, setFuncionando] = useState(true);
  const [valor, setValor] = useState(80);
  const [quantidade, setQuantidade] = useState(1);
  const [telefone, setTelefone] = useState('');
  const [observacao, setObservacao] = useState('');
  const [errors, setErrors] = useState({});

  // Helper para formatar data atual no formato datetime-local
  const getNowForInput = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  useEffect(() => {
    if (editingSale) {
      setCliente(editingSale.cliente || '');
      const isKnownNicho = NICHOS_SUGERIDOS.includes(editingSale.nicho);
      if (isKnownNicho) {
        setNicho(editingSale.nicho);
        setOutroNicho('');
      } else {
        setNicho('Outro');
        setOutroNicho(editingSale.nicho || '');
      }
      setDificuldade(editingSale.dificuldade || 'Fácil');
      try {
        const d = new Date(editingSale.dataHora);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        setDataHora(d.toISOString().slice(0, 16));
      } catch {
        setDataHora(getNowForInput());
      }
      setFuncionando(editingSale.funcionando ?? true);
      setValor(editingSale.valor ?? 80);
      setQuantidade(editingSale.quantidade ?? 1);
      setTelefone(editingSale.telefone || '');
      setObservacao(editingSale.observacao || '');
    } else {
      // Novo registro
      setCliente('');
      setNicho(NICHOS_SUGERIDOS[0]);
      setOutroNicho('');
      setDificuldade('Fácil');
      setDataHora(getNowForInput());
      setFuncionando(true);
      setValor(80);
      setQuantidade(1);
      setTelefone('');
      setObservacao('');
    }
    setErrors({});
  }, [editingSale, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!cliente.trim()) {
      newErrors.cliente = 'Informe o nome do cliente ou estabelecimento';
    }

    if (nicho === 'Outro' && !outroNicho.trim()) {
      newErrors.outroNicho = 'Informe qual é o nicho';
    }

    if (!dataHora) {
      newErrors.dataHora = 'Informe a data e hora';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const finalNicho = nicho === 'Outro' ? outroNicho.trim() : nicho;

    const payload = {
      cliente: cliente.trim(),
      nicho: finalNicho,
      dificuldade,
      dataHora: new Date(dataHora).toISOString(),
      funcionando: Boolean(funcionando),
      valor: Number(valor) || 0,
      quantidade: Number(quantidade) || 1,
      telefone: telefone.replace(/\D/g, ''),
      observacao: observacao.trim()
    };

    onSave(payload);

    // Efeito comemorativo de venda fechada!
    if (!editingSale) {
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Ignora se confetti não estiver disponível
      }
    }

    onClose();
  };

  const setNow = () => {
    setDataHora(getNowForInput());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header com gradiente sutil Google */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/50 via-white to-emerald-50/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {editingSale ? 'Editar Venda' : 'Adicionar Venda'}
              </h2>
              <p className="text-xs text-slate-500">
                Plaquinha de Avaliação Google (NFC & QR Code)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Cliente */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Cliente / Estabelecimento <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                autoFocus
                value={cliente}
                onChange={(e) => {
                  setCliente(e.target.value);
                  if (errors.cliente) setErrors(prev => ({ ...prev, cliente: null }));
                }}
                placeholder="Ex: Barbearia Vip, Restaurante do Jorge, Dra. Amanda..."
                className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                  errors.cliente 
                    ? 'border-red-300 ring-red-100 bg-red-50/30' 
                    : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                }`}
              />
            </div>
            {errors.cliente && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.cliente}
              </p>
            )}
          </div>

          {/* Nicho */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Nicho do Estabelecimento <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={nicho}
                onChange={(e) => setNicho(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer"
              >
                {NICHOS_SUGERIDOS.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                <Tag className="w-4 h-4" />
              </div>
            </div>

            {nicho === 'Outro' && (
              <div className="mt-2">
                <input
                  type="text"
                  value={outroNicho}
                  onChange={(e) => {
                    setOutroNicho(e.target.value);
                    if (errors.outroNicho) setErrors(prev => ({ ...prev, outroNicho: null }));
                  }}
                  placeholder="Especifique o nicho (ex: Floricultura, Ótica...)"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                {errors.outroNicho && (
                  <p className="mt-1 text-xs text-red-500">{errors.outroNicho}</p>
                )}
              </div>
            )}
          </div>

          {/* Como foi a venda? (Nível de dificuldade) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Como foi a venda? (Nível de Dificuldade) <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {NIVEIS_DIFICULDADE.map((lvl) => {
                const isSelected = dificuldade === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setDificuldade(lvl.id)}
                    className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? `${lvl.badgeClass} ring-2 shadow-xs border-current font-bold`
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-base">{lvl.emoji}</span>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-semibold">{lvl.label}</span>
                    <span className="text-[10px] text-slate-500 leading-tight mt-0.5 line-clamp-2">
                      {lvl.descricao}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Já está funcionando? (Status de ativação da plaquinha) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-bold text-slate-900">
                  Já está funcionando?
                </label>
                <p className="text-xs text-slate-500">
                  A plaquinha NFC / QR Code já foi gravada e testada no celular do cliente?
                </p>
              </div>

              <button
                type="button"
                onClick={() => setFuncionando(!funcionando)}
                className={`relative inline-flex h-7 w-13 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  funcionando ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center text-[10px] ${
                    funcionando ? 'translate-x-6 text-emerald-600' : 'translate-x-0 text-slate-400'
                  }`}
                >
                  {funcionando ? '✓' : '✕'}
                </span>
              </button>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                funcionando 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {funcionando ? '✅ Sim, funcionando e testada!' : '⏳ Não, pendente de gravação / link'}
              </span>
            </div>
          </div>

          {/* Data e Hora */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Data e Hora da Venda <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={setNow}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Clock className="w-3 h-3" />
                Agora
              </button>
            </div>
            <input
              type="datetime-local"
              value={dataHora}
              onChange={(e) => setDataHora(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Campos Opcionais Extras (Valor, Quantidade, WhatsApp, Obs) */}
          <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Valor Cobrado (R$)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs text-slate-400">
                  R$
                </span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Qtd de Placas
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                WhatsApp do Estabelecimento
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Phone className="w-3.5 h-3.5" />
                </span>
                <input
                  type="tel"
                  placeholder="(11) 99999-8888"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Observações da Negociação
              </label>
              <input
                type="text"
                placeholder="Ex: pediu suporte para configurar no balcão"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              {editingSale ? 'Salvar Alterações' : 'Concluir Venda'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

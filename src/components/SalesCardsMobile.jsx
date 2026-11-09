import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Edit3, 
  Trash2, 
  MessageCircle, 
  Calendar,
  Tag
} from 'lucide-react';
import { formatDateTime, formatCurrency, NIVEIS_DIFICULDADE } from '../constants';

export default function SalesCardsMobile({ 
  sales, 
  onToggleStatus, 
  onEdit, 
  onDelete 
}) {
  const getDificuldadeConfig = (lvl) => {
    return NIVEIS_DIFICULDADE.find(d => d.id === lvl) || NIVEIS_DIFICULDADE[0];
  };

  const openWhatsApp = (phone, cliente) => {
    if (!phone) return;
    const cleanPhone = phone.replace(/\D/g, '');
    const fullPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    const text = encodeURIComponent(`Olá, tudo bem? Sou o vendedor da plaquinha do Google para o ${cliente}. Passando para confirmar se está funcionando certinho! ⭐⭐⭐⭐⭐`);
    window.open(`https://wa.me/${fullPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-3 md:hidden">
      {sales.map((sale) => {
        const difConfig = getDificuldadeConfig(sale.dificuldade);
        return (
          <div 
            key={sale.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3"
          >
            {/* Top row: Cliente e Dificuldade */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-bold text-slate-900 text-base leading-tight">
                  {sale.cliente}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
                    <Tag className="w-3 h-3 text-slate-400" />
                    {sale.nicho}
                  </span>
                  {sale.valor ? (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                      {formatCurrency(sale.valor)}
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Dificuldade badge */}
              <span 
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border shrink-0 ${difConfig.badgeClass}`}
              >
                <span>{difConfig.emoji}</span>
                <span>{sale.dificuldade}</span>
              </span>
            </div>

            {/* Observação se houver */}
            {sale.observacao && (
              <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-xl italic">
                "{sale.observacao}"
              </p>
            )}

            {/* Bottom Row: Data e Já Funcionando? */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {formatDateTime(sale.dataHora)}
              </span>

              {/* Toggle de funcionamento */}
              <button
                onClick={() => onToggleStatus(sale.id, !sale.funcionando)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                  sale.funcionando
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {sale.funcionando ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Funcionando ✅</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Pendente ⏳</span>
                  </>
                )}
              </button>
            </div>

            {/* Card Actions */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              {sale.telefone ? (
                <button
                  onClick={() => openWhatsApp(sale.telefone, sale.cliente)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl hover:bg-emerald-100 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp
                </button>
              ) : (
                <span />
              )}

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit(sale)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                  title="Editar"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(sale.id, sale.cliente)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Edit3, 
  Trash2, 
  MessageCircle, 
  HelpCircle,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { formatDateTime, formatCurrency, NIVEIS_DIFICULDADE } from '../constants';

export default function SalesTable({ 
  sales, 
  onToggleStatus, 
  onEdit, 
  onDelete 
}) {
  if (sales.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mb-4">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-800">Nenhuma venda encontrada</h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
          Não encontramos nenhuma venda com os filtros selecionados ou ainda não há vendas cadastradas.
        </p>
      </div>
    );
  }

  const getDificuldadeConfig = (lvl) => {
    return NIVEIS_DIFICULDADE.find(d => d.id === lvl) || NIVEIS_DIFICULDADE[0];
  };

  const openWhatsApp = (phone, cliente) => {
    if (!phone) return;
    const cleanPhone = phone.replace(/\D/g, '');
    const fullPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    const text = encodeURIComponent(`Olá, tudo bem? Sou o vendedor da plaquinha de avaliações do Google para o ${cliente}. Passando para saber se deu tudo certo com a ativação das avaliações dos seus clientes! ⭐⭐⭐⭐⭐`);
    window.open(`https://wa.me/${fullPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-4 sm:px-6">Cliente</th>
              <th className="py-3.5 px-4">Nicho</th>
              <th className="py-3.5 px-4 text-center">Como foi a venda?</th>
              <th className="py-3.5 px-4">Data e Hora</th>
              <th className="py-3.5 px-4 text-center">Já está funcionando?</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {sales.map((sale) => {
              const difConfig = getDificuldadeConfig(sale.dificuldade);
              return (
                <tr 
                  key={sale.id}
                  className="hover:bg-slate-50/70 transition-colors group"
                >
                  {/* Cliente */}
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center flex-shrink-0 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        {sale.cliente?.charAt(0).toUpperCase() || 'P'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <span>{sale.cliente}</span>
                          {sale.quantidade > 1 && (
                            <span className="px-1.5 py-0.2 rounded bg-slate-100 text-[11px] font-semibold text-slate-600 border border-slate-200">
                              {sale.quantidade} un
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                          {sale.valor ? (
                            <span className="font-medium text-emerald-600">
                              {formatCurrency(sale.valor)}
                            </span>
                          ) : null}
                          {sale.observacao && (
                            <span className="truncate max-w-[200px]" title={sale.observacao}>
                              • {sale.observacao}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Nicho */}
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/70">
                      {sale.nicho}
                    </span>
                  </td>

                  {/* Como foi a venda? (Dificuldade) */}
                  <td className="py-4 px-4 text-center">
                    <span 
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${difConfig.badgeClass}`}
                      title={difConfig.descricao}
                    >
                      <span>{difConfig.emoji}</span>
                      <span>{sale.dificuldade}</span>
                    </span>
                  </td>

                  {/* Data e Hora */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="text-xs font-semibold text-slate-800">
                      {formatDateTime(sale.dataHora)}
                    </div>
                  </td>

                  {/* Já está funcionando? (com toggle interativo de 1 clique) */}
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => onToggleStatus(sale.id, !sale.funcionando)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer select-none active:scale-95 shadow-2xs ${
                        sale.funcionando
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                      }`}
                      title="Clique para alternar o status"
                    >
                      {sale.funcionando ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Sim (Ativa)</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Não (Pendente)</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Ações */}
                  <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {sale.telefone && (
                        <button
                          onClick={() => openWhatsApp(sale.telefone, sale.cliente)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title="Conversar no WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => onEdit(sale)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Editar venda"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDelete(sale.id, sale.cliente)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Excluir venda"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React from 'react';
import { 
  ShoppingBag, 
  DollarSign, 
  CheckCircle2, 
  TrendingUp, 
  Sparkles,
  Smartphone,
  AlertCircle
} from 'lucide-react';
import { formatCurrency } from '../constants';

export default function StatsHeader({ sales, cloudStatus, onOpenCloudModal }) {
  const totalSalesCount = sales.length;
  const totalPlaquesCount = sales.reduce((acc, curr) => acc + (Number(curr.quantidade) || 1), 0);
  const totalRevenue = sales.reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);
  const activeCount = sales.filter(s => s.funcionando).length;
  const pendingCount = totalSalesCount - activeCount;
  const activePercent = totalSalesCount > 0 ? Math.round((activeCount / totalSalesCount) * 100) : 0;

  const easySales = sales.filter(s => s.dificuldade === 'Fácil').length;
  const medSales = sales.filter(s => s.dificuldade === 'Médio').length;
  const hardSales = sales.filter(s => s.dificuldade === 'Difícil').length;

  return (
    <header className="space-y-6">
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 md:p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="relative flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Smartphone className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
                Plaquinhas <span className="text-blue-600">G</span><span className="text-red-500">o</span><span className="text-amber-500">o</span><span className="text-blue-600">g</span><span className="text-emerald-500">l</span><span className="text-red-500">e</span>
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700 rounded-full border border-blue-200/60">
                Vendas & Ativação
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-500">
              Controle de vendas de plaquinhas NFC & QR Code para avaliações
            </p>
          </div>
        </div>

        {/* Cloud / Sync Status Pill */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={onOpenCloudModal}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors shadow-xs ${
              cloudStatus?.mode === 'firebase'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
            title="Clique para ver detalhes do Firebase / Nuvem"
          >
            <span className={`w-2 h-2 rounded-full ${cloudStatus?.mode === 'firebase' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span>{cloudStatus?.status || 'Armazenamento Local'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* Card 1: Vendas */}
        <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs md:text-sm font-medium text-slate-500">Vendas Feitas</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-extrabold text-slate-900">{totalSalesCount}</span>
            <span className="text-xs text-slate-500">({totalPlaquesCount} {totalPlaquesCount === 1 ? 'placa' : 'placas'})</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {easySales} fáceis • {medSales} médias • {hardSales} difíceis
          </div>
        </div>

        {/* Card 2: Faturamento */}
        <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs md:text-sm font-medium text-slate-500">Faturamento</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl md:text-3xl font-extrabold text-slate-900">{formatCurrency(totalRevenue)}</span>
          </div>
          <div className="mt-2 text-xs text-emerald-600 font-medium">
            Ticket médio: {totalSalesCount > 0 ? formatCurrency(totalRevenue / totalSalesCount) : 'R$ 0'}
          </div>
        </div>

        {/* Card 3: Funcionando */}
        <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs md:text-sm font-medium text-slate-500">Já Funcionando?</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-extrabold text-emerald-600">{activeCount}</span>
            <span className="text-xs text-slate-500">de {totalSalesCount} ({activePercent}%)</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${activePercent}%` }}
              />
            </div>
            {pendingCount > 0 && (
              <span className="text-[11px] text-amber-600 font-medium whitespace-nowrap">
                {pendingCount} pendente{pendingCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Card 4: Dificuldade */}
        <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden group hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs md:text-sm font-medium text-slate-500">Conversão de Rua</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl md:text-2xl font-extrabold text-slate-900">
              {totalSalesCount > 0 ? (
                easySales >= medSales && easySales >= hardSales ? '🟢 Fácil' :
                medSales >= hardSales ? '🟡 Médio' : '🔴 Difícil'
              ) : '-'}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Ritmo de abordagem no comércio local
          </div>
        </div>
      </div>
    </header>
  );
}

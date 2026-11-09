import React from 'react';
import { 
  Search, 
  Plus, 
  Download, 
  Filter, 
  X,
  SlidersHorizontal
} from 'lucide-react';
import { NICHOS_SUGERIDOS, NIVEIS_DIFICULDADE } from '../constants';

export default function FilterBar({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  dificuldadeFilter,
  setDificuldadeFilter,
  nichoFilter,
  setNichoFilter,
  onOpenAddModal,
  onExportCSV,
  totalResults
}) {
  const hasActiveFilters = searchTerm || statusFilter !== 'all' || dificuldadeFilter !== 'all' || nichoFilter !== 'all';

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDificuldadeFilter('all');
    setNichoFilter('all');
  };

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
      {/* Top Action Row: Search + New Sale Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cliente, nicho ou anotação..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Buttons: Export & + Adicionar Venda */}
        <div className="flex items-center gap-2">
          <button
            onClick={onExportCSV}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Exportar para Excel / CSV"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Adicionar Venda</span>
          </button>
        </div>
      </div>

      {/* Filter Chips & Selects */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="inline-flex rounded-xl bg-slate-100 p-0.5 border border-slate-200/60">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                statusFilter === 'all' 
                  ? 'bg-white text-slate-900 shadow-2xs font-bold' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                statusFilter === 'active' 
                  ? 'bg-white text-emerald-700 shadow-2xs font-bold' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Funcionando ✅
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                statusFilter === 'pending' 
                  ? 'bg-white text-amber-700 shadow-2xs font-bold' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pendente ⏳
            </button>
          </div>

          {/* Dificuldade Select */}
          <select
            value={dificuldadeFilter}
            onChange={(e) => setDificuldadeFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">Todas Dificuldades</option>
            {NIVEIS_DIFICULDADE.map((d) => (
              <option key={d.id} value={d.id}>
                {d.emoji} {d.label}
              </option>
            ))}
          </select>

          {/* Nicho Select */}
          <select
            value={nichoFilter}
            onChange={(e) => setNichoFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none focus:border-blue-500 cursor-pointer max-w-[160px] truncate"
          >
            <option value="all">Todos os Nichos</option>
            {NICHOS_SUGERIDOS.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        {/* Clear Filters / Result Count */}
        <div className="flex items-center gap-2 ml-auto text-slate-400">
          <span>{totalResults} resultado{totalResults !== 1 ? 's' : ''}</span>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 hover:underline"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

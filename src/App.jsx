import React, { useState, useEffect, useMemo } from 'react';
import { 
  subscribeToSales, 
  addSale, 
  updateSale, 
  deleteSale,
  getLocalSales 
} from './firebase';
import StatsHeader from './components/StatsHeader';
import FilterBar from './components/FilterBar';
import SalesTable from './components/SalesTable';
import SalesCardsMobile from './components/SalesCardsMobile';
import SaleModal from './components/SaleModal';
import FirebaseModal from './components/FirebaseModal';
import { formatDateTime } from './constants';
import { Smartphone, Lightbulb, Shield, Heart } from 'lucide-react';

export default function App() {
  const [sales, setSales] = useState([]);
  const [cloudStatus, setCloudStatus] = useState({ mode: 'local', status: 'Conectando...' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'pending'
  const [dificuldadeFilter, setDificuldadeFilter] = useState('all');
  const [nichoFilter, setNichoFilter] = useState('all');

  // Subscrever ao repositório de vendas (Firebase + fallback localStorage)
  useEffect(() => {
    const unsubscribe = subscribeToSales(
      (updatedSales) => {
        setSales(updatedSales);
      },
      (status) => {
        setCloudStatus(status);
      }
    );
    return () => unsubscribe();
  }, []);

  // Filtragem de vendas
  const filteredSales = useMemo(() => {
    return sales.filter((item) => {
      // Busca por texto
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesClient = item.cliente?.toLowerCase().includes(term);
        const matchesNicho = item.nicho?.toLowerCase().includes(term);
        const matchesObs = item.observacao?.toLowerCase().includes(term);
        if (!matchesClient && !matchesNicho && !matchesObs) return false;
      }

      // Filtro de status funcionando
      if (statusFilter === 'active' && !item.funcionando) return false;
      if (statusFilter === 'pending' && item.funcionando) return false;

      // Filtro de dificuldade
      if (dificuldadeFilter !== 'all' && item.dificuldade !== dificuldadeFilter) return false;

      // Filtro de nicho
      if (nichoFilter !== 'all' && item.nicho !== nichoFilter) return false;

      return true;
    });
  }, [sales, searchTerm, statusFilter, dificuldadeFilter, nichoFilter]);

  // Ações
  const handleOpenAdd = () => {
    setEditingSale(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sale) => {
    setEditingSale(sale);
    setIsModalOpen(true);
  };

  const handleSaveSale = async (data) => {
    if (editingSale) {
      await updateSale(editingSale.id, data);
      setSales(prev => prev.map(s => s.id === editingSale.id ? { ...s, ...data } : s));
    } else {
      const created = await addSale(data);
      setSales(prev => [created, ...prev]);
    }
  };

  const handleToggleStatus = async (id, newStatus) => {
    await updateSale(id, { funcionando: newStatus });
    setSales(prev => prev.map(s => s.id === id ? { ...s, funcionando: newStatus } : s));
  };

  const handleDelete = async (id, clienteNome) => {
    if (window.confirm(`Deseja realmente excluir a venda de "${clienteNome}"?`)) {
      await deleteSale(id);
      setSales(prev => prev.filter(s => s.id !== id));
    }
  };

  // Exportar dados em CSV para o Excel
  const handleExportCSV = () => {
    if (sales.length === 0) {
      alert('Nenhuma venda para exportar.');
      return;
    }

    const headers = [
      'Cliente',
      'Nicho',
      'Como foi a venda?',
      'Data e Hora',
      'Ja esta funcionando?',
      'Valor (R$)',
      'Quantidade',
      'Telefone',
      'Observacao'
    ];

    const rows = sales.map(s => [
      `"${(s.cliente || '').replace(/"/g, '""')}"`,
      `"${(s.nicho || '').replace(/"/g, '""')}"`,
      `"${s.dificuldade || ''}"`,
      `"${formatDateTime(s.dataHora)}"`,
      s.funcionando ? '"Sim"' : '"Nao"',
      s.valor || 0,
      s.quantidade || 1,
      `"${s.telefone || ''}"`,
      `"${(s.observacao || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `vendas_plaquinhas_google_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Top Accent Bar (Cores Google) */}
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-red-500 via-amber-400 to-emerald-500" />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Header com Estatísticas */}
        <StatsHeader 
          sales={sales} 
          cloudStatus={cloudStatus}
          onOpenCloudModal={() => setIsCloudModalOpen(true)}
        />

        {/* Barra de Filtros e Busca + Botão Adicionar Venda */}
        <FilterBar 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          dificuldadeFilter={dificuldadeFilter}
          setDificuldadeFilter={setDificuldadeFilter}
          nichoFilter={nichoFilter}
          setNichoFilter={setNichoFilter}
          onOpenAddModal={handleOpenAdd}
          onExportCSV={handleExportCSV}
          totalResults={filteredSales.length}
        />

        {/* Visualização de Vendas: Tabela (Desktop) & Cards (Mobile) */}
        <div className="space-y-4">
          <div className="hidden md:block">
            <SalesTable 
              sales={filteredSales}
              onToggleStatus={handleToggleStatus}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          </div>

          <div className="md:hidden">
            <SalesCardsMobile 
              sales={filteredSales}
              onToggleStatus={handleToggleStatus}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>

        {/* Dica comercial para o primo na rua */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl p-4 sm:p-5 border border-blue-100 flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Lightbulb className="w-5 h-5 text-amber-300" />
          </div>
          <div className="text-xs sm:text-sm text-slate-700">
            <p className="font-bold text-slate-900 mb-0.5">
              Dica rápida de rua para vender mais plaquinhas:
            </p>
            <p className="text-slate-600 leading-relaxed">
              Ao entrar no estabelecimento, aproxime seu celular de uma plaquinha modelo e mostre a tela de avaliação do Google abrindo em 1 segundo. Quando o dono vê como é fácil para o cliente dele avaliar 5 estrelas sem digitar nada, a venda se torna <strong>Fácil</strong>!
            </p>
          </div>
        </div>

        {/* Rodapé */}
        <footer className="pt-6 border-t border-slate-200/80 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Plaquinhas Google Vendas • Gestão de Campo & Ativação</span>
          <span className="flex items-center gap-1">
            Pronto para Vercel & Firebase
          </span>
        </footer>
      </div>

      {/* Modal de Adicionar / Editar Venda */}
      <SaleModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSale}
        editingSale={editingSale}
      />

      {/* Modal de Configuração do Firebase & Backup */}
      <FirebaseModal 
        isOpen={isCloudModalOpen}
        onClose={() => setIsCloudModalOpen(false)}
        cloudStatus={cloudStatus}
        onReloadSales={() => setSales(getLocalSales())}
      />
    </div>
  );
}

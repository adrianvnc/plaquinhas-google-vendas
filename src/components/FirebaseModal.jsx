import React, { useState } from 'react';
import { 
  X, 
  Cloud, 
  Database, 
  Check, 
  Download, 
  Upload, 
  AlertTriangle,
  Info,
  ShieldCheck
} from 'lucide-react';
import { 
  getStoredFirebaseConfig, 
  saveStoredFirebaseConfig, 
  DEFAULT_CONFIG,
  getLocalSales,
  saveLocalSales
} from '../firebase';

export default function FirebaseModal({ isOpen, onClose, cloudStatus, onReloadSales }) {
  const [config, setConfig] = useState(() => getStoredFirebaseConfig());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [rawJson, setRawJson] = useState(JSON.stringify(config, null, 2));

  if (!isOpen) return null;

  const handleSave = () => {
    try {
      const parsed = JSON.parse(rawJson);
      saveStoredFirebaseConfig(parsed);
      setConfig(parsed);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        window.location.reload();
      }, 1000);
    } catch (e) {
      alert('JSON de configuração inválido!');
    }
  };

  const handleResetDefault = () => {
    saveStoredFirebaseConfig(DEFAULT_CONFIG);
    setRawJson(JSON.stringify(DEFAULT_CONFIG, null, 2));
    setConfig(DEFAULT_CONFIG);
  };

  const handleExportBackup = () => {
    const data = getLocalSales();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_vendas_plaquinhas_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed)) {
          saveLocalSales(parsed);
          alert(`Backup restaurado com sucesso! ${parsed.length} vendas importadas.`);
          onReloadSales();
          onClose();
        } else {
          alert('Arquivo de backup inválido.');
        }
      } catch (err) {
        alert('Erro ao processar arquivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/40 to-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Sincronização & Nuvem
              </h2>
              <p className="text-xs text-slate-500">
                Firebase Firestore & Armazenamento Seguro
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

        <div className="p-6 space-y-5 text-sm">
          {/* Status Badge */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-start gap-3">
            <div className={`w-3 h-3 rounded-full mt-1 shrink-0 ${cloudStatus?.mode === 'firebase' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <div>
              <div className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                Status Atual: {cloudStatus?.status || 'Armazenamento Ativo'}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {cloudStatus?.mode === 'firebase'
                  ? 'Os dados são salvos no seu Firebase Firestore e espelhados no navegador em tempo real.'
                  : 'Os dados estão 100% seguros na memória local do navegador. Mesmo sem internet ou sem autenticação no Firebase, nenhuma venda é perdida.'}
              </p>
              {cloudStatus?.error && (
                <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded-lg mt-2 border border-amber-200">
                  {cloudStatus.error}
                </p>
              )}
            </div>
          </div>

          {/* Backup e Restauração rápida */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Backup dos Dados
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleExportBackup}
                className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4 text-blue-600" />
                Baixar Backup (.json)
              </button>
              
              <label className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer">
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>Restaurar Backup</span>
                <input 
                  type="file" 
                  accept=".json" 
                  onChange={handleImportBackup} 
                  className="hidden" 
                />
              </label>
            </div>
          </div>

          {/* Configuração do Firebase */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Credenciais Firebase (firebaseConfig)
              </label>
              <button
                type="button"
                onClick={handleResetDefault}
                className="text-xs text-blue-600 hover:underline"
              >
                Restaurar padrão
              </button>
            </div>
            <textarea
              rows={6}
              value={rawJson}
              onChange={(e) => setRawJson(e.target.value)}
              className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-[11px] text-slate-400">
              Projeto configurado: <code className="text-slate-700 bg-slate-100 px-1 py-0.5 rounded">{config.projectId}</code>
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Fechar
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Salvo!
                </>
              ) : (
                'Salvar Credenciais'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

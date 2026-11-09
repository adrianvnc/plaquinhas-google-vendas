import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

const STORAGE_KEY = 'plaquinhas_sales_v1';
const CONFIG_KEY = 'plaquinhas_firebase_config_v1';

// Configuração padrão do Firebase encontrada no ambiente do usuário
export const DEFAULT_CONFIG = {
  apiKey: "AIzaSyDZHEPjJOygd6AdVeGSxwYuzpnMkZCHJPU",
  authDomain: "crm-matriz.firebaseapp.com",
  projectId: "crm-matriz",
  storageBucket: "crm-matriz.firebasestorage.app",
  messagingSenderId: "423313108266",
  appId: "1:423313108266:web:e56cd009430238437c4253"
};

export function getStoredFirebaseConfig() {
  try {
    const saved = localStorage.getItem(CONFIG_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('Erro ao carregar config salva:', e);
  }
  return DEFAULT_CONFIG;
}

export function saveStoredFirebaseConfig(config) {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.warn('Erro ao salvar config:', e);
  }
}

let app = null;
let db = null;

export function initFirebase(customConfig = null) {
  const config = customConfig || getStoredFirebaseConfig();
  if (!config || !config.apiKey || !config.projectId) {
    return { app: null, db: null };
  }

  try {
    if (getApps().length > 0) {
      app = getApp();
    } else {
      app = initializeApp(config);
    }
    db = getFirestore(app);
    return { app, db };
  } catch (error) {
    console.warn('Não foi possível inicializar Firebase:', error.message);
    return { app: null, db: null };
  }
}

// Inicializa no carregamento
initFirebase();

// Local Storage helpers
export function getLocalSales() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Dados iniciais de demonstração para facilitar a visualização do primo
      const initialSeed = [
        {
          id: 'demo-1',
          cliente: 'Barbearia Dom Lucas',
          nicho: 'Barbearia / Salão',
          dificuldade: 'Fácil',
          dataHora: new Date(Date.now() - 3600000 * 2).toISOString(),
          funcionando: true,
          valor: 80,
          quantidade: 1,
          observacao: 'Dono adorou a plaquinha NFC na bancada de atendimento.',
          telefone: '11999998888',
          createdAt: Date.now() - 3600000 * 2
        },
        {
          id: 'demo-2',
          cliente: 'Restaurante Sabor & Arte',
          nicho: 'Restaurante / Lanchonete',
          dificuldade: 'Médio',
          dataHora: new Date(Date.now() - 3600000 * 5).toISOString(),
          funcionando: true,
          valor: 150,
          quantidade: 2,
          observacao: 'Ficou com receio no começo, mas depois que mostrei funcionando comprou duas.',
          telefone: '11988887777',
          createdAt: Date.now() - 3600000 * 5
        },
        {
          id: 'demo-3',
          cliente: 'Clínica OdontoSorriso',
          nicho: 'Saúde / Odontologia',
          dificuldade: 'Difícil',
          dataHora: new Date(Date.now() - 3600000 * 24).toISOString(),
          funcionando: false,
          valor: 90,
          quantidade: 1,
          observacao: 'Falta enviar o link direto do Google Maps para gravar na plaquinha.',
          telefone: '11977776666',
          createdAt: Date.now() - 3600000 * 24
        }
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSeed));
      return initialSeed;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Erro ao ler localStorage:', e);
    return [];
  }
}

export function saveLocalSales(sales) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sales));
  } catch (e) {
    console.error('Erro ao salvar no localStorage:', e);
  }
}

// Sincronizador de vendas (Firebase com fallback elegante para LocalStorage)
export function subscribeToSales(onUpdate, onStatusChange) {
  let unsubscribeFirestore = null;
  const localData = getLocalSales();
  onUpdate(localData);

  const { db: firestoreDb } = initFirebase();

  if (!firestoreDb) {
    onStatusChange?.({ mode: 'local', status: 'Modo Local (Offline)' });
    return () => {};
  }

  try {
    const q = query(collection(firestoreDb, 'vendas_plaquinhas'), orderBy('createdAt', 'desc'));
    
    unsubscribeFirestore = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteSales = snapshot.docs.map(docSnap => ({
            id: docSnap.id,
            ...docSnap.data(),
            // Garante string de data
            dataHora: docSnap.data().dataHora || new Date().toISOString()
          }));
          saveLocalSales(remoteSales);
          onUpdate(remoteSales);
          onStatusChange?.({ mode: 'firebase', status: 'Nuvem Conectada' });
        } else {
          // Coleção vazia no Firebase, usa local e sinaliza conectado
          onStatusChange?.({ mode: 'firebase', status: 'Nuvem Conectada (0 registros remotos)' });
        }
      },
      (error) => {
        console.warn('Aviso Firebase (utilizando armazenamento local seguro):', error.message);
        onStatusChange?.({ 
          mode: 'local', 
          status: 'Armazenamento Local Ativo',
          error: error.code === 'permission-denied' 
            ? 'Regras do Firebase exigem autenticação. Dados seguros localmente.' 
            : error.message 
        });
      }
    );
  } catch (err) {
    console.warn('Erro ao configurar listener do Firestore:', err);
    onStatusChange?.({ mode: 'local', status: 'Armazenamento Local Ativo' });
  }

  return () => {
    if (unsubscribeFirestore) unsubscribeFirestore();
  };
}

// Criar nova venda
export async function addSale(saleData) {
  const newSale = {
    ...saleData,
    id: 'sale_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    createdAt: Date.now()
  };

  // Salva localmente primeiro (garantia de velocidade e funcionamento offline)
  const current = getLocalSales();
  const updated = [newSale, ...current];
  saveLocalSales(updated);

  // Tenta sincronizar com Firebase se disponível
  const { db: firestoreDb } = initFirebase();
  if (firestoreDb) {
    try {
      const docRef = await addDoc(collection(firestoreDb, 'vendas_plaquinhas'), {
        cliente: newSale.cliente,
        nicho: newSale.nicho,
        dificuldade: newSale.dificuldade,
        dataHora: newSale.dataHora,
        funcionando: newSale.funcionando,
        valor: Number(newSale.valor) || 0,
        quantidade: Number(newSale.quantidade) || 1,
        observacao: newSale.observacao || '',
        telefone: newSale.telefone || '',
        createdAt: serverTimestamp(),
        localId: newSale.id
      });
      // Atualiza o id com o do Firestore se salvo com sucesso
      newSale.firestoreId = docRef.id;
    } catch (e) {
      console.warn('Venda salva localmente (sincronização na nuvem pendente):', e.message);
    }
  }

  return newSale;
}

// Atualizar venda
export async function updateSale(id, changes) {
  const current = getLocalSales();
  const updated = current.map(item => item.id === id ? { ...item, ...changes } : item);
  saveLocalSales(updated);

  const { db: firestoreDb } = initFirebase();
  if (firestoreDb) {
    try {
      // Se tiver firestoreId ou id correspondente
      const target = current.find(item => item.id === id);
      const docId = target?.firestoreId || id;
      await updateDoc(doc(firestoreDb, 'vendas_plaquinhas', docId), changes);
    } catch (e) {
      console.warn('Atualizado localmente (pendente nuvem):', e.message);
    }
  }
}

// Deletar venda
export async function deleteSale(id) {
  const current = getLocalSales();
  const target = current.find(item => item.id === id);
  const updated = current.filter(item => item.id !== id);
  saveLocalSales(updated);

  const { db: firestoreDb } = initFirebase();
  if (firestoreDb && target) {
    try {
      const docId = target.firestoreId || id;
      await deleteDoc(doc(firestoreDb, 'vendas_plaquinhas', docId));
    } catch (e) {
      console.warn('Removido localmente:', e.message);
    }
  }
}

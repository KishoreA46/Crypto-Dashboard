

import React, { createContext, useReducer, useCallback, useEffect } from 'react';
import { CryptoData, cryptoAPI } from '@/lib/api/crypto';

export interface CryptoContextType {
  cryptos: CryptoData[];
  watchlist: string[];
  searchQuery: string;
  selectedCryptoId: string | null;
  isLoading: boolean;
  error: string | null;
  isOnline: boolean;
  lastUpdated: Date | null;
  sortBy: SortOption;
  
  // Actions
  fetchCryptos: () => Promise<void>;
  setCryptos: (cryptos: CryptoData[]) => void;
  setSearchQuery: (query: string) => void;
  toggleWatchlist: (cryptoId: string) => void;
  selectCrypto: (cryptoId: string | null) => void;
  setError: (error: string | null) => void;
  clearCache: () => void;
  setSortBy: (sortBy: SortOption) => void;
}

export type SortOption = 'rank' | 'gainers' | 'losers';

type CryptoAction = 
  | { type: 'SET_CRYPTOS'; payload: CryptoData[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'TOGGLE_WATCHLIST'; payload: string }
  | { type: 'SELECT_CRYPTO'; payload: string | null }
  | { type: 'SET_ONLINE'; payload: boolean }
  | { type: 'SET_LAST_UPDATED'; payload: Date }
  | { type: 'SET_SORT_BY'; payload: SortOption }
  | { type: 'SET_WATCHLIST'; payload: string[] };

interface CryptoState {
  cryptos: CryptoData[];
  watchlist: string[];
  searchQuery: string;
  selectedCryptoId: string | null;
  isLoading: boolean;
  error: string | null;
  isOnline: boolean;
  lastUpdated: Date | null;
  sortBy: SortOption;
}

const initialState: CryptoState = {
  cryptos: [],
  watchlist: [],
  searchQuery: '',
  selectedCryptoId: null,
  isLoading: false,
  error: null,
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  lastUpdated: null,
  sortBy: 'rank',
};

function cryptoReducer(state: CryptoState, action: CryptoAction): CryptoState {
  switch (action.type) {
    case 'SET_CRYPTOS':
      return { ...state, cryptos: action.payload, isLoading: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'TOGGLE_WATCHLIST': {
      const id = action.payload;
      const isInWatchlist = state.watchlist.includes(id);
      const newWatchlist = isInWatchlist
        ? state.watchlist.filter(wid => wid !== id)
        : [...state.watchlist, id];
      return { ...state, watchlist: newWatchlist };
    }
    case 'SET_WATCHLIST':
      return { ...state, watchlist: action.payload };
    case 'SELECT_CRYPTO':
      return { ...state, selectedCryptoId: action.payload };
    case 'SET_ONLINE':
      return { ...state, isOnline: action.payload };
    case 'SET_LAST_UPDATED':
      return { ...state, lastUpdated: action.payload };
    case 'SET_SORT_BY':
      return { ...state, sortBy: action.payload };
    default:
      return state;
  }
}

export const CryptoContext = createContext<CryptoContextType | undefined>(undefined);

export function CryptoProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cryptoReducer, initialState);

  // Load watchlist from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('crypto-watchlist');
      if (saved) {
        const watchlist = JSON.parse(saved);
        if (Array.isArray(watchlist) && watchlist.length > 0) {
          dispatch({ type: 'SET_WATCHLIST', payload: watchlist });
        }
      }
    } catch (e) {
      console.error('Error loading watchlist:', e);
    }
  }, []);

  // Save watchlist to localStorage
  useEffect(() => {
    localStorage.setItem('crypto-watchlist', JSON.stringify(state.watchlist));
  }, [state.watchlist]);

  // Handle online/offline
  useEffect(() => {
    const handleOnline = () => dispatch({ type: 'SET_ONLINE', payload: true });
    const handleOffline = () => dispatch({ type: 'SET_ONLINE', payload: false });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchCryptos = useCallback(async () => {
    if (!state.isOnline) {
      dispatch({ type: 'SET_ERROR', payload: 'You are offline. Showing cached data if available.' });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const data = await cryptoAPI.fetchTopCryptos();
      dispatch({ type: 'SET_CRYPTOS', payload: data });
      dispatch({ type: 'SET_LAST_UPDATED', payload: new Date() });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch cryptocurrencies';
      dispatch({ type: 'SET_ERROR', payload: message });
    }
  }, [state.isOnline]);

  const getSortedCryptos = useCallback(() => {
    const sorted = [...state.cryptos];
    switch (state.sortBy) {
      case 'gainers':
        return sorted.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
      case 'losers':
        return sorted.sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h);
      case 'rank':
      default:
        return sorted.sort((a, b) => a.market_cap_rank - b.market_cap_rank);
    }
  }, [state.cryptos, state.sortBy]);

  return (
    <CryptoContext.Provider
      value={{
        ...state,
        fetchCryptos,
        setCryptos: (cryptos) => dispatch({ type: 'SET_CRYPTOS', payload: cryptos }),
        setSearchQuery: (query) => dispatch({ type: 'SET_SEARCH_QUERY', payload: query }),
        toggleWatchlist: (id) => dispatch({ type: 'TOGGLE_WATCHLIST', payload: id }),
        selectCrypto: (id) => dispatch({ type: 'SELECT_CRYPTO', payload: id }),
        setError: (error) => dispatch({ type: 'SET_ERROR', payload: error }),
        clearCache: () => cryptoAPI.clearCache(),
        setSortBy: (sortBy) => dispatch({ type: 'SET_SORT_BY', payload: sortBy }),
        cryptos: getSortedCryptos(),
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
}

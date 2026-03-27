import { useContext } from 'react';
import { CryptoContext, CryptoContextType } from '@/lib/context/CryptoContext';

export function useCryptoContext(): CryptoContextType {
  const context = useContext(CryptoContext);
  if (!context) {
    throw new Error('useCryptoContext must be used within CryptoProvider');
  }
  return context;
}

import { useEffect } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { CryptoProvider } from '@/lib/context/CryptoContext';
import { CryptoDashboard } from '@/components/dashboard/CryptoDashboard';
import { useCryptoContext } from '@/hooks/useCryptoContext';
import './index.css';

function MainContent() {
  const { fetchCryptos } = useCryptoContext();

  useEffect(() => {
    fetchCryptos();
  }, [fetchCryptos]);

  return <CryptoDashboard />;
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <CryptoProvider>
        <div className="font-sans antialiased min-h-screen bg-background">
          <MainContent />
        </div>
      </CryptoProvider>
    </ThemeProvider>
  );
}

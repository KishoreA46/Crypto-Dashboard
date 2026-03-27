

import { useTheme } from 'next-themes';
import { Moon, Sun, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCryptoContext } from '@/hooks/useCryptoContext';

export function DashboardHeader() {
  const { theme, setTheme } = useTheme();
  const { isLoading, fetchCryptos, lastUpdated } = useCryptoContext();

  const handleRefresh = () => {
    fetchCryptos();
  };

  const formattedTime = lastUpdated 
    ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Never';

  return (
    <header className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Crypto Market Pulse
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Live cryptocurrency prices and market data
            </p>
            {lastUpdated && (
              <p className="text-xs text-muted-foreground mt-1 sm:mt-2">
                Last updated: {formattedTime}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              className="gap-2 flex-1 sm:flex-none"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
              className="w-9 px-0"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

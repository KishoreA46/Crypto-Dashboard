


import { useMemo } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { SearchBar } from './SearchBar';
import { CryptoList } from './CryptoList';
import { Watchlist } from './Watchlist';
import { DetailModal } from './DetailModal';
import { ErrorDisplay } from './ErrorDisplay';
import { useCryptoContext } from '@/hooks/useCryptoContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react';
import { SortOption } from '@/lib/context/CryptoContext';

export function CryptoDashboard() {
  const { cryptos, searchQuery, watchlist, isLoading, error, isOnline, selectedCryptoId, selectCrypto, sortBy, setSortBy } = useCryptoContext();

  const filteredCryptos = useMemo(() => {
    if (!searchQuery.trim()) return cryptos;
    
    const query = searchQuery.toLowerCase();
    return cryptos.filter(
      crypto =>
        crypto.name.toLowerCase().includes(query) ||
        crypto.symbol.toLowerCase().includes(query)
    );
  }, [cryptos, searchQuery]);

  const watchlistCryptos = useMemo(() => {
    return cryptos.filter(crypto => watchlist.includes(crypto.id));
  }, [cryptos, watchlist]);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      {error && <ErrorDisplay message={error} />}
      
      {!isOnline && (
        <div className="bg-yellow-50 dark:bg-yellow-950 border-b border-yellow-200 dark:border-yellow-900 px-4 py-3">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            You are offline. Showing cached data if available.
          </p>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                {searchQuery ? 'Search Results' : 'Cryptocurrency Market'}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {filteredCryptos.length} {filteredCryptos.length === 1 ? 'result' : 'results'}
              </p>
            </div>
            <div className="w-full sm:w-auto">
              <SearchBar />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-2">Sort By:</span>
            <Button
              variant={sortBy === 'rank' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('rank')}
              className="h-8 gap-1.5 text-xs"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              Top Rank
            </Button>
            <Button
              variant={sortBy === 'gainers' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('gainers')}
              className="h-8 gap-1.5 text-xs text-green-600 dark:text-green-400 font-bold"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Top Gainers
            </Button>
            <Button
              variant={sortBy === 'losers' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('losers')}
              className="h-8 gap-1.5 text-xs text-red-600 dark:text-red-400 font-bold"
            >
              <TrendingDown className="w-3.5 h-3.5" />
              Top Losers
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-xs grid-cols-2">
            <TabsTrigger value="all">
              Markets ({filteredCryptos.length})
            </TabsTrigger>
            <TabsTrigger value="watchlist">
              Watchlist ({watchlistCryptos.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-8">
            <CryptoList cryptos={filteredCryptos} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="watchlist" className="mt-8">
            {watchlistCryptos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No cryptos in your watchlist yet.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Star cryptocurrencies to add them here.
                </p>
              </div>
            ) : (
              <Watchlist cryptos={watchlistCryptos} />
            )}
          </TabsContent>
        </Tabs>
      </main>

      <DetailModal 
        cryptoId={selectedCryptoId} 
        onClose={() => selectCrypto(null)}
      />
    </div>
  );
}

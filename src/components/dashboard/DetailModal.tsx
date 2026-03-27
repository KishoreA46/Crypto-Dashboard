

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { CryptoData, cryptoAPI } from '@/lib/api/crypto';
import { formatPrice, formatPercentage, getChangeColor, formatMarketCap } from '@/lib/utils/formatting';
import { useCryptoContext } from '@/hooks/useCryptoContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Star } from 'lucide-react';

import { DetailAreaChart } from './DetailAreaChart';

interface DetailModalProps {
  cryptoId: string | null;
  onClose: () => void;
}

export function DetailModal({ cryptoId, onClose }: DetailModalProps) {
  const [crypto, setCrypto] = useState<CryptoData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { watchlist, toggleWatchlist } = useCryptoContext();
  const isWatched = cryptoId && watchlist.includes(cryptoId);

  useEffect(() => {
    if (!cryptoId) {
      setCrypto(null);
      return;
    }

    setIsLoading(true);
    cryptoAPI
      .fetchCryptoDetails(cryptoId)
      .then((data) => {
        setCrypto(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error loading crypto details:', error);
        setIsLoading(false);
      });
  }, [cryptoId]);

  const open = cryptoId !== null;
  const isPositive = (crypto?.price_change_percentage_24h || 0) >= 0;
  const chartColor = isPositive ? '#22c55e' : '#ef4444';

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto scrollbar-hide">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {crypto?.image && !isLoading && (
              <img src={crypto.image} alt={crypto.name} className="w-8 h-8 object-contain" />
            )}
            <DialogTitle>
              {isLoading ? 'Loading...' : crypto?.name || 'Details'}
            </DialogTitle>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="w-32 h-8" />
            <div className="space-y-3">
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-full h-4" />
            </div>
          </div>
        ) : crypto ? (
          <div className="space-y-6">
            {/* Main Price Section */}
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-foreground">
                {formatPrice(crypto.current_price)}
              </h2>
              <p className={`text-lg font-semibold ${getChangeColor(crypto.price_change_percentage_24h)}`}>
                {formatPercentage(crypto.price_change_percentage_24h)} (24h)
              </p>
              <p className="text-sm text-muted-foreground">
                Rank #{crypto.market_cap_rank}
              </p>
            </div>

            {/* Chart Section */}
            {crypto.sparkline_in_7d?.price && (
              <DetailAreaChart data={crypto.sparkline_in_7d.price.slice(-24)} color={chartColor} />
            )}

            {/* Price Range */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground mb-1">24h High</p>
                <p className="font-semibold text-foreground">
                  {crypto.high_24h ? formatPrice(crypto.high_24h) : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">24h Low</p>
                <p className="font-semibold text-foreground">
                  {crypto.low_24h ? formatPrice(crypto.low_24h) : 'N/A'}
                </p>
              </div>
            </div>

            {/* Market Data */}
            <div className="space-y-3 border-t border-border pt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Market Cap</span>
                <span className="font-semibold text-foreground">
                  {formatMarketCap(crypto.market_cap || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Volume (24h)</span>
                <span className="font-semibold text-foreground">
                  {crypto.total_volume ? formatMarketCap(crypto.total_volume) : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Symbol</span>
                <span className="font-semibold text-foreground">{crypto.symbol}</span>
              </div>
            </div>

            {/* Watchlist Button */}
            <Button
              onClick={() => {
                if (cryptoId) toggleWatchlist(cryptoId);
              }}
              className="w-full gap-2"
              variant={isWatched ? 'default' : 'outline'}
            >
              <Star className={`w-4 h-4 ${isWatched ? 'fill-current' : ''}`} />
              {isWatched ? 'Remove from Watchlist' : 'Add to Watchlist'}
            </Button>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Unable to load details</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

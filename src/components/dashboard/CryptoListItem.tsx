
import React, { memo } from 'react';
import { Star } from 'lucide-react';
import { CryptoData } from '@/lib/api/crypto';
import { formatPrice, formatPercentage, getChangeColor, formatMarketCap } from '@/lib/utils/formatting';
import { useCryptoContext } from '@/hooks/useCryptoContext';
import { Button } from '@/components/ui/button';
import { SparklineChart } from './SparklineChart';

interface CryptoListItemProps {
  crypto: CryptoData;
}

export const CryptoListItem = memo(function CryptoListItem({ crypto }: CryptoListItemProps) {
  const { watchlist, toggleWatchlist, selectCrypto } = useCryptoContext();
  const isWatched = watchlist.includes(crypto.id);
  const isPositive = crypto.price_change_percentage_24h >= 0;
  const changeColor = getChangeColor(crypto.price_change_percentage_24h);
  const sparklineColor = isPositive ? '#22c55e' : '#ef4444';

  return (
    <button
      onClick={() => selectCrypto(crypto.id)}
      className="w-full text-left border border-border rounded-lg p-3 sm:p-4 hover:bg-accent/10 dark:hover:bg-accent/5 transition-colors"
    >
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        {/* Left Section: Rank, Name, Symbol */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
          <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/5 overflow-hidden flex-shrink-0">
            {crypto.image ? (
              <img 
                src={crypto.image} 
                alt={crypto.name} 
                className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
                loading="lazy"
              />
            ) : (
              <span className="font-bold text-xs sm:text-sm text-primary">
                {crypto.market_cap_rank}
              </span>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">{crypto.name}</h3>
              <span className="text-xs font-medium text-muted-foreground bg-muted px-1.5 py-0.5 sm:px-2 sm:py-1 rounded whitespace-nowrap">
                {crypto.symbol}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 hidden sm:block">
              Market Cap: {formatMarketCap(crypto.market_cap || 0)}
            </p>
          </div>
        </div>

        {/* Middle Section: Sparkline Chart (Hidden on small mobile) */}
        <div className="hidden sm:block flex-shrink-0 px-2 lg:px-8">
          {crypto.sparkline_in_7d?.price && (
            <SparklineChart 
              data={crypto.sparkline_in_7d.price.slice(-24)} 
              color={sparklineColor} 
            />
          )}
        </div>

        {/* Right Section: Price and Buttons */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="text-right">
            <p className="font-bold text-sm sm:text-lg text-foreground">
              {formatPrice(crypto.current_price)}
            </p>
            <p className={`text-xs sm:text-sm font-medium ${changeColor}`}>
              {formatPercentage(crypto.price_change_percentage_24h)}
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              toggleWatchlist(crypto.id);
            }}
            className="flex-shrink-0 h-8 w-8 p-0"
            aria-label={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
          >
            <Star
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
                isWatched
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-muted-foreground hover:text-yellow-400'
              }`}
            />
          </Button>
        </div>
      </div>
    </button>
  );
});




import { memo } from 'react';
import { CryptoData } from '@/lib/api/crypto';
import { CryptoListItem } from './CryptoListItem';
import { Skeleton } from '@/components/ui/skeleton';

interface CryptoListProps {
  cryptos: CryptoData[];
  isLoading: boolean;
}

function CryptoListSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg">
          <div className="flex items-center gap-4 flex-1">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="w-24 h-4 mb-2" />
              <Skeleton className="w-16 h-3" />
            </div>
          </div>
          <div className="flex gap-4">
            <Skeleton className="w-20 h-4" />
            <Skeleton className="w-20 h-4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export const CryptoList = memo(function CryptoList({ cryptos, isLoading }: CryptoListProps) {
  if (isLoading && cryptos.length === 0) {
    return <CryptoListSkeleton />;
  }

  if (cryptos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No cryptocurrencies found.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Try a different search query.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {cryptos.map((crypto) => (
        <CryptoListItem key={crypto.id} crypto={crypto} />
      ))}
    </div>
  );
});



import { CryptoData } from '@/lib/api/crypto';
import { CryptoListItem } from './CryptoListItem';

interface WatchlistProps {
  cryptos: CryptoData[];
}

export function Watchlist({ cryptos }: WatchlistProps) {
  return (
    <div className="space-y-3">
      {cryptos.map((crypto) => (
        <CryptoListItem key={crypto.id} crypto={crypto} />
      ))}
    </div>
  );
}

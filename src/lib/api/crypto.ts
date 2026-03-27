const API_BASE = 'https://api.coingecko.com/api/v3';

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  market_cap_rank: number;
  high_24h?: number;
  low_24h?: number;
  total_volume?: number;
  sparkline_in_7d?: { price: number[] };
  image?: string;
}

const TARGET_COIN_IDS = [
  'bitcoin', 'ethereum', 'binancecoin', 'solana', 'ripple', 
  'cardano', 'tron', 'dogecoin', 'pepe', 'litecoin', 
  'chainlink', 'dash', 'avalanche-2', 'uniswap', 'aave', 'coti'
].join(',');

class CryptoAPI {
  private cache: Map<string, { data: CryptoData[]; timestamp: number }> = new Map();
  private cacheDuration = 5 * 60 * 1000; // 5 minutes

  async fetchTopCryptos(): Promise<CryptoData[]> {
    const cacheKey = 'top-cryptos';
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.data;
    }

    try {
      const response = await fetch(
        `${API_BASE}/coins/markets?vs_currency=usd&ids=${TARGET_COIN_IDS}&order=market_cap_desc&sparkline=true`
      );

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('API rate limit reached. Please try again in a few minutes.');
        }
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      const mapped: CryptoData[] = data.map((coin: any) => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        current_price: coin.current_price,
        price_change_percentage_24h: coin.price_change_percentage_24h || 0,
        market_cap: coin.market_cap,
        market_cap_rank: coin.market_cap_rank,
        total_volume: coin.total_volume,
        sparkline_in_7d: coin.sparkline_in_7d,
        image: coin.image,
      }));

      this.cache.set(cacheKey, { data: mapped, timestamp: Date.now() });
      return mapped;
    } catch (error) {
      console.error('Error fetching top cryptos:', error);
      // Return cached data even if expired, or throw
      const expired = this.cache.get(cacheKey);
      if (expired) {
        return expired.data;
      }
      throw error;
    }
  }

  async fetchCryptoDetails(cryptoId: string): Promise<CryptoData | null> {
    const cacheKey = `crypto-${cryptoId}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.data[0] || null;
    }

    try {
      const response = await fetch(
        `${API_BASE}/coins/${cryptoId}?localization=false&tickers=false&market_data=true&sparkline=true`
      );

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('API rate limit reached. Please try again in a few minutes.');
        }
        throw new Error(`API error: ${response.status}`);
      }

      const coin = await response.json();

      const mapped: CryptoData = {
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        current_price: coin.market_data?.current_price?.usd || 0,
        price_change_percentage_24h: coin.market_data?.price_change_percentage_24h || 0,
        market_cap: coin.market_data?.market_cap?.usd || 0,
        market_cap_rank: coin.market_cap_rank,
        high_24h: coin.market_data?.high_24h?.usd,
        low_24h: coin.market_data?.low_24h?.usd,
        total_volume: coin.market_data?.total_volume?.usd,
        sparkline_in_7d: coin.market_data?.sparkline_7d,
        image: coin.image?.large || coin.image?.small,
      };

      this.cache.set(cacheKey, { data: [mapped], timestamp: Date.now() });
      return mapped;
    } catch (error) {
      console.error('Error fetching crypto details:', error);
      throw error;
    }
  }

  clearCache() {
    this.cache.clear();
  }
}

export const cryptoAPI = new CryptoAPI();

import { useEffect, useState, useCallback } from 'react';

const PRAGMA_API_URL = 'https://api.devnet.pragma.build/node/v1';
const PRAGMA_API_KEY = 'FHVBLftpfYWWqgOuOkD28gJ9DZixgSl4';

const fetchBTCPricePragma = async (): Promise<number | null> => {
  try {
    const res = await fetch(`${PRAGMA_API_URL}/prices/latest?pair=BTC-USD`, {
      headers: {
        'x-api-key': PRAGMA_API_KEY,
        'Accept': 'application/json',
      },
    });
    const data = await res.json();
    if (data && data.price) {
      const price = parseInt(data.price, 16) / 1e8;
      if (!isNaN(price) && price > 0) return price;
    }
    return null;
  } catch (e) {
    return null;
  }
};

const fetchBTCPriceFromCoingecko = async (): Promise<number | null> => {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    const data = await res.json();
    const price = data?.bitcoin?.usd;
    if (!isNaN(price) && price > 0) return price;
    return null;
  } catch (e) {
    return null;
  }
};

export const BTCPriceDisplay = () => {
  const [price, setPrice] = useState<string>('Loading...');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchPrice = useCallback(async () => {
    setIsLoading(true);
    setPrice('Loading...');
    // Try Pragma first
    const pragmaPrice = await fetchBTCPricePragma();
    if (pragmaPrice !== null) {
      setPrice(`$${pragmaPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
      setLastUpdated(new Date().toLocaleTimeString());
      setIsLoading(false);
      return;
    }
    // Fallback to Coingecko
    const coingeckoPrice = await fetchBTCPriceFromCoingecko();
    if (coingeckoPrice !== null) {
      setPrice(`$${coingeckoPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
      setLastUpdated(new Date().toLocaleTimeString());
      setIsLoading(false);
      return;
    }
    setPrice('Price unavailable');
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 60000); // Refresh every 60s
    return () => clearInterval(interval);
  }, [fetchPrice]);

  return (
    <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-white mb-2">BTC Price (Pragma)</h2>
      <div className="text-center">
        <p className="text-2xl font-bold text-white mb-2">
          {isLoading ? (
            <span className="inline-block animate-pulse">Loading...</span>
          ) : (
            price
          )}
        </p>
        {lastUpdated && !isLoading && price !== 'Price unavailable' && (
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-400">Last updated: {lastUpdated}</p>
          </div>
        )}
      </div>
    </div>
  );
}; 
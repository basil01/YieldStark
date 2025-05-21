import { useState, useEffect } from 'react';
import { EkuboOracleService } from '../services/ekuboOracle';

export const useEkuboAPR = () => {
  const [apr, setApr] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAPR = async () => {
      try {
        const ekuboOracle = EkuboOracleService.getInstance();
        const currentAPR = await ekuboOracle.calculateAPR();
        setApr(currentAPR);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch Ekubo APR');
        setApr(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAPR();
    // Refresh APR every 5 minutes
    const interval = setInterval(fetchAPR, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return { apr, error, loading };
}; 
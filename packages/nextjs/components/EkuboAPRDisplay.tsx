import { useState, useEffect } from 'react';

export const EkuboAPRDisplay = () => {
  const [apr, setApr] = useState<number | null>(null);

  useEffect(() => {
    // Mock APR value instead of fetching from oracle
    setApr(5.2);
  }, []);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Ekubo Protocol APR</h3>
      <div className="flex items-baseline">
        <span className="text-3xl font-bold text-green-600">
          {apr?.toFixed(2)}%
        </span>
        <span className="ml-2 text-sm text-gray-500">APR</span>
      </div>
      <p className="mt-2 text-sm text-gray-500">
        Based on current pool data and trading volume
      </p>
    </div>
  );
}; 
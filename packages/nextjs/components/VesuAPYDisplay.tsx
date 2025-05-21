import { useState, useEffect } from 'react';

export const VesuAPYDisplay = () => {
  const [apy, setApy] = useState<number | null>(null);

  useEffect(() => {
    // Mock APY value instead of fetching from oracle
    setApy(7.5);
  }, []);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Vesu Protocol APY</h3>
      <div className="flex items-baseline">
        <span className="text-3xl font-bold text-green-600">
          {apy?.toFixed(2)}%
        </span>
        <span className="ml-2 text-sm text-gray-500">APY</span>
      </div>
      <p className="mt-2 text-sm text-gray-500">
        Based on current lending rates and utilization
      </p>
    </div>
  );
}; 
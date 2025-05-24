import React, { useState } from 'react';

interface YieldStarkDepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: string) => void;
  maxBalance?: string;
}

export const YieldStarkDepositModal: React.FC<YieldStarkDepositModalProps> = ({ 
  isOpen,
  onClose,
  onDeposit,
  maxBalance = "0"
}) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    // Validate amount
    if (value) {
      const numValue = parseFloat(value);
      const maxValue = parseFloat(maxBalance);
      if (isNaN(numValue)) {
        setError('Please enter a valid number');
      } else if (numValue <= 0) {
        setError('Amount must be greater than 0');
      } else if (numValue > maxValue) {
        setError(`Amount cannot exceed your balance of ${maxBalance} wBTC`);
      } else {
        setError(null);
      }
    } else {
      setError(null);
    }
  };

  const handleDeposit = () => {
    if (!error && amount) {
      onDeposit(amount);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-black">Deposit to YieldStark</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (wBTC)
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              className="w-full p-2 border rounded"
              placeholder="Enter amount"
              min="0"
              step="0.00000001"
            />
            <button 
              onClick={() => setAmount(maxBalance)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-purple-600 hover:text-purple-700"
            >
              MAX
            </button>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
          <p className="mt-2 text-sm text-gray-500">
            Available: {maxBalance} wBTC
          </p>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleDeposit}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
            disabled={!amount || !!error}
          >
            Deposit
          </button>
        </div>
      </div>
    </div>
  );
}; 
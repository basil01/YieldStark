import React, { useState, useEffect } from 'react';
import { CheckmarkAnimation } from './CheckmarkAnimation';

interface YieldStarkDepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: string) => Promise<void>;
  maxBalance: string;
  txHash?: string | null;
}

export const YieldStarkDepositModal = ({ isOpen, onClose, onDeposit, maxBalance, txHash }: YieldStarkDepositModalProps) => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setAmount('');
      setIsLoading(false);
      setIsSuccess(false);
      setError(null);
    }
  }, [isOpen]);

  const handleDeposit = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await onDeposit(amount);
      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deposit');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl text-black font-bold mb-2">YieldStark Your wBTC</h2>
        <p className="text-gray-600 mb-4">Input the amount of BTC you want YieldStark to use</p>
        
        {isSuccess ? (
          <div className="text-center">
            <CheckmarkAnimation show={true} />
            <p className="text-green-600 font-semibold mt-4">Deposit Successful!</p>
            {txHash && (
              <a 
                href={`https://starkscan.co/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 mt-2 inline-block"
              >
                View transaction on Starkscan
              </a>
            )}
            <button
              onClick={onClose}
              className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Amount (wBTC)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline bg-white"
                placeholder="Enter amount"
                disabled={isLoading}
              />
              <p className="text-sm text-gray-500 mt-1">
                Available: {maxBalance} wBTC
              </p>
            </div>

            {error && (
              <div className="text-red-500 mb-4">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-4">
              <button
                onClick={onClose}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeposit}
                disabled={isLoading || !amount}
                className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 'Deposit'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}; 
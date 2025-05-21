import React, { useState } from 'react';

interface YieldStarkDepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: string) => void;
}

export const YieldStarkDepositModal: React.FC<YieldStarkDepositModalProps> = ({ isOpen, onClose, onDeposit }) => {
  const [amount, setAmount] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-black">Deposit to YieldStark</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (wBTC)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter amount"
            min="0"
            step="0.00000001"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => onDeposit(amount)}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
            disabled={!amount || parseFloat(amount) <= 0}
          >
            Deposit
          </button>
        </div>
      </div>
    </div>
  );
}; 
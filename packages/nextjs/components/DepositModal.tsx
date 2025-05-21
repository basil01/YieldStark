'use client';

import { useState, useEffect } from 'react';
import { AccountInterface } from 'starknet';
import { approveWBTC, depositToVesu, getWBTCBalance, testContractConnection } from '../services/vesuDeposit';
import { useConnect } from '@starknet-react/core';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: () => void;
  protocol: 'vesu' | 'ekubo';
  apr: number;
  maxBalance: string;
  address: string;
  account: AccountInterface | null;
  isDepositing: boolean;
}

// Helper to detect provisional (dummy) account
function isProvisionalAccount(account: AccountInterface | null): boolean {
  if (!account) return true;
  if (typeof account.execute !== 'function') return true;
  return account.execute.toString().includes('Wallet connection issue. Please refresh and reconnect.');
}

export const DepositModal = ({
  isOpen,
  onClose,
  onDeposit,
  protocol,
  apr,
  maxBalance,
  address,
  account,
  isDepositing
}: DepositModalProps) => {
  const [amount, setAmount] = useState('');
  const [wbtcBalance, setWbtcBalance] = useState('0');
  const [isApproving, setIsApproving] = useState(false);
  const [isDepositingState, setIsDepositingState] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [isApproved, setIsApproved] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  const accountIsProvisional = isProvisionalAccount(account);

  useEffect(() => {
    if (account) {
      console.log('Account changed, testing connection...', {
        address: account.address,
        isProvisional: accountIsProvisional
      });
      testConnection();
    }
  }, [account]);

  const testConnection = async () => {
    if (!account) {
      console.log('No account available for connection test');
      return;
    }
    
    try {
      setIsTestingConnection(true);
      console.log('Testing contract connection...', {
        accountAddress: account.address,
        isProvisional: accountIsProvisional
      });
      
      const isConnected = await testContractConnection(account);
      console.log('Connection test result:', isConnected);
      
      if (!isConnected) {
        setError('Failed to connect to contracts. Please refresh the page and try again.');
        return;
      }
      
      await fetchWBTCBalance();
    } catch (err) {
      console.error('Error testing connection:', err);
      setError('Failed to connect to contracts. Please refresh the page and try again.');
    } finally {
      setIsTestingConnection(false);
    }
  };

  const fetchWBTCBalance = async () => {
    if (!account) {
      console.log('Cannot fetch balance: No account provided');
      return;
    }
    try {
      console.log('Fetching WBTC balance for account:', account.address);
      const balance = await getWBTCBalance(account);
      console.log('WBTC balance:', balance);
      setWbtcBalance(balance);
    } catch (err) {
      console.error('Error fetching WBTC balance:', err);
      setError('Failed to fetch WBTC balance');
    }
  };

  const handleApprove = async () => {
    console.log('APPROVE BUTTON CLICKED', {
      account: account?.address,
      amount,
      isProvisional: accountIsProvisional
    });
    
    if (!account) {
      console.log('Cannot approve: No account provided');
      setError('Please connect your wallet');
      return;
    }

    if (!amount) {
      console.log('Cannot approve: No amount provided');
      setError('Please enter an amount');
      return;
    }

    if (accountIsProvisional) {
      console.log('Cannot approve: Account is provisional');
      setError('Please unlock your wallet and try again');
      return;
    }

    if (isApproving || isDepositingState) {
      console.log('Cannot approve: Transaction in progress');
      return;
    }
    
    try {
      console.log('Starting approval process...', {
        account: account.address,
        amount,
        isProvisional: accountIsProvisional
      });
      setIsApproving(true);
      setError(null);
      
      // Convert amount to 8 decimals (wBTC)
      const amountInWei = BigInt(Math.floor(parseFloat(amount) * 1e8));
      console.log('Amount in Wei:', amountInWei.toString());
      
      console.log('Calling approveWBTC...');
      const txHash = await approveWBTC(account, amountInWei);
      console.log('Approval transaction hash:', txHash);
      setTxHash(txHash);
      
      setIsApproving(false);
      setIsApproved(true);
      console.log('Approval process completed');
    } catch (err) {
      console.error('Error in handleApprove:', err);
      if (err instanceof Error) {
        console.error('Error details:', {
          message: err.message,
          stack: err.stack,
          name: err.name
        });
      }
      setError(err instanceof Error ? err.message : 'Failed to approve WBTC');
      setIsApproving(false);
    }
  };

  const handleDeposit = async () => {
    console.log('DEPOSIT BUTTON CLICKED', {
      account: account?.address,
      amount,
      isProvisional: accountIsProvisional,
      isApproved
    });
    
    if (!account) {
      console.log('Cannot deposit: No account provided');
      setError('Please connect your wallet');
      return;
    }

    if (!amount) {
      console.log('Cannot deposit: No amount provided');
      setError('Please enter an amount');
      return;
    }

    if (accountIsProvisional) {
      console.log('Cannot deposit: Account is provisional');
      setError('Please unlock your wallet and try again');
      return;
    }

    if (!isApproved) {
      console.log('Cannot deposit: WBTC not approved');
      setError('Please approve WBTC first');
      return;
    }

    if (isApproving || isDepositingState) {
      console.log('Cannot deposit: Transaction in progress');
      return;
    }
    
    try {
      console.log('Starting deposit process...', {
        account: account.address,
        amount,
        isProvisional: accountIsProvisional
      });
      setIsDepositingState(true);
      setError(null);
      
      // Convert amount to 8 decimals (wBTC)
      const amountInWei = BigInt(Math.floor(parseFloat(amount) * 1e8));
      console.log('Amount in Wei:', amountInWei.toString());
      
      console.log('Calling depositToVesu...');
      const txHash = await depositToVesu(account, amountInWei);
      console.log('Deposit transaction hash:', txHash);
      setTxHash(txHash);
      
      setIsDepositingState(false);
      onDeposit();
      onClose();
      console.log('Deposit process completed');
    } catch (err) {
      console.error('Error in handleDeposit:', err);
      if (err instanceof Error) {
        console.error('Error details:', {
          message: err.message,
          stack: err.stack,
          name: err.name
        });
      }
      setError(err instanceof Error ? err.message : 'Failed to deposit to Vesu');
      setIsDepositingState(false);
    }
  };

  if (!isOpen) return null;

  console.log('[DepositModal] Render state:', {
    address,
    account: account?.address,
    accountIsProvisional,
    amount,
    isApproving,
    isDepositingState,
    error,
    txHash,
    isApproved,
    isTestingConnection
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Deposit to {protocol.toUpperCase()}</h2>
        
        <div className="mb-4">
          <p className="text-gray-600">APR: {apr}%</p>
          <p className="text-gray-600">Your WBTC Balance: {wbtcBalance}</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Amount (WBTC)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              console.log('Amount changed:', e.target.value);
              setAmount(e.target.value);
            }}
            className="w-full p-2 border rounded"
            placeholder="Enter amount"
            min="0"
            step="0.00000001"
          />
        </div>

        {isTestingConnection && (
          <div className="mb-4 p-2 bg-blue-100 text-blue-700 rounded">
            Testing contract connection...
          </div>
        )}

        {address && accountIsProvisional && (
          <div className="mb-4 p-2 bg-yellow-100 text-yellow-700 rounded">
            Wallet connected, but signer is not available. Please unlock or reconnect your wallet.<br/>
            If the problem persists, disconnect and reconnect your wallet, or refresh the page.
          </div>
        )}

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {txHash && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
            Transaction submitted!<br />
            <a
              href={`https://sepolia.voyager.online/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-700 break-all"
            >
              View on Voyager
            </a>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
            disabled={isApproving || isDepositingState || isTestingConnection}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              console.log('Approve button clicked - direct handler');
              handleApprove();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!amount || isApproving || isDepositingState || accountIsProvisional || isApproved || isTestingConnection}
          >
            {isApproving ? 'Approving...' : 'Approve'}
          </button>
          <button
            onClick={() => {
              console.log('Deposit button clicked - direct handler');
              handleDeposit();
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!amount || isApproving || isDepositingState || accountIsProvisional || !isApproved || isTestingConnection}
          >
            {isDepositingState ? 'Depositing...' : 'Deposit'}
          </button>
        </div>
      </div>
    </div>
  );
}; 
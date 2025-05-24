"use client";
import { useState } from 'react';
import { useAccount } from "@starknet-react/core";
import { DepositModal } from '../components/DepositModal';
import Link from 'next/link';
import { CustomConnectButton } from "~~/components/scaffold-stark/CustomConnectButton";

export default function Home() {
  const { address, account } = useAccount();
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState<'vesu' | 'ekubo'>('vesu');
  const [isDepositing, setIsDepositing] = useState(false);
  const [wbtcBalance, setWbtcBalance] = useState('0');
  const [showConnectPrompt, setShowConnectPrompt] = useState(false);

  const handleConnectWallet = () => {
    if (!address) {
      setShowConnectPrompt(true);
    } else {
      window.location.href = '/dashboard';
    }
  };

  return (
    <main className="min-h-screen bg-black text-white pt-20">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-8xl font-bold text-white mb-8 font-gro">
            Automate Your Bitcoin Yield On YieldStark
          </h1>
          <p className='text-2xl font-medium text-gray-100 mb-8'>
          YieldStark is a non-custodial yield optimizer that intelligently allocates your Bitcoin (WBTC) into 
          the most profitable DeFi opportunities across the Starknet ecosystem.
            Take profit while you're away and also redeposit into another Vault with best yield.
          </p>

          <div className="flex justify-center space-x-4 mt-8">
            <Link href="/dashboard">
              <button className="px-8 py-4 bg-purple-800 text-white rounded-full hover:bg-gray-100 transition-colors">
                Dashboard
              </button>
            </Link>
            <button className="px-8 py-4 bg-white text-purple-600 rounded-full hover:bg-gray-100 transition-colors border border-gray-500">
              Learn More
            </button>
          </div>
          <div className="space-y-4 mt-8">
            <p className="text-lg text-gray-300">
              Connect your wallet to start earning yield
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

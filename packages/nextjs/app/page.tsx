"use client";
import { useState } from 'react';
import { useAccount } from "@starknet-react/core";

import Link from 'next/link';
import { CustomConnectButton } from "~~/components/scaffold-stark/CustomConnectButton";
import { BTCPriceDisplay } from "~~/components/BTCPriceDisplay";

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

      {/* BTC Price Display Section */}
      <div className="relative w-full flex justify-center items-center mt-16 mb-20">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover rounded-xl z-0"
          style={{ filter: 'brightness(0.5) blur(1px)' }}
        >
          <source src="/LiquidMetal.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-8">
          <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">BTC / USD (Pragma)</h2>
          <div className="text-4xl font-extrabold text-white drop-shadow-lg">
            <BTCPriceDisplay />
          </div>
        </div>
      </div>

      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32 mb-24">
        <h2 className="text-5xl font-bold text-center mt-24 mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white bg-opacity-5 rounded-3xl p-10 mb-4 md:col-span-2 border border-white border-opacity-10">
            <h3 className="text-3xl font-bold mb-4">Bitcoin-Native Yield Optimization</h3>
            <p className="text-lg text-gray-200">
            YieldStark focuses exclusively on Bitcoin, unlocking optimized yield opportunities without the need for complex bridges or synthetic assets. BTC holders can now earn yield directly, with minimal friction.
            </p>
          </div>
          <div className="bg-white bg-opacity-5 rounded-3xl p-10 border border-white border-opacity-10">
            <h3 className="text-2xl font-bold mb-4">AI-Driven Rebalancing</h3>
            <p className="text-lg text-gray-200">
            Powered by intelligent algorithms, YieldStark dynamically reallocates BTC deposits across top-performing protocols like Vesu and Ekubo. This ensures optimal yield exposure with reduced manual overhead and risk.</p>
          </div>
          <div className="bg-white bg-opacity-5 rounded-3xl p-10 border border-white border-opacity-10">
            <h3 className="text-2xl font-bold mb-4">Built on Starknet</h3>
            <p className="text-lg text-gray-200">
            Leveraging Starknet's scalability and zero-knowledge infrastructure, 
            YieldStark delivers fast, low-cost transactions, enabling seamless deposits, rebalancing, and withdrawals — all secured on Ethereum L2.</p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full min-h-[50vh] bg-gradient-to-r from-purple-800 to-purple-600 relative flex items-center justify-center overflow-hidden">
        {/* Desktop Diagonal Layout */}
        <div className="hidden md:block w-full h-full relative">
          {/* Left: SVG beside text, both aligned and bold */}
          <div className="absolute top-12 left-10 flex items-center min-h-[100px]" style={{ minWidth: 'min-content' }}>
            <span className="mr-6 opacity-70 drop-shadow-lg select-none pointer-events-none" style={{ width: '7vw', height: '7vw', display: 'inline-block' }}>
              <svg viewBox="0.004 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="#000000" style={{ width: '7vw', height: '7vw', filter: 'drop-shadow(0 4px 16px #0006)' }}>
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path d="M63.04 39.741c-4.274 17.143-21.638 27.575-38.783 23.301C7.12 58.768-3.313 41.404.962 24.262 5.234 7.117 22.597-3.317 39.737.957c17.144 4.274 27.576 21.64 23.302 38.784z" fill="#f7931a"></path>
                  <path d="M46.11 27.441c.636-4.258-2.606-6.547-7.039-8.074l1.438-5.768-3.512-.875-1.4 5.616c-.922-.23-1.87-.447-2.812-.662l1.41-5.653-3.509-.875-1.439 5.766c-.764-.174-1.514-.346-2.242-.527l.004-.018-4.842-1.209-.934 3.75s2.605.597 2.55.634c1.422.355 1.68 1.296 1.636 2.042l-1.638 6.571c.098.025.225.061.365.117l-.37-.092-2.297 9.205c-.174.432-.615 1.08-1.609.834.035.051-2.552-.637-2.552-.637l-1.743 4.02 4.57 1.139c.85.213 1.683.436 2.502.646l-1.453 5.835 3.507.875 1.44-5.772c.957.26 1.887.5 2.797.726L27.504 50.8l3.511.875 1.453-5.823c5.987 1.133 10.49.676 12.383-4.738 1.527-4.36-.075-6.875-3.225-8.516 2.294-.531 4.022-2.04 4.483-5.157zM38.087 38.69c-1.086 4.36-8.426 2.004-10.807 1.412l1.928-7.729c2.38.594 10.011 1.77 8.88 6.317zm1.085-11.312c-.99 3.966-7.1 1.951-9.083 1.457l1.748-7.01c1.983.494 8.367 1.416 7.335 5.553z" fill="#ffffff"></path>
                </g>
              </svg>
            </span>
            <h2 className="text-[7vw] font-extrabold text-white animate-fade-in-up leading-tight uppercase" style={{ letterSpacing: '-0.05em' }}>
              DON&apos;T JUST HODL
            </h2>
          </div>
          {/* Right: Bottom right text */}
          <p className="absolute bottom-12 right-10 text-[5vw] font-extrabold text-white animate-fade-in-up delay-200 text-right leading-tight uppercase" style={{ letterSpacing: '-0.03em' }}>
            OPTIMIZE YOUR BITCOIN YIELD
          </p>
        </div>
        {/* Mobile Stacked Layout */}
        <div className="block md:hidden w-full h-full flex flex-col items-center justify-center py-16">
          <h2 className="text-[12vw] font-extrabold text-white animate-fade-in-up text-center leading-tight mb-8 uppercase" style={{ letterSpacing: '-0.05em' }}>
            DON&apos;T JUST HODL
          </h2>
          <p className="text-[8vw] font-extrabold text-white animate-fade-in-up delay-200 text-center leading-tight uppercase" style={{ letterSpacing: '-0.03em' }}>
            OPTIMIZE YOUR BITCOIN YIELD
          </p>
        </div>
      </section>

      <style jsx global>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 1.2s cubic-bezier(0.23, 1, 0.32, 1) both;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </main>
  );
}

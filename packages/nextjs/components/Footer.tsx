import { Cog8ToothIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { useTargetNetwork } from "~~/hooks/scaffold-stark/useTargetNetwork";
import { useGlobalState } from "~~/services/store/store";
import { devnet, sepolia, mainnet } from "@starknet-react/chains";
import { Faucet } from "~~/components/scaffold-stark/Faucet";
import { FaucetSepolia } from "~~/components/scaffold-stark/FaucetSepolia";
import { BlockExplorerSepolia } from "./scaffold-stark/BlockExplorerSepolia";
import { BlockExplorer } from "./scaffold-stark/BlockExplorer";
import Link from "next/link";

/**
 * Site footer
 */
export const Footer = () => {
  const nativeCurrencyPrice = useGlobalState(
    (state) => state.nativeCurrencyPrice,
  );
  const { targetNetwork } = useTargetNetwork();

  // NOTE: workaround - check by name also since in starknet react devnet and sepolia has the same chainId
  const isLocalNetwork =
    targetNetwork.id === devnet.id && targetNetwork.network === devnet.network;
  const isSepoliaNetwork =
    targetNetwork.id === sepolia.id &&
    targetNetwork.network === sepolia.network;
  const isMainnetNetwork =
    targetNetwork.id === mainnet.id &&
    targetNetwork.network === mainnet.network;

  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 mb-4 md:mb-0">
            Built with ❤️ by YieldStark Team
          </div>
          <div className="flex space-x-6">
            <Link href="https://github.com/yieldstark" target="_blank" className="text-gray-400 hover:text-purple-400 transition">
              GitHub
            </Link>
            <Link href="https://twitter.com/yieldstark" target="_blank" className="text-gray-400 hover:text-purple-400 transition">
              Twitter
            </Link>
            <Link href="https://docs.yieldstark.com" target="_blank" className="text-gray-400 hover:text-purple-400 transition">
              Docs
            </Link>
          </div>
        </div>
        <div className="mt-4 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} YieldStark. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

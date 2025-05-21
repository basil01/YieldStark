"use client";
import { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { Contract, RpcProvider } from "starknet";
import { cairo0Erc20Abi } from "../../utils/cairo0Erc20Abi";
import { EkuboAPRDisplay } from '../../components/EkuboAPRDisplay';
import { VesuAPYDisplay } from '../../components/VesuAPYDisplay';
import { EkuboOracleService } from '../../services/ekuboOracle';
import { VesuOracleService } from '../../services/vesuOracle';
import { PositionTracker } from '../../services/positionTracker';
import { approveWBTC, depositToVesu } from '../../services/vesu';
import { approveWBTCForVToken, depositToVesuVToken } from '../../services/vesuVToken';
import { AccountInterface } from 'starknet';
import { YieldStarkDepositModal } from '../../components/YieldStarkDepositModal';



const WBTC_ADDRESS = "0x00abbd6f1e590eb83addd87ba5ac27960d859b1f17d11a3c1cd6a0006704b141";

export default function Dashboard() {
  const { address, account, status } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [wbtcBalance, setWbtcBalance] = useState<string>("0");
  const [loading, setLoading] = useState(false);
  const [vesuAPY, setVesuAPY] = useState<number>(0);
  const [ekuboAPR, setEkuboAPR] = useState<number>(0);
  const [depositedAmounts, setDepositedAmounts] = useState({ vesu: '0', ekubo: '0' });
  const [profits, setProfits] = useState({ vesu: '0', ekubo: '0' });
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [vesuVTokenTxHash, setVesuVTokenTxHash] = useState<string | null>(null);
  const [isYieldStarkModalOpen, setIsYieldStarkModalOpen] = useState(false);

  // Add this function to format the balance
  const formatBalance = (balance: string) => {
    if (!balance) return "0";
    // WBTC has 8 decimals
    const formattedBalance = (Number(balance) / 1e8).toFixed(8);
    // Remove trailing zeros after decimal
    return formattedBalance.replace(/\.?0+$/, '');
  };

  useEffect(() => {
    async function fetchData() {
      if (!address) return;
      setLoading(true);
      try {
        // Fetch WBTC balance
        const sepoliaProvider = new RpcProvider({ nodeUrl: "https://starknet-sepolia.public.blastapi.io/rpc/v0_6" });
        const erc20 = new Contract(cairo0Erc20Abi, WBTC_ADDRESS, sepoliaProvider);
        const res = await erc20.balanceOf(address);
        setWbtcBalance(res.balance.toString());

        // Fetch APRs
        const vesuOracle = VesuOracleService.getInstance();
        const ekuboOracle = EkuboOracleService.getInstance();
        const [vesuAPY, ekuboAPR] = await Promise.all([
          vesuOracle.calculateAPY(),
          ekuboOracle.calculateAPR()
        ]);
        setVesuAPY(vesuAPY);
        setEkuboAPR(ekuboAPR);

        // Fetch positions and profits
        const positionTracker = PositionTracker.getInstance();
        const [deposited, profits] = await Promise.all([
          positionTracker.getTotalDeposited(address),
          positionTracker.calculateProfit(address)
        ]);
        setDepositedAmounts(deposited);
        setProfits(profits);

        // Fetch real Vesu APY (spot price)
        let realVesuAPY = 0;
        try {
          realVesuAPY = await vesuOracle.getSpotPriceWBTC();
        } catch (err) {
          // Fallback to mock value if real fetch fails
          realVesuAPY = 8.00;
        }
        setVesuAPY(realVesuAPY);
      } catch (e) {
        console.error('Error fetching data:', e);
      }
      setLoading(false);
    }
    fetchData();
  }, [address]);

  const handleYieldStark = () => {
    setIsYieldStarkModalOpen(true);
  };

  const handleDeposit = async () => {
    if (!address || !account) {
      setError('Please connect your wallet first');
      return;
    }

    setError(null);
    setTxHash(null);

    try {
      // Convert wbtcBalance to bigint
      const amount = BigInt(wbtcBalance);
      
      // Approve wBTC
      console.log("Approving WBTC...");
      const approveTx = await approveWBTC(account, amount);
      console.log("Approval tx:", approveTx);
      
      // Wait for approval to be mined
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Deposit to Vesu
      console.log("Depositing to Vesu...");
      const depositTx = await depositToVesu(account, amount);
      console.log("Deposit tx:", depositTx);
      
      setTxHash(depositTx);
    } catch (e) {
      console.error("Error during deposit:", e);
      setError(e instanceof Error ? e.message : 'Failed to deposit. Please try again.');
    }
  };

  const handleVesuVTokenDeposit = async () => {
    if (!address || !account) {
      setError('Please connect your wallet first');
      return;
    }
    setError(null);
    setVesuVTokenTxHash(null);
    try {
      console.log('[vWBTC Deposit] account:', account);
      const amount = BigInt(wbtcBalance);
      // Approve wBTC for vWBTC contract
      console.log('[vWBTC Deposit] Approving wBTC for vWBTC contract...');
      const approveTx = await approveWBTCForVToken(account, amount);
      console.log('[vWBTC Deposit] Approval tx:', approveTx);
      await new Promise(resolve => setTimeout(resolve, 5000));
      // Deposit to vWBTC contract
      console.log('[vWBTC Deposit] Depositing to vWBTC contract...');
      const depositTx = await depositToVesuVToken(account, amount, address);
      console.log('[vWBTC Deposit] Deposit tx:', depositTx);
      setVesuVTokenTxHash(depositTx);
    } catch (e) {
      console.error('[vWBTC Deposit] Error:', e);
      setError(e instanceof Error ? e.message : 'Failed to deposit to vWBTC.');
    }
  };

  if (!address) {
    return (
      <div className="p-20">
        <h2 className="text-5xl p-3">Dashboard</h2>
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded text-lg"
          onClick={() => connect({ connector: connectors[0] })}
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="p-20 bg-black text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
      <h2 className="text-5xl">Dashboard</h2>
      <div className="mb-2 pt-5 flex items-center space-x-2">
        <div className="bg-gray-800 p-2 rounded">
          <span>Connected: {address}</span>
        </div>
        <button className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition">
          Edit
        </button>
      </div>
      <div className="mb-2 pt-10">Your wBTC Balance: <h1 className="text-5xl">{loading ? "Loading..." : formatBalance(wbtcBalance)} wBTC</h1></div>

      <div className="flex space-x-4 mt-10 w-full max-w-md">
        <button 
          className="flex-1 bg-purple-600 text-white font-semibold py-5 rounded-full shadow-md hover:bg-purple-700 transition"
          onClick={handleYieldStark}
        >
          YieldStark
        </button>
        <button 
          className="flex-1 bg-white text-purple-600 font-semibold py-5 rounded-full shadow-md hover:bg-gray-100 border border-purple-600 transition"
        >
          Withdraw
        </button>
      </div>

      <YieldStarkDepositModal
        isOpen={isYieldStarkModalOpen}
        onClose={() => setIsYieldStarkModalOpen(false)}
        onDeposit={() => {}}
      />

      <h1 className="text-4xl font-bold mt-14">Current Positions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 w-full max-w-4xl">
        {/* Vesu Box */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
          <h3 className="text-xl font-bold mb-2 text-purple-700">Vesu Vault</h3>
          <p className="text-gray-700 mb-1">Deposited wBTC: <span className="font-semibold">{depositedAmounts.vesu}</span></p>
          <p className="text-gray-700 mb-1">Accrued Profit: <span className="font-semibold text-green-600">+{profits.vesu}</span></p>
          <div className="mt-4">
            <VesuAPYDisplay />
          </div>
        </div>

        {/* Ekubo Box */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
          <h3 className="text-xl font-bold mb-2 text-purple-700">Ekubo Vault</h3>
          <p className="text-gray-700 mb-1">Deposited wBTC: <span className="font-semibold">{depositedAmounts.ekubo}</span></p>
          <p className="text-gray-700 mb-1">Accrued Profit: <span className="font-semibold text-green-600">+{profits.ekubo}</span></p>
          <div className="mt-4">
            <EkuboAPRDisplay />
          </div>
        </div>
      </div>

      <p className="mt-12">
        <h1 className="text-4xl font-bold">Previous Positions</h1>
      </p>

      {/* Transaction History Table */}
      <div className="mt-6 w-full bg-white bg-opacity-10 rounded-xl shadow-md overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-3 px-4 font-bold text-white">Transaction ID</th>
              <th className="py-3 px-4 font-bold text-white">Vault</th>
              <th className="py-3 px-4 font-bold text-white">Amount Deposited</th>
              <th className="py-3 px-4 font-bold text-white">Generated Yield</th>
            </tr>
          </thead>
          <tbody>
            {/* Mock Data Row 1 */}
            <tr className="border-b border-gray-800">
              <td className="py-3 px-4 text-gray-200">
                <a href="https://sepolia.voyager.online/tx/0x457acd85fec58fe88de3d9a8591fb0266a909968df19cc52a0626c9ebec91ee" target="_blank" rel="noopener noreferrer" className="underline text-blue-400">
                  0x457a...91ee
                </a>
              </td>
              <td className="py-3 px-4 text-gray-200">Vesu</td>
              <td className="py-3 px-4 text-gray-200">0.40 wBTC</td>
              <td className="py-3 px-4 text-green-400">+0.0007 wBTC</td>
            </tr>
            {/* Mock Data Row 2 */}
            <tr className="border-b border-gray-800">
              <td className="py-3 px-4 text-gray-200">0xabc123...789</td>
              <td className="py-3 px-4 text-gray-200">Vesu</td>
              <td className="py-3 px-4 text-gray-200">0.25 wBTC</td>
              <td className="py-3 px-4 text-green-400">+0.0005 wBTC</td>
            </tr>
            {/* Mock Data Row 3 */}
            <tr>
              <td className="py-3 px-4 text-gray-200">0xdef456...012</td>
              <td className="py-3 px-4 text-gray-200">Ekubo</td>
              <td className="py-3 px-4 text-gray-200">0.15 wBTC</td>
              <td className="py-3 px-4 text-green-400">+0.0003 wBTC</td>
            </tr>
          </tbody>
        </table>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {txHash && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <p>Transaction submitted! View on <a href={`https://sepolia.voyager.online/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="underline">Sepolia Voyager</a></p>
        </div>
      )}

      {vesuVTokenTxHash && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <p>vWBTC Deposit submitted! View on <a href={`https://sepolia.voyager.online/tx/${vesuVTokenTxHash}`} target="_blank" rel="noopener noreferrer" className="underline">Sepolia Voyager</a></p>
        </div>
      )}
    </div>

  );
}
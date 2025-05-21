import { Contract, RpcProvider, AccountInterface } from 'starknet';

const VWBTC_ADDRESS = '0x076ce66eba78210a836fca94ab91828c0f6941ad88585a700f3e473a9b4af870';
const WBTC_ADDRESS = '0x00abbd6f1e590eb83addd87ba5ac27960d859b1f17d11a3c1cd6a0006704b141';

const vWBTCAbi = [
  {
    "type": "function",
    "name": "deposit",
    "inputs": [
      { "name": "assets", "type": "core::integer::u256" },
      { "name": "receiver", "type": "core::starknet::contract_address::ContractAddress" }
    ],
    "outputs": [
      { "type": "core::integer::u256" }
    ],
    "state_mutability": "external"
  }
];

const erc20Abi = [
  {
    "type": "function",
    "name": "approve",
    "inputs": [
      { "name": "spender", "type": "core::starknet::contract_address::ContractAddress" },
      { "name": "amount", "type": "core::integer::u256" }
    ],
    "outputs": [
      { "type": "core::bool" }
    ],
    "state_mutability": "external"
  }
];

export async function approveWBTCForVToken(account: AccountInterface, amount: bigint) {
  if (!account) throw new Error('No account provided');
  const provider = new RpcProvider({ nodeUrl: "https://starknet-sepolia.public.blastapi.io/rpc/v0_6" });
  const wbtcContract = new Contract(erc20Abi, WBTC_ADDRESS, provider);
  wbtcContract.connect(account);
  const tx = await wbtcContract.approve(VWBTC_ADDRESS, amount);
  return tx.transaction_hash;
}

export async function depositToVesuVToken(account: AccountInterface, amount: bigint, receiver: string) {
  if (!account) throw new Error('No account provided');
  const provider = new RpcProvider({ nodeUrl: "https://starknet-sepolia.public.blastapi.io/rpc/v0_6" });
  const vWBTCContract = new Contract(vWBTCAbi, VWBTC_ADDRESS, provider);
  vWBTCContract.connect(account);
  const tx = await vWBTCContract.deposit(amount, receiver);
  return tx.transaction_hash;
} 
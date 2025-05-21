import { EkuboOracleService } from '../services/ekuboOracle';
import { Contract, AccountInterface } from 'starknet';
// Use require for ABI imports to avoid module/type errors
const wbtcAbi = require('../abis/wbtc.json');
const vesuGenesisAbi = require('../abis/VesuGenesisPool.json');

export async function getVesuAPR(): Promise<number> {
  // TODO: Replace with actual Vesu API call
  return 0.05; // 5% APR (stub)
}

export async function getEkuboAPR(): Promise<number> {
  const ekuboOracle = EkuboOracleService.getInstance();
  return await ekuboOracle.calculateAPR();
}

export async function withdrawFromVault(protocol: "vesu" | "ekubo") {
  const ekuboOracle = EkuboOracleService.getInstance();
  
  if (protocol === "ekubo") {
    const vaultAddress = ekuboOracle.getSepoliaVaultAddress();
    const tokenAddresses = ekuboOracle.getSepoliaTokenAddresses();
    
    // TODO: Implement actual withdrawal using vault contract
    console.log(`Withdrawing from Ekubo vault at ${vaultAddress}`);
    console.log(`Using tokens:`, tokenAddresses);
  } else {
    // TODO: Implement Vesu withdrawal
    console.log(`Withdrawing from Vesu vault...`);
  }
}

export async function depositToVault(protocol: "vesu" | "ekubo") {
  const ekuboOracle = EkuboOracleService.getInstance();
  
  if (protocol === "ekubo") {
    const vaultAddress = ekuboOracle.getSepoliaVaultAddress();
    const tokenAddresses = ekuboOracle.getSepoliaTokenAddresses();
    
    // TODO: Implement actual deposit using vault contract
    console.log(`Depositing into Ekubo vault at ${vaultAddress}`);
    console.log(`Using tokens:`, tokenAddresses);
  } else {
    // TODO: Implement Vesu deposit
    console.log(`Depositing into Vesu vault...`);
  }
}

const WBTC_ADDRESS = '0x00abbd6f1e590eb83addd87ba5ac27960d859b1f17d11a3c1cd6a0006704b141';
const VESU_GENESIS_ADDRESS = '0x001ecab07456147a8de92b9273dd6789893401e8462a737431493980d9be6827';
const POOL_ID = '730993554056884283224259059297934576024721456828383733531590831263129347422';

export async function depositToVesuLendingPool(amount: number, account: AccountInterface, userAddress: string) {
  // Convert amount to 8 decimals (wBTC)
  const amountU8 = BigInt(Math.floor(amount * 1e8));

  // 1. Approve Vesu Genesis to spend wBTC
  const wbtcContract = new Contract(wbtcAbi, WBTC_ADDRESS, account);
  await wbtcContract.approve(VESU_GENESIS_ADDRESS, amountU8);

  // 2. Deposit to Vesu Genesis Pool
  const vesuContract = new Contract(vesuGenesisAbi as any, VESU_GENESIS_ADDRESS, account);
  // The deposit function signature may vary; adjust as needed
  // Example: await vesuContract.deposit(POOL_ID, amountU8, userAddress);
  // If the function is modify_position, construct the params object accordingly
  // For now, let's assume deposit(pool_id, amount, user_address)
  await vesuContract.deposit(POOL_ID, amountU8, userAddress);
} 
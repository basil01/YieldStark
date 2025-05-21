// This file is intentionally left empty after clearing all ABI-related code. 


import { Contract, AccountInterface, uint256, Abi, cairo } from "starknet";
import WBTCAbi from "../abis/WBTC.json" assert { type: "json" };
import GenesisAbi from "../abis/VesuGenesisPool.json" assert { type: "json" };

const WBTC_ADDRESS = "0x00abbd6f1e590eb83addd87ba5ac27960d859b1f17d11a3c1cd6a0006704b141";
const GENESIS_POOL_ADDRESS = "0x001ecab07456147a8de92b9273dd6789893401e8462a737431493980d9be6827";
const POOL_ID = cairo.uint256(730993554056884283224259059297934576024721456828383733531590831263129347422n);

export async function approveWBTC(account: AccountInterface, amount: bigint) {
  const token = new Contract(WBTCAbi as Abi, WBTC_ADDRESS, account);
  const amountUint = uint256.bnToUint256(amount);
  return await token.invoke("approve", [GENESIS_POOL_ADDRESS, amountUint]);
}

export async function depositWBTC(account: AccountInterface, amount: bigint) {
  const pool = new Contract(GenesisAbi as Abi, GENESIS_POOL_ADDRESS, account);
  const amountUint = uint256.bnToUint256(amount);
  return await pool.invoke("deposit", [POOL_ID, WBTC_ADDRESS, amountUint]);
}

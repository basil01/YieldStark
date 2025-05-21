import { Contract, uint256 } from "starknet";
import { WBTC, VESU_SINGLETON, VESU_GENESIS_POOL } from "~~/utils/Constants";

// WBTC ERC20 ABI (minimal for approve)
const wbtcABI = [
  {
    type: "function",
    name: "approve",
    inputs: [
      { name: "spender", type: "ContractAddress" },
      { name: "amount", type: "Uint256" }
    ],
    outputs: [{ type: "bool" }],
    state_mutability: "external"
  }
];

// Singleton ABI (minimal for deposit)
const singletonABI = [
  {
    type: "function",
    name: "modify_position",
    inputs: [
      {
        name: "params",
        type: "struct",
        members: [
          { name: "pool_id", type: "felt252" },
          { name: "collateral_asset", type: "ContractAddress" },
          { name: "debt_asset", type: "ContractAddress" },
          { name: "user", type: "ContractAddress" },
          { name: "collateral", type: "struct", members: [
            { name: "amount_type", type: "enum", variants: [{ name: "Delta", type: "()" }, { name: "Target", type: "()" }] },
            { name: "denomination", type: "enum", variants: [{ name: "Native", type: "()" }, { name: "Assets", type: "()" }] },
            { name: "value", type: "struct", members: [
              { name: "abs", type: "Uint256" },
              { name: "is_negative", type: "bool" }
            ]}
          ]},
          { name: "debt", type: "struct", members: [
            { name: "amount_type", type: "enum", variants: [{ name: "Delta", type: "()" }, { name: "Target", type: "()" }] },
            { name: "denomination", type: "enum", variants: [{ name: "Native", type: "()" }, { name: "Assets", type: "()" }] },
            { name: "value", type: "struct", members: [
              { name: "abs", type: "Uint256" },
              { name: "is_negative", type: "bool" }
            ]}
          ]},
          { name: "data", type: "felt252[]" }
        ]
      }
    ],
    outputs: [
      {
        type: "struct",
        members: [
          { name: "collateral_delta", type: "struct", members: [
            { name: "abs", type: "Uint256" },
            { name: "is_negative", type: "bool" }
          ]},
          { name: "collateral_shares_delta", type: "struct", members: [
            { name: "abs", type: "Uint256" },
            { name: "is_negative", type: "bool" }
          ]},
          { name: "debt_delta", type: "struct", members: [
            { name: "abs", type: "Uint256" },
            { name: "is_negative", type: "bool" }
          ]},
          { name: "nominal_debt_delta", type: "struct", members: [
            { name: "abs", type: "Uint256" },
            { name: "is_negative", type: "bool" }
          ]},
          { name: "bad_debt", type: "Uint256" }
        ]
      }
    ],
    state_mutability: "external"
  }
];

/**
 * Approve WBTC spending for Vesu Singleton
 * @param account The user's account
 * @param amount The amount to approve
 * @returns Transaction hash
 */
export async function approveWBTC(account: any, amount: bigint): Promise<string> {
  try {
    const wbtcContract = new Contract(wbtcABI, WBTC, account);
    const amountUint256 = uint256.bnToUint256(amount);
    
    console.log("Approving WBTC...");
    console.log("Spender:", VESU_SINGLETON);
    console.log("Amount:", amountUint256);
    
    const result = await wbtcContract.approve(VESU_SINGLETON, amountUint256);
    console.log("Approve result:", result);
    
    return result.transaction_hash;
  } catch (error) {
    console.error("Error in approveWBTC:", error);
    throw error;
  }
}

/**
 * Deposit WBTC to Vesu
 * @param account The user's account
 * @param amount The amount to deposit
 * @returns Transaction hash
 */
export async function depositToVesu(account: any, amount: bigint): Promise<string> {
  try {
    const singletonContract = new Contract(singletonABI, VESU_SINGLETON, account);
    
    const params = {
      pool_id: VESU_GENESIS_POOL,
      collateral_asset: WBTC,
      debt_asset: WBTC,
      user: account.address,
      collateral: {
        amount_type: { Delta: {} },
        denomination: { Assets: {} },
        value: { 
          abs: uint256.bnToUint256(amount),
          is_negative: false 
        }
      },
      debt: {
        amount_type: { Delta: {} },
        denomination: { Assets: {} },
        value: { 
          abs: uint256.bnToUint256(0n),
          is_negative: false 
        }
      },
      data: []
    };

    console.log("Depositing to Vesu...");
    console.log("Params:", JSON.stringify(params, null, 2));
    
    const result = await singletonContract.modify_position(params);
    console.log("Deposit result:", result);
    
    return result.transaction_hash;
  } catch (error) {
    console.error("Error in depositToVesu:", error);
    throw error;
  }
} 
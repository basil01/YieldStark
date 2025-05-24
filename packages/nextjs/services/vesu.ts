import { Contract, RpcProvider, AccountInterface, uint256 } from "starknet";
import { VESU_SINGLETON, WBTC } from "~~/utils/Constants";

// ✅ Minimal ERC20 ABI for approve and balance
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
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "ContractAddress" }],
    outputs: [{ name: "balance", type: "Uint256" }],
    state_mutability: "view"
  },
  {
    type: "function",
    name: "allowance",
    inputs: [
      { name: "owner", type: "ContractAddress" },
      { name: "spender", type: "ContractAddress" }
    ],
    outputs: [{ name: "remaining", type: "Uint256" }],
    state_mutability: "view"
  }
];

// ✅ Minimal Singleton ABI for modify_position
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
          {
            name: "collateral",
            type: "struct",
            members: [
              {
                name: "amount_type",
                type: "enum",
                variants: [
                  { name: "Delta", type: "()" },
                  { name: "Target", type: "()" }
                ]
              },
              {
                name: "denomination",
                type: "enum",
                variants: [
                  { name: "Native", type: "()" },
                  { name: "Assets", type: "()" }
                ]
              },
              { name: "value", type: "Uint256" }
            ]
          },
          {
            name: "debt",
            type: "struct",
            members: [
              {
                name: "amount_type",
                type: "enum",
                variants: [
                  { name: "Delta", type: "()" },
                  { name: "Target", type: "()" }
                ]
              },
              {
                name: "denomination",
                type: "enum",
                variants: [
                  { name: "Native", type: "()" },
                  { name: "Assets", type: "()" }
                ]
              },
              { name: "value", type: "Uint256" }
            ]
          }
        ]
      }
    ],
    outputs: [],
    state_mutability: "external"
  }
];

// ✅ Check WBTC balance
export async function checkWBTCBalance(account: AccountInterface): Promise<bigint> {
  try {
    const wbtcContract = new Contract(wbtcABI, WBTC, account);
    const balance = await wbtcContract.balanceOf(account.address);
    return balance.balance;
  } catch (error) {
    console.error("Error checking WBTC balance:", error);
    throw new Error("Failed to check WBTC balance");
  }
}

// ✅ Check WBTC allowance
export async function checkWBTCAllowance(account: AccountInterface): Promise<bigint> {
  try {
    const wbtcContract = new Contract(wbtcABI, WBTC, account);
    const allowance = await wbtcContract.allowance(account.address, VESU_SINGLETON);
    return allowance.remaining;
  } catch (error) {
    console.error("Error checking WBTC allowance:", error);
    throw new Error("Failed to check WBTC allowance");
  }
}

// ✅ Approve WBTC spending
export async function approveWBTC(account: AccountInterface, amount: bigint): Promise<string> {
  try {
    // Check if user has enough balance
    const balance = await checkWBTCBalance(account);
    if (balance < amount) {
      throw new Error("Insufficient WBTC balance");
    }

    // Check if we already have enough allowance
    const currentAllowance = await checkWBTCAllowance(account);
    if (currentAllowance >= amount) {
      console.log("Sufficient allowance already exists");
      return "already_approved";
    }

    const wbtcContract = new Contract(wbtcABI, WBTC, account);
    const amountUint256 = uint256.bnToUint256(amount);

    console.log("Approving WBTC...");
    console.log("Account:", account.address);
    console.log("Spender (Singleton):", VESU_SINGLETON);
    console.log("Amount (Uint256):", amountUint256);

    // Execute the approve transaction
    const tx = await wbtcContract.approve(VESU_SINGLETON, amountUint256);
    console.log("Approval transaction sent:", tx.transaction_hash);
    
    // Wait for the transaction to be accepted
    await account.waitForTransaction(tx.transaction_hash);
    console.log("Approval transaction confirmed");
    
    return tx.transaction_hash;
  } catch (error) {
    console.error("Error approving WBTC:", error);
    throw error;
  }
}

// ✅ Deposit to Vesu
export async function depositToVesu(account: AccountInterface, amount: bigint): Promise<string> {
  try {
    // Check if user has enough balance
    const balance = await checkWBTCBalance(account);
    if (balance < amount) {
      throw new Error("Insufficient WBTC balance");
    }

    // Check if we have enough allowance
    const allowance = await checkWBTCAllowance(account);
    if (allowance < amount) {
      throw new Error("Insufficient WBTC allowance. Please approve first.");
    }

    const singletonContract = new Contract(singletonABI, VESU_SINGLETON, account);
    const amountUint256 = uint256.bnToUint256(amount);

    console.log("Depositing to Vesu...");
    console.log("Account:", account.address);
    console.log("Amount (Uint256):", amountUint256);

    // Prepare the modify_position parameters
    const params = {
      pool_id: "0x1", // Genesis pool ID
      collateral_asset: WBTC,
      debt_asset: "0x0", // No debt asset for deposit
      user: account.address,
      collateral: {
        amount_type: { Delta: {} },
        denomination: { Assets: {} },
        value: amountUint256
      },
      debt: {
        amount_type: { Delta: {} },
        denomination: { Assets: {} },
        value: uint256.bnToUint256(0n)
      }
    };

    // Execute the deposit transaction
    const tx = await singletonContract.modify_position(params);
    console.log("Deposit transaction sent:", tx.transaction_hash);
    
    // Wait for the transaction to be accepted
    await account.waitForTransaction(tx.transaction_hash);
    console.log("Deposit transaction confirmed");
    
    return tx.transaction_hash;
  } catch (error) {
    console.error("Error depositing to Vesu:", error);
    throw error;
  }
} 
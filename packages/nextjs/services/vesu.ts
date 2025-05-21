import { Contract, RpcProvider, AccountInterface } from "starknet";

const VESU_EXTENSION_ADDRESS = "0x0571efca8cae0e426cb7052dad04badded0855b4cd6c6f475639af3356bc33fe";
const WBTC_ADDRESS = "0x00abbd6f1e590eb83addd87ba5ac27960d859b1f17d11a3c1cd6a0006704b141";

// Vesu Extension ABI
const vesuExtensionAbi = [
  {
    "type": "function",
    "name": "add_asset",
    "inputs": [
      {
        "name": "pool_id",
        "type": "core::felt252"
      },
      {
        "name": "asset_params",
        "type": "vesu::data_model::AssetParams"
      },
      {
        "name": "v_token_params",
        "type": "vesu::extension::default_extension_po::VTokenParams"
      },
      {
        "name": "interest_rate_config",
        "type": "vesu::extension::components::interest_rate_model::InterestRateConfig"
      },
      {
        "name": "pragma_oracle_params",
        "type": "vesu::extension::default_extension_po::PragmaOracleParams"
      }
    ],
    "outputs": [],
    "state_mutability": "external"
  }
];

// ERC20 ABI for WBTC
const erc20Abi = [
  {
    "type": "function",
    "name": "approve",
    "inputs": [
      {
        "name": "spender",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "amount",
        "type": "core::integer::u256"
      }
    ],
    "outputs": [
      {
        "type": "core::bool"
      }
    ],
    "state_mutability": "external"
  }
];

export async function approveWBTC(account: AccountInterface, amount: bigint) {
  const provider = new RpcProvider({ nodeUrl: "https://starknet-sepolia.public.blastapi.io/rpc/v0_6" });
  const wbtcContract = new Contract(erc20Abi, WBTC_ADDRESS, provider);
  wbtcContract.connect(account);

  try {
    const tx = await wbtcContract.approve(VESU_EXTENSION_ADDRESS, amount);
    return tx.transaction_hash;
  } catch (error) {
    console.error("Error approving WBTC:", error);
    throw error;
  }
}

export async function depositToVesu(account: AccountInterface, amount: bigint) {
  const provider = new RpcProvider({ nodeUrl: "https://starknet-sepolia.public.blastapi.io/rpc/v0_6" });
  const vesuContract = new Contract(vesuExtensionAbi, VESU_EXTENSION_ADDRESS, provider);
  vesuContract.connect(account);

  try {
    // Prepare asset parameters
    const assetParams = {
      asset: WBTC_ADDRESS,
      floor: 0n,
      initial_rate_accumulator: 1n,
      initial_full_utilization_rate: 1n,
      max_utilization: 1000000000000000000n, // 1 in wei
      is_legacy: false,
      fee_rate: 0n
    };

    // Prepare vToken parameters
    const vTokenParams = {
      v_token_name: "Vesu WBTC",
      v_token_symbol: "vWBTC"
    };

    // Prepare interest rate config
    const interestRateConfig = {
      min_target_utilization: 0n,
      max_target_utilization: 1000000000000000000n,
      target_utilization: 800000000000000000n,
      min_full_utilization_rate: 0n,
      max_full_utilization_rate: 1000000000000000000n,
      zero_utilization_rate: 0n,
      rate_half_life: 86400n,
      target_rate_percent: 50000000000000000n
    };

    // Prepare oracle parameters
    const pragmaOracleParams = {
      pragma_key: "WBTC/USD",
      timeout: 3600n,
      number_of_sources: 3,
      start_time_offset: 0n,
      time_window: 3600n,
      aggregation_mode: 0 // Median
    };

    // Call add_asset function
    const tx = await vesuContract.add_asset(
      "0x1", // pool_id
      assetParams,
      vTokenParams,
      interestRateConfig,
      pragmaOracleParams
    );

    return tx.transaction_hash;
  } catch (error) {
    console.error("Error depositing to Vesu:", error);
    throw error;
  }
} 
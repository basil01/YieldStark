import { CONTRACTS, MOCK_DATA } from '../config/contracts';
import { Contract, RpcProvider } from 'starknet';

export interface VesuPoolData {
  apy: number;
  tvl: number;
  utilizationRate: number;
}

export class VesuOracleService {
  private static instance: VesuOracleService;
  private provider: RpcProvider;
  
  private constructor() {
    this.provider = new RpcProvider({ nodeUrl: "https://starknet-sepolia.public.blastapi.io/rpc/v0_6" });
  }

  public static getInstance(): VesuOracleService {
    if (!VesuOracleService.instance) {
      VesuOracleService.instance = new VesuOracleService();
    }
    return VesuOracleService.instance;
  }

  /**
   * Get pool data for WBTC lending
   * In production, this would call the Vesu Pragma Oracle contract
   */
  public async getPoolData(): Promise<VesuPoolData> {
    // TODO: Replace with actual contract call to Pragma Oracle
    // For now, return mock data
    return {
      apy: MOCK_DATA.VESU.LENDING.APY,
      tvl: MOCK_DATA.VESU.LENDING.TVL,
      utilizationRate: MOCK_DATA.VESU.LENDING.UTILIZATION_RATE
    };
  }

  /**
   * Calculate APY based on pool data
   * For Vesu, this is based on utilization rate and lending rates
   */
  public async calculateAPY(): Promise<number> {
    const poolData = await this.getPoolData();
    return poolData.apy * 100; // Convert to percentage
  }

  
  public getVaultAddress(): string {
    return CONTRACTS.VESU.SEPOLIA.WBTC_VAULT;
  }
} 
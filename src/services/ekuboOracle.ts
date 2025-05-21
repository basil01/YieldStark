import { CONTRACTS, MOCK_DATA } from '../config/contracts';

export interface PoolData {
  twap: number;
  volume24h: number;
  tvl: number;
}

export class EkuboOracleService {
  private static instance: EkuboOracleService;
  
  private constructor() {}

  public static getInstance(): EkuboOracleService {
    if (!EkuboOracleService.instance) {
      EkuboOracleService.instance = new EkuboOracleService();
    }
    return EkuboOracleService.instance;
  }

  /**
   * Get pool data for WBTC-ETH pair from mainnet
   * In production, this would call the Ekubo Oracle Extension contract
   */
  public async getPoolData(): Promise<PoolData> {
    // TODO: Replace with actual contract call to mainnet Oracle Extension
    return {
      twap: MOCK_DATA.EKUBO.TWAP.WBTC_ETH,
      volume24h: MOCK_DATA.EKUBO.TWAP.VOLUME_24H,
      tvl: MOCK_DATA.EKUBO.TWAP.TVL
    };
  }

  /**
   * Calculate APR based on pool data from mainnet
   * Formula: (24h Volume * Fee Rate) / TVL * 365
   */
  public async calculateAPR(): Promise<number> {
    const poolData = await this.getPoolData();
    const FEE_RATE = 0.003; // 0.3% fee rate
    
    const dailyFees = poolData.volume24h * FEE_RATE;
    const annualFees = dailyFees * 365;
    const apr = (annualFees / poolData.tvl) * 100; // Convert to percentage
    
    return apr;
  }

  /**
   * Get Sepolia vault contract address
   */
  public getSepoliaVaultAddress(): string {
    return CONTRACTS.EKUBO.SEPOLIA.CORE_CONTRACT;
  }

  /**
   * Get Sepolia token addresses
   */
  public getSepoliaTokenAddresses() {
    return {
      wbtc: CONTRACTS.EKUBO.SEPOLIA.TOKENS.WBTC,
      eth: CONTRACTS.EKUBO.SEPOLIA.TOKENS.ETH
    };
  }
} 
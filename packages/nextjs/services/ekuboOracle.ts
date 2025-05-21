import { Contract, RpcProvider } from 'starknet';
import { CONTRACTS } from '../config/contracts';

export class EkuboOracleService {
  private static instance: EkuboOracleService;
  private provider: RpcProvider;

  private constructor() {
    this.provider = new RpcProvider({ nodeUrl: "https://starknet-sepolia.public.blastapi.io/rpc/v0_6" });
  }

  public static getInstance(): EkuboOracleService {
    if (!EkuboOracleService.instance) {
      EkuboOracleService.instance = new EkuboOracleService();
    }
    return EkuboOracleService.instance;
  }

  public async calculateAPR(): Promise<number> {
    // TODO: Implement actual APR calculation from Ekubo Oracle
    // For now, return mock data
    return 5.25; // 5.25% APR
  }

  public getVaultAddress(): string {
    return CONTRACTS.EKUBO.SEPOLIA.WBTC_VAULT;
  }
} 
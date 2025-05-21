import { Contract, RpcProvider } from 'starknet';
import { CONTRACTS } from '../config/contracts';

const vesuOracleAbi = [
  {"type":"impl","name":"MockPragmaOracleImpl","interface_name":"vesu::test::mock_oracle::IMockPragmaOracle"},
  {"type":"enum","name":"vesu::vendor::pragma::DataType","variants":[{"name":"SpotEntry","type":"core::felt252"},{"name":"FutureEntry","type":"(core::felt252, core::integer::u64)"},{"name":"GenericEntry","type":"core::felt252"}]},
  {"type":"enum","name":"vesu::vendor::pragma::AggregationMode","variants":[{"name":"Median","type":"()"},{"name":"Mean","type":"()"},{"name":"Error","type":"()"}]},
  {"type":"enum","name":"core::option::Option::<core::integer::u64>","variants":[{"name":"Some","type":"core::integer::u64"},{"name":"None","type":"()"}]},
  {"type":"struct","name":"vesu::vendor::pragma::PragmaPricesResponse","members":[{"name":"price","type":"core::integer::u128"},{"name":"decimals","type":"core::integer::u32"},{"name":"last_updated_timestamp","type":"core::integer::u64"},{"name":"num_sources_aggregated","type":"core::integer::u32"},{"name":"expiration_timestamp","type":"core::option::Option::<core::integer::u64>"}]},
  {"type":"interface","name":"vesu::test::mock_oracle::IMockPragmaOracle","items":[{"type":"function","name":"get_data","inputs":[{"name":"data_type","type":"vesu::vendor::pragma::DataType"},{"name":"aggregation_mode","type":"vesu::vendor::pragma::AggregationMode"}],"outputs":[{"type":"vesu::vendor::pragma::PragmaPricesResponse"}],"state_mutability":"external"},{"type":"function","name":"get_data_median","inputs":[{"name":"data_type","type":"vesu::vendor::pragma::DataType"}],"outputs":[{"type":"vesu::vendor::pragma::PragmaPricesResponse"}],"state_mutability":"external"},{"type":"function","name":"get_num_sources_aggregated","inputs":[{"name":"key","type":"core::felt252"}],"outputs":[{"type":"core::integer::u32"}],"state_mutability":"external"},{"type":"function","name":"get_last_updated_timestamp","inputs":[{"name":"key","type":"core::felt252"}],"outputs":[{"type":"core::integer::u64"}],"state_mutability":"external"},{"type":"function","name":"set_price","inputs":[{"name":"key","type":"core::felt252"},{"name":"price","type":"core::integer::u128"}],"outputs":[],"state_mutability":"external"},{"type":"function","name":"set_num_sources_aggregated","inputs":[{"name":"key","type":"core::felt252"},{"name":"num_sources_aggregated","type":"core::integer::u32"}],"outputs":[],"state_mutability":"external"},{"type":"function","name":"set_last_updated_timestamp","inputs":[{"name":"key","type":"core::felt252"},{"name":"last_updated_timestamp","type":"core::integer::u64"}],"outputs":[],"state_mutability":"external"}]},
  {"type":"struct","name":"vesu::test::mock_oracle::MockPragmaOracle::BaseEntry","members":[{"name":"timestamp","type":"core::integer::u64"},{"name":"source","type":"core::felt252"},{"name":"publisher","type":"core::felt252"}]},
  {"type":"struct","name":"vesu::test::mock_oracle::MockPragmaOracle::SpotEntry","members":[{"name":"base","type":"vesu::test::mock_oracle::MockPragmaOracle::BaseEntry"},{"name":"price","type":"core::integer::u128"},{"name":"pair_id","type":"core::felt252"},{"name":"volume","type":"core::integer::u128"}]},
  {"type":"event","name":"vesu::test::mock_oracle::MockPragmaOracle::SubmittedSpotEntry","kind":"struct","members":[{"name":"spot_entry","type":"vesu::test::mock_oracle::MockPragmaOracle::SpotEntry","kind":"data"}]},
  {"type":"event","name":"vesu::test::mock_oracle::MockPragmaOracle::Event","kind":"enum","variants":[{"name":"SubmittedSpotEntry","type":"vesu::test::mock_oracle::MockPragmaOracle::SubmittedSpotEntry","kind":"nested"}]}
];

function spotEntry(wbtcAddress: string) {
  return { SpotEntry: wbtcAddress };
}
function medianMode() {
  return [0, {}];
}

export class VesuOracleService {
  private static instance: VesuOracleService;
  private provider: RpcProvider;
  private contract: Contract;

  private constructor() {
    this.provider = new RpcProvider({ nodeUrl: "https://starknet-sepolia.public.blastapi.io/rpc/v0_6" });
    this.contract = new Contract(
      vesuOracleAbi,
      CONTRACTS.VESU.SEPOLIA.ORACLE,
      this.provider
    );
  }

  public static getInstance(): VesuOracleService {
    if (!VesuOracleService.instance) {
      VesuOracleService.instance = new VesuOracleService();
    }
    return VesuOracleService.instance;
  }

  public async getSpotPriceWBTC(): Promise<number> {
    const data_type = spotEntry(CONTRACTS.VESU.SEPOLIA.WBTC_VAULT);
    const aggregation_mode = medianMode();
    const res = await this.contract.get_data(data_type, aggregation_mode);
    const price = Number(res.price) / 10 ** Number(res.decimals);
    return price;
  }

  public async calculateAPY(): Promise<number> {
    return this.getSpotPriceWBTC();
  }

  public getVaultAddress(): string {
    return CONTRACTS.VESU.SEPOLIA.WBTC_VAULT;
  }
} 
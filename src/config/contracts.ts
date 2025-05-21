export const CONTRACTS = {
  EKUBO: {
    // Mainnet contracts for price feeds
    MAINNET: {
      ORACLE_EXTENSION: "0x005e470ff654d834983a46b8f29dfa99963d5044b993cb7b9c92243a69dab38f",
      CORE_CONTRACT: "0x00000005dd3d2f4429af886cd1a3b08289dbcea99a294197e9eb43b0e0325b4b",
      TOKENS: {
        WBTC: "0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac",
        ETH: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"
      }
    },
    // Sepolia contracts for vault operations
    SEPOLIA: {
      CORE_CONTRACT: "0x0201d5c1324da297fda9ac6197a5d8b49a0556ad27a64576fbaaab6573e3e59f",
      TOKENS: {
        WBTC: "0x00abbd6f1e590eb83addd87ba5ac27960d859b1f17d11a3c1cd6a0006704b141",
        ETH: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"
      }
    }
  },
  VESU: {
    SEPOLIA: {
      SINGLETON: "0x01ecab07456147a8de92b9273dd6789893401e8462a737431493980d9be6827",
      EXTENSION_PO: "0x0571efca8cae0e426cb7052dad04badded0855b4cd6c6f475639af3356bc33fe",
      EXTENSION_CL: "0x05005006d674f502ec74b498b07efca725aeb33da17861fb6a340485092f3fe6",
      ORACLE: "0x014af20afa8046eb473c5acf952b19755e5831654c2419538e2d1055b096665a",
      SUMMARY_STATS: "0x0379afb83d2f8e38ab08252750233665a812a24278aacdde52475618edbf879c",
      WBTC_VAULT: "0x00abbd6f1e590eb83addd87ba5ac27960d859b1f17d11a3c1cd6a0006704b141"
    }
  }
} as const;

// Mock data for development
export const MOCK_DATA = {
  EKUBO: {
    TWAP: {
      WBTC_ETH: 20.5, // 1 WBTC = 20.5 ETH
      VOLUME_24H: 1000000, // $1M daily volume
      TVL: 50000000 // $50M TVL
    }
  },
  VESU: {
    LENDING: {
      APY: 0.08, // 8% APY
      TVL: 30000000, // $30M TVL
      UTILIZATION_RATE: 0.75 // 75% utilization
    }
  }
} as const; 
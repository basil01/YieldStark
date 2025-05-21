import { getVesuAPR, getEkuboAPR, withdrawFromVault, depositToVault } from "./protocolActions";

const REBALANCE_THRESHOLD = 0.01; // 1% difference to trigger rebalance

// TODO: Insert Vesu and Ekubo Oracle endpoints or contract addresses/ABIs here
// Example:
// const VESU_ORACLE_ENDPOINT = "https://api.pragmaoracle.com/vesu/apr";
// const EKUBO_ORACLE_ENDPOINT = "https://api.ekubo.com/apr";
// const VESU_VAULT_ADDRESS = "0x...";
// const EKUBO_VAULT_ADDRESS = "0x...";
// const VAULT_ABI = [ ... ];

export class YieldStarkStrategy {
  private currentProtocol: "vesu" | "ekubo" = "vesu";

  async run() {
    // 1. Fetch APRs
    const vesuAPR = await getVesuAPR(/* pass endpoint or contract info here if needed */);
    const ekuboAPR = await getEkuboAPR(/* pass endpoint or contract info here if needed */);

    // 2. Compare yields
    let target: "vesu" | "ekubo" = vesuAPR > ekuboAPR + REBALANCE_THRESHOLD ? "vesu" : "ekubo";
    let current: "vesu" | "ekubo" = this.currentProtocol;

    // 3. Rebalance if needed
    if (current !== target) {
      await withdrawFromVault(current /*, vault address/ABI if needed */);
      await depositToVault(target /*, vault address/ABI if needed */);
      this.currentProtocol = target;
      console.log(`Rebalanced from ${current} to ${target}`);
    } else {
      console.log("No rebalance needed.");
    }
  }
}

export default YieldStarkStrategy; 
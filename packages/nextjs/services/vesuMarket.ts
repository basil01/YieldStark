export const fetchWBTCMarket = async () => {
  const res = await fetch("https://api.vesu.xyz/markets");
  const data = await res.json();
  // Find the wBTC market (adjust symbol if needed)
  return data.find((market) => market.symbol === "wBTC");
}; 
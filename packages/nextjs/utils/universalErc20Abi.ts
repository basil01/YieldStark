export const universalErc20Abi = [
  {
    "name": "balanceOf",
    "type": "function",
    "inputs": [{ "name": "account", "type": "felt" }],
    "outputs": [{ "name": "balance", "type": "felt" }],
    "stateMutability": "view"
  },
    {
      type: "function",
      name: "approve",
      inputs: [
        { name: "spender", type: "felt" },
        { name: "amount", type: "Uint256" },
      ],
      outputs: [],
    },
    {
      type: "function",
      name: "transfer",
      inputs: [
        { name: "recipient", type: "felt" },
        { name: "amount", type: "Uint256" },
      ],
      outputs: [],
    },
    {
      type: "function",
      name: "decimals",
      inputs: [],
      outputs: [{ type: "felt" }],
    },
  ];
  
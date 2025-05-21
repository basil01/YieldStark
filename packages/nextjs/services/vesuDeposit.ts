import { Contract, RpcProvider, AccountInterface, uint256, TypedData, Signature } from "starknet";

// Contract addresses for Sepolia (verified deployed contracts)
const WBTC_ADDRESS = "0x00abbd6f1e590eb83addd87ba5ac27960d859b1f17d11a3c1cd6a0006704b141";
const VWBTC_ADDRESS = "0x076ce66eba78210a836fca94ab91828c0f6941ad88585a700f3e473a9b4af870";

// ABI for WBTC
const WBTC_ABI = [
  {
    name: 'approve',
    type: 'function',
    inputs: [
      { name: 'spender', type: 'felt252' },
      { name: 'amount', type: 'Uint256' }
    ],
    outputs: [{ name: 'success', type: 'bool' }],
    state_mutability: 'external'
  },
  {
    name: 'balanceOf',
    type: 'function',
    inputs: [{ name: 'account', type: 'felt252' }],
    outputs: [{ name: 'balance', type: 'Uint256' }],
    state_mutability: 'view'
  },
  {
    name: 'allowance',
    type: 'function',
    inputs: [
      { name: 'owner', type: 'felt252' },
      { name: 'spender', type: 'felt252' }
    ],
    outputs: [{ name: 'remaining', type: 'Uint256' }],
    state_mutability: 'view'
  }
];

// ABI for vWBTC (vToken)
const VWBTC_ABI = [
  {
    name: 'deposit',
    type: 'function',
    inputs: [
      { name: 'assets', type: 'Uint256' },
      { name: 'receiver', type: 'felt252' }
    ],
    outputs: [{ name: 'shares', type: 'Uint256' }],
    state_mutability: 'external'
  },
  {
    name: 'preview_deposit',
    type: 'function',
    inputs: [{ name: 'assets', type: 'Uint256' }],
    outputs: [{ name: 'shares', type: 'Uint256' }],
    state_mutability: 'view'
  },
  {
    name: 'asset',
    type: 'function',
    inputs: [],
    outputs: [{ name: 'asset', type: 'felt252' }],
    state_mutability: 'view'
  }
];

const getProvider = () => {
  return new RpcProvider({
    nodeUrl: 'https://starknet-sepolia.public.blastapi.io'
  });
};

export const requestSignature = async (account: AccountInterface, amount: bigint): Promise<Signature> => {
  const typedData: TypedData = {
    types: {
      StarkNetDomain: [
        { name: 'name', type: 'felt' },
        { name: 'version', type: 'felt' },
        { name: 'chainId', type: 'felt' }
      ],
      Deposit: [
        { name: 'action', type: 'felt' },
        { name: 'amount', type: 'felt' },
        { name: 'vToken', type: 'felt' },
        { name: 'receiver', type: 'felt' }
      ]
    },
    primaryType: 'Deposit',
    domain: {
      name: 'Vesu Deposit',
      version: '1',
      chainId: '0x534e5f5345504f4c4941' // SN_SEPOLIA in hex
    },
    message: {
      action: 'deposit',
      amount: amount.toString(),
      vToken: VWBTC_ADDRESS,
      receiver: account.address
    }
  };

  const signature = await account.signMessage(typedData);
  return signature;
};

export const getWBTCBalance = async (account: AccountInterface): Promise<string> => {
  const provider = getProvider();
  const wbtcContract = new Contract(WBTC_ABI, WBTC_ADDRESS, provider);
  const balance = await wbtcContract.balanceOf(account.address);
  return (Number(balance) / 1e8).toString();
};

export const approveWBTC = async (account: AccountInterface, amount: bigint): Promise<string> => {
  const provider = getProvider();
  const wbtcContract = new Contract(WBTC_ABI, WBTC_ADDRESS, provider);
  wbtcContract.connect(account);
  
  const allowance = await wbtcContract.allowance(account.address, VWBTC_ADDRESS);
  if (allowance >= amount) {
    return 'already_approved';
  }
  
  const { transaction_hash } = await wbtcContract.approve(
    VWBTC_ADDRESS,
    uint256.bnToUint256(amount)
  );
  
  return transaction_hash;
};

export const depositToVesu = async (account: AccountInterface, amount: bigint): Promise<string> => {
  // First request signature
  await requestSignature(account, amount);
  
  const provider = getProvider();
  const vwbtcContract = new Contract(VWBTC_ABI, VWBTC_ADDRESS, provider);
  vwbtcContract.connect(account);
  
  const assetAddress = await vwbtcContract.asset();
  if (assetAddress !== WBTC_ADDRESS) {
    throw new Error('Invalid vToken asset address');
  }
  
  const { transaction_hash } = await vwbtcContract.deposit(
    uint256.bnToUint256(amount),
    account.address
  );
  
  return transaction_hash;
};

export const testContractConnection = async (account: AccountInterface): Promise<boolean> => {
  try {
    const provider = getProvider();
    
    const wbtcContract = new Contract(WBTC_ABI, WBTC_ADDRESS, provider);
    await wbtcContract.balanceOf(account.address);
    
    const vwbtcContract = new Contract(VWBTC_ABI, VWBTC_ADDRESS, provider);
    await vwbtcContract.asset();
    
    return true;
  } catch (error) {
    return false;
  }
}; 
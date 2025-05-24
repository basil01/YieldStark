import { Contract, RpcProvider } from 'starknet';
import { CONTRACTS } from '../config/contracts';

export interface Position {
  protocol: 'vesu' | 'ekubo';
  amount: string;
  timestamp: number;
  apr: number;
  profit: string;
}

export class PositionTracker {
  private static instance: PositionTracker;
  private provider: RpcProvider;
  private positions: Map<string, Position[]>;

  private constructor() {
    this.provider = new RpcProvider({ nodeUrl: "https://starknet-sepolia.public.blastapi.io/rpc/v0_6" });
    this.positions = new Map();
  }

  public static getInstance(): PositionTracker {
    if (!PositionTracker.instance) {
      PositionTracker.instance = new PositionTracker();
    }
    return PositionTracker.instance;
  }

  public async addPosition(address: string, protocol: 'vesu' | 'ekubo', amount: string, apr: number) {
    const position: Position = {
      protocol,
      amount,
      timestamp: Date.now(),
      apr,
      profit: '0'
    };

    const userPositions = this.positions.get(address) || [];
    userPositions.push(position);
    this.positions.set(address, userPositions);
    console.log('Added position:', position);
    console.log('Current positions for address:', address, this.positions.get(address));
  }

  public async getPositions(address: string): Promise<Position[]> {
    const positions = this.positions.get(address) || [];
    console.log('Getting positions for address:', address, positions);
    return positions;
  }

  public async calculateProfit(address: string): Promise<{ vesu: string; ekubo: string }> {
    const positions = await this.getPositions(address);
    const now = Date.now();

    const profits = positions.reduce((acc, pos) => {
      const timeInYears = (now - pos.timestamp) / (1000 * 60 * 60 * 24 * 365);
      const profit = (parseFloat(pos.amount) * pos.apr * timeInYears).toString();
      
      if (pos.protocol === 'vesu') {
        acc.vesu = (parseFloat(acc.vesu) + parseFloat(profit)).toString();
      } else {
        acc.ekubo = (parseFloat(acc.ekubo) + parseFloat(profit)).toString();
      }
      
      return acc;
    }, { vesu: '0', ekubo: '0' });

    console.log('Calculated profits:', profits);
    return profits;
  }

  public async getTotalDeposited(address: string): Promise<{ vesu: string; ekubo: string }> {
    const positions = await this.getPositions(address);
    
    const totals = positions.reduce((acc, pos) => {
      if (pos.protocol === 'vesu') {
        acc.vesu = (parseFloat(acc.vesu) + parseFloat(pos.amount)).toString();
      } else {
        acc.ekubo = (parseFloat(acc.ekubo) + parseFloat(pos.amount)).toString();
      }
      return acc;
    }, { vesu: '0', ekubo: '0' });

    console.log('Total deposited:', totals);
    return totals;
  }
} 
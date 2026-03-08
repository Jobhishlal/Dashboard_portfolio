export interface Stock {
  id: string
  symbol: string
  name: string
  purchasePrice: number
  quantity: number
  exchange: 'NSE' | 'BSE'
  sector: string
  cmp: number
  peRatio: number
  eps: number
  investment?: number
  portfolioPercentage?: number
  presentValue?: number
  gainLoss?: number
}

export interface PortfolioSummary {
  totalInvestment: number
  currentValue: number
  totalGainLoss: number
  totalGainLossPercentage: number
  bestPerformingStock: {
    symbol: string
    gainPercentage: number
  }
}

export interface SectorAllocation {
  name: string
  value: number
  color: string
}

export interface PerformanceData {
  month: string
  value: number
  investment: number
}

export const initialHoldings: Stock[] = [
  {
    id: '1',
    symbol: 'RELIANCE',
    name: 'Reliance Industries',
    purchasePrice: 2450.5,
    quantity: 100,
    exchange: 'NSE',
    sector: 'Energy',
    cmp: 2950.0,
    peRatio: 28.5,
    eps: 103.4,
  },
  {
    id: '2',
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    purchasePrice: 3200.0,
    quantity: 50,
    exchange: 'NSE',
    sector: 'Technology',
    cmp: 4100.25,
    peRatio: 32.1,
    eps: 127.8,
  },
  {
    id: '3',
    symbol: 'HDFCBANK',
    name: 'HDFC Bank',
    purchasePrice: 1650.0,
    quantity: 200,
    exchange: 'NSE',
    sector: 'Finance',
    cmp: 1420.5,
    peRatio: 15.2,
    eps: 93.5,
  },
  {
    id: '4',
    symbol: 'INFY',
    name: 'Infosys',
    purchasePrice: 1450.75,
    quantity: 150,
    exchange: 'NSE',
    sector: 'Technology',
    cmp: 1680.0,
    peRatio: 24.8,
    eps: 67.2,
  },
  {
    id: '5',
    symbol: 'ITC',
    name: 'ITC Limited',
    purchasePrice: 380.0,
    quantity: 500,
    exchange: 'NSE',
    sector: 'Consumer',
    cmp: 425.6,
    peRatio: 26.4,
    eps: 16.1,
  },
  {
    id: '6',
    symbol: 'BHARTIARTL',
    name: 'Bharti Airtel',
    purchasePrice: 850.0,
    quantity: 120,
    exchange: 'NSE',
    sector: 'Technology',
    cmp: 1150.0,
    peRatio: 45.2,
    eps: 25.4,
  },
  {
    id: '7',
    symbol: 'ASIANPAINT',
    name: 'Asian Paints',
    purchasePrice: 3100.0,
    quantity: 40,
    exchange: 'NSE',
    sector: 'Consumer',
    cmp: 2850.0,
    peRatio: 52.1,
    eps: 54.7,
  },
  {
    id: '8',
    symbol: 'BAJFINANCE',
    name: 'Bajaj Finance',
    purchasePrice: 6500.0,
    quantity: 25,
    exchange: 'NSE',
    sector: 'Finance',
    cmp: 7200.0,
    peRatio: 38.5,
    eps: 187.0,
  },
]

export const sectorColors: Record<string, string> = {
  Technology: '#3b82f6',
  Finance: '#8b5cf6', 
  Energy: '#f59e0b', 
  Healthcare: '#10b981',
  Consumer: '#ec4899',
}

export const performanceTimeline: PerformanceData[] = [
  { month: 'Jan', value: 1150000, investment: 1100000 },
  { month: 'Feb', value: 1180000, investment: 1100000 },
  { month: 'Mar', value: 1120000, investment: 1100000 },
  { month: 'Apr', value: 1250000, investment: 1150000 },
  { month: 'May', value: 1280000, investment: 1150000 },
  { month: 'Jun', value: 1350000, investment: 1200000 },
  { month: 'Jul', value: 1420000, investment: 1200000 },
  { month: 'Aug', value: 1380000, investment: 1200000 },
  { month: 'Sep', value: 1450000, investment: 1250000 },
  { month: 'Oct', value: 1410000, investment: 1250000 },
  { month: 'Nov', value: 1520000, investment: 1250000 },
  { month: 'Dec', value: 1585000, investment: 1250000 },
]

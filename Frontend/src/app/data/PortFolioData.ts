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
  // Financial Sector
  { id: '1', symbol: 'HDFCBANK', name: 'HDFC Bank', exchange: 'NSE', sector: 'Financial Sector', purchasePrice: 0, quantity: 0, cmp: 0, peRatio: 0, eps: 0 },
  { id: '2', symbol: 'BAJFINANCE', name: 'Bajaj Finance', exchange: 'NSE', sector: 'Financial Sector', purchasePrice: 0, quantity: 0, cmp: 0, peRatio: 0, eps: 0 },
  { id: '3', symbol: 'ICICIBANK', name: 'ICICI Bank', exchange: 'NSE', sector: 'Financial Sector', purchasePrice: 0, quantity: 0, cmp: 0, peRatio: 0, eps: 0 },
  { id: '4', symbol: 'BAJAJHFL', name: 'Bajaj Housing Finance', exchange: 'NSE', sector: 'Financial Sector', purchasePrice: 0, quantity: 0, cmp: 0, peRatio: 0, eps: 0 },
  { id: '5', symbol: 'SAVANI', name: 'Savani Financials', exchange: 'NSE', sector: 'Financial Sector', purchasePrice: 0, quantity: 0, cmp: 0, peRatio: 0, eps: 0 },
  
  // Tech Sector
  { id: '6', symbol: 'AFFLE', name: 'Affle India', exchange: 'NSE', sector: 'Tech Sector', purchasePrice: 0, quantity: 0, cmp: 0, peRatio: 0, eps: 0 },
  { id: '7', symbol: 'LTIM', name: 'LTI Mindtree', exchange: 'NSE', sector: 'Tech Sector', purchasePrice: 0, quantity: 0, cmp: 0, peRatio: 0, eps: 0 },
  { id: '8', symbol: 'KPITTECH', name: 'KPIT Tech', exchange: 'NSE', sector: 'Tech Sector', purchasePrice: 0, quantity: 0, cmp: 0, peRatio: 0, eps: 0 },
  { id: '9', symbol: 'TATATECH', name: 'Tata Tech', exchange: 'NSE', sector: 'Tech Sector', purchasePrice: 0, quantity: 0, cmp: 0, peRatio: 0, eps: 0 },
  { id: '10', symbol: 'BLSE', name: 'BLS E-Services', exchange: 'NSE', sector: 'Tech Sector', purchasePrice: 0, quantity: 0, cmp: 0, peRatio: 0, eps: 0 },
  { id: '11', symbol: 'TANLA', name: 'Tanla Platforms', exchange: 'NSE', sector: 'Tech Sector', purchasePrice: 0, quantity: 0, cmp: 0, peRatio: 0, eps: 0 },
  
  // Consumer
  { id: '12', symbol: 'DMART', name: 'Avenue Supermarts (Dmart)', exchange: 'NSE', sector: 'Consumer', purchasePrice: 0, quantity: 0, cmp: 0, peRatio: 0, eps: 0 },
  { id: '13', symbol: 'TATACONSUM', name: 'Tata Consumer Products', exchange: 'NSE', sector: 'Consumer', purchasePrice: 0, quantity: 0, cmp: 0, peRatio: 0, eps: 0 },
  { id: '14', symbol: 'PIDILITIND', name: 'Pidilite Industries', exchange: 'NSE', sector: 'Consumer', purchasePrice: 0, quantity: 0, cmp: 0, peRatio: 0, eps: 0 },
  
  // Power
  { id: '15', symbol: 'TATAPOWER', name: 'Tata Power', exchange: 'NSE', sector: 'Power', purchasePrice: 0, quantity: 0, cmp: 0, peRatio: 0, eps: 0 },
  { id: '16', symbol: 'KPIGREEN', name: 'KPI Green Energy', exchange: 'NSE', sector: 'Power', purchasePrice: 0, quantity: 0, cmp: 0, peRatio: 0, eps: 0 },
  { id: '17', symbol: 'SUZLON', name: 'Suzlon Energy', exchange: 'NSE', sector: 'Power', purchasePrice: 0, quantity: 0, cmp: 0, peRatio: 0, eps: 0 },
  { id: '18', symbol: 'GENSOL', name: 'Gensol Engineering', exchange: 'NSE', sector: 'Power', purchasePrice: 0, quantity: 0, cmp: 0, peRatio: 0, eps: 0 },
  
  // Pipe Sector
  { id: '19', symbol: 'HARIOMPIPE', name: 'Hariom Pipe Industries', exchange: 'NSE', sector: 'Pipe Sector', purchasePrice: 0, quantity: 0, cmp: 0, peRatio: 0, eps: 0 },
  { id: '20', symbol: 'ASTRAL', name: 'Astral Limited', exchange: 'NSE', sector: 'Pipe Sector', purchasePrice: 0, quantity: 0, cmp: 0, peRatio: 0, eps: 0 },
  { id: '21', symbol: 'POLYCAB', name: 'Polycab India', exchange: 'NSE', sector: 'Pipe Sector', purchasePrice: 0, quantity: 0, cmp: 0, peRatio: 0, eps: 0 },
  
  // Others
  { id: '22', symbol: 'CLEAN', name: 'Clean Science & Technology', exchange: 'NSE', sector: 'Others', purchasePrice: 0, quantity: 0, cmp: 0, peRatio: 0, eps: 0 },
]

export const sectorColors: Record<string, string> = {
  'Financial Sector': '#8b5cf6', // Deep Purple
  'Finance': '#9333ea',          // Bright Purple
  'Tech Sector': '#0ea5e9',      // Sky Blue
  'Technology': '#2563eb',       // Royal Blue
  'Consumer': '#db2777',         // Pink
  'Power': '#eab308',            // Gold/Yellow
  'Pipe Sector': '#059669',      // Dark Emerald
  'Pipe': '#10b981',             // Emerald Green
  'Others': '#475569',           // Slate
  'Energy': '#f97316',           // Orange
  'Healthcare': '#dc2626',       // Red
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

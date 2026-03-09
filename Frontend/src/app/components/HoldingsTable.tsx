import React, { useMemo, useState, memo } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpDownIcon, ChevronUpIcon, ChevronDownIcon, LayersIcon } from 'lucide-react'
import { Stock } from '../data/PortFolioData'
import { formatCurrency, formatPercentage, formatNumber } from '../utils/Formatters'

interface HoldingsTableProps {
  holdings: Stock[]
  totalValue: number
  currentPage: number
  totalPages: number
  totalItems: number
  onPageChange: (page: number) => void
}

type SortField =
  | keyof Stock
  | 'investment'
  | 'presentValue'
  | 'gainLoss'
  | 'portfolioPct'
  
type SortDirection = 'asc' | 'desc'

export const HoldingsTable = memo(function HoldingsTable({ 
  holdings, 
  totalValue, 
  currentPage, 
  totalPages, 
  totalItems, 
  onPageChange 
}: HoldingsTableProps) {
  const [sortField, setSortField] = useState<SortField>('presentValue')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [groupBySector, setGroupBySector] = useState(true)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const sortedHoldings = useMemo(() => {
    return [...holdings].sort((a, b) => {
      let aValue: any
      let bValue: any
      
      const aInvestment = a.investment ?? (a.purchasePrice * a.quantity)
      const bInvestment = b.investment ?? (b.purchasePrice * b.quantity)
      
      const aPresentValue = a.presentValue ?? (a.cmp * a.quantity)
      const bPresentValue = b.presentValue ?? (b.cmp * b.quantity)

      const aPct = a.portfolioPercentage ?? ((aPresentValue / totalValue) * 100 || 0)
      const bPct = b.portfolioPercentage ?? ((bPresentValue / totalValue) * 100 || 0)

      switch (sortField) {
        case 'investment':
          aValue = aInvestment
          bValue = bInvestment
          break
        case 'presentValue':
          aValue = aPresentValue
          bValue = bPresentValue
          break
        case 'gainLoss':
          aValue = a.gainLoss ?? (aPresentValue - aInvestment)
          bValue = b.gainLoss ?? (bPresentValue - bInvestment)
          break
        case 'portfolioPct':
          aValue = aPct
          bValue = bPct
          break
        default:
          aValue = a[sortField]
          bValue = b[sortField]
      }
      if (aValue === bValue) return 0
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      }
      return aValue < bValue ? 1 : -1
    })
  }, [holdings, sortField, sortDirection, totalValue])

  const groupedHoldings = useMemo(() => {
    if (!groupBySector) return null;
    
    const groups: Record<string, {
      sector: string;
      stocks: Stock[];
      totalInvestment: number;
      totalPresentValue: number;
      totalGainLoss: number;
    }> = {};

    sortedHoldings.forEach(stock => {
      const sector = stock.sector || 'Uncategorized';
      if (!groups[sector]) {
        groups[sector] = { sector, stocks: [], totalInvestment: 0, totalPresentValue: 0, totalGainLoss: 0 };
      }
      
      const investment = stock.investment ?? (stock.purchasePrice * stock.quantity);
      const presentValue = stock.presentValue ?? (stock.cmp * stock.quantity);
      const gainLoss = stock.gainLoss ?? (presentValue - investment);
      
      groups[sector].stocks.push(stock);
      groups[sector].totalInvestment += investment;
      groups[sector].totalPresentValue += presentValue;
      groups[sector].totalGainLoss += gainLoss;
    });
    
    return Object.values(groups).sort((a,b) => b.totalPresentValue - a.totalPresentValue);
  }, [sortedHoldings, groupBySector])

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDownIcon className="w-3 h-3 ml-1 text-fintech-muted opacity-50" />
    return sortDirection === 'asc' ? (
      <ChevronUpIcon className="w-3 h-3 ml-1 text-fintech-accent" />
    ) : (
      <ChevronDownIcon className="w-3 h-3 ml-1 text-fintech-accent" />
    )
  }

  const thClass =
    'px-4 py-3 text-xs font-semibold text-fintech-muted uppercase tracking-wider cursor-pointer hover:text-white transition-colors bg-fintech-bg/50 backdrop-blur-md sticky top-0'

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
      <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/20">
        <h3 className="text-xl font-bold text-white tracking-tight">Active Holdings</h3>
        <button
          onClick={() => setGroupBySector(!groupBySector)}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
            groupBySector 
              ? 'bg-fintech-accent/20 text-fintech-accent border border-fintech-accent/30 hover:bg-fintech-accent/30' 
              : 'bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700'
          }`}
        >
          <LayersIcon className="w-4 h-4" />
          {groupBySector ? 'Ungroup' : 'Group by Sector'}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1200px]">
          <thead className="bg-fintech-bg/80 sticky top-0 z-10 backdrop-blur-sm">
            <tr>
              <th className={thClass} onClick={() => handleSort('symbol')}>
                <div className="flex items-center">
                  Particulars <SortIcon field="symbol" />
                </div>
              </th>
              <th className={`${thClass} text-right`} onClick={() => handleSort('purchasePrice')}>
                <div className="flex items-center justify-end">
                  Purchase Price <SortIcon field="purchasePrice" />
                </div>
              </th>
              <th className={`${thClass} text-right`} onClick={() => handleSort('quantity')}>
                <div className="flex items-center justify-end">
                  Quantity (Qty) <SortIcon field="quantity" />
                </div>
              </th>
              <th className={`${thClass} text-right`} onClick={() => handleSort('investment')}>
                <div className="flex items-center justify-end">
                  Investment <SortIcon field="investment" />
                </div>
              </th>
              <th className={`${thClass} text-right`} onClick={() => handleSort('portfolioPct')}>
                <div className="flex items-center justify-end">
                  Portfolio (%) <SortIcon field="portfolioPct" />
                </div>
              </th>
              <th className={`${thClass} text-right`} onClick={() => handleSort('exchange')}>
                <div className="flex items-center justify-end">
                  NSE/BSE <SortIcon field="exchange" />
                </div>
              </th>
              <th className={`${thClass} text-right`} onClick={() => handleSort('cmp')}>
                <div className="flex items-center justify-end">
                  CMP <SortIcon field="cmp" />
                </div>
              </th>
              <th className={`${thClass} text-right`} onClick={() => handleSort('presentValue')}>
                <div className="flex items-center justify-end">
                  Present Value <SortIcon field="presentValue" />
                </div>
              </th>
              <th className={`${thClass} text-right`} onClick={() => handleSort('gainLoss')}>
                <div className="flex items-center justify-end">
                  Gain/Loss <SortIcon field="gainLoss" />
                </div>
              </th>
              <th className={`${thClass} text-right`} onClick={() => handleSort('peRatio')}>
                <div className="flex items-center justify-end">
                  P/E Ratio <SortIcon field="peRatio" />
                </div>
              </th>
              <th className={`${thClass} text-right`} onClick={() => handleSort('eps')}>
                <div className="flex items-center justify-end">
                  Latest Earnings <SortIcon field="eps" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-fintech-border font-mono text-sm">
            {groupBySector && groupedHoldings ? (
              groupedHoldings.map((group) => (
                <React.Fragment key={group.sector}>
                  <tr className="bg-zinc-800/40 border-b border-t border-zinc-700/50">
                    <td className="px-4 py-3 whitespace-nowrap" colSpan={3}>
                      <span className="font-bold text-fintech-accent uppercase tracking-wider text-xs bg-fintech-accent/10 px-3 py-1.5 rounded-md">
                        {group.sector}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-fintech-text font-bold">
                      {formatCurrency(group.totalInvestment)}
                    </td>
                    <td colSpan={3}></td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-fintech-text font-bold">
                      {formatCurrency(group.totalPresentValue)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className={`flex flex-col items-end ${group.totalGainLoss >= 0 ? 'text-fintech-profit' : 'text-fintech-loss'}`}>
                        <span className="font-bold">{formatCurrency(group.totalGainLoss)}</span>
                      </div>
                    </td>
                    <td colSpan={2}></td>
                  </tr>
                  {group.stocks.map((stock, index) => {
                    const investment = stock.investment ?? (stock.purchasePrice * stock.quantity)
                    const presentValue = stock.presentValue ?? (stock.cmp * stock.quantity)
                    const gainLoss = stock.gainLoss ?? (presentValue - investment)
                    const isProfit = gainLoss >= 0
                    const portfolioPct = stock.portfolioPercentage ?? ((presentValue / totalValue) * 100 || 0)
                    
                    return (
                      <motion.tr
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        key={`${group.sector}-${stock.id || stock.symbol}`}
                        className="hover:bg-fintech-bg/40 transition-colors group"
                      >
                        <td className="px-4 py-4 whitespace-nowrap pl-8">
                          <div className="flex flex-col font-sans">
                            <span className="font-semibold text-fintech-text">
                              {stock.name || stock.symbol}
                            </span>
                            <span className="text-xs text-fintech-muted truncate max-w-[150px] font-mono mt-0.5">
                              {stock.symbol}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-fintech-text">
                          {formatCurrency(stock.purchasePrice)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-fintech-text">
                          {formatNumber(stock.quantity)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-fintech-text font-medium">
                          {formatCurrency(investment)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-fintech-text">{portfolioPct.toFixed(2)}%</span>
                            <div className="w-12 h-1.5 bg-fintech-bg rounded-full overflow-hidden hidden sm:block">
                              <div
                                className="h-full bg-fintech-accent rounded-full"
                                style={{ width: `${Math.min(portfolioPct, 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right">
                          <span className="text-[10px] px-2 py-1 rounded bg-zinc-800 text-fintech-muted font-bold tracking-wider">
                            {stock.exchange}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-fintech-text font-medium">
                          {formatCurrency(stock.cmp)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-fintech-text font-medium">
                          {formatCurrency(presentValue)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right">
                          <div className={`flex flex-col items-end ${isProfit ? 'text-fintech-profit' : 'text-fintech-loss'}`}>
                            <span className="font-medium">{formatCurrency(gainLoss)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-fintech-text">
                          {stock.peRatio ? stock.peRatio.toFixed(2) : '-'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-fintech-text">
                          {stock.eps ? stock.eps.toFixed(2) : '-'}
                        </td>
                      </motion.tr>
                    )
                  })}
                </React.Fragment>
              ))
            ) : (
              sortedHoldings.map((stock, index) => {
                const investment = stock.investment ?? (stock.purchasePrice * stock.quantity)
                const presentValue = stock.presentValue ?? (stock.cmp * stock.quantity)
                const gainLoss = stock.gainLoss ?? (presentValue - investment)
                const isProfit = gainLoss >= 0
                const portfolioPct = stock.portfolioPercentage ?? ((presentValue / totalValue) * 100 || 0)
                
                return (
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={`all-${stock.id || stock.symbol}`}
                    className="hover:bg-fintech-bg/40 transition-colors group"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex flex-col font-sans">
                        <span className="font-semibold text-fintech-text">
                          {stock.name || stock.symbol}
                        </span>
                        <span className="text-xs text-fintech-muted truncate max-w-[150px] font-mono mt-0.5">
                          {stock.symbol}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-fintech-text">
                      {formatCurrency(stock.purchasePrice)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-fintech-text">
                      {formatNumber(stock.quantity)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-fintech-text font-medium">
                      {formatCurrency(investment)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-fintech-text">{portfolioPct.toFixed(2)}%</span>
                        <div className="w-12 h-1.5 bg-fintech-bg rounded-full overflow-hidden hidden sm:block">
                          <div
                            className="h-full bg-fintech-accent rounded-full"
                            style={{ width: `${Math.min(portfolioPct, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <span className="text-[10px] px-2 py-1 rounded bg-zinc-800 text-fintech-muted font-bold tracking-wider">
                        {stock.exchange}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-fintech-text font-medium">
                      {formatCurrency(stock.cmp)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-fintech-text font-medium">
                      {formatCurrency(presentValue)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <div className={`flex flex-col items-end ${isProfit ? 'text-fintech-profit' : 'text-fintech-loss'}`}>
                        <span className="font-medium">{formatCurrency(gainLoss)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-fintech-text">
                      {stock.peRatio ? stock.peRatio.toFixed(2) : '-'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-fintech-text">
                      {stock.eps ? stock.eps.toFixed(2) : '-'}
                    </td>
                  </motion.tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-4 bg-zinc-950/20">
        <div className="text-sm text-fintech-muted">
          Showing <span className="text-white font-medium">{holdings.length}</span> of <span className="text-white font-medium">{totalItems}</span> assets
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-xs font-bold"
          >
            Previous
          </button>
          
          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              // Only show a subset of pages if there are many
              if (totalPages > 5) {
                if (pageNum !== 1 && pageNum !== totalPages && Math.abs(pageNum - currentPage) > 1) {
                  if (pageNum === 2 || pageNum === totalPages - 1) return <span key={pageNum} className="text-zinc-600 px-1">...</span>;
                  return null;
                }
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all border ${
                    currentPage === pageNum 
                      ? 'bg-fintech-accent text-white border-fintech-accent shadow-lg shadow-fintech-accent/20' 
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white hover:bg-zinc-700'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-xs font-bold"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
})

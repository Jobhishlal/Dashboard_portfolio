import React, { Children } from 'react'
import { motion, Variants } from 'framer-motion'
import {
  WalletIcon,
  BarChart3Icon,
  TrendingUpIcon,
  TrendingDownIcon,
  StarIcon,
} from 'lucide-react'
import { PortfolioSummary } from '../data/PortFolioData'
import { formatCurrency, formatPercentage } from '../utils/Formatters'
interface SummaryCardsProps {
  summary: PortfolioSummary
}
export function SummaryCards({ summary }: SummaryCardsProps) {
  const isProfit = summary.totalGainLoss >= 0
  const container: Variants = {
    hidden: {
      opacity: 0,
    },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }
  const item: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
  }
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
    >
      {/* Total Investment */}
      <motion.div
        variants={item}
        className="bg-fintech-card rounded-xl p-6 border border-fintech-border shadow-lg shadow-black/20"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium text-fintech-muted mb-1">
              Total Investment
            </p>
            <h3 className="text-2xl font-bold text-fintech-text">
              {formatCurrency(summary.totalInvestment)}
            </h3>
          </div>
          <div className="p-3 bg-fintech-bg rounded-lg text-fintech-accent">
            <WalletIcon className="w-6 h-6" />
          </div>
        </div>
      </motion.div>

      {/* Current Value */}
      <motion.div
        variants={item}
        className="bg-fintech-card rounded-xl p-6 border border-fintech-border shadow-lg shadow-black/20"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium text-fintech-muted mb-1">
              Current Value
            </p>
            <h3 className="text-2xl font-bold text-fintech-text">
              {formatCurrency(summary.currentValue)}
            </h3>
          </div>
          <div className="p-3 bg-fintech-bg rounded-lg text-purple-500">
            <BarChart3Icon className="w-6 h-6" />
          </div>
        </div>
      </motion.div>

      {/* Total Gain/Loss */}
      <motion.div
        variants={item}
        className="bg-fintech-card rounded-xl p-6 border border-fintech-border shadow-lg shadow-black/20"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium text-fintech-muted mb-1">
              Total P&L
            </p>
            <h3
              className={`text-2xl font-bold ${isProfit ? 'text-fintech-profit' : 'text-fintech-loss'}`}
            >
              {formatCurrency(summary.totalGainLoss)}
            </h3>
          </div>
          <div
            className={`p-3 rounded-lg ${isProfit ? 'bg-fintech-profitBg text-fintech-profit' : 'bg-fintech-lossBg text-fintech-loss'}`}
          >
            {isProfit ? (
              <TrendingUpIcon className="w-6 h-6" />
            ) : (
              <TrendingDownIcon className="w-6 h-6" />
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span
            className={`text-sm font-medium ${isProfit ? 'text-fintech-profit' : 'text-fintech-loss'}`}
          >
            {formatPercentage(summary.totalGainLossPercentage)}
          </span>
          <span className="text-xs text-fintech-muted">All time</span>
        </div>
      </motion.div>

      {/* Best Performing */}
      <motion.div
        variants={item}
        className="bg-fintech-card rounded-xl p-6 border border-fintech-border shadow-lg shadow-black/20"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium text-fintech-muted mb-1">
              Top Performer
            </p>
            <h3 className="text-2xl font-bold text-fintech-text">
              {summary.bestPerformingStock.symbol}
            </h3>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500">
            <StarIcon className="w-6 h-6" />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm font-medium text-fintech-profit">
            {formatPercentage(summary.bestPerformingStock.gainPercentage)}
          </span>
          <span className="text-xs text-fintech-muted">Return</span>
        </div>
      </motion.div>
    </motion.div>
  )
}

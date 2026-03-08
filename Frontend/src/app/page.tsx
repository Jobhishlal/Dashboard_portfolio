"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { performanceTimeline, Stock, PortfolioSummary, SectorAllocation, sectorColors } from './data/PortFolioData';
import { Navbar } from './components/Nabar';
import { SummaryCards } from './components/SummarryChart';
import { PerformanceChart } from './components/PerformanceChart';
import { SectorChart } from './components/SectorCharts';
import { HoldingsTable } from './components/HoldingsTable';
import { AddStockModal } from './components/AddStock';
import { PlusIcon, RefreshCwIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { portfolioService } from '../services/portfolioService';

export default function Dashboard() {
  const [holdings, setHoldings] = useState<Stock[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchHoldings();

    const intervalId = setInterval(() => {
      fetchHoldings();
    }, 15000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchHoldings = async () => {
    setIsRefreshing(true);
    try {
      const response = await portfolioService.getAllPortfolios();
      if (response && response.data) {
        setHoldings(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch holdings:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const summary = useMemo((): PortfolioSummary => {
    const totalInvestment = holdings.reduce((sum, s) => sum + (s.investment ?? (s.purchasePrice * s.quantity)), 0);
    const currentValue = holdings.reduce((sum, s) => sum + (s.presentValue ?? (s.cmp * s.quantity)), 0);
    const totalGainLoss = currentValue - totalInvestment;
    const totalGainLossPercentage = totalInvestment > 0 ? (totalGainLoss / totalInvestment) * 100 : 0;

    let bestStock = holdings[0];
    let maxGain = -Infinity;

    holdings.forEach(s => {
      const pGainLoss = s.gainLoss ?? ((s.cmp - s.purchasePrice) / s.purchasePrice) * 100;
      const gainPct = (pGainLoss / (s.investment ?? (s.purchasePrice * s.quantity))) * 100;
      
      if (gainPct > maxGain) {
        maxGain = gainPct;
        bestStock = s;
      }
    });

    return {
      totalInvestment,
      currentValue,
      totalGainLoss,
      totalGainLossPercentage,
      bestPerformingStock: {
        symbol: bestStock?.symbol || 'N/A',
        gainPercentage: maxGain === -Infinity || isNaN(maxGain) ? 0 : maxGain
      }
    };
  }, [holdings]);

  const sectorAllocation = useMemo((): SectorAllocation[] => {
    const sectors: Record<string, number> = {};
    const totalValue = holdings.reduce((sum, s) => sum + s.cmp * s.quantity, 0);

    holdings.forEach(s => {
      sectors[s.sector] = (sectors[s.sector] || 0) + (s.cmp * s.quantity);
    });

    return Object.entries(sectors).map(([name, value]) => ({
      name,
      value,
      color: sectorColors[name] || '#3b82f6'
    }));
  }, [holdings]);

  const handleAddStock = async (newStock: Omit<Stock, 'id' | 'cmp' | 'peRatio' | 'eps'>) => {
    // Call backend API (throws on error handled by modal)
    await portfolioService.createPortfolio({
      symbol: newStock.symbol,
      purchasePrice: newStock.purchasePrice,
      quantity: newStock.quantity,
      sector: newStock.sector,
      exchange: newStock.exchange,
    });

    // Refetch holdings from the backend so that Live CMP and calculations are updated fully
    await fetchHoldings();
    setIsModalOpen(false); // Close modal on success
  };

  return (
    <div className="min-h-screen bg-fintech-bg text-fintech-text pb-12">
      <Navbar />
      
      <main className="pt-24 px-8 max-w-[1600px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Executive Summary</h2>
            <p className="text-fintech-muted mt-1">Real-time portfolio performance and intelligence.</p>
          </div>
          <div className="flex items-center gap-4">
            {isRefreshing && (
              <div className="flex items-center text-sm font-medium text-fintech-muted animate-pulse">
                <RefreshCwIcon className="w-4 h-4 mr-2 animate-spin" /> Fetching latest data...
              </div>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-fintech-accent hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-xl shadow-fintech-accent/20 transition-all"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Add Asset</span>
            </motion.button>
          </div>
        </div>

        <SummaryCards summary={summary} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <PerformanceChart data={performanceTimeline} />
          </div>
          <div>
            <SectorChart data={sectorAllocation} totalValue={summary.currentValue} />
          </div>
        </div>

        <HoldingsTable holdings={holdings} totalValue={summary.currentValue} />
      </main>

      <AddStockModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddStock} 
      />
    </div>
  );
}

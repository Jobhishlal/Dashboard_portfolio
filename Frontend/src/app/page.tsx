"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Stock, PortfolioSummary, SectorAllocation, sectorColors } from './data/PortFolioData';
import { Navbar } from './components/Nabar';
import { SummaryCards } from './components/SummarryChart';
import { PerformanceChart } from './components/PerformanceChart';
import { SectorChart } from './components/SectorCharts';
import { HoldingsTable } from './components/HoldingsTable';
import { AddStockModal } from './components/AddStock';
import { DashboardSkeleton } from './components/DashboardSkeleton';
import { PlusIcon, RefreshCwIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { portfolioService } from '../services/portfolioService';

export default function Dashboard() {
  const [holdings, setHoldings] = useState<Stock[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit] = useState(10);

  const fetchHoldings = useCallback(async (isInitial = false, pageNum = currentPage) => {
    if (isInitial) setInitialLoading(true);
    else setIsRefreshing(true);
    setFetchError(null);
    try {
      const response = await portfolioService.getAllPortfolios(pageNum, limit);
      if (response && response.data) {
        setHoldings(response.data.data);
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.total);
        return true;
      }
      return false;
    } catch (error: any) {
      
      if (error.message !== fetchError) {
        console.error("Failed to fetch holdings:", error.message);
      }
      setFetchError(error.message || "Unable to connect to the server. Please check if the backend is running.");
      return false;
    } finally {
      setIsRefreshing(false);
      setInitialLoading(false);
    }
  }, [currentPage, limit, fetchError]);


   //refresh data every 15 seconds 
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
 
    const pollHoldings = async () => {
      const success = await fetchHoldings(false, currentPage);
     
      if (success) {
        timeoutId = setTimeout(pollHoldings, 15000); // 15 seconds
      } else {
        console.log("Polling paused due to connection error. Click 'Retry' to restart.");
      }
    };

    fetchHoldings(true, currentPage).then((success) => {
       if (success) {
         timeoutId = setTimeout(pollHoldings, 15000);
       }
    });

    return () => clearTimeout(timeoutId);
  }, [fetchHoldings, currentPage]);

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

  const dynamicPerformanceData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = [];
    const now = new Date();
    
    
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = months[d.getMonth()];
      
      const ratio = (11 - i) / 11; 

      const curve = Math.pow(ratio, 2);
      
      const simulatedValue = summary.totalInvestment + (summary.totalGainLoss * curve);
      
      data.push({
        month: monthStr,
        investment: summary.totalInvestment,
        value: summary.totalInvestment === 0 ? 0 : simulatedValue
      });
    }
    
    return data;
  }, [summary.totalInvestment, summary.totalGainLoss]);

  const handleAddStock = useCallback(async (newStock: Omit<Stock, 'id' | 'cmp' | 'peRatio' | 'eps'>) => {
  
    await portfolioService.createPortfolio({
      symbol: newStock.symbol,
      purchasePrice: newStock.purchasePrice,
      quantity: newStock.quantity,
      sector: newStock.sector,
      exchange: newStock.exchange,
    });


    await fetchHoldings();
    setIsModalOpen(false); 
  }, [fetchHoldings]);

  const handleCloseModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-fintech-bg text-fintech-text pb-12">
      <Navbar />
      
      <main className="pt-24 px-4 md:px-8 max-w-[1600px] mx-auto w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Executive Summary</h2>
            <p className="text-fintech-muted mt-1">Real-time portfolio performance and intelligence.</p>
          </div>
          <div className="flex items-center gap-4">
            
            {isRefreshing && !initialLoading && (
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

        {initialLoading ? (
           <DashboardSkeleton />
        ) : fetchError && holdings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-fintech-card/30 border border-fintech-border/50 rounded-2xl backdrop-blur-md">
            <div className="bg-red-500/10 p-4 rounded-full mb-4">
              <RefreshCwIcon className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Connection Failed</h3>
            <p className="text-fintech-muted mb-6 max-w-md text-center">
              {fetchError}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fetchHoldings(true)}
              className="bg-fintech-accent hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-fintech-accent/20"
            >
              Retry Connection
            </motion.button>
          </div>
        ) : (
          <>
            <SummaryCards summary={summary} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 w-full">
              <div className="lg:col-span-2 min-w-0 w-full">
                <PerformanceChart data={dynamicPerformanceData} />
              </div>
              <div className="min-w-0 w-full">
                <SectorChart data={sectorAllocation} totalValue={summary.currentValue} />
              </div>
            </div>

            <HoldingsTable 
              holdings={holdings} 
              totalValue={summary.currentValue} 
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              onPageChange={(page) => {
                setCurrentPage(page);
                fetchHoldings(false, page);
              }}
            />
          </>
        )}
      </main>

      <AddStockModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onAdd={handleAddStock} 
      />
    </div>
  );
}

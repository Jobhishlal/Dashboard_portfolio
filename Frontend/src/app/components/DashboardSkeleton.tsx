import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export const DashboardSkeleton = () => {
  // data fetching before laoding animation
  const shimmerVariants = {
    initial: { backgroundPosition: '-200% 0' },
    animate: {
      backgroundPosition: '200% 0',
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const blockClass = "relative overflow-hidden bg-[#16161a] border border-[#222226]";
  const shimmerEffect = "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent";

  return (
    <div className="w-full space-y-8 animate-in zoom-in duration-500">
      {/* Loading Overlay - Spinner & Message */}
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] pointer-events-none">
        <div className="bg-[#111114]/80 border border-[#222226] p-8 rounded-3xl flex flex-col items-center gap-4 shadow-2xl shadow-black/50 overflow-hidden relative group">
          {/* Subtle blue glow behind spinner */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full"></div>
          
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-12 h-12 text-[#3b82f6] drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
          </motion.div>
          
          <div className="text-center">
            <h3 className="text-white font-semibold text-lg tracking-wide">Fetching live market data</h3>
            <p className="text-zinc-500 text-sm mt-1">Synchronizing your portfolio assets...</p>
          </div>
          
          {/* Progress bar line */}
          <div className="w-full h-[2px] bg-[#222226] mt-4 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#3b82f6]"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>

      {/* 4 Summary Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i} 
            className={`${blockClass} rounded-2xl p-6 h-36 flex flex-col justify-between shadow-xl shadow-black/20`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-[#3b82f6]/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]`}></div>
            <div className="flex justify-between items-start">
              <div className="space-y-3">
                <div className="w-24 h-4 bg-[#222226] rounded-full"></div>
                <div className="w-32 h-8 bg-[#222226] rounded-lg"></div>
              </div>
              <div className="w-12 h-12 bg-[#222226] rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 bg-[#3b82f6]/20 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 h-3 bg-[#222226] rounded-full"></div>
              <div className="w-10 h-3 bg-[#3b82f6]/10 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {/* Performance Line Chart */}
        <div className="lg:col-span-2 min-w-0 w-full">
          <div className={`${blockClass} rounded-2xl p-6 h-[450px] shadow-xl shadow-black/20 flex flex-col relative`}>
            <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-[#3b82f6]/3 to-transparent -translate-x-full animate-[shimmer_3s_infinite]`}></div>
            <div className="flex justify-between items-center mb-8">
               <div className="w-48 h-6 bg-[#222226] rounded-full"></div>
               <div className="flex gap-2">
                 {[1,2,3].map(j => <div key={j} className="w-12 h-6 bg-[#222226] rounded-md"></div>)}
               </div>
            </div>
            <div className="flex-1 w-full flex items-end justify-between px-2 gap-3 opacity-40">
              {[60, 40, 75, 55, 90, 65, 80, 45, 100, 70, 85, 95].map((height, i) => (
                <div 
                  key={i} 
                  className="w-full bg-gradient-to-t from-[#3b82f6]/10 to-[#3b82f6]/30 rounded-t-lg transition-all duration-1000" 
                  style={{ height: `${height}%` }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Sector Pie Chart */}
        <div className="min-w-0 w-full">
          <div className={`${blockClass} rounded-2xl p-6 h-[450px] shadow-xl shadow-black/20 flex flex-col items-center justify-center relative`}>
             <div className="w-40 h-6 bg-[#222226] rounded-full absolute top-6 left-6"></div>
             
             {/* Fake Donut Skeleton */}
             <div className="w-64 h-64 rounded-full border-[20px] border-[#222226] relative mt-8 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full border border-[#222226]/50"></div>
                <div className="absolute inset-0 w-full h-full rounded-full border-t-[20px] border-t-[#3b82f6]/20 animate-spin-slow"></div>
             </div>
             
             <div className="mt-12 w-full space-y-4 px-4">
                {[1,2,3].map(j => (
                  <div key={j} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#222226]"></div>
                      <div className="w-24 h-3 bg-[#222226] rounded-full"></div>
                    </div>
                    <div className="w-12 h-3 bg-[#222226] rounded-full"></div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
      
      {/* Holdings Table Skeleton */}
      <div className={`${blockClass} rounded-2xl p-1 shadow-xl shadow-black/20 min-h-[500px]`}>
         <div className="p-6 border-b border-[#222226] flex justify-between items-center">
            <div className="w-40 h-6 bg-[#222226] rounded-full"></div>
            <div className="w-32 h-10 bg-[#222226] rounded-xl"></div>
         </div>
         
         <div className="w-full overflow-hidden">
           {/* Table Header */}
           <div className="w-full h-14 border-b border-[#222226] flex items-center px-8 justify-between bg-[#111114]">
              <div className="w-32 h-4 bg-[#222226] rounded-full"></div>
              <div className="w-24 h-4 bg-[#222226] rounded-full hidden md:block"></div>
              <div className="w-24 h-4 bg-[#222226] rounded-full hidden md:block"></div>
              <div className="w-24 h-4 bg-[#222226] rounded-full"></div>
           </div>
           
           {/* Table Rows */}
           <div className="divide-y divide-[#222226]">
             {[...Array(6)].map((_, i) => (
               <div key={i} className="w-full h-20 flex items-center px-8 justify-between hover:bg-white/[0.02] transition-colors group">
                  <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 bg-[#222226] rounded-xl flex items-center justify-center overflow-hidden relative">
                       <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#3b82f6]/5 to-transparent"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="w-28 h-4 bg-[#222226] rounded-full"></div>
                      <div className="w-16 h-3 bg-[#222226]/60 rounded-full"></div>
                    </div>
                  </div>
                  <div className="w-20 h-4 bg-[#222226] rounded-full hidden md:block"></div>
                  <div className="w-24 h-4 bg-[#222226] rounded-full hidden md:block"></div>
                  <div className="space-y-3 flex flex-col items-end">
                    <div className="w-24 h-4 bg-[#3b82f6]/10 rounded-full"></div>
                    <div className="w-16 h-3 bg-[#222226] rounded-full"></div>
                  </div>
               </div>
             ))}
           </div>
         </div>
      </div>
    </div>
  );
};


import React from 'react';
import { motion } from 'framer-motion';

export const DashboardSkeleton = () => {
  const shimmer = {
    animate: {
      opacity: [0.3, 0.7, 0.3],
      transition: {
        duration: 1.5,
        ease: "easeInOut" as const,
        repeat: Infinity,
      }
    }
  };

  const blockClass = "bg-[#334155] rounded-md";

  return (
    <div className="w-full space-y-8">
      {/* 4 Summary Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <motion.div 
            key={i} 
            variants={shimmer}
            animate="animate"
            className="bg-fintech-card border border-fintech-border rounded-xl p-6 h-32 flex flex-col justify-between shadow-lg shadow-black/20"
          >
            <div className="flex justify-between items-center relative z-10">
              <div className={`w-24 h-4 ${blockClass}`}></div>
              <div className={`w-10 h-10 ${blockClass} rounded-lg`}></div>
            </div>
            <div className={`w-32 h-8 ${blockClass} mt-4 relative z-10`}></div>
          </motion.div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {/* Performance Line Chart */}
        <div className="lg:col-span-2 min-w-0 w-full">
          <motion.div 
            variants={shimmer}
            animate="animate"
            className="bg-fintech-card border border-fintech-border rounded-xl p-6 h-[400px] shadow-lg shadow-black/20 flex flex-col"
          >
            <div className={`w-48 h-6 ${blockClass} mb-8`}></div>
            <div className="flex-1 w-full flex items-end justify-between px-2 gap-2 opacity-50">
              {/* Fake bars/points representing chart */}
              {[40, 60, 30, 70, 50, 80, 45, 90, 65, 100, 75, 85].map((height, i) => (
                <div key={i} className={`w-full ${blockClass} rounded-t-sm`} style={{ height: `${height}%` }}></div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sector Pie Chart */}
        <div className="min-w-0 w-full">
          <motion.div 
            variants={shimmer}
            animate="animate"
            className="bg-fintech-card border border-fintech-border rounded-xl p-6 h-[400px] shadow-lg shadow-black/20 flex flex-col items-center justify-center relative"
          >
             <div className={`w-48 h-6 ${blockClass} absolute top-6 left-6`}></div>
             
             {/* Fake Donut Layer */}
             <div className="w-56 h-56 rounded-full border-[16px] border-[#334155] opacity-50 relative mt-8">
                {/* Inner circle punchout to make it a donut */}
                <div className="absolute inset-0 bg-transparent rounded-full"></div>
             </div>
          </motion.div>
        </div>
      </div>
      
      {/* Holdings Table Skeleton */}
      <motion.div 
        variants={shimmer}
        animate="animate"
        className="bg-fintech-card border border-fintech-border rounded-xl p-6 shadow-lg shadow-black/20 min-h-[400px]"
      >
         <div className={`w-48 h-6 ${blockClass} mb-8`}></div>
         
         <div className="w-full bg-[#1e293b] rounded-lg border border-fintech-border overflow-hidden">
           {/* Table Header */}
           <div className="w-full h-12 border-b border-fintech-border flex items-center px-6 justify-between opacity-80">
              <div className={`w-20 h-4 ${blockClass}`}></div>
              <div className={`w-24 h-4 ${blockClass}`}></div>
              <div className={`w-16 h-4 ${blockClass} hidden md:block`}></div>
              <div className={`w-16 h-4 ${blockClass} hidden md:block`}></div>
              <div className={`w-20 h-4 ${blockClass} hidden sm:block`}></div>
           </div>
           
           {/* Table Rows */}
           <div className="space-y-0">
             {[...Array(5)].map((_, i) => (
               <div key={i} className="w-full h-16 border-b border-fintech-border/50 last:border-0 flex items-center px-6 justify-between hover:bg-white/5 transition-colors">
                  <div className="flex gap-4 items-center">
                    <div className={`w-8 h-8 ${blockClass} rounded-full`}></div>
                    <div className="space-y-2">
                      <div className={`w-24 h-4 ${blockClass}`}></div>
                      <div className={`w-16 h-3 ${blockClass} opacity-60`}></div>
                    </div>
                  </div>
                  <div className={`w-24 h-4 ${blockClass}`}></div>
                  <div className={`w-16 h-4 ${blockClass} hidden md:block`}></div>
                  <div className={`w-16 h-4 ${blockClass} hidden md:block`}></div>
                  <div className={`w-20 h-6 ${blockClass} rounded-full hidden sm:block`}></div>
               </div>
             ))}
           </div>
         </div>
      </motion.div>
    </div>
  );
};

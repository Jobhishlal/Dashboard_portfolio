import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { PerformanceData } from '../data/PortFolioData'
import { formatCurrency } from '../utils/Formatters'
interface PerformanceChartProps {
  data: PerformanceData[]
}
export function PerformanceChart({ data }: PerformanceChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-fintech-card border border-fintech-border p-3 rounded-lg shadow-xl">
          <p className="text-fintech-text font-medium mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-fintech-accent text-sm flex justify-between gap-4">
              <span>Portfolio Value:</span>
              <span className="font-medium">
                {formatCurrency(payload[0].value)}
              </span>
            </p>
            <p className="text-fintech-muted text-sm flex justify-between gap-4">
              <span>Investment:</span>
              <span className="font-medium">
                {formatCurrency(payload[1].value)}
              </span>
            </p>
          </div>
        </div>
      )
    }
    return null
  }
  return (
    <div className="bg-fintech-card rounded-xl p-6 border border-fintech-border shadow-lg shadow-black/20 h-[400px] flex flex-col">
      <h3 className="text-lg font-semibold text-fintech-text mb-6">
        Portfolio Performance
      </h3>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              stroke="#94a3b8"
              tick={{
                fill: '#94a3b8',
                fontSize: 12,
              }}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#94a3b8"
              tick={{
                fill: '#94a3b8',
                fontSize: 12,
              }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorValue)"
              activeDot={{
                r: 6,
                fill: '#3b82f6',
                stroke: '#0f172a',
                strokeWidth: 2,
              }}
            />
            <Area
              type="monotone"
              dataKey="investment"
              stroke="#94a3b8"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="none"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

import React, { memo } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import { SectorAllocation, sectorColors } from '../data/PortFolioData'
import { formatCurrency, formatPercentage } from '../utils/Formatters'
interface SectorChartProps {
  data: SectorAllocation[]
  totalValue: number
}
export const SectorChart = memo(function SectorChart({ data, totalValue }: SectorChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const percentage = (data.value / totalValue) * 100
      return (
        <div className="bg-fintech-card border border-fintech-border p-3 rounded-lg shadow-xl">
          <p className="text-fintech-text font-medium mb-1">{data.name}</p>
          <p className="text-fintech-muted text-sm">
            {formatCurrency(data.value)}
          </p>
          <p className="text-fintech-accent text-sm font-medium mt-1">
            {percentage.toFixed(1)}%
          </p>
        </div>
      )
    }
    return null
  }
  return (
    <div className="bg-fintech-card rounded-xl p-6 border border-fintech-border shadow-lg shadow-black/20 h-[400px] flex flex-col">
      <h3 className="text-lg font-semibold text-fintech-text mb-6">
        Sector Allocation
      </h3>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || sectorColors[entry.name] || '#3b82f6'}
                />
              ))}
            </Pie>
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                fill: 'transparent',
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => (
                <span className="text-fintech-text text-sm ml-1">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
})

import React, { useState, useRef, useEffect, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XIcon } from 'lucide-react'
import { Stock, initialHoldings } from '../data/PortFolioData'

interface AddStockModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (stock: Omit<Stock, 'id' | 'cmp' | 'peRatio' | 'eps'>) => Promise<void> | void
}

export const AddStockModal = memo(function AddStockModal({ isOpen, onClose, onAdd }: AddStockModalProps) {
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    purchasePrice: '',
    quantity: '',
    exchange: 'NSE',
    sector: 'Technology',
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  
  const [showSuggestions, setShowSuggestions] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filteredStocks = initialHoldings.filter(stock => 
    stock.symbol.toLowerCase().includes(formData.symbol.toLowerCase()) || 
    stock.name.toLowerCase().includes(formData.symbol.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.symbol.trim()) {
      setError("stock symbol is required")
      return
    }
    
    const quantityNum = Number(formData.quantity)
    const priceNum = Number(formData.purchasePrice)
    
    if (!formData.quantity || quantityNum <= 0) {
      setError("quantity must be greater than 0")
      return
    }
    if (!formData.purchasePrice || priceNum <= 0) {
      setError("purchase amount must be greater than 0")
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccessMsg(null)
    
    try {
      await onAdd({
        symbol: formData.symbol.toUpperCase(),
        name: formData.name || formData.symbol.toUpperCase(),
        purchasePrice: Number(formData.purchasePrice),
        quantity: Number(formData.quantity),
        exchange: formData.exchange as 'NSE' | 'BSE',
        sector: formData.sector,
      })
      
      setSuccessMsg("Completed successfully")
      
      setTimeout(() => {
        setFormData({
          symbol: '',
          name: '',
          purchasePrice: '',
          quantity: '',
          exchange: 'NSE',
          sector: 'Technology',
        })
        setSuccessMsg(null)
        onClose()
      }, 2000)
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to inject asset. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  const inputClass =
    'w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-fintech-accent focus:ring-1 focus:ring-fintech-accent transition-colors placeholder:text-zinc-500'
  const labelClass = 'block text-sm font-semibold text-zinc-300 mb-1.5'
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={onClose}
            className="fixed inset-0 bg-fintech-bg/80 backdrop-blur-sm z-50"
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 20,
              }}
              transition={{
                type: 'spring',
                duration: 0.5,
                bounce: 0.3,
              }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] w-full max-w-md pointer-events-auto overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-zinc-800 bg-zinc-950/20">
                <h2 className="text-xl font-black tracking-tighter text-white uppercase italic">
                  Inject Asset
                </h2>
                <button
                  onClick={onClose}
                  className="text-zinc-500 hover:text-white hover:bg-zinc-800 p-1.5 rounded-lg transition-colors"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg flex items-center justify-between"
                  >
                    <p className="text-sm font-medium">{error}</p>
                    <button type="button" onClick={() => setError(null)} className="text-red-500 hover:text-red-400">
                      <XIcon className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
                {successMsg && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-4 py-3 rounded-lg flex items-center justify-between"
                  >
                    <p className="text-sm font-medium">{successMsg}</p>
                    <button type="button" onClick={() => setSuccessMsg(null)} className="text-emerald-500 hover:text-emerald-400">
                      <XIcon className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 relative" ref={dropdownRef}>
                    <label className={labelClass}>Stock Symbol</label>
                    <input
                      type="text"
                      placeholder="e.g. RELIANCE (Search or type)"
                      className={`${inputClass} uppercase`}
                      value={formData.symbol}
                      onFocus={() => setShowSuggestions(true)}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          symbol: e.target.value,
                        })
                        setShowSuggestions(true)
                      }}
                    />

                    <AnimatePresence>
                      {showSuggestions && filteredStocks.length > 0 && (
                        <motion.ul
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="absolute z-10 left-0 right-0 mt-2 bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl overflow-hidden max-h-60 overflow-y-auto"
                        >
                          {filteredStocks.map((stock) => (
                            <li
                              key={stock.id}
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  symbol: stock.symbol,
                                  name: stock.name,
                                  exchange: stock.exchange,
                                  sector: stock.sector,
                                })
                                setShowSuggestions(false)
                              }}
                              className="px-4 py-3 hover:bg-zinc-800/80 cursor-pointer border-b border-zinc-800/50 last:border-none transition-colors"
                            >
                              <div className="font-bold text-white mb-0.5">{stock.symbol}</div>
                              <div className="flex items-center text-xs text-zinc-400">
                                <span className="truncate mr-2">{stock.name}</span>
                                <span className="bg-zinc-800 px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold text-zinc-300">
                                  {stock.exchange}
                                </span>
                              </div>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>

                  <div>
                    <label className={labelClass}>Quantity</label>
                    <input
                      type="number"
                      
                      
                      placeholder="0"
                      className={inputClass}
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          quantity: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Avg. Price (₹)</label>
                    <input
                      type="number"
                      
                    
                      placeholder="0.00"
                      className={inputClass}
                      value={formData.purchasePrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          purchasePrice: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Exchange</label>
                    <input
                      type="text"
                      className={`${inputClass} bg-zinc-900/50 cursor-not-allowed text-zinc-500`}
                      value={formData.exchange}
                      readOnly
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Sector</label>
                    <input
                      type="text"
                      className={`${inputClass} bg-zinc-900/50 cursor-not-allowed text-zinc-500`}
                      value={formData.sector}
                      readOnly
                    />
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-zinc-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 text-sm font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-6 py-2.5 flex items-center justify-center gap-2 text-sm font-bold text-white rounded-lg transition-all shadow-xl active:scale-95 ${
                      isLoading ? 'bg-zinc-700 cursor-not-allowed text-zinc-400' : 'bg-fintech-accent hover:bg-blue-500 shadow-blue-500/10'
                    }`}
                  >
                    {isLoading && <span className="w-4 h-4 border-2 border-zinc-400 border-t-white rounded-full animate-spin"></span>}
                    {isLoading ? "Injecting..." : "Add Asset"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
})

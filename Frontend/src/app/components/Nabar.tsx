import React, { memo, useState, useRef, useEffect } from 'react'
import { BellIcon, RefreshCwIcon, UserIcon, XIcon, CheckCircleIcon, InfoIcon, AlertTriangleIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNotifications } from '../context/NotificationContext'

export const Navbar = memo(function Navbar() {
  const { notifications, unreadCount, liveToast, clearNotification, clearAll, markAsRead } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
      case 'warning': return <AlertTriangleIcon className="w-4 h-4 text-amber-500" />
      default: return <InfoIcon className="w-4 h-4 text-blue-500" />
    }
  }

  return (
    <>
    <nav className="fixed top-0 left-0 right-0 h-16 bg-fintech-bg/80 backdrop-blur-md border-b border-fintech-border z-40 flex items-center justify-between px-8 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fintech-accent to-blue-700 flex items-center justify-center shadow-lg shadow-fintech-accent/20">
          <span className="text-white font-bold text-xl leading-none">P</span>
        </div>
        <h1 className="text-xl font-semibold text-fintech-text tracking-tight">
          Portfolio Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          className="p-2 text-fintech-muted hover:text-fintech-text hover:bg-fintech-card rounded-full transition-colors"
          aria-label="Refresh data"
        >
          <RefreshCwIcon className="w-5 h-5" />
        </button>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-fintech-muted hover:text-fintech-text hover:bg-fintech-card rounded-full transition-colors relative"
            aria-label="Notifications"
          >
            <BellIcon className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center translate-x-1 -translate-y-1 bg-fintech-accent text-[9px] font-bold text-white rounded-full border-2 border-fintech-bg">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-3 w-80 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col max-h-[400px]"
              >
                <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950/50">
                  <h3 className="font-semibold text-white">Notifications</h3>
                  {notifications.length > 0 && (
                    <button 
                      onClick={() => clearAll()}
                      className="text-xs font-semibold text-zinc-400 hover:text-red-400 transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                
                <div className="overflow-y-auto flex-1 p-2 space-y-1">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-sm text-zinc-500">
                      No recent notifications
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div 
                        key={notif.id}
                        onMouseEnter={() => { if (!notif.isRead) markAsRead(notif.id) }}
                        className={`p-3 rounded-lg group relative flex items-start gap-3 transition-colors ${!notif.isRead ? 'bg-zinc-800/80' : 'hover:bg-zinc-800/40'}`}
                      >
                        <div className="mt-0.5">{getIcon(notif.type)}</div>
                        <div className="flex-1 pr-6">
                          <p className={`text-sm leading-tight ${!notif.isRead ? 'text-zinc-100 font-medium' : 'text-zinc-400'}`}>
                            {notif.message}
                          </p>
                          <p className="text-[10px] text-zinc-500 mt-1">
                            {new Date(notif.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        <button
                          onClick={() => clearNotification(notif.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-white hover:bg-zinc-700 transition-all"
                        >
                          <XIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="h-8 w-px bg-fintech-border mx-2"></div>
        <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 rounded-full bg-fintech-card border border-fintech-border flex items-center justify-center overflow-hidden">
            <UserIcon className="w-5 h-5 text-fintech-muted" />
          </div>
        </button>
      </div>
    </nav>
    
    <AnimatePresence>
      {liveToast && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 p-4 bg-zinc-900 border border-zinc-800 shadow-[0_10px_40px_rgba(0,0,0,0.8)] rounded-xl max-w-sm"
        >
          <div className="bg-zinc-800 p-2 rounded-lg">
             {getIcon(liveToast.type)}
          </div>
          <div>
            <h4 className="text-white text-sm font-bold tracking-tight">System Update</h4>
            <p className="text-sm font-medium text-emerald-400 mt-0.5 leading-snug">{liveToast.message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  )
})

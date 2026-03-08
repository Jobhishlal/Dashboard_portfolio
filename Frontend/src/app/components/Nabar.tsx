import React from 'react'
import { BellIcon, RefreshCwIcon, UserIcon } from 'lucide-react'
export function Navbar() {
  return (
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
        <button
          className="p-2 text-fintech-muted hover:text-fintech-text hover:bg-fintech-card rounded-full transition-colors relative"
          aria-label="Notifications"
        >
          <BellIcon className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-fintech-accent rounded-full border border-fintech-bg"></span>
        </button>
        <div className="h-8 w-px bg-fintech-border mx-2"></div>
        <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 rounded-full bg-fintech-card border border-fintech-border flex items-center justify-center overflow-hidden">
            <UserIcon className="w-5 h-5 text-fintech-muted" />
          </div>
        </button>
      </div>
    </nav>
  )
}

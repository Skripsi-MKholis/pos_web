"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  IconConfetti, 
  IconArrowRight, 
  IconLayoutDashboard, 
  IconDeviceDesktopAnalytics,
  IconBuildingStore,
  IconChartBar,
  IconTrendingUp
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface WelcomeOnboardingProps {
  userName: string
  storeName: string
  storeId: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function WelcomeOnboarding({ 
  userName, 
  storeName, 
  storeId, 
  open: controlledOpen,
  onOpenChange 
}: WelcomeOnboardingProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const [currentStep, setCurrentStep] = React.useState(0)
  const [spotlightRect, setSpotlightRect] = React.useState<DOMRect | null>(null)

  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : internalOpen

  const steps = [
    {
      title: "Selamat datang di Parzello POS!",
      description: `Halo ${userName}, toko "${storeName}" Anda siap beroperasi. Mari kita lihat sekilas cara kerjanya.`,
      icon: IconConfetti,
      color: "text-yellow-500 bg-yellow-500/10",
      target: null
    },
    {
      title: "Konfigurasi & Akses Cepat",
      description: "Bagian ini adalah jalan pintas untuk fitur yang paling sering digunakan, termasuk pengaturan modul.",
      icon: IconLayoutDashboard,
      color: "text-primary bg-primary/10",
      target: "quick-access"
    },
    {
      title: "Metrik Utama",
      description: "Lihat total omzet harian, jumlah transaksi, dan peringatan stok menipis secara instan.",
      icon: IconChartBar,
      color: "text-emerald-500 bg-emerald-500/10",
      target: "metrics"
    },
    {
      title: "Analisis Tren",
      description: "Grafik interaktif ini membantu Anda melihat performa penjualan selama 30 hari terakhir.",
      icon: IconTrendingUp,
      color: "text-blue-500 bg-blue-500/10",
      target: "charts"
    },
    {
      title: "Siap Mulai?",
      description: "Gunakan tombol Konfigurasi & Akses Cepat untuk mulai mencatat transaksi pertama Anda hari ini!",
      icon: IconBuildingStore,
      color: "text-orange-500 bg-orange-500/10",
      target: null
    }
  ]

  React.useEffect(() => {
    if (isOpen) {
      const target = steps[currentStep].target
      if (target) {
        const el = document.querySelector(`[data-tour="${target}"]`)
        if (el) {
          setSpotlightRect(el.getBoundingClientRect())
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      } else {
        setSpotlightRect(null)
      }
    }
  }, [currentStep, isOpen])

  React.useEffect(() => {
    if (isControlled) return
    const welcomed = localStorage.getItem(`welcomed_${storeId}`)
    if (!welcomed) {
      const timer = setTimeout(() => setInternalOpen(true), 1200)
      return () => clearTimeout(timer)
    }
  }, [storeId, isControlled])

  const handleFinish = () => {
    localStorage.setItem(`welcomed_${storeId}`, "true")
    if (onOpenChange) {
      onOpenChange(false)
    } else {
      setInternalOpen(false)
    }
    setTimeout(() => setCurrentStep(0), 500)
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(s => s + 1)
    } else {
      handleFinish()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center cursor-default overflow-hidden">
          {/* Enhanced Spotlight Overlay using Clip-Path to avoid blur on target */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/60 backdrop-blur-md pointer-events-none"
            style={{
              clipPath: spotlightRect 
                ? `polygon(
                    0% 0%, 
                    0% 100%, 
                    ${spotlightRect.left - 8}px 100%, 
                    ${spotlightRect.left - 8}px ${spotlightRect.top - 8}px, 
                    ${spotlightRect.right + 8}px ${spotlightRect.top - 8}px, 
                    ${spotlightRect.right + 8}px ${spotlightRect.bottom + 8}px, 
                    ${spotlightRect.left - 8}px ${spotlightRect.bottom + 8}px, 
                    ${spotlightRect.left - 8}px 100%, 
                    100% 100%, 
                    100% 0%
                  )`
                : 'none'
            }}
          />

          {/* Fallback dark overlay if spotlightRect is null (Initial/End steps) */}
          {!spotlightRect && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/60 backdrop-blur-md"
            />
          )}

          {/* Animated Highlight Ring */}
          {spotlightRect && (
            <motion.div 
              initial={false}
              animate={{
                top: spotlightRect.top - 12,
                left: spotlightRect.left - 12,
                width: spotlightRect.width + 24,
                height: spotlightRect.height + 24,
              }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              className="absolute rounded-[2.5rem] border-4 border-primary shadow-[0_0_50px_rgba(var(--primary-rgb),0.3)] z-50 pointer-events-none"
            >
               <div className="absolute inset-0 rounded-[2.3rem] border border-white/50 animate-pulse" />
            </motion.div>
          )}

          {/* Modal Card */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`relative w-full max-w-sm overflow-hidden z-[110] transition-all duration-700 ease-in-out ${
              spotlightRect 
                ? spotlightRect.top > window.innerHeight / 2 
                  ? '-translate-y-40' 
                  : 'translate-y-40'  
                : ''
            }`}
          >
            <Card className="rounded-[2.5rem] border-none shadow-2xl bg-card overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 flex gap-0.5">
                 {steps.map((_, i) => (
                   <div 
                    key={i} 
                    className={`h-full flex-1 transition-all duration-500 ${i <= currentStep ? 'bg-primary' : 'bg-muted'}`} 
                   />
                 ))}
              </div>

              <CardContent className="p-8 pt-10">
                <div className="space-y-6 text-center">
                  <motion.div 
                    key={`icon-${currentStep}`}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`mx-auto h-16 w-16 rounded-2xl flex items-center justify-center ${steps[currentStep].color}`}
                  >
                    {React.createElement(steps[currentStep].icon, { size: 32, strokeWidth: 1.5 })}
                  </motion.div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-black tracking-tight">{steps[currentStep].title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {steps[currentStep].description}
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <Button 
                      onClick={nextStep}
                      className="h-12 rounded-2xl w-full font-black shadow-lg shadow-primary/20 group"
                    >
                      {currentStep === steps.length - 1 ? "Mulai Sekarang" : "Lanjut"}
                      <IconArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    
                    <button onClick={handleFinish} className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors py-2">
                       Lewati Panduan
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

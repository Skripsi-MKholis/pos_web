"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { IconCookie, IconX, IconShieldLock } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CookieConsent() {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    // Check if user has already accepted
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted")
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
          className="fixed bottom-6 left-6 right-6 z-[60] md:left-auto md:max-w-md"
        >
          <div className="relative overflow-hidden group">
             {/* Glassmorphism Card */}
             <div className="p-6 rounded-[2.5rem] bg-background/80 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-1 ring-white/20">
                <div className="flex flex-col gap-6">
                   <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                         <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                            <IconCookie size={28} />
                         </div>
                         <div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Kebijakan Cookie</h3>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Persetujuan Penggunaan Data</p>
                         </div>
                      </div>
                      <button onClick={() => setIsVisible(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                         <IconX size={20} />
                      </button>
                   </div>

                   <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                      Kami menggunakan cookie untuk meningkatkan pengalaman Anda, menganalisis lalu lintas, dan menjaga keamanan sesi Anda di **Parzello POS**. Dengan mengklik "Setuju", Anda menyetujui penggunaan cookie kami.
                   </p>

                   <div className="flex flex-col sm:flex-row gap-3 pt-2">
                       <Button 
                        onClick={handleAccept}
                        className="flex-1 h-12 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20"
                       >
                         Setuju & Lanjut
                       </Button>
                       <Link href="/privacy" className="flex-1">
                          <Button 
                            variant="outline" 
                            className="w-full h-12 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] border-white/10 bg-white/5 hover:bg-white/10"
                          >
                            <IconShieldLock size={14} className="mr-2" />
                            Baca Detail
                          </Button>
                       </Link>
                   </div>
                </div>

                {/* Decorative Glow */}
                <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-primary/10 rounded-full blur-[50px] pointer-events-none" />
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

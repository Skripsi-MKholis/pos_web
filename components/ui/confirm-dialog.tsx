"use client"

import * as React from "react"
import { IconAlertTriangle, IconTrash, IconInfoCircle } from "@tabler/icons-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void | Promise<void>
  title: string
  description: React.ReactNode
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
  variant?: "destructive" | "warning" | "primary"
}

export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  isLoading = false,
  variant = "destructive",
}: ConfirmDialogProps) {
  
  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault()
    await onConfirm()
  }

  const variantStyles = {
    destructive: {
      border: "border-destructive/10",
      topBar: "bg-destructive",
      iconBg: "bg-destructive/10 text-destructive",
      title: "text-destructive",
      button: "destructive",
      icon: <IconTrash size={28} />,
    },
    warning: {
      border: "border-orange-500/10",
      topBar: "bg-orange-500",
      iconBg: "bg-orange-500/10 text-orange-500",
      title: "text-orange-500",
      button: "default", // will be custom styled
      icon: <IconAlertTriangle size={28} />,
    },
    primary: {
      border: "border-primary/10",
      topBar: "bg-primary",
      iconBg: "bg-primary/10 text-primary",
      title: "text-primary",
      button: "default",
      icon: <IconInfoCircle size={28} />,
    },
  }

  const styles = variantStyles[variant]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("rounded-2xl overflow-hidden pt-8", styles.border)}>
        <div className={cn("absolute top-0 left-0 w-full h-1.5", styles.topBar)}></div>
        <form onSubmit={handleConfirm}>
          <DialogHeader>
            <div className={cn("mx-auto flex h-14 w-14 items-center justify-center rounded-full mb-4", styles.iconBg)}>
              {styles.icon}
            </div>
            <DialogTitle className={cn("text-center text-xl font-black", styles.title)}>
              {title}
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              {description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-8 flex flex-col-reverse sm:flex-row gap-2">
            <Button 
              type="button" 
              variant="outline" 
              className="rounded-xl w-full sm:w-auto h-11" 
              onClick={() => onOpenChange(false)} 
              disabled={isLoading}
            >
              {cancelText}
            </Button>
            <Button 
              type="submit" 
              variant={variant === "destructive" ? "destructive" : "default"} 
              className={cn(
                "rounded-xl w-full sm:w-auto h-11 shadow-lg font-bold tracking-wide",
                variant === "warning" && "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20",
                variant === "destructive" && "shadow-destructive/20",
                variant === "primary" && "shadow-primary/20",
              )} 
              disabled={isLoading}
            >
              {isLoading ? "Memproses..." : confirmText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

/* ─── Modal ─── */
interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  wide?: boolean
}

export function Modal({ open, onClose, title, children, wide }: ModalProps) {
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className={cn(
        "relative z-50 w-full bg-card rounded-t-2xl md:rounded-2xl shadow-medium animate-scale-in max-h-[85vh] overflow-y-auto scrollbar-hide",
        wide ? "md:max-w-2xl" : "md:max-w-md"
      )}>
        <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-card/95 backdrop-blur-sm z-10 rounded-t-2xl">
          <h2 className="text-base font-semibold">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

/* ─── Input ─── */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { label?: string }

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, label, ...props }, ref) => (
  <div className="space-y-1.5">
    {label && <label className="text-sm font-medium">{label}</label>}
    <input ref={ref} className={cn("w-full h-10 px-3 rounded-lg border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all", className)} {...props} />
  </div>
))
Input.displayName = "Input"

/* ─── Select ─── */
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, label, options, ...props }, ref) => (
  <div className="space-y-1.5">
    {label && <label className="text-sm font-medium">{label}</label>}
    <select ref={ref} className={cn("w-full h-10 px-3 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all appearance-none", className)} {...props}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
))
Select.displayName = "Select"

/* ─── Toast ─── */
interface ToastMsg { id: number; text: string; type: "success" | "error" | "info" }
const ToastCtx = React.createContext<{ toast: (t: string, type?: ToastMsg["type"]) => void }>({ toast: () => {} })
export const useToast = () => React.useContext(ToastCtx)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastMsg[]>([])
  const toast = React.useCallback((text: string, type: ToastMsg["type"] = "success") => {
    const id = Date.now()
    setToasts(p => [...p, { id, text, type }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 2500)
  }, [])
  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={cn("px-4 py-2.5 rounded-xl text-sm font-medium shadow-medium animate-fade-in",
            t.type === "success" && "bg-success text-success-foreground",
            t.type === "error" && "bg-destructive text-destructive-foreground",
            t.type === "info" && "bg-primary text-primary-foreground",
          )}>{t.text}</div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}
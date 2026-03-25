import React, { createContext, useState, useContext } from "react"
import type { ReactNode } from "react"
import { Toast, ToastContainer } from "react-bootstrap";

// Define allowed severity types
type ToastSeverity = "info" | "success" | "warning" | "error";

// Toast state type
interface ToastState {
  show: boolean
  message: string
  severity: ToastSeverity
}

// Context type
interface ToastContextType {
  showToast: (message: string, severity?: ToastSeverity) => void
}

// Create context
const ToastContext = createContext<ToastContextType | undefined>(undefined)

// Provider props
interface ToastProviderProps {
  children: ReactNode
}

export const ToastWrapper: React.FC<ToastProviderProps> = ({ children }) => {
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    severity: "info",
  })

  const showToast = (message: string, severity: ToastSeverity = "info") => {
    setToast({
      show: true,
      message,
      severity,
    })
  }

  const handleClose = () => {
    setToast((prev) => ({ ...prev, show: false }))
  }

  // Map severity to Bootstrap background
  const getBgVariant = (severity: ToastSeverity) => {
    switch (severity) {
      case "success":
        return "success"
      case "error":
        return "danger"
      case "warning":
        return "warning"
      case "info":
      default:
        return "primary"
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer position="bottom-center" className="p-3" style={{ zIndex: 9999 }}>
        <Toast bg={getBgVariant(toast.severity)} onClose={handleClose} show={toast.show} delay={3000} autohide>
          <Toast.Body className="text-white">
            {toast.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </ToastContext.Provider>
  )
}

// Optional helper hook (recommended)
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastWrapper")
  }
  return context
}

export { ToastContext }
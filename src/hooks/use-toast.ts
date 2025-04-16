import { useToast as useToastPrimitive } from "@/components/ui/toast"

export const useToast = useToastPrimitive

// Re-export from components/ui/toast for proper shadcn usage
import { toast } from "@/components/ui/toast"

export { toast }

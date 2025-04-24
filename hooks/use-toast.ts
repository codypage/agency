// This is a placeholder for the toast hook that would be used in the CreateTaskDialog
// In a real implementation, this would be a proper toast hook

import { useToast as useToastOriginal } from "@/components/ui/toast"

export const useToast = () => {
  let toastFunction
  try {
    toastFunction = useToastOriginal().toast
  } catch (e) {
    toastFunction = ({ title, description, variant }: { title: string; description: string; variant?: string }) => {
      console.log(`Toast: ${title} - ${description} (${variant || "default"})`)
    }
  }

  return {
    toast: toastFunction,
  }
}

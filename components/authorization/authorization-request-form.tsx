"use client"
import { AuthorizationRequestWizard } from "./authorization-request-wizard"

interface AuthorizationRequestFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientId?: string
  clientName?: string
}

export function AuthorizationRequestForm({ open, onOpenChange, clientId, clientName }: AuthorizationRequestFormProps) {
  return (
    <AuthorizationRequestWizard open={open} onOpenChange={onOpenChange} clientId={clientId} clientName={clientName} />
  )
}

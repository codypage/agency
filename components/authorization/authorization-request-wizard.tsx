"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { CalendarIcon, CheckCircle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Steps } from "@/components/ui/steps"
import { Loading } from "@/components/ui/loading"
import { BackButton } from "@/components/ui/back-button"

interface AuthorizationRequestWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientId?: string
  clientName?: string
}

export function AuthorizationRequestWizard({
  open,
  onOpenChange,
  clientId,
  clientName,
}: AuthorizationRequestWizardProps) {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({
    clientId: clientId || "",
    clientName: clientName || "",
    cptCode: "",
    description: "",
    units: "",
    startDate: null as Date | null,
    endDate: null as Date | null,
    provider: "",
    insuranceProvider: "",
    authorizationNumber: "",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiStatus, setApiStatus] = useState({
    connected: true,
    loading: false,
    error: null as string | null,
  })

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setStep(0)
      setFormData({
        clientId: clientId || "",
        clientName: clientName || "",
        cptCode: "",
        description: "",
        units: "",
        startDate: null,
        endDate: null,
        provider: "",
        insuranceProvider: "",
        authorizationNumber: "",
        notes: "",
      })
      setIsSubmitting(false)
      setApiStatus({
        connected: true,
        loading: false,
        error: null,
      })
    }
  }, [open, clientId, clientName])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNext = () => {
    setStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setStep((prev) => prev - 1)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setApiStatus((prev) => ({ ...prev, loading: true, error: null }))

    try {
      // Simulate API call to Desk365
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Check if we should simulate an error (20% chance)
      if (Math.random() < 0.2) {
        throw new Error("Failed to connect to Desk365 API. Please try again.")
      }

      // Success
      setApiStatus({
        connected: true,
        loading: false,
        error: null,
      })

      // Move to success step
      setStep(3)
    } catch (error) {
      setApiStatus({
        connected: false,
        loading: false,
        error: error instanceof Error ? error.message : "An unknown error occurred",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const validateStep = () => {
    switch (step) {
      case 0:
        return !!formData.clientId && !!formData.clientName
      case 1:
        return !!formData.cptCode && !!formData.units && formData.startDate && formData.endDate
      case 2:
        return !!formData.provider && !!formData.insuranceProvider
      default:
        return true
    }
  }

  // Get description based on CPT code
  useEffect(() => {
    if (formData.cptCode) {
      const descriptions: Record<string, string> = {
        "97151": "Behavior Identification Assessment",
        "97153": "Adaptive behavior treatment by protocol",
        "97154": "Group adaptive behavior treatment",
        "97155": "Adaptive behavior treatment with protocol modification",
        "97156": "Family adaptive behavior treatment guidance",
        "97157": "Multiple-family group adaptive behavior treatment guidance",
        "97158": "Group adaptive behavior treatment with protocol modification",
      }

      handleInputChange("description", descriptions[formData.cptCode] || "")
    }
  }, [formData.cptCode])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>New Authorization Request</DialogTitle>
          <DialogDescription>Create a new authorization request for a client</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Steps
            steps={[
              { label: "Client Information", status: step === 0 ? "current" : step > 0 ? "complete" : "incomplete" },
              {
                label: "Service Details",
                status: step === 1 ? "current" : step > 1 ? "complete" : "incomplete",
              },
              {
                label: "Provider & Insurance",
                status: step === 2 ? "current" : step > 2 ? "complete" : "incomplete",
              },
              { label: "Confirmation", status: step === 3 ? "current" : "incomplete" },
            ]}
          />
        </div>

        <div className="py-4">
          {step === 0 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client-name">Client Name</Label>
                <Input
                  id="client-name"
                  value={formData.clientName}
                  onChange={(e) => handleInputChange("clientName", e.target.value)}
                  placeholder="Enter client name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-id">Client ID</Label>
                <Input
                  id="client-id"
                  value={formData.clientId}
                  onChange={(e) => handleInputChange("clientId", e.target.value)}
                  placeholder="Enter client ID"
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cpt-code">CPT Code</Label>
                <Select value={formData.cptCode} onValueChange={(value) => handleInputChange("cptCode", value)}>
                  <SelectTrigger id="cpt-code">
                    <SelectValue placeholder="Select CPT code" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="97151">97151 - Behavior Identification Assessment</SelectItem>
                    <SelectItem value="97153">97153 - Adaptive behavior treatment by protocol</SelectItem>
                    <SelectItem value="97154">97154 - Group adaptive behavior treatment</SelectItem>
                    <SelectItem value="97155">
                      97155 - Adaptive behavior treatment with protocol modification
                    </SelectItem>
                    <SelectItem value="97156">97156 - Family adaptive behavior treatment guidance</SelectItem>
                    <SelectItem value="97157">
                      97157 - Multiple-family group adaptive behavior treatment guidance
                    </SelectItem>
                    <SelectItem value="97158">
                      97158 - Group adaptive behavior treatment with protocol modification
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Service description"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="units">Authorized Units</Label>
                <Input
                  id="units"
                  type="number"
                  value={formData.units}
                  onChange={(e) => handleInputChange("units", e.target.value)}
                  placeholder="Enter number of units"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="start-date"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.startDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.startDate ? format(formData.startDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.startDate || undefined}
                        onSelect={(date) => handleInputChange("startDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="end-date"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.endDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.endDate ? format(formData.endDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.endDate || undefined}
                        onSelect={(date) => handleInputChange("endDate", date)}
                        initialFocus
                        disabled={(date) => (formData.startDate ? date < formData.startDate : false)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="provider">Provider</Label>
                <Select value={formData.provider} onValueChange={(value) => handleInputChange("provider", value)}>
                  <SelectTrigger id="provider">
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dakota">Dakota</SelectItem>
                    <SelectItem value="stacy">Stacy</SelectItem>
                    <SelectItem value="brittany">Brittany</SelectItem>
                    <SelectItem value="jaden">Jaden</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="insurance-provider">Insurance Provider</Label>
                <Select
                  value={formData.insuranceProvider}
                  onValueChange={(value) => handleInputChange("insuranceProvider", value)}
                >
                  <SelectTrigger id="insurance-provider">
                    <SelectValue placeholder="Select insurance provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue-cross">Blue Cross Blue Shield</SelectItem>
                    <SelectItem value="aetna">Aetna</SelectItem>
                    <SelectItem value="cigna">Cigna</SelectItem>
                    <SelectItem value="united">UnitedHealthcare</SelectItem>
                    <SelectItem value="medicaid">Medicaid</SelectItem>
                    <SelectItem value="sunflower">Sunflower Health Plan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="authorization-number">Authorization Number (if available)</Label>
                <Input
                  id="authorization-number"
                  value={formData.authorizationNumber}
                  onChange={(e) => handleInputChange("authorizationNumber", e.target.value)}
                  placeholder="Enter authorization number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Enter any additional notes"
                  rows={3}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              {apiStatus.error ? (
                <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-800">
                  <h3 className="font-medium mb-2">Error Submitting Request</h3>
                  <p>{apiStatus.error}</p>
                  <p className="mt-2 text-sm">
                    The request could not be submitted to the Desk365 API. Please check your connection and try again.
                  </p>
                </div>
              ) : (
                <div className="p-4 border border-green-200 bg-green-50 rounded-md text-green-800">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5" />
                    <h3 className="font-medium">Authorization Request Submitted</h3>
                  </div>
                  <p>
                    Your authorization request for {formData.clientName} has been successfully submitted to the Desk365
                    API.
                  </p>
                  <p className="mt-2 text-sm">
                    The request will be processed and you will be notified when it is approved.
                  </p>
                </div>
              )}

              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Request Summary</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="font-medium">Client:</div>
                  <div>{formData.clientName}</div>
                  <div className="font-medium">CPT Code:</div>
                  <div>
                    {formData.cptCode} - {formData.description}
                  </div>
                  <div className="font-medium">Units:</div>
                  <div>{formData.units}</div>
                  <div className="font-medium">Date Range:</div>
                  <div>
                    {formData.startDate ? format(formData.startDate, "MM/dd/yyyy") : "N/A"} to{" "}
                    {formData.endDate ? format(formData.endDate, "MM/dd/yyyy") : "N/A"}
                  </div>
                  <div className="font-medium">Provider:</div>
                  <div>
                    {formData.provider === "dakota"
                      ? "Dakota"
                      : formData.provider === "stacy"
                        ? "Stacy"
                        : formData.provider === "brittany"
                          ? "Brittany"
                          : formData.provider === "jaden"
                            ? "Jaden"
                            : "N/A"}
                  </div>
                  <div className="font-medium">Insurance:</div>
                  <div>
                    {formData.insuranceProvider === "blue-cross"
                      ? "Blue Cross Blue Shield"
                      : formData.insuranceProvider === "aetna"
                        ? "Aetna"
                        : formData.insuranceProvider === "cigna"
                          ? "Cigna"
                          : formData.insuranceProvider === "united"
                            ? "UnitedHealthcare"
                            : formData.insuranceProvider === "medicaid"
                              ? "Medicaid"
                              : formData.insuranceProvider === "sunflower"
                                ? "Sunflower Health Plan"
                                : "N/A"}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-4">
          {step > 0 && step < 3 && <BackButton onClick={handleBack} />}
          {step === 0 && (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          )}
          {step < 2 && (
            <Button onClick={handleNext} disabled={!validateStep()}>
              Next
            </Button>
          )}
          {step === 2 && (
            <Button onClick={handleSubmit} disabled={!validateStep() || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loading variant="spinner" size="sm" text="" className="mr-2" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          )}
          {step === 3 && <Button onClick={() => onOpenChange(false)}>Close</Button>}
        </div>
      </DialogContent>
    </Dialog>
  )
}

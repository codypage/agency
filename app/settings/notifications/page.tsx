import { NotificationPreferences } from "@/components/settings/notification-preferences"

export default function NotificationSettingsPage() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Notification Settings</h1>
      <NotificationPreferences />
    </div>
  )
}

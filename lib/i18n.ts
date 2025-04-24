// This is a simple i18n implementation
// In a real application, you would use a library like next-i18next or react-intl

type Locale = "en" | "es" | "fr" | "de"

interface I18nConfig {
  defaultLocale: Locale
  supportedLocales: Locale[]
}

const config: I18nConfig = {
  defaultLocale: "en",
  supportedLocales: ["en", "es", "fr", "de"],
}

// Simple translations store
const translations: Record<Locale, Record<string, Record<string, string>>> = {
  en: {
    common: {
      "app.title": "Desk365 Integration",
      "app.description": "Integrate with Desk365 API",
      "nav.dashboard": "Dashboard",
      "nav.tasks": "Tasks",
      "nav.reports": "Reports",
      "nav.authorizations": "Authorizations",
      "nav.settings": "Settings",
      "button.submit": "Submit",
      "button.cancel": "Cancel",
      "button.save": "Save",
      "button.delete": "Delete",
      "button.edit": "Edit",
      "button.back": "Back",
      "error.general": "Something went wrong. Please try again.",
      "error.notFound": "The requested resource was not found.",
      "error.unauthorized": "You are not authorized to access this resource.",
      "empty.noData": "No data available",
      "empty.noResults": "No results found",
      loading: "Loading...",
    },
    tasks: {
      title: "Task Hub",
      description: "Manage and track all project tasks",
      empty: "No tasks found",
      create: "Create Task",
      "filter.all": "All Tasks",
      "filter.myTasks": "My Tasks",
      "filter.teamTasks": "Team Tasks",
      "filter.overdue": "Overdue",
      "filter.upcoming": "Upcoming",
      "status.notStarted": "Not Started",
      "status.inProgress": "In Progress",
      "status.completed": "Completed",
    },
    // Add more translation namespaces as needed
  },
  es: {
    common: {
      "app.title": "Integración Desk365",
      "app.description": "Integrar con API Desk365",
      "nav.dashboard": "Panel",
      "nav.tasks": "Tareas",
      "nav.reports": "Informes",
      "nav.authorizations": "Autorizaciones",
      "nav.settings": "Configuración",
      "button.submit": "Enviar",
      "button.cancel": "Cancelar",
      "button.save": "Guardar",
      "button.delete": "Eliminar",
      "button.edit": "Editar",
      "button.back": "Atrás",
      "error.general": "Algo salió mal. Por favor, inténtelo de nuevo.",
      "error.notFound": "El recurso solicitado no fue encontrado.",
      "error.unauthorized": "No está autorizado para acceder a este recurso.",
      "empty.noData": "No hay datos disponibles",
      "empty.noResults": "No se encontraron resultados",
      loading: "Cargando...",
    },
    tasks: {
      title: "Centro de Tareas",
      description: "Gestionar y seguir todas las tareas del proyecto",
      empty: "No se encontraron tareas",
      create: "Crear Tarea",
      "filter.all": "Todas las Tareas",
      "filter.myTasks": "Mis Tareas",
      "filter.teamTasks": "Tareas del Equipo",
      "filter.overdue": "Atrasadas",
      "filter.upcoming": "Próximas",
      "status.notStarted": "No Iniciada",
      "status.inProgress": "En Progreso",
      "status.completed": "Completada",
    },
    // Add more translation namespaces as needed
  },
  fr: {
    // French translations would go here
    common: {},
    tasks: {},
  },
  de: {
    // German translations would go here
    common: {},
    tasks: {},
  },
}

export function getTranslation(key: string, locale: Locale = config.defaultLocale, namespace = "common"): string {
  // Split the key by dots to navigate the nested structure
  const parts = key.split(".")

  // If the key has no dots, use it directly in the specified namespace
  const translationKey = parts.length === 1 ? key : parts.pop() || ""
  const translationNamespace = parts.length === 0 ? namespace : parts.join(".")

  // Get the translation or fallback to the key itself
  const translation = translations[locale]?.[translationNamespace]?.[translationKey]

  // If translation not found in the specified locale, try the default locale
  if (!translation && locale !== config.defaultLocale) {
    return getTranslation(key, config.defaultLocale, namespace)
  }

  return translation || key
}

export function getCurrentLocale(): Locale {
  // In a browser environment, get the locale from localStorage or navigator
  if (typeof window !== "undefined") {
    const savedLocale = localStorage.getItem("locale") as Locale | null
    if (savedLocale && config.supportedLocales.includes(savedLocale)) {
      return savedLocale
    }

    // Try to get the locale from the browser
    const browserLocale = navigator.language.split("-")[0] as Locale
    if (config.supportedLocales.includes(browserLocale)) {
      return browserLocale
    }
  }

  return config.defaultLocale
}

export function setLocale(locale: Locale): void {
  if (config.supportedLocales.includes(locale) && typeof window !== "undefined") {
    localStorage.setItem("locale", locale)
    // In a real app, you might want to reload the page or update the app state
    window.location.reload()
  }
}

export const i18nConfig = config

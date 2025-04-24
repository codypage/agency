import { cva } from "class-variance-authority"

// Consistent spacing scale
export const spacing = {
  xs: "0.25rem", // 4px
  sm: "0.5rem", // 8px
  md: "1rem", // 16px
  lg: "1.5rem", // 24px
  xl: "2rem", // 32px
  "2xl": "2.5rem", // 40px
  "3xl": "3rem", // 48px
}

// Consistent animation durations
export const durations = {
  fast: "150ms",
  normal: "250ms",
  slow: "350ms",
}

// Consistent shadows
export const shadows = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
}

// Interactive element styles
export const interactiveStyles = cva("", {
  variants: {
    interactive: {
      subtle: "transition-colors hover:bg-muted/60 active:bg-muted",
      medium: "transition-all hover:bg-muted/80 active:bg-muted hover:shadow-sm",
      prominent: "transition-all hover:bg-muted hover:shadow-md active:shadow-sm",
    },
    focus: {
      outline: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      border: "focus-visible:border-primary focus-visible:outline-none",
    },
  },
  defaultVariants: {
    interactive: "subtle",
    focus: "outline",
  },
})

// Table row styles
export const tableRowStyles = cva("transition-all duration-200 data-[state=selected]:bg-muted", {
  variants: {
    interactive: {
      true: "cursor-pointer hover:bg-muted/60 active:bg-muted",
      false: "",
    },
    highlight: {
      true: "hover:shadow-sm hover:-translate-y-[1px]",
      false: "",
    },
  },
  defaultVariants: {
    interactive: true,
    highlight: false,
  },
})

// Card styles with consistent spacing
export const cardContentSpacing = cva("", {
  variants: {
    spacing: {
      compact: "p-3 sm:p-4",
      normal: "p-4 sm:p-6",
      spacious: "p-5 sm:p-8",
    },
  },
  defaultVariants: {
    spacing: "normal",
  },
})

// Mobile-friendly table styles
export const responsiveTableStyles = {
  container: "overflow-auto rounded-md border",
  table: "w-full min-w-full table-auto",
  header: "bg-muted/50 sticky top-0",
  headerCell: "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
  row: "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
  cell: "p-4 align-middle [&:has([role=checkbox])]:pr-0",
  footer: "bg-muted/50",
}

// Add navigation-specific styles to ensure consistency
export const navigationStyles = cva("", {
  variants: {
    level: {
      primary: "text-base font-medium",
      secondary: "text-sm font-medium text-muted-foreground",
      tertiary: "text-xs font-normal text-muted-foreground",
    },
    state: {
      active: "bg-primary/10 text-primary",
      inactive: "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
    },
  },
  defaultVariants: {
    level: "primary",
    state: "inactive",
  },
})

// Semantic color variations
export const semanticColors = {
  // Primary variations
  "primary-hover": "hsl(var(--primary) / 0.9)",
  "primary-active": "hsl(var(--primary) / 0.8)",
  "primary-focus": "hsl(var(--primary) / 0.85)",

  // Secondary variations
  "secondary-hover": "hsl(var(--secondary) / 0.9)",
  "secondary-active": "hsl(var(--secondary) / 0.8)",
  "secondary-focus": "hsl(var(--secondary) / 0.85)",

  // Feedback colors
  success: "hsl(var(--success))",
  warning: "hsl(var(--warning))",
  error: "hsl(var(--error))",
  info: "hsl(var(--info))",

  // Background variations
  "background-subtle": "hsl(var(--background) / 0.5)",
  "background-muted": "hsl(var(--muted))",

  // Border variations
  "border-hover": "hsl(var(--border) / 0.5)",
  "border-focus": "hsl(var(--ring))",
}

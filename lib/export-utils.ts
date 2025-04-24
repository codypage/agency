import { saveAs } from "file-saver"
import * as XLSX from "xlsx"
import type { AdminProject } from "@/types/admin-project"

/**
 * Converts an array of tasks to CSV format
 */
export function tasksToCSV(tasks: AdminProject[]): string {
  // Define the headers
  const headers = [
    "ID",
    "Task",
    "Description",
    "Status",
    "Priority",
    "Category",
    "Project Lead",
    "POC",
    "Due Date",
    "Start Date",
    "Completion Date",
    "Dependencies",
    "Notes",
  ]

  // Create CSV content
  let csv = headers.join(",") + "\n"

  // Add each task as a row
  tasks.forEach((task) => {
    const row = [
      task.id,
      escapeCsvValue(task.task),
      escapeCsvValue(task.description || ""),
      task.status,
      task.priority || "",
      task.category || "",
      task.projectLead || "",
      task.poc || "",
      task.dueDate || "",
      task.startDate || "",
      task.completionDate || "",
      escapeCsvValue(Array.isArray(task.dependencies) ? task.dependencies.join(", ") : ""),
      escapeCsvValue(task.notes || ""),
    ]
    csv += row.join(",") + "\n"
  })

  return csv
}

/**
 * Escapes special characters in CSV values
 */
function escapeCsvValue(value: string): string {
  // If the value contains commas, quotes, or newlines, wrap it in quotes
  if (value && (value.includes(",") || value.includes('"') || value.includes("\n"))) {
    // Double up any quotes to escape them
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

/**
 * Exports tasks to a CSV file
 */
export function exportTasksToCSV(tasks: AdminProject[], filename = "tasks.csv"): void {
  const csv = tasksToCSV(tasks)
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
  saveAs(blob, filename)
}

/**
 * Exports tasks to an Excel file
 */
export function exportTasksToExcel(tasks: AdminProject[], filename = "tasks.xlsx"): void {
  // Prepare the data for Excel
  const data = tasks.map((task) => ({
    ID: task.id,
    Task: task.task,
    Description: task.description || "",
    Status: task.status,
    Priority: task.priority || "",
    Category: task.category || "",
    "Project Lead": task.projectLead || "",
    POC: task.poc || "",
    "Due Date": task.dueDate || "",
    "Start Date": task.startDate || "",
    "Completion Date": task.completionDate || "",
    Dependencies: Array.isArray(task.dependencies) ? task.dependencies.join(", ") : "",
    Notes: task.notes || "",
  }))

  // Create a worksheet
  const worksheet = XLSX.utils.json_to_sheet(data)

  // Create a workbook
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks")

  // Generate Excel file and trigger download
  XLSX.writeFile(workbook, filename)
}

/**
 * Formats the current date for use in filenames
 */
export function formatDateForFilename(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

// Enhance export functionality to support multiple formats
// Add these functions:

export async function exportToExcel(data: any[], filename = "report") {
  // Implementation for Excel export
  console.log("Exporting to Excel:", data)
  // In a real implementation, you would use a library like exceljs
  return `${filename}.xlsx`
}

export async function exportToPDF(data: any[], filename = "report") {
  // Implementation for PDF export
  console.log("Exporting to PDF:", data)
  // In a real implementation, you would use a library like jspdf
  return `${filename}.pdf`
}

export async function exportToCSV(data: any[], filename = "report") {
  // Implementation for CSV export
  console.log("Exporting to CSV:", data)
  // Convert data to CSV format
  return `${filename}.csv`
}

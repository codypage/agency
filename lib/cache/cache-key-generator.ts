/**
 * Cache Key Generator
 *
 * Utilities for generating consistent cache keys based on method parameters.
 */

export class CacheKeyGenerator {
  /**
   * Generate a cache key for a method call
   */
  static forMethod(className: string, methodName: string, args: any[] = []): string {
    const argsString = args.map((arg) => this.stringifyArg(arg)).join(":")
    return `${className}:${methodName}${argsString ? `:${argsString}` : ""}`
  }

  /**
   * Generate a cache key for a task
   */
  static forTask(taskId: string): string {
    return `task:${taskId}`
  }

  /**
   * Generate a cache key for task comments
   */
  static forTaskComments(taskId: string): string {
    return `task:${taskId}:comments`
  }

  /**
   * Generate a cache key for task attachments
   */
  static forTaskAttachments(taskId: string): string {
    return `task:${taskId}:attachments`
  }

  /**
   * Generate a cache key for department tickets
   */
  static forDepartmentTickets(departmentId: string, status?: string): string {
    return `department:${departmentId}:tickets${status ? `:${status}` : ""}`
  }

  /**
   * Generate a cache key for department stats
   */
  static forDepartmentStats(): string {
    return "department:stats"
  }

  /**
   * Stringify an argument for inclusion in a cache key
   */
  private static stringifyArg(arg: any): string {
    if (arg === null || arg === undefined) {
      return ""
    }

    if (typeof arg === "function") {
      return "function"
    }

    if (typeof arg === "object") {
      try {
        // Sort keys to ensure consistent serialization
        const ordered: any = {}
        Object.keys(arg)
          .sort()
          .forEach((key) => {
            ordered[key] = arg[key]
          })
        return JSON.stringify(ordered)
      } catch (e) {
        return Object.prototype.toString.call(arg)
      }
    }

    return String(arg)
  }
}

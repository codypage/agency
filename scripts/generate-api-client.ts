#!/usr/bin/env ts-node
/**
 * Desk365 API Client Generator
 *
 * This script generates a TypeScript client from the Desk365 OpenAPI specification.
 * It uses the OpenAPI Generator CLI to create a strongly-typed client that can be
 * used with the existing facade pattern.
 *
 * Usage:
 *   npm run generate-api-client
 *
 * Requirements:
 *   - OpenAPI Generator CLI (installed via npm)
 *   - Desk365 API specification file (YAML or JSON)
 */

import { execSync } from "child_process"
import * as fs from "fs"
import * as path from "path"
import * as yaml from "js-yaml"

// Configuration
const CONFIG = {
  specPath: "./api-specs/desk365-api-v3-spec.yaml",
  outputDir: "./src/generated/desk365-client",
  npmName: "@internal/desk365-client",
  typescriptThreePlus: true,
  supportsES6: true,
  withInterfaces: true,
  // Additional generator options
  additionalProperties: {
    npmVersion: "1.0.0",
    supportsES6: "true",
    withInterfaces: "true",
    typescriptThreePlus: "true",
    modelPropertyNaming: "camelCase",
    enumPropertyNaming: "camelCase",
    skipValidateSpec: "false",
    legacyDiscriminatorBehavior: "false",
    useSingleRequestParameter: "true",
  },
}

// Ensure the output directory exists
function ensureDirectoryExists(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
    console.log(`Created directory: ${dir}`)
  }
}

// Validate the OpenAPI spec file
function validateSpecFile(specPath: string): void {
  if (!fs.existsSync(specPath)) {
    console.error(`Error: OpenAPI spec file not found at ${specPath}`)
    console.log("Please place your Desk365 API specification file at the specified path.")
    process.exit(1)
  }

  try {
    // Try to parse the spec file to validate it
    const fileContent = fs.readFileSync(specPath, "utf8")
    if (specPath.endsWith(".yaml") || specPath.endsWith(".yml")) {
      yaml.load(fileContent)
    } else if (specPath.endsWith(".json")) {
      JSON.parse(fileContent)
    } else {
      console.error("Error: Unsupported specification file format. Use YAML or JSON.")
      process.exit(1)
    }
    console.log("OpenAPI specification file is valid.")
  } catch (error) {
    console.error(`Error parsing specification file: ${error.message}`)
    process.exit(1)
  }
}

// Generate the TypeScript client
function generateClient(): void {
  console.log("Generating Desk365 API client...")

  // Build the additional properties string
  const additionalPropsString = Object.entries(CONFIG.additionalProperties)
    .map(([key, value]) => `${key}=${value}`)
    .join(",")

  try {
    // Execute the OpenAPI Generator CLI command
    const command = [
      "npx @openapitools/openapi-generator-cli generate",
      `-i ${CONFIG.specPath}`,
      `-g typescript-fetch`,
      `-o ${CONFIG.outputDir}`,
      `--additional-properties=${additionalPropsString}`,
      `--skip-validate-spec`,
    ].join(" ")

    console.log(`Executing: ${command}`)
    execSync(command, { stdio: "inherit" })

    console.log("Client generation completed successfully!")
    console.log(`Output directory: ${CONFIG.outputDir}`)

    // Apply post-generation fixes
    applyPostGenerationFixes()
  } catch (error) {
    console.error("Error generating client:", error.message)
    process.exit(1)
  }
}

// Apply fixes to the generated code
function applyPostGenerationFixes(): void {
  console.log("Applying post-generation fixes...")

  // Fix 1: Add proper export for the configuration
  const indexPath = path.join(CONFIG.outputDir, "index.ts")
  if (fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(indexPath, "utf8")

    // Ensure Configuration is properly exported
    if (!indexContent.includes("export * from './runtime';")) {
      indexContent = indexContent.replace(
        "export * from './apis';",
        "export * from './apis';\nexport * from './runtime';",
      )
      fs.writeFileSync(indexPath, indexContent)
      console.log("Fixed: Added runtime exports to index.ts")
    }
  }

  // Fix 2: Update package.json in the generated directory
  const packageJsonPath = path.join(CONFIG.outputDir, "package.json")
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))
    packageJson.name = CONFIG.npmName
    packageJson.version = CONFIG.additionalProperties.npmVersion
    packageJson.private = true
    packageJson.types = "./index.d.ts"
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
    console.log("Fixed: Updated package.json")
  }

  console.log("Post-generation fixes applied successfully!")
}

// Create a sample OpenAPI spec if it doesn't exist
function createSampleSpecIfNeeded(): void {
  const specDir = path.dirname(CONFIG.specPath)
  ensureDirectoryExists(specDir)

  if (!fs.existsSync(CONFIG.specPath)) {
    console.log("OpenAPI spec file not found. Creating a sample spec file...")

    const sampleSpec = `
openapi: 3.0.0
info:
  title: Desk365 API
  version: 3.0.0
  description: API for Desk365 helpdesk system
servers:
  - url: https://api.desk365.com/v3
    description: Production server
paths:
  /tickets:
    get:
      summary: Get all tickets
      operationId: getTickets
      parameters:
        - name: status
          in: query
          schema:
            type: string
            enum: [open, closed, pending]
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
      responses:
        '200':
          description: A list of tickets
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Ticket'
                  meta:
                    $ref: '#/components/schemas/PaginationMeta'
    post:
      summary: Create a new ticket
      operationId: createTicket
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/TicketCreateRequest'
      responses:
        '201':
          description: Ticket created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Ticket'
  /tickets/{ticketId}:
    get:
      summary: Get a ticket by ID
      operationId: getTicket
      parameters:
        - name: ticketId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Ticket details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Ticket'
        '404':
          description: Ticket not found
    put:
      summary: Update a ticket
      operationId: updateTicket
      parameters:
        - name: ticketId
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/TicketUpdateRequest'
      responses:
        '200':
          description: Ticket updated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Ticket'
        '404':
          description: Ticket not found
  /tickets/{ticketId}/comments:
    get:
      summary: Get comments for a ticket
      operationId: getComments
      parameters:
        - name: ticketId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: List of comments
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Comment'
    post:
      summary: Add a comment to a ticket
      operationId: addComment
      parameters:
        - name: ticketId
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CommentCreateRequest'
      responses:
        '201':
          description: Comment added
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Comment'
  /tickets/{ticketId}/attachments:
    get:
      summary: Get attachments for a ticket
      operationId: getAttachments
      parameters:
        - name: ticketId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: List of attachments
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Attachment'
    post:
      summary: Add an attachment to a ticket
      operationId: addAttachment
      parameters:
        - name: ticketId
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                file:
                  type: string
                  format: binary
                uploadedBy:
                  type: string
      responses:
        '201':
          description: Attachment added
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Attachment'
components:
  securitySchemes:
    ApiKeyAuth:
      type: apiKey
      in: header
      name: X-API-Key
  schemas:
    Ticket:
      type: object
      properties:
        id:
          type: string
        subject:
          type: string
        description:
          type: string
        status:
          type: string
          enum: [new, open, in_progress, pending, resolved, closed]
        priority:
          type: string
          enum: [low, normal, high, urgent]
        assignedTo:
          type: string
        dueDate:
          type: string
          format: date-time
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
        createdBy:
          type: string
        customFields:
          type: object
          additionalProperties: true
    TicketCreateRequest:
      type: object
      required:
        - subject
      properties:
        subject:
          type: string
        description:
          type: string
        status:
          type: string
          enum: [new, open, in_progress, pending, resolved, closed]
          default: new
        priority:
          type: string
          enum: [low, normal, high, urgent]
          default: normal
        assignedTo:
          type: string
        dueDate:
          type: string
          format: date-time
        customFields:
          type: object
          additionalProperties: true
    TicketUpdateRequest:
      type: object
      properties:
        subject:
          type: string
        description:
          type: string
        status:
          type: string
          enum: [new, open, in_progress, pending, resolved, closed]
        priority:
          type: string
          enum: [low, normal, high, urgent]
        assignedTo:
          type: string
        dueDate:
          type: string
          format: date-time
        customFields:
          type: object
          additionalProperties: true
    Comment:
      type: object
      properties:
        id:
          type: string
        text:
          type: string
        user:
          type: string
        timestamp:
          type: string
          format: date-time
    CommentCreateRequest:
      type: object
      required:
        - text
      properties:
        text:
          type: string
        user:
          type: string
    Attachment:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        url:
          type: string
        size:
          type: string
        uploadedBy:
          type: string
        uploadedAt:
          type: string
          format: date-time
    PaginationMeta:
      type: object
      properties:
        currentPage:
          type: integer
        totalPages:
          type: integer
        totalItems:
          type: integer
        itemsPerPage:
          type: integer
security:
  - ApiKeyAuth: []
`

    fs.writeFileSync(CONFIG.specPath, sampleSpec)
    console.log(`Created sample OpenAPI spec at ${CONFIG.specPath}`)
    console.log("Note: This is a sample spec. Replace it with the actual Desk365 API specification.")
  }
}

// Main function
function main(): void {
  console.log("=== Desk365 API Client Generator ===")

  // Ensure directories exist
  ensureDirectoryExists(path.dirname(CONFIG.specPath))
  ensureDirectoryExists(CONFIG.outputDir)

  // Create sample spec if needed
  createSampleSpecIfNeeded()

  // Validate the spec file
  validateSpecFile(CONFIG.specPath)

  // Generate the client
  generateClient()

  console.log("=== Client Generation Complete ===")
}

// Run the script
main()

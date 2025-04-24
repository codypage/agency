# Desk365 API Client Generation

This document provides instructions for generating and using the TypeScript client for the Desk365 API.

## Prerequisites

- Node.js 14 or higher
- npm or yarn
- Desk365 API specification file (YAML or JSON)

## Installation

Install the required dependencies:

\`\`\`bash
npm install
\`\`\`

## Generating the Client

1. Place your Desk365 API specification file at `./api-specs/desk365-api-v3-spec.yaml`
2. Run the generator script:

\`\`\`bash
npm run generate-api-client
\`\`\`

This will generate a TypeScript client in the `./src/generated/desk365-client` directory.

## Using the Generated Client

The generated client can be used directly, but it's recommended to use it through the facade pattern implemented in the project.

### Direct Usage

\`\`\`typescript
import { Configuration, TicketsApi } from '../../src/generated/desk365-client';

// Configure API key authorization
const configuration = new Configuration({
  basePath: "https://api.desk365.com/v3",
  headers: {
    'X-API-Key': 'YOUR_API_KEY'
  }
});

// Create API client instance
const ticketsApi = new TicketsApi(configuration);

// Use the client
const ticket = await ticketsApi.getTicket({ ticketId: "123" });
\`\`\`

### Using the Service Provider

The recommended way to use the client is through the service provider:

\`\`\`typescript
import { initializeServiceProvider, getServiceProvider } from '../lib/api-client/service-provider';

// Initialize the service provider
initializeServiceProvider({
  apiKey: "YOUR_API_KEY",
  baseUrl: "https://api.desk365.com/v3",
  featureFlags: {
    tasks: true,
    comments: true,
    attachments: true
  },
  caching: {
    enabled: true,
    storageType: "localStorage",
    defaultTtl: 5 * 60 * 1000, // 5 minutes
    taskTtl: 5 * 60 * 1000,
    commentsTtl: 2 * 60 * 1000,
    attachmentsTtl: 10 * 60 * 1000
  }
});

// Get the task service
const serviceProvider = getServiceProvider();
const taskService = serviceProvider.getTaskService();

// Use the task service
const task = await taskService.getTask("123");
\`\`\`

### Using the React Hook

For React components, use the `useDesk365` hook:

\`\`\`typescript
import { useDesk365 } from '../hooks/use-desk365';

function MyComponent() {
  const { isReady, error, taskService } = useDesk365();
  
  useEffect(() => {
    if (isReady && taskService) {
      taskService.getTask("123")
        .then(task => console.log(task))
        .catch(error => console.error(error));
    }
  }, [isReady, taskService]);
  
  if (!isReady) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>My Component</div>;
}
\`\`\`

## Customizing the Client

The client generation can be customized by modifying the `CONFIG` object in the `scripts/generate-api-client.ts` file.

## Troubleshooting

If you encounter issues with the client generation:

1. Ensure your OpenAPI specification is valid
2. Check the console output for error messages
3. Try running the generator with the `--skip-validate-spec` option if you're having validation issues
4. Verify that the generated client matches your API structure

For more information, refer to the [OpenAPI Generator documentation](https://openapi-generator.tech/docs/generators/typescript-fetch/).

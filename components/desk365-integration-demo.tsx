"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Code } from "@/components/ui/code"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"
// Add these imports at the top with the other imports
import { AlertCircle, CheckCircle, Clock, RefreshCw } from "lucide-react"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"

// Update the component to include API status indicators
export function Desk365IntegrationDemo() {
  const [apiKey, setApiKey] = useState("")
  const [baseUrl, setBaseUrl] = useState("https://api.desk365.com/v3")
  const [featureFlags, setFeatureFlags] = useState({
    ticketsEnabled: true,
    contactsEnabled: true,
    kbEnabled: false,
    surveysEnabled: false,
  })
  // Add API status state
  const [apiStatus, setApiStatus] = useState({
    connected: false,
    loading: false,
    lastChecked: null,
    responseTime: null,
    error: null,
  })

  const toggleFeature = (feature: keyof typeof featureFlags) => {
    setFeatureFlags((prev) => ({
      ...prev,
      [feature]: !prev[feature],
    }))
  }

  // Add function to check API connection
  const checkApiConnection = async () => {
    if (!apiKey) {
      setApiStatus({
        connected: false,
        loading: false,
        lastChecked: new Date(),
        responseTime: null,
        error: "API key is required",
      })
      return
    }

    setApiStatus((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const startTime = performance.now()

      // Simulate API health check - in a real implementation, this would be an actual API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Simulate successful connection
      const endTime = performance.now()
      const responseTime = Math.round(endTime - startTime)

      setApiStatus({
        connected: true,
        loading: false,
        lastChecked: new Date(),
        responseTime,
        error: null,
      })
    } catch (error) {
      setApiStatus({
        connected: false,
        loading: false,
        lastChecked: new Date(),
        responseTime: null,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      })
    }
  }

  // Check connection when API key or base URL changes
  useEffect(() => {
    if (apiKey) {
      const timer = setTimeout(() => {
        checkApiConnection()
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [apiKey, baseUrl])

  // Add this new card after the existing cards
  const renderApiStatusCard = () => (
    <Card>
      <CardHeader>
        <CardTitle>API Connection Status</CardTitle>
        <CardDescription>Real-time status of your Desk365 API connection</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {apiStatus.loading ? (
              <>
                <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
                <span>Checking connection...</span>
              </>
            ) : apiStatus.connected ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Connected</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span>Disconnected</span>
              </>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={checkApiConnection} disabled={apiStatus.loading || !apiKey}>
            <RefreshCw className={`h-4 w-4 mr-2 ${apiStatus.loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {apiStatus.lastChecked && (
          <div className="text-sm text-muted-foreground">
            Last checked: {apiStatus.lastChecked.toLocaleTimeString()}
          </div>
        )}

        {apiStatus.responseTime && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Response time: {apiStatus.responseTime}ms</span>
          </div>
        )}

        {apiStatus.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{apiStatus.error}</AlertDescription>
          </Alert>
        )}

        <Separator />

        <div className="space-y-2">
          <h3 className="text-sm font-medium">API Endpoints Status:</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <Badge
                variant={featureFlags.ticketsEnabled ? "default" : "outline"}
                className="h-2 w-2 rounded-full p-0"
              />
              <span className="text-sm">Tickets API</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={featureFlags.contactsEnabled ? "default" : "outline"}
                className="h-2 w-2 rounded-full p-0"
              />
              <span className="text-sm">Contacts API</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={featureFlags.kbEnabled ? "default" : "outline"} className="h-2 w-2 rounded-full p-0" />
              <span className="text-sm">Knowledge Base API</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={featureFlags.surveysEnabled ? "default" : "outline"}
                className="h-2 w-2 rounded-full p-0"
              />
              <span className="text-sm">Surveys API</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>Configure your Desk365 API v3 connection settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter your Desk365 API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="base-url">Base URL</Label>
            <Input
              id="base-url"
              placeholder="https://api.desk365.com/v3"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Add the API Status Card here */}
      {renderApiStatusCard()}

      <Card>
        <CardHeader>
          <CardTitle>Feature Flags</CardTitle>
          <CardDescription>Control which API features are enabled for testing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="tickets-feature">Tickets API</Label>
            <Switch
              id="tickets-feature"
              checked={featureFlags.ticketsEnabled}
              onCheckedChange={() => toggleFeature("ticketsEnabled")}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="contacts-feature">Contacts API</Label>
            <Switch
              id="contacts-feature"
              checked={featureFlags.contactsEnabled}
              onCheckedChange={() => toggleFeature("contactsEnabled")}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="kb-feature">Knowledge Base API</Label>
            <Switch
              id="kb-feature"
              checked={featureFlags.kbEnabled}
              onCheckedChange={() => toggleFeature("kbEnabled")}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="surveys-feature">Surveys API</Label>
            <Switch
              id="surveys-feature"
              checked={featureFlags.surveysEnabled}
              onCheckedChange={() => toggleFeature("surveysEnabled")}
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="architecture">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
          <TabsTrigger value="client-gen">Client Generation</TabsTrigger>
          <TabsTrigger value="facade">Abstraction Layer</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="architecture" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Integration Architecture</CardTitle>
              <CardDescription>Modular architecture for Desk365 API integration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <InfoIcon className="h-4 w-4" />
                  <AlertTitle>Modular Design</AlertTitle>
                  <AlertDescription>
                    The integration is structured into independent modules for each Desk365 resource type, allowing for
                    selective implementation and testing.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Architecture Layers:</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <Badge variant="outline">Generated Client</Badge> - Auto-generated from OpenAPI spec
                    </li>
                    <li>
                      <Badge variant="outline">Abstraction Layer</Badge> - Facade pattern to simplify API interactions
                    </li>
                    <li>
                      <Badge variant="outline">Feature Flags</Badge> - Control which features are enabled
                    </li>
                    <li>
                      <Badge variant="outline">Resource Modules</Badge> - Separate modules for tickets, contacts, etc.
                    </li>
                    <li>
                      <Badge variant="outline">Application Logic</Badge> - Business logic that uses the facade
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="client-gen" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>OpenAPI Client Generation</CardTitle>
              <CardDescription>Using OpenAPI Generator to create a Python client</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Code className="text-sm">
                  {`# Install OpenAPI Generator
pip install openapi-generator-cli

# Generate Python client from Desk365 OpenAPI spec
openapi-generator generate \\
  -i desk365-api-v3-spec.yaml \\
  -g python \\
  -o ./generated-client \\
  --additional-properties=packageName=desk365_client`}
                </Code>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Client Configuration:</h3>
                  <Code className="text-sm">
                    {`from desk365_client import Configuration, ApiClient

# Configure API key authorization
configuration = Configuration(
    host="https://api.desk365.com/v3",
    api_key={'ApiKeyAuth': 'YOUR_API_KEY'}
)

# Create API client instance
api_client = ApiClient(configuration=configuration)

# Create API instances
from desk365_client.api.tickets_api import TicketsApi
tickets_api = TicketsApi(api_client)`}
                  </Code>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facade" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Abstraction Layer (Facade Pattern)</CardTitle>
              <CardDescription>Simplifying the generated client with a facade</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Code className="text-sm">
                  {`# Ticket Service Facade
class TicketServiceFacade:
    def __init__(self, tickets_api, feature_flags):
        self.tickets_api = tickets_api
        self.feature_flags = feature_flags
        
    def get_ticket(self, ticket_id):
        """Get a ticket by ID with simplified interface"""
        if not self.feature_flags.is_enabled('tickets'):
            raise FeatureFlagDisabledException("Tickets feature is disabled")
            
        try:
            # Call the generated client
            api_response = self.tickets_api.get_ticket(ticket_id)
            
            # Transform to domain model
            return self._map_to_ticket_model(api_response)
        except ApiException as e:
            # Translate API exceptions to application exceptions
            self._handle_api_exception(e)
    
    def create_ticket(self, ticket_data):
        """Create a new ticket with simplified interface"""
        if not self.feature_flags.is_enabled('tickets'):
            raise FeatureFlagDisabledException("Tickets feature is disabled")
            
        # Map from application model to API model
        api_ticket = self._map_from_ticket_model(ticket_data)
        
        try:
            response = self.tickets_api.create_ticket(api_ticket)
            return self._map_to_ticket_model(response)
        except ApiException as e:
            self._handle_api_exception(e)
            
    def _map_to_ticket_model(self, api_ticket):
        """Map API response to application domain model"""
        return Ticket(
            id=api_ticket.id,
            subject=api_ticket.subject,
            description=api_ticket.description,
            status=api_ticket.status,
            # Map other fields as needed
        )
        
    def _map_from_ticket_model(self, ticket):
        """Map application model to API request model"""
        from desk365_client.models.ticket_create_request import TicketCreateRequest
        
        return TicketCreateRequest(
            subject=ticket.subject,
            description=ticket.description,
            # Map other fields as needed
        )
        
    def _handle_api_exception(self, exception):
        """Translate API exceptions to application exceptions"""
        if exception.status == 404:
            raise TicketNotFoundException(f"Ticket not found: {exception}")
        elif exception.status == 401:
            raise AuthenticationException("Invalid API key")
        else:
            raise Desk365Exception(f"API error: {exception}")`}
                </Code>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Testing Strategy</CardTitle>
              <CardDescription>Comprehensive testing approach for the integration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Unit Testing:</h3>
                  <Code className="text-sm">
                    {`# Test the Ticket Service Facade
def test_ticket_service_get_ticket():
    # Arrange
    mock_tickets_api = MagicMock()
    mock_feature_flags = MagicMock()
    mock_feature_flags.is_enabled.return_value = True
    
    # Mock API response
    mock_api_response = MagicMock()
    mock_api_response.id = "123"
    mock_api_response.subject = "Test Ticket"
    mock_tickets_api.get_ticket.return_value = mock_api_response
    
    # Create facade with mocked dependencies
    facade = TicketServiceFacade(mock_tickets_api, mock_feature_flags)
    
    # Act
    result = facade.get_ticket("123")
    
    # Assert
    assert result.id == "123"
    assert result.subject == "Test Ticket"
    mock_tickets_api.get_ticket.assert_called_once_with("123")`}
                  </Code>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Integration Testing:</h3>
                  <Code className="text-sm">
                    {`# Integration test with real API (using VCR.py to record/replay HTTP interactions)
@vcr.use_cassette('fixtures/vcr_cassettes/get_ticket.yaml')
def test_integration_get_ticket():
    # Arrange - create real client but with test API key
    config = Configuration(
        host="https://api.desk365.com/v3",
        api_key={'ApiKeyAuth': os.environ.get('TEST_API_KEY')}
    )
    api_client = ApiClient(config)
    tickets_api = TicketsApi(api_client)
    
    feature_flags = FeatureFlags({"tickets": True})
    facade = TicketServiceFacade(tickets_api, feature_flags)
    
    # Act
    result = facade.get_ticket("existing-ticket-id")
    
    # Assert
    assert result.id == "existing-ticket-id"
    assert result.subject is not None`}
                  </Code>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

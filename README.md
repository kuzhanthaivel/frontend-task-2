# Task Overview
Build a modern, sleek, and professional workflow execution monitoring interface for a workflow automation platform. The system allows users to audit the execution logs for their workflows.

### Tech Stack
Typescript, React with Next.js 14, Tailwind CSS v3, shadcn/ui components

### Design
- Modern, clean interface
- Professional color scheme with subtle gradients
- Smooth transitions and micro-interactions
- Main Executions List Page (`/workflows/[workflow_id]/executions`) is provided as reference for style patterns.

## Page to Build
### Execution Detail Page (`/workflows/[workflow_id]/executions/[execution_id]`)
# Execution Detail Page

## Overview
This implementation creates a detailed execution view page for a workflow management system. The page displays comprehensive information about a specific workflow execution, including OCR processing details, LLM (Large Language Model) responses, and Slack notification data.

## Features
### 1. Data Fetching
- Real API integration with `fetch(/api/executions/${executionId})`
- Proper loading states with skeleton UI components
- Error handling for failed API requests
- TypeScript support with proper type definitions

### 2. Visual Design
- Clean, modern UI with a two-column layout on larger screens
- Status indicators with color coding (success, failed, running)
- Responsive design that works on all screen sizes
- Consistent spacing and typography

### 3. Component Structure
- **Header Section:** Execution metadata (ID, workflow name, status, timestamps)
- **OCR Processing Panel:** Displays extracted text and processing details
- **LLM Processing Panel:** Shows AI response, token usage, and model information
- **Slack Notification Panel:** Displays channel and message details
- **Error States:** Handles API failures and missing executions gracefully

### 4. User Experience
- Loading skeletons that match the final UI structure
- Intuitive back navigation to executions list
- Clear error messages with retry option
- Status badges with appropriate icons and colors

## Implementation Details
### Key Components
#### Execution Header
- Displays execution ID, workflow name, and status badge
- Shows start/end times, duration, and trigger type

#### OCR Section
- Output text display with proper formatting
- Pages processed count

#### LLM Section
- Response content display
- Token usage statistics (total, prompt, completion)
- Model information
- Error states for failed LLM calls
- Loading state for in-progress executions

#### Slack Section
- Channel information
- Message content

### State Management
- `executionData`: Stores the fetched execution data
- `loading`: Controls loading state UI
- `error`: Handles API error messages

### API Integration
The component fetches data from `/api/executions/${executionId}` and handles:
- Successful responses
- HTTP errors
- Network failures
- Missing data

## Usage
To use this component:
- Navigate to `/workflows/[workflow_id]/executions/[execution_id]`
- The component will automatically fetch and display execution details
- Use the back button to return to the executions list

## Customization
### Styling
The component uses Tailwind CSS classes for styling. Key color codes:
- Success: `green-500`, `green-100`, `green-800`
- Error: `red-500`, `red-100`, `red-800`
- Running: `blue-500`, `blue-100`, `blue-800`
- Neutral: `gray-500`, `gray-100`, `gray-800`

## Dependencies
- React 18+
- Next.js 13+ (App Router)
- Lucide React (for icons)
- Tailwind CSS (for styling)
- Custom UI components (Button, Skeleton)

## API Response Structure
The component expects the API to return data in this format:

```typescript
interface ExecutionData {
  execution_id: string;
  workflow_id: string;
  workflow_name: string;
  status: 'success' | 'failed' | 'running';
  start_time: string;
  end_time: string | null;
  trigger: string;
  ocr_node: {
    output: string;
    pages_processed: number;
    keys_to_display_frontend: string[];
  };
  llm_call: {
    usage?: {
      total_tokens: number;
      prompt_tokens: number;
      completion_tokens: number;
    };
    metadata?: {
      model: string;
      prompt: string;
      output_schema: any;
    };
    response?: string;
    error?: string;
    status?: string;
    keys_to_display_frontend: string[];
  };
  send_slack?: {
    channel: string;
    message: string;
    keys_to_display_frontend: string[];
  };
}
```


**Currently shows raw JSON**

#### Requirements:
1. **Header Section**
   - Back button to return to executions list
   - Workflow name and execution ID
   - Overall execution status badge
   - Execution metadata (start time, end time, trigger type)

2. **Node Timeline/Flow View**
   - Visual representation of workflow nodes
   - Each node should display:
     - Node name and type
     - Node output values

3. **Node Output Display**
   - Each node in the execution response includes a `keys_to_display_frontend` array that specifies which fields should be shown in the UI. Only display the values from these fields.
   - Format different data types appropriately:
     - Strings: Regular text
     - Numbers: Formatted numbers
     - Objects/Arrays/Long strings: Collapsible formatted display
   - Error states should be prominently displayed

## API Endpoints (returns mock data)

**Main API endpoint for this task**: GET `/api/executions/{execution_id}` - Returns detailed execution data including node outputs

*Note: these endpoints below shouldn't directly affect what you're building. Just documenting them here for completeness*

* GET `/api/workflows/{workflow_id}`
Returns workflow definition including nodes and input schema

* POST `/api/workflows/{workflow_id}`
Triggers a new workflow execution with provided input values

* GET `/api/executions?workflow_id={workflow_id}`
Returns list of executions for a workflow

### Execution Detail Response Example
```json
{
  "execution_id": "123",
  "workflow_id": "wf_001",
  "workflow_name": "Summarize PDF",
  "status": "success",
  "start_time": "2024-01-15T10:30:00Z",
  "end_time": "2024-01-15T10:30:45Z",
  "trigger": "manual",
  "ocr_node": {
    "output": "Document content...",
    "pages_processed": 3,
    "keys_to_display_frontend": ["output"]
  },
  "llm_call": {
    "response": "Summary text...",
    "usage": { "total_tokens": 245 },
    "keys_to_display_frontend": ["response"]
  }
}
```

## Testing Notes
- Test with different execution statuses (success, failed, running)
- Test with different output types and output lengths (edit the `mockExecutionDetails` JSON in [`mock-data.ts`](app/api/mock-data.ts#L78))
- Ensure all data types display correctly
- Test error states and edge cases

## Getting Started
1. Run `npm install` to install dependencies
2. Run `npm run dev` to start the development server
3. Navigate to `http://localhost:3000` (or whichever URL is displayed) to see the app
4. The main page redirects to `/workflows/wf_001/executions`
5. Click on any execution to navigate to the detail page that needs to be built
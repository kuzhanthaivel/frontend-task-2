import { WorkflowDefinition, WorkflowExecution, WorkflowExecutionDetail } from '@/types/workflow.types';

export const mockWorkflow: WorkflowDefinition = {
  name: "Summarize PDF",
  description: "Summarize a PDF and send it to Slack",
  nodes: [
    {
      id: "ocr_node",
      name: "Read PDFs",
      type: "OCRNode",
      params: [
        { param_name: "pdf_url", param_value: "{{$pdf_url}}" }
      ]
    },
    {
      id: "llm_call",
      name: "Summarize Transcript",
      type: "LLMCallNode",
      params: [
        { param_name: "prompt", param_value: "Summarize the following content: {{$ocr_node.output}}" },
        { param_name: "model", param_value: "gpt-4o" }
      ]
    },
    {
      id: "send_slack",
      name: "Send Slack Message",
      type: "SendSlackMessageNode",
      params: [
        { param_name: "slack_channel", param_value: "{{$channel_id}}" },
        { param_name: "message", param_value: "{{$llm_call.response}}" }
      ]
    }
  ],
  connections: [],
  input_schema: {
    pdf_url: {
      type: "string",
      description: "URL of PDF"
    },
    channel_id: {
      type: "string",
      description: "Slack channel ID"
    }
  }
};

export const mockExecutions: WorkflowExecution[] = [
  {
    execution_id: "123",
    workflow_id: "wf_001",
    workflow_name: "Summarize PDF",
    status: "success",
    start_time: "2025-08-20T10:30:00Z",
    end_time: "2025-08-20T10:30:45Z",
    trigger: "webhook"
  },
  {
    execution_id: "124",
    workflow_id: "wf_001",
    workflow_name: "Summarize PDF",
    status: "failed",
    start_time: "2025-08-20T11:15:00Z",
    end_time: "2025-08-20T11:15:30Z",
    error: "Exceeded max retries",
    trigger: "manual"
  },
  {
    execution_id: "125",
    workflow_id: "wf_001",
    workflow_name: "Summarize PDF",
    status: "running",
    start_time: "2025-08-20T12:00:00Z",
    end_time: null,
    trigger: "manual"
  }
];

export const mockExecutionDetails: Record<string, WorkflowExecutionDetail> = {
  "123": {
    execution_id: "123",
    workflow_id: "wf_001",
    workflow_name: "Summarize PDF",
    status: "success",
    start_time: "2025-08-20T10:30:00Z",
    end_time: "2025-08-20T10:30:45Z",
    trigger: "webhook",
    ocr_node: {
      output: "This is a sample PDF document containing information about quarterly sales reports. The document shows revenue growth of 15% compared to the previous quarter, with strong performance in the technology and healthcare sectors. Key highlights include new client acquisitions and improved customer retention rates.",
      pages_processed: 3,
      keys_to_display_frontend: ["output"]
    },
    llm_call: {
      usage: {
        total_tokens: 245,
        prompt_tokens: 180,
        completion_tokens: 65
      },
      metadata: {
        model: "gpt-4o",
        prompt: "Summarize the following content: This is a sample PDF document...",
        output_schema: null
      },
      response: "The quarterly sales report shows strong performance with 15% revenue growth compared to the previous quarter. Technology and healthcare sectors led the growth, driven by new client acquisitions and improved customer retention rates.",
      keys_to_display_frontend: ["response"]
    },
    send_slack: {
      channel: "C1234567890",
      message: "The quarterly sales report shows strong performance with 15% revenue growth...",
      keys_to_display_frontend: ["channel", "message"]
    }
  },
  "124": {
    execution_id: "124",
    workflow_id: "wf_001",
    workflow_name: "Summarize PDF",
    status: "failed",
    start_time: "2025-08-20T11:15:00Z",
    end_time: "2025-08-20T11:15:30Z",
    trigger: "manual",
    ocr_node: {
      output: "This is a sample PDF document...",
      pages_processed: 3,
      keys_to_display_frontend: ["output"]
    },
    llm_call: {
      error: "Exceeded max retries",
      keys_to_display_frontend: []
    }
  },
  "125": {
    execution_id: "125",
    workflow_id: "wf_001",
    workflow_name: "Summarize PDF",
    status: "running",
    start_time: "2025-08-20T12:00:00Z",
    end_time: null,
    trigger: "manual",
    ocr_node: {
      output: "This is a sample PDF document...",
      pages_processed: 3,
      keys_to_display_frontend: ["output"]
    },
    llm_call: {
      status: "running",
      keys_to_display_frontend: []
    }
  }
};
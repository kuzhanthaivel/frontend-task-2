export interface WorkflowNode {
  id: string;
  name: string;
  type: string;
  params: Array<{
    param_name: string;
    param_value: string;
  }>;
}

export interface WorkflowDefinition {
  name: string;
  description: string;
  nodes: WorkflowNode[];
  connections: any[];
  input_schema: Record<string, {
    type: string;
    description: string;
    enum?: string[];
  }>;
}

export interface WorkflowExecution {
  execution_id: string;
  workflow_id: string;
  workflow_name: string;
  status: 'success' | 'failed' | 'running';
  start_time: string;
  end_time: string | null;
  trigger: 'manual' | 'webhook';
  error?: string;
}

export interface NodeOutput {
  error?: string;
  keys_to_display_frontend?: string[];
  [key: string]: any;
}

export interface WorkflowExecutionDetail extends WorkflowExecution {
  [nodeId: string]: NodeOutput | any;
}
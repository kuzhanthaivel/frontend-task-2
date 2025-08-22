import { NextResponse } from 'next/server';
import { mockWorkflow, mockExecutions } from '../../mock-data';

export async function GET(
  request: Request,
  { params }: { params: { workflow_id: string } }
) {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return NextResponse.json(mockWorkflow);
}

export async function POST(
  request: Request,
  { params }: { params: { workflow_id: string } }
) {
  const body = await request.json();
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newExecution = {
    execution_id: `exec_${Date.now()}`,
    workflow_id: params.workflow_id,
    workflow_name: mockWorkflow.name,
    status: "running" as const,
    start_time: new Date().toISOString(),
    end_time: null,
    trigger: "manual" as const
  };
  
  mockExecutions.unshift(newExecution);
  
  return NextResponse.json(newExecution, { status: 201 });
}
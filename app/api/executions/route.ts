import { NextResponse } from 'next/server';
import { mockExecutions } from '../mock-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workflowId = searchParams.get('workflow_id');
  
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return NextResponse.json(mockExecutions);
}
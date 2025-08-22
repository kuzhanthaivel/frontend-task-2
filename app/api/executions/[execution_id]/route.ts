import { NextResponse } from 'next/server';
import { mockExecutionDetails } from '../../mock-data';

export async function GET(
  request: Request,
  { params }: { params: { execution_id: string } }
) {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const execution = mockExecutionDetails[params.execution_id];
  
  if (!execution) {
    return NextResponse.json({ error: 'Execution not found' }, { status: 404 });
  }
  
  return NextResponse.json(execution);
}
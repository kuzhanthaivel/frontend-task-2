'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { DynamicForm } from '@/components/DynamicForm';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { WorkflowDefinition, WorkflowExecution } from '@/types/workflow.types';
import { convertToJSONSchema7 } from '@/lib/schema-utils';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export default function ExecutionsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const workflowId = params.workflow_id as string;
  
  const [workflow, setWorkflow] = useState<WorkflowDefinition | null>(null);
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(true);
  const [triggeringWorkflow, setTriggeringWorkflow] = useState(false);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    fetchWorkflowAndExecutions();
  }, [workflowId]);

  const fetchWorkflowAndExecutions = async () => {
    try {
      setLoading(true);
      const [workflowRes, executionsRes] = await Promise.all([
        fetch(`/api/workflows/${workflowId}`),
        fetch(`/api/executions?workflow_id=${workflowId}`)
      ]);
      
      const workflowData = await workflowRes.json();
      const executionsData = await executionsRes.json();
      
      setWorkflow(workflowData);
      setExecutions(executionsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch workflow data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerWorkflow = async (formData: any) => {
    try {
      setTriggeringWorkflow(true);
      
      const response = await fetch(`/api/workflows/${workflowId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error('Failed to trigger workflow');
      
      const newExecution = await response.json();
      
      toast({
        title: "Success",
        description: `Workflow triggered successfully (ID: ${newExecution.execution_id})`,
      });
      
      setFormKey(prev => prev + 1);
      setFormOpen(false);
      
      await fetchWorkflowAndExecutions();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to trigger workflow",
        variant: "destructive"
      });
    } finally {
      setTriggeringWorkflow(false);
    }
  };

  const handleRowClick = (executionId: string) => {
    router.push(`/workflows/${workflowId}/executions/${executionId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-muted-foreground">Workflow not found</p>
      </div>
    );
  }

  const jsonSchema = convertToJSONSchema7(workflow.input_schema);

  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900">{workflow.name}</h1>
          <p className="text-gray-500 mt-2 text-lg">{workflow.description}</p>
        </div>

        <div className="space-y-6">
          <Collapsible open={formOpen} onOpenChange={setFormOpen}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Trigger Workflow</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Manually trigger this workflow with custom inputs
                    </p>
                  </div>
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {formOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </div>
              <CollapsibleContent>
                <div className="px-6 py-4 bg-gray-50/50">
                  <DynamicForm
                    key={formKey}
                    schema={jsonSchema}
                    onSubmit={handleTriggerWorkflow}
                  />
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Execution History</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    View and monitor previous workflow runs
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchWorkflowAndExecutions}
                  className="text-gray-600 border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-100">
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Execution ID</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Trigger</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {executions.map((execution) => (
                    <tr
                      key={execution.execution_id}
                      className="cursor-pointer hover:bg-gray-50/75 transition-all duration-150 group"
                      onClick={() => handleRowClick(execution.execution_id)}
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
                          {execution.execution_id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={execution.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDistanceToNow(new Date(execution.start_time), { addSuffix: true })}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {execution.end_time 
                          ? formatDistanceToNow(new Date(execution.end_time), { addSuffix: true })
                          : '—'
                        }
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          execution.trigger === 'manual' 
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : "bg-gray-50 text-gray-700 border border-gray-200"
                        )}>
                          {execution.trigger}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {executions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                          <p className="text-sm font-medium">No executions found</p>
                          <p className="text-xs text-gray-400 mt-1">Trigger a workflow to see execution history</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    
  );
}
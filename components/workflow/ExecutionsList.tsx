'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { DynamicForm } from '@/components/DynamicForm';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Play, 
  RefreshCw, 
  ChevronRight, 
  Webhook,
  Hand,
  Calendar,
  Zap,
  Clock,
  Activity,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import type { 
  Workflow, 
  WorkflowExecution, 
  ExecutionMetrics 
} from '@/types/workflow.types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface ExecutionsListProps {
  workflow: Workflow;
  executions: WorkflowExecution[];
  metrics?: ExecutionMetrics;
  onTriggerWorkflow: (values: Record<string, any>) => Promise<void>;
  onRefresh: () => void;
  isLoading?: boolean;
}

// Trigger type icons
const triggerIcons = {
  manual: Hand,
  webhook: Webhook,
  schedule: Calendar,
  api: Zap,
};

export function ExecutionsList({
  workflow,
  executions,
  metrics,
  onTriggerWorkflow,
  onRefresh,
  isLoading = false
}: ExecutionsListProps) {
  const router = useRouter();
  const [isTriggering, setIsTriggering] = useState(false);
  const [expandedForm, setExpandedForm] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Auto-refresh when there are running executions
  useEffect(() => {
    if (!autoRefresh) return;
    
    const hasRunning = executions.some(e => e.status === 'running');
    if (!hasRunning) {
      setAutoRefresh(false);
      return;
    }

    const interval = setInterval(onRefresh, 3000);
    return () => clearInterval(interval);
  }, [autoRefresh, executions, onRefresh]);

  const handleTriggerWorkflow = async (values: Record<string, any>) => {
    setIsTriggering(true);
    try {
      await onTriggerWorkflow(values);
      toast.success('Workflow triggered successfully', {
        description: 'Your workflow is now running. Check the execution details below.',
      });
      setExpandedForm(false);
      setAutoRefresh(true);
    } catch (error) {
      toast.error('Failed to trigger workflow', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    } finally {
      setIsTriggering(false);
    }
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return '-';
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return formatDistanceToNow(date, { addSuffix: true });
    return format(date, 'MMM d, HH:mm');
  };

  return (
    <div className="space-y-6">
      {/* Header with Metrics */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{workflow.name}</h1>
          {workflow.description && (
            <p className="text-muted-foreground mt-2">{workflow.description}</p>
          )}
        </div>

        {/* Metrics Cards */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs uppercase tracking-wide">Total Runs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{metrics.total_executions}</span>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs uppercase tracking-wide">Success Rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">
                    {metrics.total_executions > 0 
                      ? `${Math.round((metrics.successful_executions / metrics.total_executions) * 100)}%`
                      : '-'}
                  </span>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs uppercase tracking-wide">Avg Duration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">
                    {formatDuration(metrics.average_duration_ms)}
                  </span>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs uppercase tracking-wide">Last 24h</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{metrics.last_24h_executions}</span>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Trigger Workflow Form */}
      {workflow.input_schema && (
        <Card className={cn(
          "transition-all duration-300 border-2",
          expandedForm ? "border-primary/50 shadow-lg" : "border-slate-200 dark:border-slate-800"
        )}>
          <CardHeader 
            className="cursor-pointer"
            onClick={() => setExpandedForm(!expandedForm)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Play className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Trigger Workflow</CardTitle>
                  <CardDescription>Manually run this workflow with custom inputs</CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "transition-transform duration-200",
                  expandedForm && "rotate-90"
                )}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          {expandedForm && (
            <CardContent className="animate-in slide-in-from-top-2 duration-300">
              <DynamicForm
                schema={workflow.input_schema}
                onSubmit={handleTriggerWorkflow}
                className="space-y-4"
              />
              {isTriggering && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                  <span className="text-sm text-blue-600">Triggering workflow...</span>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      )}

      {/* Executions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Execution History</CardTitle>
              <CardDescription>View and monitor all workflow executions</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[140px]">Execution ID</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[140px]">Started</TableHead>
                  <TableHead className="w-[100px]">Duration</TableHead>
                  <TableHead className="w-[100px]">Trigger</TableHead>
                  <TableHead>Error</TableHead>
                  <TableHead className="text-right w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {executions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle className="h-8 w-8 text-muted-foreground/50" />
                        <p>No executions yet</p>
                        <p className="text-sm">Trigger the workflow to see execution history</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  executions.map((execution) => {
                    const TriggerIcon = triggerIcons[execution.trigger_type];
                    return (
                      <TableRow 
                        key={execution.execution_id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => router.push(`/workflows/${workflow.id}/executions/${execution.execution_id}`)}
                      >
                        <TableCell className="font-mono text-xs">
                          {execution.execution_id.slice(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <StatusBadge 
                            status={execution.status} 
                            pulse={execution.status === 'running'}
                          />
                        </TableCell>
                        <TableCell className="text-sm">
                          <div>
                            <div className="font-medium">{getRelativeTime(execution.start_time)}</div>
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(execution.start_time), 'HH:mm:ss')}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {execution.status === 'running' ? (
                            <div className="flex items-center gap-1">
                              <RefreshCw className="h-3 w-3 animate-spin" />
                              <span>Running</span>
                            </div>
                          ) : (
                            formatDuration(execution.duration_ms)
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <TriggerIcon className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm capitalize">{execution.trigger_type}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {execution.error_message ? (
                            <span className="text-sm text-red-600 dark:text-red-400 truncate max-w-[200px] block">
                              {execution.error_message}
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/workflows/${workflow.id}/executions/${execution.execution_id}`);
                            }}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  FileText,
  MessageSquare,
  Slack,
} from "lucide-react";

export default function ExecutionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const workflowId = params.workflow_id as string;
  const executionId = params.execution_id as string;

  const [executionData, setExecutionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExecutionData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/executions/${executionId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch execution data: ${response.status}`);
        }
        
        const data = await response.json();
        setExecutionData(data);
      } catch (error) {
        console.error('Failed to fetch execution data:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchExecutionData();
  }, [executionId]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "running":
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "running":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Skeleton className="h-6 w-32" />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-7 w-64 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-7 w-24 rounded-full" />
            </div>
          </div>
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Skeleton className="h-12 rounded-lg" />
              <Skeleton className="h-12 rounded-lg" />
              <Skeleton className="h-12 rounded-lg" />
              <Skeleton className="h-12 rounded-lg" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center">
              <Skeleton className="h-5 w-5 rounded-full mr-2" />
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="p-6 space-y-4">
              <div>
                <Skeleton className="h-5 w-20 mb-2" />
                <Skeleton className="h-20 rounded-lg" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-6 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center">
                <Skeleton className="h-5 w-5 rounded-full mr-2" />
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="p-6 space-y-4">
                <Skeleton className="h-5 w-20 mb-2" />
                <Skeleton className="h-20 rounded-lg" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Skeleton className="h-16 rounded-lg" />
                  <Skeleton className="h-16 rounded-lg" />
                  <Skeleton className="h-16 rounded-lg" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center">
                <Skeleton className="h-5 w-5 rounded-full mr-2" />
                <Skeleton className="h-5 w-40" />
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <Skeleton className="h-5 w-20 mb-2" />
                  <Skeleton className="h-6 rounded-lg" />
                </div>
                <div>
                  <Skeleton className="h-5 w-20 mb-2" />
                  <Skeleton className="h-16 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!executionData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => router.push(`/workflows/${workflowId}/executions`)}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to executions
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Execution not found
          </h3>
          <p className="text-gray-500 mb-4">
            The execution with ID {executionId} could not be found.
          </p>
          <Button
            onClick={() => router.push(`/workflows/${workflowId}/executions`)}
          >
            Back to executions
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <button
          onClick={() => router.push(`/workflows/${workflowId}/executions`)}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to executions
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Execution #{executionData.execution_id}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Workflow: {executionData.workflow_name} (
                {executionData.workflow_id})
              </p>
            </div>
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                executionData.status
              )}`}
            >
              {getStatusIcon(executionData.status)}
              <span className="ml-1 capitalize">{executionData.status}</span>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-b border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">
                Start Time
              </p>
              <p className="text-sm font-medium">
                {formatDate(executionData.start_time)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">
                End Time
              </p>
              <p className="text-sm font-medium">
                {formatDate(executionData.end_time)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">
                Duration
              </p>
              <p className="text-sm font-medium">
                {executionData.start_time && executionData.end_time
                  ? `${Math.round(
                      (new Date(executionData.end_time).getTime() -
                        new Date(executionData.start_time).getTime()) /
                        1000
                    )} seconds`
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">
                Trigger
              </p>
              <p className="text-sm font-medium capitalize">
                {executionData.trigger}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center">
            <FileText className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="font-medium">OCR Processing</h3>
          </div>
          <div className="p-6">
            {executionData.ocr_node ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Output
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm">{executionData.ocr_node.output}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Pages Processed
                    </p>
                    <p className="text-sm">
                      {executionData.ocr_node.pages_processed}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No OCR data available</p>
            )}
          </div>
        </div>

        <div className="flex flex-col ">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center">
              <MessageSquare className="h-5 w-5 text-purple-500 mr-2" />
              <h3 className="font-medium">LLM Processing</h3>
            </div>
            <div className="p-6">
              {executionData.llm_call ? (
                <div className="space-y-4">
                  {executionData.llm_call.error ? (
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <p className="text-sm font-medium text-red-800 mb-1">
                        Error
                      </p>
                      <p className="text-sm text-red-700">
                        {executionData.llm_call.error}
                      </p>
                    </div>
                  ) : executionData.llm_call.status === "running" ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-pulse flex items-center">
                        <div className="h-4 w-4 bg-blue-500 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-500">
                          Processing LLM request...
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      {executionData.llm_call.response && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Response
                          </p>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm">
                              {executionData.llm_call.response}
                            </p>
                          </div>
                        </div>
                      )}

                      {executionData.llm_call.usage && (
                        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Total Tokens
                            </p>
                            <p className="text-sm">
                              {executionData.llm_call.usage.total_tokens}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Prompt Tokens
                            </p>
                            <p className="text-sm">
                              {executionData.llm_call.usage.prompt_tokens}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Completion Tokens
                            </p>
                            <p className="text-sm">
                              {executionData.llm_call.usage.completion_tokens}
                            </p>
                          </div>
                          {executionData.llm_call.metadata && (
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-1">
                                Model
                              </p>
                              <p className="text-sm">
                                {executionData.llm_call.metadata.model}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                      
                    </>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No LLM data available</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center">
              <Slack className="h-5 w-5 text-pink-500 mr-2" />
              <h3 className="font-medium">Slack Notification</h3>
            </div>
            <div className="p-6">
              {executionData.send_slack ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Channel
                    </p>
                    <p className="text-sm">
                      {executionData.send_slack.channel}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Message
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm">
                        {executionData.send_slack.message}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No Slack data available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

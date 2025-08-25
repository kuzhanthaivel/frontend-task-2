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
  Zap,
} from "lucide-react";

// Define types for better type safety
interface NodeData {
  [key: string]: any;
  keys_to_display_frontend?: string[];
}

interface ExecutionData {
  execution_id: string;
  workflow_id: string;
  workflow_name: string;
  status: string;
  start_time: string;
  end_time: string;
  trigger: string;
  [key: string]: any;
}

export default function ExecutionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const workflowId = params.workflow_id as string;
  const executionId = params.execution_id as string;

  const [executionData, setExecutionData] = useState<ExecutionData | null>(null);
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

  const getNodeIcon = (nodeType: string) => {
    switch (nodeType) {
      case "ocr_node":
        return <FileText className="h-5 w-5 text-blue-500 mr-2" />;
      case "llm_call":
        return <MessageSquare className="h-5 w-5 text-purple-500 mr-2" />;
      case "send_slack":
        return <Slack className="h-5 w-5 text-pink-500 mr-2" />;
      default:
        return <Zap className="h-5 w-5 text-gray-500 mr-2" />;
    }
  };

  const getNodeTitle = (nodeType: string) => {
    switch (nodeType) {
      case "ocr_node":
        return "OCR Processing";
      case "llm_call":
        return "LLM Processing";
      case "send_slack":
        return "Slack Notification";
      default:
        return nodeType.split('_').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
  };

  // Function to determine node priority for layout
  const getNodePriority = (nodeType: string) => {
    // Primary nodes get left column, secondary get right
    const primaryNodes = ['ocr_node', 'input_node', 'primary_node'];
    return primaryNodes.includes(nodeType) ? 'primary' : 'secondary';
  };

  // Function to render node data based on keys_to_display_frontend
  const renderNodeData = (nodeType: string, nodeData: NodeData) => {
    if (!nodeData) return <p className="text-sm text-gray-500">No data available</p>;
    
    // Use keys_to_display_frontend if provided, otherwise show all except metadata
    const keysToDisplay = nodeData.keys_to_display_frontend || 
      Object.keys(nodeData).filter(key => 
        key !== 'keys_to_display_frontend' && 
        key !== 'metadata' &&
        nodeData[key] !== null &&
        nodeData[key] !== undefined
      );
    
    if (keysToDisplay.length === 0) {
      return <p className="text-sm text-gray-500">No data to display</p>;
    }

    return (
      <div className="space-y-4">
        {keysToDisplay.map((key) => {
          const value = nodeData[key];
          
          // Skip if value is null/undefined
          if (value === null || value === undefined) return null;
          
          // Special handling for error fields
          if (key === 'error') {
            return (
              <div key={key} className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-sm font-medium text-red-800 mb-1">
                  Error
                </p>
                <p className="text-sm text-red-700">
                  {value}
                </p>
              </div>
            );
          }
          
          // Special handling for usage fields
          if (key === 'usage' && typeof value === 'object') {
            return (
              <div key={key} className="space-y-3">
                <p className="text-sm font-medium text-gray-700">Usage</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg">
                  {Object.entries(value).map(([usageKey, usageValue]) => (
                    <div key={usageKey} className="text-center">
                      <p className="text-xs text-gray-500 uppercase font-medium mb-1">
                        {usageKey.replace(/_/g, ' ')}
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {usageValue as React.ReactNode}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          
          // Special handling for status
          if (key === 'status') {
            if (value === 'running') {
              return (
                <div key={key} className="flex items-center justify-center py-4 bg-blue-50 rounded-lg">
                  <div className="animate-pulse flex items-center">
                    <div className="h-4 w-4 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm text-blue-700 font-medium">
                      Processing {nodeType.replace('_', ' ')}...
                    </span>
                  </div>
                </div>
              );
            }
            return (
              <div key={key}>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Status
                </p>
                <p className="text-sm capitalize">{value}</p>
              </div>
            );
          }
          
          // Handle object values (excluding arrays)
          if (typeof value === 'object' && !Array.isArray(value)) {
            return (
              <div key={key}>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {key.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm whitespace-pre-wrap font-mono">
                    {JSON.stringify(value, null, 2)}
                  </pre>
                </div>
              </div>
            );
          }
          
          // Handle array values
          if (Array.isArray(value)) {
            return (
              <div key={key}>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {key.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="text-sm list-disc list-inside space-y-1">
                    {value.map((item, index) => (
                      <li key={index} className="text-gray-700">
                        {typeof item === 'object' ? JSON.stringify(item) : item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          }
          
          // Handle long text (like output/response/message)
          if ((key === 'output' || key === 'response' || key === 'message') && typeof value === 'string') {
            return (
              <div key={key} className="space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  {key.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {value}
                  </p>
                </div>
              </div>
            );
          }
          
          // Handle numeric values with special formatting
          if (key === 'pages_processed' || key === 'total_tokens' || key === 'prompt_tokens' || key === 'completion_tokens') {
            return (
              <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <span className="text-sm font-medium text-gray-700">
                  {key.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </span>
                <span className="text-sm font-semibold text-gray-900 bg-blue-100 px-2 py-1 rounded">
                  {value}
                </span>
              </div>
            );
          }
          
          // Default rendering for simple values
          return (
            <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
              <span className="text-sm font-medium text-gray-700">
                {key.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </span>
              <span className="text-sm text-gray-900 max-w-xs truncate">
                {value}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  // Identify all nodes in the execution data
  const getNodeTypes = () => {
    if (!executionData) return [];
    
    const excludeFields = [
      'execution_id', 'workflow_id', 'workflow_name', 
      'status', 'start_time', 'end_time', 'trigger', 'error'
    ];
    
    return Object.keys(executionData).filter(
      key => !excludeFields.includes(key) && 
             executionData[key] !== null && 
             typeof executionData[key] === 'object'
    );
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
          <div className="space-y-6">
            <Skeleton className="h-64 rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !executionData) {
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
            {error ? "Error loading execution" : "Execution not found"}
          </h3>
          <p className="text-gray-500 mb-4">
            {error || `The execution with ID ${executionId} could not be found.`}
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

  const nodeTypes = getNodeTypes();
  const primaryNodes = nodeTypes.filter(type => getNodePriority(type) === 'primary');
  const secondaryNodes = nodeTypes.filter(type => getNodePriority(type) === 'secondary');

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

      {/* Execution Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Execution #{executionData.execution_id}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Workflow: {executionData.workflow_name} ({executionData.workflow_id})
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
              <p className="text-xs text-gray-500 uppercase font-medium">Start Time</p>
              <p className="text-sm font-medium">{formatDate(executionData.start_time)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">End Time</p>
              <p className="text-sm font-medium">{formatDate(executionData.end_time)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Duration</p>
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
              <p className="text-xs text-gray-500 uppercase font-medium">Trigger</p>
              <p className="text-sm font-medium capitalize">{executionData.trigger}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Node Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Primary Nodes Column */}
        <div className="space-y-6">
          {primaryNodes.map((nodeType) => (
            <div key={nodeType} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center">
                {getNodeIcon(nodeType)}
                <h3 className="font-medium">{getNodeTitle(nodeType)}</h3>
              </div>
              <div className="p-6">
                {renderNodeData(nodeType, executionData[nodeType])}
              </div>
            </div>
          ))}
        </div>

        {/* Secondary Nodes Column */}
        <div className="space-y-6">
          {secondaryNodes.map((nodeType) => (
            <div key={nodeType} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center">
                {getNodeIcon(nodeType)}
                <h3 className="font-medium">{getNodeTitle(nodeType)}</h3>
              </div>
              <div className="p-6">
                {renderNodeData(nodeType, executionData[nodeType])}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
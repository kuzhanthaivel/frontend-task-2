import { cn } from "@/lib/utils"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"

interface StatusBadgeProps {
  status: 'success' | 'failed' | 'running';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variants = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    failed: "bg-red-50 text-red-700 border-red-200",
    running: "bg-blue-50 text-blue-700 border-blue-200"
  };

  
  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
      variants[status],
      className
    )}>
      <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
    </div>
  );
}
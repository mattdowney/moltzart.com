import * as React from "react";
import { cn } from "@/lib/utils";

export function CodeToken({ className, ...props }: React.ComponentProps<"code">) {
  return <code className={cn("text-2xs font-mono text-teal-400", className)} {...props} />;
}

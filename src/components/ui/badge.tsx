import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center shrink-0 whitespace-nowrap gap-1",
  {
    variants: {
      variant: {
        default: "bg-zinc-700/40 text-zinc-400",
        outline: "border border-zinc-800 bg-zinc-900/50 text-zinc-500",
        status: "border",
      },
      shape: {
        default: "rounded",
        pill: "rounded-full",
      },
      size: {
        default: "type-badge px-2 py-1 [&>svg]:size-2.5",
        compact: "px-1.5 py-0.75 text-[0.625rem] leading-none tracking-[0.08em] font-medium font-mono [&>svg]:size-2",
      },
    },
    defaultVariants: {
      variant: "default",
      shape: "default",
      size: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  shape = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant, shape, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }

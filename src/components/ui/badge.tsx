import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center shrink-0 whitespace-nowrap type-badge [&>svg]:size-2.5 gap-1",
  {
    variants: {
      variant: {
        default: "px-2 py-1 bg-zinc-700/40 text-zinc-400",
        outline: "px-2 py-1 border border-zinc-800 bg-zinc-900/50 text-zinc-500",
        status: "px-2 py-1 border",
      },
      shape: {
        default: "rounded",
        pill: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      shape: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  shape = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant, shape }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }

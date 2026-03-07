import { cva, type VariantProps } from "class-variance-authority";

export const adminSurfaceVariants = cva(
  "rounded-lg border shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]",
  {
    variants: {
      variant: {
        section: "border-zinc-800/60 bg-zinc-900/45",
        embedded: "border-zinc-800/50 bg-zinc-950/40",
        subtle: "border-zinc-800/40 bg-zinc-950/25",
      },
    },
    defaultVariants: {
      variant: "section",
    },
  }
);

export type AdminSurfaceVariantProps = VariantProps<typeof adminSurfaceVariants>;

"use client"

import * as React from "react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"
import { Calendar as CalendarIcon, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export type { DateRange }

function DateRangePicker({
  value,
  onChange,
  placeholder = "Date range",
  className,
}: {
  value: DateRange | undefined
  onChange: (range: DateRange | undefined) => void
  placeholder?: string
  className?: string
}) {
  const [open, setOpen] = React.useState(false)

  const hasValue = value?.from !== undefined

  const label = React.useMemo(() => {
    if (!value?.from) return null
    if (!value.to) return format(value.from, "MMM d, yyyy")
    return `${format(value.from, "MMM d")} – ${format(value.to, "MMM d, yyyy")}`
  }, [value])

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation()
    onChange(undefined)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className={cn("relative inline-flex items-center w-full", className)}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-8 w-full justify-start text-xs font-normal",
              !hasValue && "text-muted-foreground",
              hasValue && "pr-7"
            )}
          >
            <CalendarIcon className="size-3 opacity-50" />
            {label ?? placeholder}
          </Button>
        </PopoverTrigger>
        {hasValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-1.5 inline-flex size-4 items-center justify-center rounded-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            aria-label="Clear date range"
          >
            <X className="size-3" />
          </button>
        )}
      </div>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="range"
          selected={value}
          onSelect={(range) => {
            onChange(range)
            // Close only once a full range is selected
            if (range?.from && range?.to) {
              setOpen(false)
            }
          }}
          initialFocus
          numberOfMonths={1}
        />
      </PopoverContent>
    </Popover>
  )
}

export { DateRangePicker }

"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
}: {
  value: Date | undefined
  onChange: (date: Date | undefined) => void
  placeholder?: string
  className?: string
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className={cn("relative inline-flex items-center", className)}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-8 justify-start text-xs font-normal",
              !value && "text-muted-foreground",
              value && "pr-7"
            )}
          >
            <CalendarIcon className="size-3 opacity-50" />
            {value ? format(value, "MMM d, yyyy") : placeholder}
          </Button>
        </PopoverTrigger>
        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onChange(undefined)
            }}
            className="absolute right-1.5 inline-flex size-4 items-center justify-center rounded-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <X className="size-3" />
          </button>
        )}
      </div>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange(date)
            setOpen(false)
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker }

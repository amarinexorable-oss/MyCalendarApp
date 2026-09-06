"use client"

import { toDateKey } from "@/lib/agenda"
import { cn } from "@/lib/utils"

const WEEKDAY = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export function DayStrip({
  week,
  selectedKey,
  onSelect,
  countFor,
  todayKey,
}: {
  week: Date[]
  selectedKey: string
  onSelect: (key: string) => void
  countFor: (key: string) => number
  todayKey: string
}) {
  return (
    <div className="grid grid-cols-7 gap-2">
      {week.map((day, i) => {
        const key = toDateKey(day)
        const active = key === selectedKey
        const isToday = key === todayKey
        const count = countFor(key)
        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            aria-pressed={active}
            className={cn(
              "flex flex-col items-center gap-1 rounded-xl border px-1 py-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-card-foreground hover:border-foreground/20",
            )}
          >
            <span
              className={cn(
                "text-xs font-medium uppercase tracking-wide",
                active ? "text-primary-foreground/80" : "text-muted-foreground",
              )}
            >
              {WEEKDAY[i]}
            </span>
            <span className="font-mono text-lg font-semibold tabular-nums leading-none">
              {day.getDate()}
            </span>
            <span
              className={cn(
                "flex h-4 items-center text-[11px]",
                active ? "text-primary-foreground/80" : "text-muted-foreground",
              )}
            >
              {count > 0 ? `${count} event${count > 1 ? "s" : ""}` : "—"}
            </span>
            <span
              className={cn(
                "size-1.5 rounded-full",
                isToday
                  ? active
                    ? "bg-primary-foreground"
                    : "bg-primary"
                  : "bg-transparent",
              )}
              aria-hidden
            />
          </button>
        )
      })}
    </div>
  )
}

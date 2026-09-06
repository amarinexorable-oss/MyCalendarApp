"use client"

import { MapPin, Users, X } from "lucide-react"
import {
  CATEGORIES,
  durationLabel,
  formatTime,
  type Meeting,
} from "@/lib/agenda"
import { cn } from "@/lib/utils"

export function MeetingCard({
  meeting,
  onDelete,
}: {
  meeting: Meeting
  onDelete: (id: string) => void
}) {
  const cat = CATEGORIES[meeting.category]
  const duration = durationLabel(meeting.start, meeting.end)

  return (
    <div className="group relative flex gap-4">
      {/* timeline rail */}
      <div className="flex w-16 shrink-0 flex-col items-end pt-0.5">
        <span className="font-mono text-sm tabular-nums text-foreground">
          {formatTime(meeting.start)}
        </span>
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {formatTime(meeting.end)}
        </span>
      </div>

      <div className="relative flex flex-col items-center">
        <span className={cn("mt-1.5 size-3 rounded-full ring-4 ring-background", cat.solid)} />
        <span className="mt-1 w-px grow bg-border" aria-hidden />
      </div>

      <div className="mb-4 flex-1 rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-foreground/20">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                  cat.soft,
                  cat.text,
                )}
              >
                {cat.label}
              </span>
              {duration && (
                <span className="text-xs text-muted-foreground">{duration}</span>
              )}
            </div>
            <h3 className="mt-2 text-balance font-medium leading-snug text-card-foreground">
              {meeting.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => onDelete(meeting.id)}
            aria-label={`Delete ${meeting.title}`}
            className="rounded-md p-1 text-muted-foreground opacity-0 transition hover:bg-accent hover:text-foreground focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
          {meeting.location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5" />
              {meeting.location}
            </span>
          )}
          {meeting.attendees.length > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-3.5" />
              {meeting.attendees.join(", ")}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

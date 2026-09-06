"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  CATEGORIES,
  toDateKey,
  type Category,
  type Meeting,
} from "@/lib/agenda"
import { cn } from "@/lib/utils"

const WEEKDAY_LONG = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]

const inputClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"

const labelClass = "mb-1.5 block text-sm font-medium text-foreground"

export function AddMeetingDialog({
  open,
  onClose,
  onAdd,
  week,
  defaultDateKey,
}: {
  open: boolean
  onClose: () => void
  onAdd: (m: Meeting) => void
  week: Date[]
  defaultDateKey: string
}) {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState<Category>("meeting")
  const [dateKey, setDateKey] = useState(defaultDateKey)
  const [start, setStart] = useState("09:00")
  const [end, setEnd] = useState("09:30")
  const [location, setLocation] = useState("")
  const [attendees, setAttendees] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (open) {
      setTitle("")
      setCategory("meeting")
      setDateKey(defaultDateKey)
      setStart("09:00")
      setEnd("09:30")
      setLocation("")
      setAttendees("")
      setError("")
    }
  }, [open, defaultDateKey])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  if (!open) return null

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError("Give your event a title.")
      return
    }
    if (end <= start) {
      setError("End time must be after the start time.")
      return
    }
    onAdd({
      id: Math.random().toString(36).slice(2, 10),
      dateKey,
      start,
      end,
      title: title.trim(),
      category,
      location: location.trim(),
      attendees: attendees
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
    })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-meeting-title"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-border bg-card p-6 shadow-xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2
            id="add-meeting-title"
            className="text-lg font-semibold text-card-foreground"
          >
            New event
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-muted-foreground transition hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={submit} className="mt-5 flex flex-col gap-4">
          <div>
            <label htmlFor="title" className={labelClass}>
              Title
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design review"
              className={inputClass}
              autoFocus
            />
          </div>

          <div>
            <span className={labelClass}>Category</span>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(CATEGORIES) as Category[]).map((key) => {
                const cat = CATEGORIES[key]
                const active = category === key
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setCategory(key)}
                    aria-pressed={active}
                    className={cn(
                      "flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-sm transition",
                      active
                        ? "border-foreground/25 bg-accent font-medium text-foreground"
                        : "border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span className={cn("size-2.5 rounded-full", cat.solid)} />
                    {cat.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label htmlFor="day" className={labelClass}>
              Day
            </label>
            <select
              id="day"
              value={dateKey}
              onChange={(e) => setDateKey(e.target.value)}
              className={inputClass}
            >
              {week.map((day, i) => (
                <option key={toDateKey(day)} value={toDateKey(day)}>
                  {WEEKDAY_LONG[i]},{" "}
                  {day.toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="start" className={labelClass}>
                Start
              </label>
              <input
                id="start"
                type="time"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="end" className={labelClass}>
                End
              </label>
              <input
                id="end"
                type="time"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="location" className={labelClass}>
              Location
            </label>
            <input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Room B, Zoom, Phone"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="attendees" className={labelClass}>
              Attendees
            </label>
            <input
              id="attendees"
              value={attendees}
              onChange={(e) => setAttendees(e.target.value)}
              placeholder="Comma separated, e.g. Ana, Marcus"
              className={inputClass}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <div className="mt-1 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add event</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

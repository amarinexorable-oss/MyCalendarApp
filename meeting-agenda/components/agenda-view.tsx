"use client"

import { useMemo, useState } from "react"
import { CalendarPlus, CalendarRange, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AddMeetingDialog } from "@/components/add-meeting-dialog"
import { DayStrip } from "@/components/day-strip"
import { MeetingCard } from "@/components/meeting-card"
import {
  createSeedMeetings,
  getWeekDays,
  sortMeetings,
  toDateKey,
  type Meeting,
} from "@/lib/agenda"

export function AgendaView() {
  const today = useMemo(() => new Date(), [])
  const todayKey = toDateKey(today)

  const [weekOffset, setWeekOffset] = useState(0)
  const week = useMemo(() => {
    const ref = new Date(today)
    ref.setDate(ref.getDate() + weekOffset * 7)
    return getWeekDays(ref)
  }, [today, weekOffset])

  const initialWeek = useMemo(() => getWeekDays(today), [today])
  const [meetings, setMeetings] = useState<Meeting[]>(() =>
    createSeedMeetings(initialWeek),
  )

  // Open on today if it has events, otherwise the first day of the week that does.
  const [selectedKey, setSelectedKey] = useState(() => {
    const seed = createSeedMeetings(initialWeek)
    if (seed.some((m) => m.dateKey === todayKey)) return todayKey
    const firstBusy = initialWeek
      .map(toDateKey)
      .find((key) => seed.some((m) => m.dateKey === key))
    return firstBusy ?? todayKey
  })
  const [dialogOpen, setDialogOpen] = useState(false)

  // Keep selection inside the visible week when navigating weeks.
  const selectedInWeek = week.some((d) => toDateKey(d) === selectedKey)
  const activeKey = selectedInWeek ? selectedKey : toDateKey(week[0])

  const countFor = (key: string) =>
    meetings.filter((m) => m.dateKey === key).length

  const dayMeetings = sortMeetings(
    meetings.filter((m) => m.dateKey === activeKey),
  )

  const selectedDate = week.find((d) => toDateKey(d) === activeKey) ?? week[0]

  const addMeeting = (m: Meeting) =>
    setMeetings((prev) => [...prev, m])
  const deleteMeeting = (id: string) =>
    setMeetings((prev) => prev.filter((m) => m.id !== id))

  const rangeLabel = `${week[0].toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })} – ${week[6].toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })}`

  return (
    <main className="mx-auto min-h-svh w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-primary">
          <CalendarRange className="size-5" />
          <span className="text-sm font-medium uppercase tracking-wide">
            Agenda
          </span>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground text-balance">
            {selectedDate.toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h1>
          <Button onClick={() => setDialogOpen(true)} className="gap-2">
            <CalendarPlus className="size-4" />
            New event
          </Button>
        </div>
      </header>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setWeekOffset((w) => w - 1)}
              aria-label="Previous week"
              className="rounded-md p-1.5 text-muted-foreground transition hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="min-w-32 text-center text-sm font-medium text-foreground">
              {rangeLabel}
            </span>
            <button
              type="button"
              onClick={() => setWeekOffset((w) => w + 1)}
              aria-label="Next week"
              className="rounded-md p-1.5 text-muted-foreground transition hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
          {weekOffset !== 0 && (
            <button
              type="button"
              onClick={() => {
                setWeekOffset(0)
                setSelectedKey(todayKey)
              }}
              className="text-sm font-medium text-primary hover:underline"
            >
              Today
            </button>
          )}
        </div>

        <DayStrip
          week={week}
          selectedKey={activeKey}
          onSelect={setSelectedKey}
          countFor={countFor}
          todayKey={todayKey}
        />
      </section>

      <section className="mt-8">
        {dayMeetings.length > 0 ? (
          <div className="flex flex-col">
            {dayMeetings.map((m) => (
              <MeetingCard key={m.id} meeting={m} onDelete={deleteMeeting} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
            <CalendarRange className="size-8 text-muted-foreground" />
            <p className="mt-3 font-medium text-foreground">Nothing scheduled</p>
            <p className="mt-1 text-sm text-muted-foreground">
              This day is wide open. Add an event to fill it in.
            </p>
            <Button
              variant="outline"
              className="mt-4 gap-2"
              onClick={() => setDialogOpen(true)}
            >
              <CalendarPlus className="size-4" />
              New event
            </Button>
          </div>
        )}
      </section>

      <AddMeetingDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAdd={addMeeting}
        week={week}
        defaultDateKey={activeKey}
      />
    </main>
  )
}

export type Category = "meeting" | "call" | "focus" | "break"

export type Meeting = {
  id: string
  dateKey: string // YYYY-MM-DD
  start: string // HH:MM (24h)
  end: string // HH:MM (24h)
  title: string
  category: Category
  location: string
  attendees: string[]
}

export const CATEGORIES: Record<
  Category,
  { label: string; text: string; soft: string; solid: string }
> = {
  meeting: {
    label: "Meeting",
    text: "text-cat-blue",
    soft: "bg-cat-blue-soft",
    solid: "bg-cat-blue",
  },
  call: {
    label: "Call",
    text: "text-cat-violet",
    soft: "bg-cat-violet-soft",
    solid: "bg-cat-violet",
  },
  focus: {
    label: "Focus",
    text: "text-cat-green",
    soft: "bg-cat-green-soft",
    solid: "bg-cat-green",
  },
  break: {
    label: "Break",
    text: "text-cat-amber",
    soft: "bg-cat-amber-soft",
    solid: "bg-cat-amber",
  },
}

export function toDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

/** Returns the 7 days of the week (Mon–Sun) containing `ref`. */
export function getWeekDays(ref: Date): Date[] {
  const start = new Date(ref)
  const day = start.getDay() // 0 = Sun
  const diffToMonday = (day + 6) % 7
  start.setDate(start.getDate() - diffToMonday)
  start.setHours(0, 0, 0, 0)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })
}

export function formatTime(hhmm: string): string {
  const [hStr, mStr] = hhmm.split(":")
  const h = Number(hStr)
  const suffix = h >= 12 ? "PM" : "AM"
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:${mStr} ${suffix}`
}

export function durationLabel(start: string, end: string): string {
  const mins = toMinutes(end) - toMinutes(start)
  if (mins <= 0) return ""
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number)
  return h * 60 + m
}

export function sortMeetings(list: Meeting[]): Meeting[] {
  return [...list].sort((a, b) => toMinutes(a.start) - toMinutes(b.start))
}

/** Sample meetings anchored to the current week so the app looks alive. */
export function createSeedMeetings(week: Date[]): Meeting[] {
  const k = (i: number) => toDateKey(week[i])
  const id = () => Math.random().toString(36).slice(2, 10)
  return [
    {
      id: id(),
      dateKey: k(0),
      start: "09:00",
      end: "09:30",
      title: "Daily standup",
      category: "meeting",
      location: "Zoom · Room A",
      attendees: ["Priya", "Marcus", "Ana", "Devon"],
    },
    {
      id: id(),
      dateKey: k(0),
      start: "10:00",
      end: "12:00",
      title: "Deep work — Q3 roadmap draft",
      category: "focus",
      location: "Do not disturb",
      attendees: [],
    },
    {
      id: id(),
      dateKey: k(0),
      start: "13:00",
      end: "13:45",
      title: "Lunch",
      category: "break",
      location: "Cafeteria",
      attendees: [],
    },
    {
      id: id(),
      dateKey: k(0),
      start: "15:30",
      end: "16:00",
      title: "1:1 with Ana",
      category: "call",
      location: "Google Meet",
      attendees: ["Ana"],
    },
    {
      id: id(),
      dateKey: k(1),
      start: "09:30",
      end: "10:30",
      title: "Design review — onboarding",
      category: "meeting",
      location: "Room B",
      attendees: ["Sam", "Priya", "Kai"],
    },
    {
      id: id(),
      dateKey: k(1),
      start: "11:00",
      end: "11:30",
      title: "Vendor call — analytics",
      category: "call",
      location: "Phone",
      attendees: ["Marcus"],
    },
    {
      id: id(),
      dateKey: k(2),
      start: "10:00",
      end: "11:30",
      title: "Sprint planning",
      category: "meeting",
      location: "Room A",
      attendees: ["Priya", "Marcus", "Ana", "Devon", "Kai"],
    },
    {
      id: id(),
      dateKey: k(2),
      start: "14:00",
      end: "16:00",
      title: "Focus block — API refactor",
      category: "focus",
      location: "Do not disturb",
      attendees: [],
    },
    {
      id: id(),
      dateKey: k(3),
      start: "09:00",
      end: "09:30",
      title: "Daily standup",
      category: "meeting",
      location: "Zoom · Room A",
      attendees: ["Priya", "Marcus", "Ana", "Devon"],
    },
    {
      id: id(),
      dateKey: k(3),
      start: "13:30",
      end: "14:30",
      title: "Customer interview",
      category: "call",
      location: "Google Meet",
      attendees: ["Ana", "Sam"],
    },
    {
      id: id(),
      dateKey: k(4),
      start: "11:00",
      end: "12:00",
      title: "Retro & demo",
      category: "meeting",
      location: "Room C",
      attendees: ["Priya", "Marcus", "Ana", "Devon", "Kai", "Sam"],
    },
  ]
}

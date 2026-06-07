'use client'

import ShadcnBigCalendar from '@widgets/calendar'
import {
  ComponentType,
  SetStateAction,
  Suspense,
  useEffect,
  useState,
} from 'react'
import type { CalendarProps } from 'react-big-calendar'
import { dateFnsLocalizer, SlotInfo, Views } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale/en-US'
import type { EventInteractionArgs } from 'react-big-calendar/lib/addons/dragAndDrop'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { DashboardSkeleton } from '@widgets/calendar'

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const DnDCalendar = withDragAndDrop<CalendarEvent>(
  ShadcnBigCalendar as ComponentType<CalendarProps<CalendarEvent>>
)

type CalendarEvent = {
  title: string
  start: Date
  end: Date
  allDay?: boolean
  variant?: 'primary' | 'secondary' | 'outline'
}

const startOfToday = new Date()
startOfToday.setHours(0, 0, 0, 0)

const createDate = (dayOffset: number, hours: number, minutes = 0) => {
  const date = new Date(startOfToday)
  date.setDate(startOfToday.getDate() + dayOffset)
  date.setHours(hours, minutes, 0, 0)
  return date
}

const presetEvents: CalendarEvent[] = [
  {
    title: 'Product design sync',
    start: createDate(0, 9, 30),
    end: createDate(0, 12, 30),
    variant: 'primary',
  },
  {
    title: 'Customer onboarding',
    start: createDate(1, 13),
    end: createDate(1, 14, 30),
    variant: 'secondary',
  },
  {
    title: 'Deep work block',
    start: createDate(2, 11),
    end: createDate(2, 13),
    variant: 'outline',
  },
  {
    title: 'Prepare Presentation',
    start: createDate(-2, 9),
    end: createDate(-2, 13),
    variant: 'secondary',
  },
  {
    title: 'Team offsite',
    start: createDate(-1, 0),
    end: createDate(1, 0),
    allDay: true,
    variant: 'secondary',
  },
  {
    title: 'Retro & planning',
    start: createDate(3, 15),
    end: createDate(3, 16, 30),
    variant: 'primary',
  },
  {
    title: 'Quarterly roadmap',
    start: createDate(30, 10),
    end: createDate(30, 11, 30),
    variant: 'primary',
  },
  {
    title: 'Partner demo',
    start: createDate(32, 14),
    end: createDate(32, 15),
    variant: 'secondary',
  },
  {
    title: 'Billing review',
    start: createDate(34, 9),
    end: createDate(34, 11),
    variant: 'outline',
  },
  {
    title: 'Security tabletop',
    start: createDate(36, 13),
    end: createDate(36, 14, 30),
    variant: 'primary',
  },
]

const LandingPage = () => {
  const [view, setView] = useState(Views.WEEK)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [events, setEvents] = useState<CalendarEvent[]>(() => [...presetEvents])
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null)

  const eventPropGetter: CalendarProps<CalendarEvent>['eventPropGetter'] = (
    event
  ) => {
    const variant = event.variant ?? 'primary'
    return {
      className: `event-variant-${variant}`,
    }
  }

  const deriveAllDay = (
    startDate: Date,
    endDate: Date,
    isAllDay?: boolean,
    fallback?: boolean
  ) => {
    if (typeof isAllDay === 'boolean') return isAllDay
    const dayDiff = endDate.getTime() - startDate.getTime()
    const startsAtMidnight =
      startDate.getHours() === 0 &&
      startDate.getMinutes() === 0 &&
      startDate.getSeconds() === 0
    const endsAtMidnight =
      endDate.getHours() === 0 &&
      endDate.getMinutes() === 0 &&
      endDate.getSeconds() === 0
    if (startsAtMidnight && endsAtMidnight && dayDiff >= 24 * 60 * 60 * 1000) {
      return true
    }
    if (!startsAtMidnight || dayDiff < 24 * 60 * 60 * 1000) {
      return false
    }
    return fallback ?? false
  }

  const clampToSingleDay = (startDate: Date) => {
    const endOfDay = new Date(startDate)
    endOfDay.setHours(23, 59, 59, 999)
    return endOfDay
  }

  const handleEventDrop = ({
    event,
    start,
    end,
    isAllDay,
  }: EventInteractionArgs<CalendarEvent>) => {
    const nextStart = new Date(start)
    const nextEnd = new Date(end)
    const nextAllDay = deriveAllDay(nextStart, nextEnd, isAllDay, event.allDay)
    const normalizedEnd =
      !nextAllDay &&
      event.allDay &&
      event.end.getTime() - event.start.getTime() >= 24 * 60 * 60 * 1000
        ? clampToSingleDay(nextStart)
        : nextEnd
    const updatedEvents = events.map((existingEvent) =>
      existingEvent === event
        ? {
            ...existingEvent,
            start: nextStart,
            end: normalizedEnd,
            allDay: nextAllDay,
          }
        : existingEvent
    )
    setEvents(updatedEvents)
  }

  const handleEventResize = ({
    event,
    start,
    end,
    isAllDay,
  }: EventInteractionArgs<CalendarEvent>) => {
    const nextStart = new Date(start)
    const nextEnd = new Date(end)
    const nextAllDay = deriveAllDay(nextStart, nextEnd, isAllDay, event.allDay)
    const updatedEvents = events.map((existingEvent) =>
      existingEvent === event
        ? {
            ...existingEvent,
            start: nextStart,
            end: nextEnd,
            allDay: nextAllDay,
          }
        : existingEvent
    )
    setEvents(updatedEvents)
  }

  useEffect(() => {
    const now = new Date()
    setDate(now)
  }, [])

  return (
    <DnDCalendar
      localizer={localizer}
      style={{ height: '100%', width: '100%' }}
      className="border-border border-rounded-md rounded-lg border-2 border-solid"
      selectable
      date={date}
      onNavigate={(newDate) => setDate(newDate)}
      view={view}
      onView={() => setView(view)}
      resizable
      draggableAccessor={() => true}
      resizableAccessor={() => true}
      events={events}
      eventPropGetter={eventPropGetter}
      onSelectSlot={(info) => setSelectedSlot(info)}
      onEventDrop={handleEventDrop}
      onEventResize={handleEventResize}
    />
  )
}

export default LandingPage

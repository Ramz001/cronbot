'use client'

import ShadcnBigCalendar from '@widgets/calendar'
import { ComponentType, useEffect, useState } from 'react'
import type { CalendarProps } from 'react-big-calendar'
import { dateFnsLocalizer, SlotInfo, Views } from 'react-big-calendar'
import type { View } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale/en-US'
import type { EventInteractionArgs } from 'react-big-calendar/lib/addons/dragAndDrop'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'

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
  automationId?: string
  status?: 'pending' | 'running' | 'success' | 'failed' | 'skipped'
  provider?: 'discord'
}

const startOfToday = new Date()
startOfToday.setHours(0, 0, 0, 0)

const createDate = (dayOffset: number, hours: number, minutes = 0) => {
  const date = new Date(startOfToday)
  date.setDate(startOfToday.getDate() + dayOffset)
  date.setHours(hours, minutes, 0, 0)
  return date
}

const FIXED_DURATION_MINUTES = 5

const presetEvents: CalendarEvent[] = [
  {
    title: 'Daily standup — #general',
    start: createDate(0, 9, 0),
    end: createDate(0, 9, FIXED_DURATION_MINUTES),
    variant: 'primary',
    provider: 'discord',
    status: 'success',
    automationId: 'auto-001',
  },
  {
    title: 'Weekly report — #team-leads',
    start: createDate(1, 10, 0),
    end: createDate(1, 10, FIXED_DURATION_MINUTES),
    variant: 'secondary',
    provider: 'discord',
    status: 'success',
    automationId: 'auto-002',
  },
  {
    title: 'DB cleanup — maintenance',
    start: createDate(2, 3, 0),
    end: createDate(2, 3, FIXED_DURATION_MINUTES),
    variant: 'outline',
    status: 'running',
    automationId: 'auto-003',
  },
  {
    title: 'Welcome DM — new members',
    start: createDate(-2, 8, 30),
    end: createDate(-2, 8, 30 + FIXED_DURATION_MINUTES),
    variant: 'secondary',
    provider: 'discord',
    status: 'success',
    automationId: 'auto-004',
  },
  {
    title: 'Reminder: meeting in 10 min — #engineering',
    start: createDate(-1, 9, 50),
    end: createDate(-1, 9, 50 + FIXED_DURATION_MINUTES),
    variant: 'secondary',
    provider: 'discord',
    status: 'success',
    automationId: 'auto-005',
  },
  {
    title: 'Analytics snapshot — #metrics',
    start: createDate(3, 8, 0),
    end: createDate(3, 8, FIXED_DURATION_MINUTES),
    variant: 'primary',
    provider: 'discord',
    status: 'failed',
    automationId: 'auto-006',
  },
  {
    title: 'Backup — full snapshot',
    start: createDate(30, 2, 0),
    end: createDate(30, 2, FIXED_DURATION_MINUTES),
    variant: 'primary',
    status: 'success',
    automationId: 'auto-007',
  },
  {
    title: 'Role sync — server members',
    start: createDate(32, 6, 0),
    end: createDate(32, 6, FIXED_DURATION_MINUTES),
    variant: 'secondary',
    provider: 'discord',
    status: 'success',
    automationId: 'auto-008',
  },
  {
    title: 'Audit log export',
    start: createDate(34, 1, 0),
    end: createDate(34, 1, FIXED_DURATION_MINUTES),
    variant: 'outline',
    status: 'skipped',
    automationId: 'auto-009',
  },
  {
    title: 'Security scan — tokens & perms',
    start: createDate(36, 4, 0),
    end: createDate(36, 4, FIXED_DURATION_MINUTES),
    variant: 'primary',
    status: 'success',
    automationId: 'auto-010',
  },
]

const LandingPage = () => {
  const [view, setView] = useState<View>(Views.WEEK)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [events, setEvents] = useState<CalendarEvent[]>(() => [...presetEvents])
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null)

  const eventPropGetter: CalendarProps<CalendarEvent>['eventPropGetter'] = (
    event
  ) => {
    const status = event.status ?? 'pending'
    return {
      className: `event-status-${status}`,
    }
  }

  const handleEventDrop = ({
    event,
    start,
  }: EventInteractionArgs<CalendarEvent>) => {
    const nextStart = new Date(start)
    const nextEnd = new Date(nextStart)
    nextEnd.setMinutes(nextEnd.getMinutes() + FIXED_DURATION_MINUTES)

    const updatedEvents = events.map((existingEvent) =>
      existingEvent === event
        ? {
            ...existingEvent,
            start: nextStart,
            end: nextEnd,
            allDay: false,
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
      onView={(newView) => setView(newView)}
      draggableAccessor={() => true}
      events={events}
      eventPropGetter={eventPropGetter}
      onSelectSlot={(info) => setSelectedSlot(info)}
      onEventDrop={handleEventDrop}
    />
  )
}

export default LandingPage

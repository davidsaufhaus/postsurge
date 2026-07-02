"use client";

import { useMemo, useState, useTransition } from "react";
import { AddToCalendarButton } from "./add-to-calendar";
import { cancelTermin, rescheduleTermin } from "../actions";

type CalendarEvent = {
  id: string;
  titel: string;
  datum: string; // ISO
  ort: string;
  typ: "termin" | "kontrolle";
};

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function TerminActions({ event }: { event: CalendarEvent }) {
  const [pending, startTransition] = useTransition();
  const [rescheduling, setRescheduling] = useState(false);
  const [newDate, setNewDate] = useState(event.datum.slice(0, 16));

  if (event.typ === "kontrolle") return null;

  return (
    <div className="flex flex-col items-end gap-2">
      {rescheduling ? (
        <div className="flex items-center gap-2">
          <input
            type="datetime-local"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="rounded-lg border border-black/10 px-2 py-1 text-xs text-[#1d1d1f]"
          />
          <button
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                await rescheduleTermin(event.id, newDate);
                setRescheduling(false);
              })
            }
            className="rounded-full bg-[#0071e3]/10 px-3 py-1 text-xs font-medium text-[#0071e3] hover:bg-[#0071e3]/20 disabled:opacity-60"
          >
            {pending ? "…" : "Speichern"}
          </button>
          <button
            onClick={() => setRescheduling(false)}
            className="text-xs text-[#86868b] hover:underline"
          >
            Abbrechen
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => setRescheduling(true)}
            className="rounded-full bg-[#f5f5f7] px-3 py-1 text-xs font-medium text-[#1d1d1f] hover:bg-black/10"
          >
            Verschieben
          </button>
          <button
            disabled={pending}
            onClick={() => {
              if (confirm("Termin wirklich absagen?"))
                startTransition(() => cancelTermin(event.id));
            }}
            className="rounded-full bg-[#ff3b30]/10 px-3 py-1 text-xs font-medium text-[#ff3b30] hover:bg-[#ff3b30]/20 disabled:opacity-60"
          >
            {pending ? "…" : "Absagen"}
          </button>
        </div>
      )}
    </div>
  );
}

export function TermineCalendar({ events }: { events: CalendarEvent[] }) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const days = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = (firstOfMonth.getDay() + 6) % 7; // Montag = 0
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: (Date | null)[] = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    return cells;
  }, [viewDate]);

  function eventsOn(day: Date) {
    return events.filter((e) => sameDay(new Date(e.datum), day));
  }

  const selectedEvents = selectedDay ? eventsOn(selectedDay) : [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
          className="rounded-full px-3 py-1.5 text-sm font-medium text-[#1d1d1f] hover:bg-black/5"
        >
          ←
        </button>
        <p className="text-sm font-semibold text-[#1d1d1f]">
          {viewDate.toLocaleDateString("de-DE", { month: "long", year: "numeric" })}
        </p>
        <button
          onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
          className="rounded-full px-3 py-1.5 text-sm font-medium text-[#1d1d1f] hover:bg-black/5"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-1 text-xs font-medium text-[#86868b]">
            {w}
          </div>
        ))}
        {days.map((day, i) => {
          if (!day) return <div key={i} />;
          const dayEvents = eventsOn(day);
          const isToday = sameDay(day, today);
          const isSelected = selectedDay && sameDay(day, selectedDay);
          const hasKontrolle = dayEvents.some((e) => e.typ === "kontrolle");
          const hasTermin = dayEvents.some((e) => e.typ === "termin");

          return (
            <button
              key={i}
              onClick={() => setSelectedDay(day)}
              className={`relative flex h-11 flex-col items-center justify-center rounded-xl text-sm transition-colors ${
                isSelected
                  ? "bg-[#0071e3] text-white"
                  : isToday
                    ? "bg-[#0071e3]/10 text-[#0071e3] font-semibold"
                    : "text-[#1d1d1f] hover:bg-black/5"
              }`}
            >
              {day.getDate()}
              {(hasKontrolle || hasTermin) && (
                <span className="absolute bottom-1 flex gap-0.5">
                  {hasKontrolle && (
                    <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? "bg-white" : "bg-[#ff9500]"}`} />
                  )}
                  {hasTermin && (
                    <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? "bg-white" : "bg-[#0071e3]"}`} />
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4 text-xs text-[#86868b]">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#0071e3]" /> Nachsorgetermin
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#ff9500]" /> Kontrolltermin
        </span>
      </div>

      <div className="rounded-xl bg-[#f5f5f7] p-4">
        {!selectedDay && (
          <p className="text-sm text-[#86868b]">Wähle einen Tag im Kalender, um Termine zu sehen.</p>
        )}
        {selectedDay && selectedEvents.length === 0 && (
          <p className="text-sm text-[#86868b]">
            Keine Termine am {selectedDay.toLocaleDateString("de-DE", { dateStyle: "medium" })}.
          </p>
        )}
        {selectedEvents.length > 0 && (
          <ul className="flex flex-col gap-3">
            {selectedEvents.map((e) => (
              <li key={e.id} className="flex flex-col gap-2 rounded-xl bg-white p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-[#1d1d1f]">{e.titel}</p>
                    <p className="text-sm text-[#86868b]">
                      {new Date(e.datum).toLocaleString("de-DE", { dateStyle: "medium", timeStyle: "short" })}
                      {e.ort && ` · ${e.ort}`}
                    </p>
                  </div>
                  <AddToCalendarButton titel={e.titel} datum={e.datum} ort={e.ort} />
                </div>
                <TerminActions event={e} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

"use client";

function toIcsDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export function AddToCalendarButton({
  titel,
  datum,
  ort,
}: {
  titel: string;
  datum: string;
  ort: string;
}) {
  function handleClick() {
    const start = new Date(datum);
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//PostSurge//Nachsorgetermin//DE",
      "BEGIN:VEVENT",
      `UID:${crypto.randomUUID()}`,
      `DTSTAMP:${toIcsDate(new Date())}`,
      `DTSTART:${toIcsDate(start)}`,
      `DTEND:${toIcsDate(end)}`,
      `SUMMARY:${titel}`,
      `LOCATION:${ort}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${titel.replace(/\s+/g, "_")}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={handleClick}
      className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-[#1d1d1f] transition-colors hover:bg-black/5"
    >
      Zum Kalender hinzufügen
    </button>
  );
}

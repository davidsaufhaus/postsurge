import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-5 bg-[radial-gradient(circle_at_50%_0%,#ffffff,#f5f5f7_60%)] px-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0071e3] text-2xl font-semibold text-white shadow-lg shadow-[#0071e3]/20">
        P
      </span>
      <h1 className="text-6xl font-semibold tracking-tight text-[#1d1d1f]">PostSurge</h1>
      <p className="max-w-lg text-xl font-normal text-[#86868b]">
        Digitale Begleitung vor und nach der Entlassung.
      </p>
      <p className="max-w-md text-base text-[#86868b]">
        Genesungsplan, tägliches Check-in und Arzt-Dashboard in einer App.
      </p>
      <Link
        href="/login"
        className="mt-4 rounded-full bg-[#0071e3] px-7 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-[#0058b9]"
      >
        Anmelden
      </Link>
    </main>
  );
}

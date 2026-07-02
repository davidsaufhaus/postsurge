import Link from "next/link";
import { PostSurgeLogo } from "@/components/logo";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-5 bg-[radial-gradient(circle_at_50%_0%,#ffffff,#f5f5f7_60%)] px-6 text-center">
      <PostSurgeLogo size="lg" />
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

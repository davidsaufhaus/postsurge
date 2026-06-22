import Link from "next/link";

export default function AdminHomePage() {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-black/5 bg-white p-10 text-center shadow-sm">
      <h1 className="mb-2 text-xl font-semibold tracking-tight text-[#1d1d1f]">Willkommen, Administrator</h1>
      <p className="mb-5 text-sm text-[#86868b]">Verwalte hier den Medikamentenkatalog.</p>
      <Link
        href="/admin/medications"
        className="rounded-full bg-[#0071e3] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0058b9]"
      >
        Zum Medikamentenkatalog
      </Link>
    </div>
  );
}

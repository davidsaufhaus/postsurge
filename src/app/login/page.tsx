import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-[radial-gradient(circle_at_50%_0%,#ffffff,#f5f5f7_60%)] px-6">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0071e3] text-lg font-semibold text-white shadow-lg shadow-[#0071e3]/20">
        P
      </span>
      <h1 className="text-3xl font-semibold tracking-tight text-[#1d1d1f]">PostSurge</h1>
      <LoginForm />
      <div className="w-full max-w-sm rounded-2xl border border-black/5 bg-white/70 p-4 text-xs text-[#86868b] shadow-sm backdrop-blur">
        <p className="mb-1 font-semibold text-[#1d1d1f]">Demo-Zugänge</p>
        <p>Patient: patient@postsurge.de / demo1234</p>
        <p>Arzt: arzt@postsurge.de / demo1234</p>
        <p>Pflege: pflege@postsurge.de / demo1234</p>
        <p>Admin: admin@postsurge.de / demo1234</p>
      </div>
    </main>
  );
}

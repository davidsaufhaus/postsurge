import { LoginForm } from "./login-form";
import { PostSurgeLogo } from "@/components/logo";

export default function LoginPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-[radial-gradient(circle_at_50%_0%,#ffffff,#f5f5f7_60%)] px-4 py-8 sm:px-6">
      <PostSurgeLogo size="lg" />
      <p className="text-sm text-[#86868b]">Digitale Nachsorge nach der Operation</p>
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
